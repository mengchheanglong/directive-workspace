import fs from "node:fs";

import {
  DIRECTIVE_RUNTIME_MANUAL_ACTION_KINDS,
  DIRECTIVE_RUNTIME_MANUAL_SEQUENCE_KINDS,
  runDirectiveRuntimeManualControl,
  type DirectiveRuntimeManualControlInput,
} from "../shared/lib/runtime-manual-control.ts";

type CommandName = "action" | "sequence";
type FlagMap = Record<string, string[]>;

function printUsage() {
  process.stdout.write(`Directive Workspace Runtime Manual Control CLI (admin/test-only)

Commands:
  action --directive-root <path> --action-kind <kind> --target-path <path> --approved <true|false> --approved-by <actor> [--runner-id <id>]
  sequence --directive-root <path> --sequence-kind <kind> --steps-json-path <path> --approved <true|false> [--sequence-id <id>]
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

function readBooleanFlag(flags: FlagMap, name: string) {
  const value = readRequiredFlag(flags, name);
  if (value !== "true" && value !== "false") {
    throw new Error(`Invalid value for --${name}; expected true or false`);
  }
  return value === "true";
}

function readJsonFile<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function requireAllowedValue<T extends string>(input: {
  value: string;
  allowed: readonly T[];
  flagName: string;
}): T {
  if (!input.allowed.includes(input.value as T)) {
    throw new Error(
      `Invalid value for --${input.flagName}; allowed values: ${input.allowed.join(", ")}`,
    );
  }
  return input.value as T;
}

function buildActionInput(flags: FlagMap): DirectiveRuntimeManualControlInput {
  return {
    mode: "action",
    directiveRoot: readRequiredFlag(flags, "directive-root"),
    actionKind: requireAllowedValue({
      value: readRequiredFlag(flags, "action-kind"),
      allowed: DIRECTIVE_RUNTIME_MANUAL_ACTION_KINDS,
      flagName: "action-kind",
    }),
    targetPath: readRequiredFlag(flags, "target-path"),
    approved: readBooleanFlag(flags, "approved"),
    approvedBy: readRequiredFlag(flags, "approved-by"),
    runnerId: readOptionalFlag(flags, "runner-id"),
  };
}

function buildSequenceInput(flags: FlagMap): DirectiveRuntimeManualControlInput {
  const sequenceKind = requireAllowedValue({
    value: readRequiredFlag(flags, "sequence-kind"),
    allowed: DIRECTIVE_RUNTIME_MANUAL_SEQUENCE_KINDS,
    flagName: "sequence-kind",
  });
  const steps = readJsonFile<Extract<DirectiveRuntimeManualControlInput, { mode: "sequence" }>["steps"]>(
    readRequiredFlag(flags, "steps-json-path"),
  );

  return {
    mode: "sequence",
    directiveRoot: readRequiredFlag(flags, "directive-root"),
    sequenceKind,
    steps,
    approved: readBooleanFlag(flags, "approved"),
    sequenceId: readOptionalFlag(flags, "sequence-id"),
  };
}

function buildInput(command: CommandName, flags: FlagMap): DirectiveRuntimeManualControlInput {
  switch (command) {
    case "action":
      return buildActionInput(flags);
    case "sequence":
      return buildSequenceInput(flags);
    default: {
      const exhaustiveCheck: never = command;
      throw new Error(`Unsupported command: ${String(exhaustiveCheck)}`);
    }
  }
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (!command) {
    printUsage();
    process.exit(1);
  }

  const result = runDirectiveRuntimeManualControl(buildInput(command, flags));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

void main().catch((error) => {
  process.stderr.write(`${String((error as Error).message || error)}\n`);
  process.exit(1);
});
