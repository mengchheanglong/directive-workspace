import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest,
  type OpenClawMaintenanceWatchdogSignal,
} from "../../adapters/openclaw-maintenance-watchdog-signal-adapter.ts";
import {
  adaptOpenClawRuntimeVerificationSignalToDirectiveRequest,
  type OpenClawRuntimeVerificationSignal,
} from "../../adapters/openclaw-runtime-verification-signal-adapter.ts";
import {
  createMemoryDiscoveryHostStorageBridge,
} from "../starter/discovery-host-storage-bridge.memory.template.ts";
import {
  submitDiscoveryEntryWithHostBridge,
  type DiscoveryHostStorageBridge,
} from "../starter/discovery-submission-adapter.template.ts";
import {
  runHostIntegrationAcceptanceQuickstart,
} from "../starter/run-host-integration-acceptance-quickstart.template.ts";
import type { DiscoverySubmissionRequest } from "../../../discovery/lib/discovery-submission-router.ts";

type CommandName =
  | "acceptance-quickstart"
  | "submission-memory-dry-run"
  | "print-submission-example"
  | "print-signal-example"
  | "signal-adapter-dry-run";

type FlagMap = Record<string, string[]>;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const integrationKitRoot = path.resolve(currentDirectory, "..");
const examplesRoot = path.resolve(integrationKitRoot, "examples");

function printUsage() {
  process.stdout.write(`Directive Workspace Host Integration Kit CLI

Commands:
  acceptance-quickstart --host-name <name> --module-surface <package_import|starter_copy|mixed> --output-root <path> [--relative-output-path <path>] [--generated-at <iso>]
  submission-memory-dry-run --input-json-path <path> [--directive-root <path>] [--received-at <yyyy-mm-dd>] [--unresolved-gap-id <id> ...]
  print-submission-example --shape <front_door|queue_only|fast_path|split_case>
  print-signal-example --kind <runtime_verification|maintenance_watchdog>
  signal-adapter-dry-run --kind <runtime_verification|maintenance_watchdog> --input-json-path <path>
`);
}

function parseArgs(argv: string[]) {
  const [command, ...rest] = argv;
  const flags: FlagMap = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2);
    const nextValue = rest[index + 1];
    if (!nextValue || nextValue.startsWith("--")) {
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

function readRepeatedFlag(flags: FlagMap, name: string) {
  return flags[name] ?? [];
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function resolveSubmissionExamplePath(shape: string) {
  const fileNameByShape: Record<string, string> = {
    front_door: "discovery-submission-front-door.json",
    queue_only: "discovery-submission-queue-only.json",
    fast_path: "discovery-submission-fast-path.json",
    split_case: "discovery-submission-split-case.json",
  };
  const fileName = fileNameByShape[shape];
  if (!fileName) {
    throw new Error(`Unsupported submission example shape: ${shape}`);
  }
  return path.resolve(examplesRoot, fileName);
}

function resolveSignalExamplePath(kind: string) {
  const fileNameByKind: Record<string, string> = {
    runtime_verification: "openclaw-runtime-verification-signal.json",
    maintenance_watchdog: "openclaw-maintenance-watchdog-signal.json",
  };
  const fileName = fileNameByKind[kind];
  if (!fileName) {
    throw new Error(`Unsupported signal example kind: ${kind}`);
  }
  return path.resolve(examplesRoot, fileName);
}

async function handleAcceptanceQuickstart(flags: FlagMap) {
  const hostName = readRequiredFlag(flags, "host-name");
  const moduleSurface = readRequiredFlag(flags, "module-surface") as
    | "package_import"
    | "starter_copy"
    | "mixed";
  const outputRoot = readRequiredFlag(flags, "output-root");
  const relativeOutputPath = readOptionalFlag(flags, "relative-output-path");
  const generatedAt = readOptionalFlag(flags, "generated-at");

  const result = await runHostIntegrationAcceptanceQuickstart({
    hostName,
    moduleSurface,
    outputRoot,
    relativeOutputPath,
    generatedAt,
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        command: "acceptance-quickstart",
        outputPath: result.outputPath,
        report: result.report,
      },
      null,
      2,
    )}\n`,
  );
}

function createSubmissionMemoryBridge(flags: FlagMap): {
  bridge: DiscoveryHostStorageBridge;
  queuePath: string;
} {
  const directiveRoot =
    readOptionalFlag(flags, "directive-root") ?? "C:/example/directive-workspace";
  const receivedAt = readOptionalFlag(flags, "received-at");
  const unresolvedGapIds = readRepeatedFlag(flags, "unresolved-gap-id");
  const harness = createMemoryDiscoveryHostStorageBridge({
    directiveRoot,
    receivedAt,
    unresolvedGapIds,
  });

  return {
    bridge: harness.bridge,
    queuePath: path.resolve(directiveRoot, "discovery", "intake-queue.json"),
  };
}

async function handleSubmissionMemoryDryRun(flags: FlagMap) {
  const inputJsonPath = readRequiredFlag(flags, "input-json-path");
  const request = readJsonFile<DiscoverySubmissionRequest>(inputJsonPath);
  const { bridge } = createSubmissionMemoryBridge(flags);
  const result = await submitDiscoveryEntryWithHostBridge({
    request,
    storage: bridge,
    dryRun: true,
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        command: "submission-memory-dry-run",
        inputJsonPath,
        result,
      },
      null,
      2,
    )}\n`,
  );
}

function handlePrintSubmissionExample(flags: FlagMap) {
  const shape = readRequiredFlag(flags, "shape");
  const examplePath = resolveSubmissionExamplePath(shape);
  const payload = readJsonFile<Record<string, unknown>>(examplePath);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        command: "print-submission-example",
        shape,
        examplePath,
        payload,
      },
      null,
      2,
    )}\n`,
  );
}

function handlePrintSignalExample(flags: FlagMap) {
  const kind = readRequiredFlag(flags, "kind");
  const examplePath = resolveSignalExamplePath(kind);
  const payload = readJsonFile<Record<string, unknown>>(examplePath);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        command: "print-signal-example",
        kind,
        examplePath,
        payload,
      },
      null,
      2,
    )}\n`,
  );
}

function handleSignalAdapterDryRun(flags: FlagMap) {
  const kind = readRequiredFlag(flags, "kind");
  const inputJsonPath = readRequiredFlag(flags, "input-json-path");

  if (kind === "runtime_verification") {
    const payload = readJsonFile<OpenClawRuntimeVerificationSignal>(inputJsonPath);
    const result = adaptOpenClawRuntimeVerificationSignalToDirectiveRequest(payload);
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          command: "signal-adapter-dry-run",
          kind,
          inputJsonPath,
          result,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  if (kind === "maintenance_watchdog") {
    const payload = readJsonFile<OpenClawMaintenanceWatchdogSignal>(inputJsonPath);
    const result = adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest(payload);
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          command: "signal-adapter-dry-run",
          kind,
          inputJsonPath,
          result,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  throw new Error(`Unsupported signal adapter kind: ${kind}`);
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));

  if (!command) {
    printUsage();
    process.exit(1);
  }

  switch (command) {
    case "acceptance-quickstart":
      await handleAcceptanceQuickstart(flags);
      return;
    case "submission-memory-dry-run":
      await handleSubmissionMemoryDryRun(flags);
      return;
    case "print-submission-example":
      handlePrintSubmissionExample(flags);
      return;
    case "print-signal-example":
      handlePrintSignalExample(flags);
      return;
    case "signal-adapter-dry-run":
      handleSignalAdapterDryRun(flags);
      return;
    default:
      printUsage();
      throw new Error(`Unsupported command: ${String(command)}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
