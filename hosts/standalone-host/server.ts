import http, {
  type IncomingMessage,
  type Server as NodeHttpServer,
  type ServerResponse,
} from "node:http";
import fs from "node:fs";
import path from "node:path";

import type { DiscoverySubmissionRequest } from "../../shared/lib/discovery-submission-router.ts";
import type { ForgeFollowUpRecordRequest } from "../../shared/lib/forge-follow-up-record-writer";
import type { ForgeProofBundleRequest } from "../../shared/lib/forge-proof-bundle-writer";
import type { ForgePromotionRecordRequest } from "../../shared/lib/forge-promotion-record-writer";
import type { ForgeRegistryEntryRequest } from "../../shared/lib/forge-registry-entry-writer";
import type { ForgeRecordRequest } from "../../shared/lib/forge-record-writer";
import type { ForgeTransformationProofRequest } from "../../shared/lib/forge-transformation-proof-writer";
import type { ForgeTransformationRecordRequest } from "../../shared/lib/forge-transformation-record-writer";
import {
  DEFAULT_STANDALONE_RUNTIME_ARTIFACTS_RELATIVE_ROOT,
  STANDALONE_HOST_CONFIG_MODE,
  type ResolvedStandaloneHostAuth,
  type ResolvedStandaloneHostConfig,
  type ResolvedStandaloneHostPersistence,
} from "./config";
import { createStandaloneHostPersistenceLedger } from "./persistence";
import { createStandaloneFilesystemHost } from "./runtime";

type JsonValue = Record<string, unknown>;

export type StartStandaloneHostServerOptions = {
  directiveRoot: string;
  host?: string;
  port?: number;
  unresolvedGapIds?: string[];
  receivedAt?: string;
  initialQueue?: JsonValue;
  auth?: ResolvedStandaloneHostAuth;
  persistence?: ResolvedStandaloneHostPersistence;
  runtimeArtifactsRoot?: string;
  writeStatusFile?: boolean;
  writeAccessLog?: boolean;
  writeBootLog?: boolean;
};

export type StandaloneHostRuntimeStatus = {
  mode: typeof STANDALONE_HOST_CONFIG_MODE;
  lifecycle: "starting" | "running" | "stopped";
  directiveRoot: string;
  runtimeArtifactsRoot: string;
  receivedAt: string | null;
  unresolvedGapIds: string[];
  auth: {
    mode: ResolvedStandaloneHostAuth["mode"];
    protectedRoutePrefixes: string[];
  };
  persistence: {
    mode: ResolvedStandaloneHostPersistence["mode"];
    sqlitePath: string | null;
    experimentalRuntime: boolean;
  };
  server: {
    host: string | null;
    port: number | null;
    origin: string | null;
  };
  process: {
    pid: number;
  };
  metrics: {
    requestCount: number;
    lastRequestAt: string | null;
    lastStatusCode: number | null;
    lastError: string | null;
  };
  startedAt: string | null;
  updatedAt: string | null;
  stoppedAt: string | null;
};

export type StandaloneHostServerHandle = {
  server: NodeHttpServer;
  host: string;
  port: number;
  origin: string;
  runtimeArtifactsRoot: string;
  statusPath: string;
  accessLogPath: string;
  bootLogPath: string;
  readStatus(): StandaloneHostRuntimeStatus;
  close(): Promise<void>;
};

function writeJson(
  res: ServerResponse,
  statusCode: number,
  payload: unknown,
) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function normalizeAbsolutePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function ensureParentDirectory(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJsonAtomic(filePath: string, value: unknown) {
  ensureParentDirectory(filePath);
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(tmpPath, filePath);
}

function appendJsonLine(filePath: string, value: unknown) {
  ensureParentDirectory(filePath);
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function resolveStandaloneHostAuth(
  auth: ResolvedStandaloneHostAuth | undefined,
): ResolvedStandaloneHostAuth {
  return (
    auth ?? {
      mode: "none",
      protectedRoutePrefixes: ["/api/"],
    }
  );
}

function isProtectedRoute(
  pathname: string,
  auth: ResolvedStandaloneHostAuth,
) {
  return auth.protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
}

function resolveBearerToken(req: IncomingMessage) {
  const authorization = req.headers.authorization;
  if (typeof authorization !== "string") {
    return null;
  }

  const match = /^Bearer\s+(.+)$/iu.exec(authorization.trim());
  return match ? match[1] : null;
}

function isAuthorizedRequest(
  req: IncomingMessage,
  auth: ResolvedStandaloneHostAuth,
) {
  if (auth.mode === "none") {
    return true;
  }

  const bearerToken = resolveBearerToken(req);
  return bearerToken === auth.bearerToken;
}

function writeUnauthorized(res: ServerResponse) {
  res.setHeader(
    "www-authenticate",
    'Bearer realm="directive-workspace-standalone-host"',
  );
  writeJson(res, 401, {
    ok: false,
    error: "unauthorized",
  });
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("request_body_too_large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function parseOptionalPositiveInt(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error("invalid_max_entries");
  }
  return Math.floor(parsed);
}

function createStandaloneHostRuntimeRecorder(
  options: StartStandaloneHostServerOptions,
) {
  const auth = resolveStandaloneHostAuth(options.auth);
  const persistenceLedger = createStandaloneHostPersistenceLedger({
    persistence: options.persistence,
  });
  const persistence = persistenceLedger.describe();
  const runtimeArtifactsRoot = normalizeAbsolutePath(
    options.runtimeArtifactsRoot
      ?? path.resolve(
        options.directiveRoot,
        DEFAULT_STANDALONE_RUNTIME_ARTIFACTS_RELATIVE_ROOT,
      ),
  );
  const statusPath = normalizeAbsolutePath(
    path.resolve(runtimeArtifactsRoot, "status.json"),
  );
  const accessLogPath = normalizeAbsolutePath(
    path.resolve(runtimeArtifactsRoot, "access-log.jsonl"),
  );
  const bootLogPath = normalizeAbsolutePath(
    path.resolve(runtimeArtifactsRoot, "boot-log.jsonl"),
  );
  const status: StandaloneHostRuntimeStatus = {
    mode: STANDALONE_HOST_CONFIG_MODE,
    lifecycle: "starting",
    directiveRoot: normalizeAbsolutePath(options.directiveRoot),
    runtimeArtifactsRoot,
    receivedAt: options.receivedAt ?? null,
    unresolvedGapIds: [...(options.unresolvedGapIds ?? [])],
    auth: {
      mode: auth.mode,
      protectedRoutePrefixes: [...auth.protectedRoutePrefixes],
    },
    persistence: {
      mode: persistence.mode,
      sqlitePath: persistence.sqlitePath,
      experimentalRuntime: persistence.experimentalRuntime,
    },
    server: {
      host: null,
      port: null,
      origin: null,
    },
    process: {
      pid: process.pid,
    },
    metrics: {
      requestCount: 0,
      lastRequestAt: null,
      lastStatusCode: null,
      lastError: null,
    },
    startedAt: null,
    updatedAt: null,
    stoppedAt: null,
  };

  function persistStatus() {
    if (options.writeStatusFile === false) {
      return;
    }
    writeJsonAtomic(statusPath, status);
    persistenceLedger.recordJsonArtifact(statusPath, status, "runtime_status");
  }

  return {
    runtimeArtifactsRoot,
    statusPath,
    accessLogPath,
    bootLogPath,
    readStatus() {
      return JSON.parse(JSON.stringify(status)) as StandaloneHostRuntimeStatus;
    },
    recordStarted(server: {
      host: string;
      port: number;
      origin: string;
    }) {
      const recordedAt = new Date().toISOString();
      status.lifecycle = "running";
      status.server = server;
      status.startedAt = recordedAt;
      status.updatedAt = recordedAt;
      persistStatus();
      persistenceLedger.recordRuntimeStarted({
        recordedAt,
        directiveRoot: status.directiveRoot,
        runtimeArtifactsRoot,
        host: server.host,
        port: server.port,
        origin: server.origin,
        authMode: auth.mode,
      });

      if (options.writeBootLog !== false) {
        appendJsonLine(bootLogPath, {
          event: "started",
          recordedAt,
          mode: STANDALONE_HOST_CONFIG_MODE,
          directiveRoot: status.directiveRoot,
          runtimeArtifactsRoot,
          server,
        });
      }
    },
    recordRequest(event: {
      recordedAt: string;
      method: string;
      path: string;
      query: string;
      routeId: string;
      statusCode: number;
      durationMs: number;
      error: string | null;
    }) {
      status.metrics.requestCount += 1;
      status.metrics.lastRequestAt = event.recordedAt;
      status.metrics.lastStatusCode = event.statusCode;
      status.metrics.lastError = event.error;
      status.updatedAt = event.recordedAt;
      persistStatus();
      persistenceLedger.recordRuntimeRequest(event);

      if (options.writeAccessLog !== false) {
        appendJsonLine(accessLogPath, event);
      }
    },
    recordStopped() {
      const recordedAt = new Date().toISOString();
      status.lifecycle = "stopped";
      status.stoppedAt = recordedAt;
      status.updatedAt = recordedAt;
      persistStatus();
      persistenceLedger.recordRuntimeStopped({
        recordedAt,
        requestCount: status.metrics.requestCount,
      });

      if (options.writeBootLog !== false) {
        appendJsonLine(bootLogPath, {
          event: "stopped",
          recordedAt,
          mode: STANDALONE_HOST_CONFIG_MODE,
          directiveRoot: status.directiveRoot,
          runtimeArtifactsRoot,
          requestCount: status.metrics.requestCount,
        });
      }
    },
    close() {
      persistenceLedger.close();
    },
  };
}

export function startStandaloneHostServer(
  options: StartStandaloneHostServerOptions,
): Promise<StandaloneHostServerHandle> {
  const bindHost = options.host ?? "127.0.0.1";
  const bindPort = options.port ?? 8787;
  const auth = resolveStandaloneHostAuth(options.auth);
  const standaloneHost = createStandaloneFilesystemHost({
    directiveRoot: options.directiveRoot,
    unresolvedGapIds: options.unresolvedGapIds,
    receivedAt: options.receivedAt,
    initialQueue: options.initialQueue,
    persistence: options.persistence,
  });
  const runtimeRecorder = createStandaloneHostRuntimeRecorder(options);
  let closed = false;

  const server = http.createServer(async (req, res) => {
    const requestStartedAt = Date.now();
    let method = req.method ?? "GET";
    let pathname = "/";
    let query = "";
    let routeId = "request_parse";
    let requestError: string | null = null;

    try {
      const requestUrl = new URL(req.url ?? "/", `http://${bindHost}:${bindPort}`);
      pathname = requestUrl.pathname;
      query = requestUrl.search;
      method = req.method ?? "GET";

      if (isProtectedRoute(pathname, auth) && !isAuthorizedRequest(req, auth)) {
        routeId = "auth_guard";
        writeUnauthorized(res);
        return;
      }

      if (method === "GET" && pathname === "/health") {
        routeId = "health";
        writeJson(res, 200, {
          ok: true,
          mode: "standalone_reference_host",
          directive_root: standaloneHost.directiveRoot,
          runtime_artifacts_root: runtimeRecorder.runtimeArtifactsRoot,
        });
        return;
      }

      if (method === "GET" && pathname === "/api/runtime/status") {
        routeId = "runtime_status";
        writeJson(res, 200, {
          ok: true,
          runtime: runtimeRecorder.readStatus(),
        });
        return;
      }

      if (method === "GET" && pathname === "/api/discovery/overview") {
        routeId = "discovery_overview";
        const maxEntries = parseOptionalPositiveInt(
          requestUrl.searchParams.get("max_entries"),
        );
        const overview = standaloneHost.readDiscoveryOverview(maxEntries);
        writeJson(res, 200, { ok: true, overview });
        return;
      }

      if (method === "GET" && pathname === "/api/forge/overview") {
        routeId = "forge_overview";
        const maxEntries = parseOptionalPositiveInt(
          requestUrl.searchParams.get("max_entries"),
        );
        const overview = standaloneHost.readForgeOverview(maxEntries);
        writeJson(res, 200, { ok: true, overview });
        return;
      }

      if (method === "POST" && pathname === "/api/discovery/submissions") {
        routeId = "discovery_submit";
        const dryRun =
          requestUrl.searchParams.get("dry_run") === "1"
          || requestUrl.searchParams.get("mode") === "dry_run";
        const processWithEngine =
          requestUrl.searchParams.get("process_with_engine") === "1";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as DiscoverySubmissionRequest;
        const result = processWithEngine
          ? await standaloneHost.submitDiscoveryEntryWithEngine(request, dryRun)
          : await standaloneHost.submitDiscoveryEntry(request, dryRun);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/follow-ups") {
        routeId = "forge_followup_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgeFollowUpRecordRequest;
        const result = await standaloneHost.writeForgeFollowUp(request);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/records") {
        routeId = "forge_record_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgeRecordRequest;
        const result = await standaloneHost.writeForgeRecord(request);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/proof-bundles") {
        routeId = "forge_proof_bundle_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgeProofBundleRequest;
        const result = await standaloneHost.writeForgeProofBundle(request);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/transformation-proofs") {
        routeId = "forge_transformation_proof_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgeTransformationProofRequest;
        const result = await standaloneHost.writeForgeTransformationProof(request);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/transformation-records") {
        routeId = "forge_transformation_record_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgeTransformationRecordRequest;
        const result = await standaloneHost.writeForgeTransformationRecord(request);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/promotion-records") {
        routeId = "forge_promotion_record_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgePromotionRecordRequest;
        const result = await standaloneHost.writeForgePromotionRecord(request);
        writeJson(res, 200, result);
        return;
      }

      if (method === "POST" && pathname === "/api/forge/registry-entries") {
        routeId = "forge_registry_entry_write";
        const rawBody = await readBody(req);
        const request = JSON.parse(rawBody) as ForgeRegistryEntryRequest;
        const result = await standaloneHost.writeForgeRegistryEntry(request);
        writeJson(res, 200, result);
        return;
      }

      routeId = "not_found";
      writeJson(res, 404, {
        ok: false,
        error: "not_found",
        path: pathname,
        method,
      });
    } catch (error) {
      const message = String((error as Error).message || error);
      requestError = message;
      routeId = routeId === "request_parse" ? "request_error" : routeId;
      const statusCode =
        message === "request_body_too_large" || message.startsWith("invalid_")
          ? 400
          : 500;
      writeJson(res, statusCode, {
        ok: false,
        error: message,
      });
    } finally {
      runtimeRecorder.recordRequest({
        recordedAt: new Date().toISOString(),
        method,
        path: pathname,
        query,
        routeId,
        statusCode: res.statusCode,
        durationMs: Date.now() - requestStartedAt,
        error: requestError,
      });
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(bindPort, bindHost, () => {
      server.off("error", reject);
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("invalid_server_address"));
        return;
      }

      const actualPort = address.port;
      const origin = `http://${bindHost}:${actualPort}`;
      runtimeRecorder.recordStarted({
        host: bindHost,
        port: actualPort,
        origin,
      });

      resolve({
        server,
        host: bindHost,
        port: actualPort,
        origin,
        runtimeArtifactsRoot: runtimeRecorder.runtimeArtifactsRoot,
        statusPath: runtimeRecorder.statusPath,
        accessLogPath: runtimeRecorder.accessLogPath,
        bootLogPath: runtimeRecorder.bootLogPath,
        readStatus() {
          return runtimeRecorder.readStatus();
        },
        close() {
          if (closed) {
            return Promise.resolve();
          }
          closed = true;
          return new Promise<void>((closeResolve, closeReject) => {
            server.close((closeError) => {
              if (closeError) {
                closeReject(closeError);
                return;
              }
              runtimeRecorder.recordStopped();
              standaloneHost.close();
              runtimeRecorder.close();
              closeResolve();
            });
          });
        },
      });
    });
  });
}

export function startStandaloneHostServerFromConfig(
  config: ResolvedStandaloneHostConfig,
) {
  return startStandaloneHostServer({
    directiveRoot: config.directiveRoot,
    host: config.server.host,
    port: config.server.port,
    unresolvedGapIds: config.unresolvedGapIds,
    receivedAt: config.receivedAt,
    initialQueue: config.initialQueue,
    auth: config.auth,
    persistence: config.persistence,
    runtimeArtifactsRoot: config.runtimeArtifacts.root,
    writeStatusFile: config.runtimeArtifacts.writeStatusFile,
    writeAccessLog: config.runtimeArtifacts.writeAccessLog,
    writeBootLog: config.runtimeArtifacts.writeBootLog,
  });
}
