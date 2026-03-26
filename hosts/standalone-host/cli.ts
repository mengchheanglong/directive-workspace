import fs from "node:fs";

import type { DiscoverySubmissionRequest } from "../../shared/lib/discovery-submission-router.ts";
import type { RuntimeFollowUpRecordRequest } from "../../shared/lib/runtime-follow-up-record-writer";
import type { RuntimeProofBundleRequest } from "../../shared/lib/runtime-proof-bundle-writer";
import type { RuntimePromotionRecordRequest } from "../../shared/lib/runtime-promotion-record-writer";
import type { RuntimeRegistryEntryRequest } from "../../shared/lib/runtime-registry-entry-writer";
import type { RuntimeRecordRequest } from "../../shared/lib/runtime-record-writer";
import type { RuntimeTransformationProofRequest } from "../../shared/lib/runtime-transformation-proof-writer";
import type { RuntimeTransformationRecordRequest } from "../../shared/lib/runtime-transformation-record-writer";
import { bootstrapStandaloneHostWorkspace } from "./bootstrap";
import {
  applyStandaloneHostConfigOverrides,
  loadStandaloneHostConfig,
  type ResolvedStandaloneHostConfig,
} from "./config";
import {
  createStandaloneFilesystemHost,
  createStandaloneFilesystemHostFromConfig,
  DEFAULT_STANDALONE_HOST_NAME,
  runStandaloneHostAcceptanceQuickstart,
} from "./runtime";
import {
  startStandaloneHostServer,
  startStandaloneHostServerFromConfig,
} from "./server";

type CommandName =
  | "init"
  | "acceptance-quickstart"
  | "discovery-submit"
  | "discovery-overview"
  | "runtime-followup-write"
  | "runtime-record-write"
  | "runtime-proof-write"
  | "runtime-transformation-proof-write"
  | "runtime-transformation-record-write"
  | "runtime-promotion-write"
  | "runtime-registry-write"
  | "runtime-overview"
  | "serve";

type FlagMap = Record<string, string[]>;

function printUsage() {
  process.stdout.write(`Directive Workspace Standalone Host CLI

Commands:
  init --output-root <path> [--host-name <name>] [--received-at <yyyy-mm-dd>] [--config-filename <name>] [--persistence-mode <filesystem|filesystem_and_sqlite>] [--auth-template <none|include>]
  acceptance-quickstart --output-root <path> [--host-name <name>] [--relative-output-path <path>] [--generated-at <iso>]
  discovery-submit (--directive-root <path> | --config <path>) --input-json-path <path> [--received-at <yyyy-mm-dd>] [--unresolved-gap-id <id> ...] [--persistence-sqlite-path <path>] [--dry-run] [--process-with-engine]
  discovery-overview (--directive-root <path> | --config <path>) [--max-entries <n>] [--received-at <yyyy-mm-dd>] [--persistence-sqlite-path <path>]
  runtime-followup-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-record-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-proof-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-transformation-proof-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-transformation-record-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-promotion-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-registry-write (--directive-root <path> | --config <path>) --input-json-path <path> [--persistence-sqlite-path <path>]
  runtime-overview (--directive-root <path> | --config <path>) [--max-entries <n>] [--persistence-sqlite-path <path>]
  serve (--directive-root <path> | --config <path>) [--host <host>] [--port <port>] [--received-at <yyyy-mm-dd>] [--unresolved-gap-id <id> ...] [--auth-bearer-token <token>] [--persistence-sqlite-path <path>]
`);
}

function parseArgs(argv: string[]) {
  const [command, ...rest] = argv;
  const flags: FlagMap = {};
  const flagWithoutValue = new Set(["dry-run", "process-with-engine"]);

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }

    const key = token.slice(2);
    const nextValue = rest[index + 1];
    if (!nextValue || nextValue.startsWith("--")) {
      if (flagWithoutValue.has(key)) {
        flags[key] ??= [];
        flags[key].push("true");
        continue;
      }
      throw new Error(`Missing value for --${key}`);
    }

    flags[key] ??= [];
    flags[key].push(nextValue);
    index += 1;
  }

  return {
    command: command as CommandName | undefined,
    flags,
  };
}

function readRequiredFlag(flags: FlagMap, name: string) {
  const value = flags[name]?.[0];
  if (!value) {
    throw new Error(`Missing required flag --${name}`);
  }
  return value;
}

function readOptionalFlag(flags: FlagMap, name: string) {
  return flags[name]?.[0];
}

function readOptionalNumberFlag(flags: FlagMap, name: string) {
  const value = readOptionalFlag(flags, name);
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`Invalid value for --${name}`);
  }
  return parsed;
}

function readRepeatedFlag(flags: FlagMap, name: string) {
  return flags[name] ?? [];
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readOptionalRuntimeConfig(
  flags: FlagMap,
  includeServerOverrides = false,
) {
  const configPath = readOptionalFlag(flags, "config");
  if (!configPath) {
    return null;
  }

  return applyStandaloneHostConfigOverrides(loadStandaloneHostConfig(configPath), {
    directiveRoot: readOptionalFlag(flags, "directive-root"),
    receivedAt: readOptionalFlag(flags, "received-at"),
    unresolvedGapIds: flags["unresolved-gap-id"]
      ? readRepeatedFlag(flags, "unresolved-gap-id")
      : undefined,
    authBearerToken: readOptionalFlag(flags, "auth-bearer-token"),
    persistenceSqlitePath: readOptionalFlag(flags, "persistence-sqlite-path"),
    host: includeServerOverrides ? readOptionalFlag(flags, "host") : undefined,
    port: includeServerOverrides
      ? readOptionalNumberFlag(flags, "port")
      : undefined,
  });
}

function createRuntimeHostFromFlags(
  flags: FlagMap,
  config: ResolvedStandaloneHostConfig | null,
) {
  if (config) {
    return createStandaloneFilesystemHostFromConfig(config);
  }

  return createStandaloneFilesystemHost({
    directiveRoot: readRequiredFlag(flags, "directive-root"),
    receivedAt: readOptionalFlag(flags, "received-at"),
    unresolvedGapIds: readRepeatedFlag(flags, "unresolved-gap-id"),
    persistence: readOptionalFlag(flags, "persistence-sqlite-path")
      ? {
          mode: "filesystem_and_sqlite",
          sqlitePath: readOptionalFlag(flags, "persistence-sqlite-path")!,
          sqlitePathSource: "override",
          experimentalRuntime: true,
        }
      : undefined,
  });
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (!command) {
    printUsage();
    process.exit(1);
  }

  if (command === "init") {
    const persistenceMode =
      readOptionalFlag(flags, "persistence-mode") ?? "filesystem_and_sqlite";
    if (
      persistenceMode !== "filesystem"
      && persistenceMode !== "filesystem_and_sqlite"
    ) {
      throw new Error("Invalid value for --persistence-mode");
    }
    const authTemplate = readOptionalFlag(flags, "auth-template") ?? "none";
    if (authTemplate !== "none" && authTemplate !== "include") {
      throw new Error("Invalid value for --auth-template");
    }

    const result = bootstrapStandaloneHostWorkspace({
      outputRoot: readRequiredFlag(flags, "output-root"),
      hostName: readOptionalFlag(flags, "host-name"),
      receivedAt: readOptionalFlag(flags, "received-at"),
      configFilename: readOptionalFlag(flags, "config-filename"),
      includeSqlitePersistence: persistenceMode === "filesystem_and_sqlite",
      includeAuthTemplate: authTemplate === "include",
    });

    process.stdout.write(`${JSON.stringify({ ok: true, ...result }, null, 2)}\n`);
    return;
  }

  if (command === "acceptance-quickstart") {
    const outputRoot = readRequiredFlag(flags, "output-root");
    const hostName =
      readOptionalFlag(flags, "host-name") ?? DEFAULT_STANDALONE_HOST_NAME;
    const relativeOutputPath = readOptionalFlag(flags, "relative-output-path");
    const generatedAt = readOptionalFlag(flags, "generated-at");

    const result = await runStandaloneHostAcceptanceQuickstart({
      outputRoot,
      hostName,
      relativeOutputPath,
      generatedAt,
    });
    process.stdout.write(`${JSON.stringify({ ok: true, ...result }, null, 2)}\n`);
    return;
  }

  if (command === "discovery-submit") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);
    const dryRun = flags["dry-run"]?.[0] === "true";
    const processWithEngine = flags["process-with-engine"]?.[0] === "true";

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<DiscoverySubmissionRequest>(inputJsonPath);
      const result = processWithEngine
        ? await host.submitDiscoveryEntryWithEngine(request, dryRun)
        : await host.submitDiscoveryEntry(request, dryRun);

      process.stdout.write(`${JSON.stringify({ ok: true, ...result }, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "discovery-overview") {
    const runtimeConfig = readOptionalRuntimeConfig(flags);
    const maxEntriesRaw = readOptionalFlag(flags, "max-entries");
    const maxEntries = maxEntriesRaw ? Number(maxEntriesRaw) : undefined;

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const overview = host.readDiscoveryOverview(
        Number.isFinite(maxEntries) ? maxEntries : undefined,
      );

      process.stdout.write(`${JSON.stringify({ ok: true, overview }, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-followup-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimeFollowUpRecordRequest>(inputJsonPath);
      const result = await host.writeRuntimeFollowUp(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-record-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimeRecordRequest>(inputJsonPath);
      const result = await host.writeRuntimeRecord(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-promotion-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimePromotionRecordRequest>(inputJsonPath);
      const result = await host.writeRuntimePromotionRecord(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-proof-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimeProofBundleRequest>(inputJsonPath);
      const result = await host.writeRuntimeProofBundle(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-transformation-proof-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimeTransformationProofRequest>(inputJsonPath);
      const result = await host.writeRuntimeTransformationProof(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-transformation-record-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimeTransformationRecordRequest>(inputJsonPath);
      const result = await host.writeRuntimeTransformationRecord(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-registry-write") {
    const inputJsonPath = readRequiredFlag(flags, "input-json-path");
    const runtimeConfig = readOptionalRuntimeConfig(flags);

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const request = readJsonFile<RuntimeRegistryEntryRequest>(inputJsonPath);
      const result = await host.writeRuntimeRegistryEntry(request);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "runtime-overview") {
    const runtimeConfig = readOptionalRuntimeConfig(flags);
    const maxEntriesRaw = readOptionalFlag(flags, "max-entries");
    const maxEntries = maxEntriesRaw ? Number(maxEntriesRaw) : undefined;

    const host = createRuntimeHostFromFlags(flags, runtimeConfig);
    try {
      const overview = host.readRuntimeOverview(
        Number.isFinite(maxEntries) ? maxEntries : undefined,
      );
      process.stdout.write(`${JSON.stringify({ ok: true, overview }, null, 2)}\n`);
    } finally {
      host.close();
    }
    return;
  }

  if (command === "serve") {
    const runtimeConfig = readOptionalRuntimeConfig(flags, true);
    const directiveRoot =
      runtimeConfig?.directiveRoot ?? readRequiredFlag(flags, "directive-root");
    const bindHost = readOptionalFlag(flags, "host");
    const port = readOptionalNumberFlag(flags, "port");

    const handle = runtimeConfig
      ? await startStandaloneHostServerFromConfig(runtimeConfig)
      : await startStandaloneHostServer({
          directiveRoot,
          host: bindHost,
          port,
          receivedAt: readOptionalFlag(flags, "received-at"),
          unresolvedGapIds: readRepeatedFlag(flags, "unresolved-gap-id"),
          auth: readOptionalFlag(flags, "auth-bearer-token")
            ? {
                mode: "static_bearer",
                bearerToken: readOptionalFlag(flags, "auth-bearer-token")!,
                bearerTokenSource: "override",
                protectedRoutePrefixes: ["/api/"],
              }
            : undefined,
          persistence: readOptionalFlag(flags, "persistence-sqlite-path")
            ? {
                mode: "filesystem_and_sqlite",
                sqlitePath: readOptionalFlag(flags, "persistence-sqlite-path")!,
                sqlitePathSource: "override",
                experimentalRuntime: true,
              }
            : undefined,
        });

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          mode: "serving",
          origin: handle.origin,
          directiveRoot,
          runtimeArtifactsRoot: handle.runtimeArtifactsRoot,
        },
        null,
        2,
      )}\n`,
    );

    const shutdown = async () => {
      await handle.close();
      process.exit(0);
    };

    process.on("SIGINT", () => {
      void shutdown();
    });
    process.on("SIGTERM", () => {
      void shutdown();
    });
    return;
  }

  throw new Error(`Unsupported command: ${String(command)}`);
}

main().catch((error) => {
  process.stderr.write(`${String((error as Error).message || error)}\n`);
  process.exit(1);
});
