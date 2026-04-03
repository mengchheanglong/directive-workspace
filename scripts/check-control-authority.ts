import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMPLEMENT_PATH = path.join(DIRECTIVE_ROOT, "implement.md");
const CONTROL_README_PATH = path.join(DIRECTIVE_ROOT, "control", "README.md");
const ACTIVE_RUNBOOK_PATH = path.join(DIRECTIVE_ROOT, "control", "runbook", "active.md");
const CURRENT_PRIORITY_PATH = path.join(DIRECTIVE_ROOT, "control", "runbook", "current-priority.md");
const STOP_LINES_PATH = path.join(DIRECTIVE_ROOT, "control", "policies", "stop-lines.md");
const CONTINUATION_RULES_PATH = path.join(
  DIRECTIVE_ROOT,
  "control",
  "policies",
  "continuation-rules.md",
);
const LOGGING_RULES_PATH = path.join(DIRECTIVE_ROOT, "control", "policies", "logging-rules.md");

const CHECKER_ID = "control_authority" as const;
const FAILURE_CONTRACT_VERSION = 1 as const;

type SurfaceKey =
  | "implement"
  | "control_readme"
  | "active_runbook"
  | "current_priority"
  | "stop_lines"
  | "continuation_rules"
  | "logging_rules";

type ControlAuthorityViolationCode =
  | "missing_surface"
  | "missing_required_content"
  | "forbidden_content_present"
  | "max_non_empty_lines_exceeded"
  | "section_count_mismatch"
  | "section_heading_mismatch";

type ControlAuthorityViolation = {
  code: ControlAuthorityViolationCode;
  surface: SurfaceKey;
  path: string;
  message: string;
  expected?: string | number;
  actual?: string | number;
};

type ControlAuthoritySuccess = {
  ok: true;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  checked: {
    implement: string;
    implementNonEmptyLineCount: number;
    implementSectionCount: number;
    activeRunbook: string;
    currentPriority: string;
    stopLines: string;
    continuationRules: string;
    loggingRules: string;
  };
};

type ControlAuthorityFailure = {
  ok: false;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  summary: string;
  violations: ControlAuthorityViolation[];
};

export type ControlAuthorityCheckResult = ControlAuthoritySuccess | ControlAuthorityFailure;

type SurfaceSpec = {
  key: SurfaceKey;
  absolutePath: string;
  relativePath: string;
};

type ValidateControlAuthorityOptions = {
  surfaceTextOverrides?: Partial<Record<SurfaceKey, string>>;
};

const SURFACE_SPECS: SurfaceSpec[] = [
  {
    key: "implement",
    absolutePath: IMPLEMENT_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, IMPLEMENT_PATH).replace(/\\/g, "/"),
  },
  {
    key: "control_readme",
    absolutePath: CONTROL_README_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, CONTROL_README_PATH).replace(/\\/g, "/"),
  },
  {
    key: "active_runbook",
    absolutePath: ACTIVE_RUNBOOK_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, ACTIVE_RUNBOOK_PATH).replace(/\\/g, "/"),
  },
  {
    key: "current_priority",
    absolutePath: CURRENT_PRIORITY_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, CURRENT_PRIORITY_PATH).replace(/\\/g, "/"),
  },
  {
    key: "stop_lines",
    absolutePath: STOP_LINES_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, STOP_LINES_PATH).replace(/\\/g, "/"),
  },
  {
    key: "continuation_rules",
    absolutePath: CONTINUATION_RULES_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, CONTINUATION_RULES_PATH).replace(/\\/g, "/"),
  },
  {
    key: "logging_rules",
    absolutePath: LOGGING_RULES_PATH,
    relativePath: path.relative(DIRECTIVE_ROOT, LOGGING_RULES_PATH).replace(/\\/g, "/"),
  },
] as const;

const POSSIBLE_VIOLATION_CODES: ControlAuthorityViolationCode[] = [
  "missing_surface",
  "missing_required_content",
  "forbidden_content_present",
  "max_non_empty_lines_exceeded",
  "section_count_mismatch",
  "section_heading_mismatch",
];

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countLinesMatching(text: string, pattern: RegExp) {
  return text
    .split(/\r?\n/u)
    .filter((line) => pattern.test(line)).length;
}

function countNonEmptyLines(text: string) {
  return text
    .split(/\r?\n/u)
    .filter((line) => line.trim().length > 0).length;
}

function pushViolation(
  violations: ControlAuthorityViolation[],
  violation: ControlAuthorityViolation,
) {
  violations.push(violation);
}

function loadSurfaceTexts(options: ValidateControlAuthorityOptions) {
  const surfaceTexts: Partial<Record<SurfaceKey, string>> = {};
  const violations: ControlAuthorityViolation[] = [];

  for (const surface of SURFACE_SPECS) {
    const override = options.surfaceTextOverrides?.[surface.key];
    if (override !== undefined) {
      surfaceTexts[surface.key] = override;
      continue;
    }

    if (!fs.existsSync(surface.absolutePath)) {
      pushViolation(violations, {
        code: "missing_surface",
        surface: surface.key,
        path: surface.relativePath,
        message: `Missing control-authority surface: ${surface.absolutePath}`,
        expected: "file_present",
        actual: "missing",
      });
      continue;
    }

    surfaceTexts[surface.key] = fs.readFileSync(surface.absolutePath, "utf8");
  }

  return { surfaceTexts, violations };
}

function requireSnippets(input: {
  violations: ControlAuthorityViolation[];
  surface: SurfaceKey;
  path: string;
  text: string | undefined;
  snippets: string[];
}) {
  if (input.text === undefined) {
    return;
  }

  for (const snippet of input.snippets) {
    if (!new RegExp(escapeForRegex(snippet), "u").test(input.text)) {
      pushViolation(input.violations, {
        code: "missing_required_content",
        surface: input.surface,
        path: input.path,
        message: `${input.path} is missing required content: ${snippet}`,
        expected: snippet,
        actual: "missing",
      });
    }
  }
}

function forbidSnippets(input: {
  violations: ControlAuthorityViolation[];
  surface: SurfaceKey;
  path: string;
  text: string | undefined;
  snippets: string[];
}) {
  if (input.text === undefined) {
    return;
  }

  for (const snippet of input.snippets) {
    if (input.text.includes(snippet)) {
      pushViolation(input.violations, {
        code: "forbidden_content_present",
        surface: input.surface,
        path: input.path,
        message: `${input.path} must not contain monolithic-runbook drift: ${snippet}`,
        expected: "not_present",
        actual: snippet,
      });
    }
  }
}

export function validateControlAuthority(
  options: ValidateControlAuthorityOptions = {},
): ControlAuthorityCheckResult {
  const { surfaceTexts, violations } = loadSurfaceTexts(options);

  const implementText = surfaceTexts.implement;
  const controlReadmeText = surfaceTexts.control_readme;
  const activeRunbookText = surfaceTexts.active_runbook;
  const currentPriorityText = surfaceTexts.current_priority;
  const stopLinesText = surfaceTexts.stop_lines;
  const continuationRulesText = surfaceTexts.continuation_rules;
  const loggingRulesText = surfaceTexts.logging_rules;

  requireSnippets({
    violations,
    surface: "implement",
    path: "implement.md",
    text: implementText,
    snippets: [
      "thin compatibility entrypoint",
      "control/README.md",
      "control/runbook/active.md",
      "control/policies/stop-lines.md",
      "control/policies/continuation-rules.md",
      "control/policies/logging-rules.md",
    ],
  });
  forbidSnippets({
    violations,
    surface: "implement",
    path: "implement.md",
    text: implementText,
    snippets: [
      "## Current mission",
      "## Current Runtime Execution Stop-Line",
      "## Current Structural Mapping Experiment Boundary",
      "## Progress log",
      "## Progress log format",
      "## Run persistence rule",
    ],
  });

  if (implementText !== undefined) {
    const nonEmptyLineCount = countNonEmptyLines(implementText);
    if (nonEmptyLineCount > 16) {
      pushViolation(violations, {
        code: "max_non_empty_lines_exceeded",
        surface: "implement",
        path: "implement.md",
        message:
          "implement.md must remain a thin compatibility entrypoint rather than regrowing into a larger active runbook",
        expected: 16,
        actual: nonEmptyLineCount,
      });
    }

    const sectionCount = countLinesMatching(implementText, /^## /u);
    if (sectionCount !== 1) {
      pushViolation(violations, {
        code: "section_count_mismatch",
        surface: "implement",
        path: "implement.md",
        message:
          "implement.md must keep a single thin entrypoint section instead of multiple active-runbook sections",
        expected: 1,
        actual: sectionCount,
      });
    }

    if (!/^## Control Entrypoint$/mu.test(implementText)) {
      pushViolation(violations, {
        code: "section_heading_mismatch",
        surface: "implement",
        path: "implement.md",
        message: "implement.md must preserve the single Control Entrypoint section",
        expected: "## Control Entrypoint",
        actual: "missing",
      });
    }
  }

  requireSnippets({
    violations,
    surface: "control_readme",
    path: "control/README.md",
    text: controlReadmeText,
    snippets: [
      "control/runbook/active.md",
      "control/runbook/current-priority.md",
      "control/policies/stop-lines.md",
      "control/policies/continuation-rules.md",
      "control/policies/logging-rules.md",
      "control/logs/",
    ],
  });
  requireSnippets({
    violations,
    surface: "active_runbook",
    path: "control/runbook/active.md",
    text: activeRunbookText,
    snippets: [
      "control/runbook/current-priority.md",
      "control/policies/stop-lines.md",
      "control/policies/continuation-rules.md",
      "control/policies/logging-rules.md",
    ],
  });
  requireSnippets({
    violations,
    surface: "current_priority",
    path: "control/runbook/current-priority.md",
    text: currentPriorityText,
    snippets: ["## Current mission", "## Current run priority"],
  });
  requireSnippets({
    violations,
    surface: "stop_lines",
    path: "control/policies/stop-lines.md",
    text: stopLinesText,
    snippets: [
      "## Current Runtime Execution Stop-Line",
      "## Current Structural Mapping Experiment Boundary",
      "## Current Structural Mapping Stop-Line",
    ],
  });
  requireSnippets({
    violations,
    surface: "continuation_rules",
    path: "control/policies/continuation-rules.md",
    text: continuationRulesText,
    snippets: [
      "## Task selection policy",
      "## Required cycle framing",
      "## Run persistence rule",
    ],
  });
  requireSnippets({
    violations,
    surface: "logging_rules",
    path: "control/policies/logging-rules.md",
    text: loggingRulesText,
    snippets: [
      "leave `implement.md` as a thin entrypoint only",
      "control/logs/YYYY-MM/",
      "control/templates/cycle-entry.md",
      "control/templates/loop-run.md",
      "control/templates/handoff.md",
    ],
  });

  if (violations.length > 0) {
    return {
      ok: false,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      summary: "Control authority contract violated.",
      violations,
    };
  }

  return {
    ok: true,
    checkerId: CHECKER_ID,
    failureContractVersion: FAILURE_CONTRACT_VERSION,
    checked: {
      implement: "implement.md",
      implementNonEmptyLineCount: countNonEmptyLines(implementText ?? ""),
      implementSectionCount: countLinesMatching(implementText ?? "", /^## /u),
      activeRunbook: "control/runbook/active.md",
      currentPriority: "control/runbook/current-priority.md",
      stopLines: "control/policies/stop-lines.md",
      continuationRules: "control/policies/continuation-rules.md",
      loggingRules: "control/policies/logging-rules.md",
    },
  };
}

function createFailureProbeOverrides(): Partial<Record<SurfaceKey, string>> {
  const implementText = fs.readFileSync(IMPLEMENT_PATH, "utf8");
  return {
    implement: implementText.replace("control/policies/logging-rules.md", "control/policies/logging-rules.MISSING"),
  };
}

function resolveOptionsFromArgs(args: string[]): ValidateControlAuthorityOptions {
  const probeArg = args.find((arg) => arg.startsWith("--probe="));
  if (!probeArg) {
    return {};
  }

  const probeMode = probeArg.slice("--probe=".length);
  if (probeMode !== "missing_required_content") {
    throw new Error(`Unsupported control-authority probe mode: ${probeMode}`);
  }

  return {
    surfaceTextOverrides: createFailureProbeOverrides(),
  };
}

function isDirectExecution() {
  const currentFile = path.resolve(fileURLToPath(import.meta.url));
  const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return currentFile === executedFile;
}

if (isDirectExecution()) {
  const result = validateControlAuthority(resolveOptionsFromArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) {
    process.exitCode = 1;
  }
}
