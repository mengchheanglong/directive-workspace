import assert from "node:assert/strict";
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

function readText(filePath: string) {
  assert.ok(fs.existsSync(filePath), `Missing control-authority surface: ${filePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function assertContainsAll(label: string, text: string, requiredSnippets: string[]) {
  for (const snippet of requiredSnippets) {
    assert.match(
      text,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"),
      `${label} is missing required content: ${snippet}`,
    );
  }
}

function assertContainsNone(label: string, text: string, forbiddenSnippets: string[]) {
  for (const snippet of forbiddenSnippets) {
    assert.ok(!text.includes(snippet), `${label} must not contain monolithic-runbook drift: ${snippet}`);
  }
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

function main() {
  const implementText = readText(IMPLEMENT_PATH);
  const controlReadmeText = readText(CONTROL_README_PATH);
  const activeRunbookText = readText(ACTIVE_RUNBOOK_PATH);
  const currentPriorityText = readText(CURRENT_PRIORITY_PATH);
  const stopLinesText = readText(STOP_LINES_PATH);
  const continuationRulesText = readText(CONTINUATION_RULES_PATH);
  const loggingRulesText = readText(LOGGING_RULES_PATH);

  assertContainsAll("implement.md", implementText, [
    "thin compatibility entrypoint",
    "control/README.md",
    "control/runbook/active.md",
    "control/policies/stop-lines.md",
    "control/policies/continuation-rules.md",
    "control/policies/logging-rules.md",
  ]);
  assertContainsNone("implement.md", implementText, [
    "## Current mission",
    "## Current Runtime Execution Stop-Line",
    "## Current Structural Mapping Experiment Boundary",
    "## Progress log",
    "## Progress log format",
    "## Run persistence rule",
  ]);
  assert.ok(
    countNonEmptyLines(implementText) <= 16,
    "implement.md must remain a thin compatibility entrypoint rather than regrowing into a larger active runbook",
  );
  assert.equal(
    countLinesMatching(implementText, /^## /u),
    1,
    "implement.md must keep a single thin entrypoint section instead of multiple active-runbook sections",
  );
  assert.match(
    implementText,
    /^## Control Entrypoint$/mu,
    "implement.md must preserve the single Control Entrypoint section",
  );

  assertContainsAll("control/README.md", controlReadmeText, [
    "control/runbook/active.md",
    "control/runbook/current-priority.md",
    "control/policies/stop-lines.md",
    "control/policies/continuation-rules.md",
    "control/policies/logging-rules.md",
    "control/logs/",
  ]);

  assertContainsAll("control/runbook/active.md", activeRunbookText, [
    "control/runbook/current-priority.md",
    "control/policies/stop-lines.md",
    "control/policies/continuation-rules.md",
    "control/policies/logging-rules.md",
  ]);

  assertContainsAll("control/runbook/current-priority.md", currentPriorityText, [
    "## Current mission",
    "## Current run priority",
  ]);

  assertContainsAll("control/policies/stop-lines.md", stopLinesText, [
    "## Current Runtime Execution Stop-Line",
    "## Current Structural Mapping Experiment Boundary",
    "## Current Structural Mapping Stop-Line",
  ]);

  assertContainsAll("control/policies/continuation-rules.md", continuationRulesText, [
    "## Task selection policy",
    "## Required cycle framing",
    "## Run persistence rule",
  ]);

  assertContainsAll("control/policies/logging-rules.md", loggingRulesText, [
    "leave `implement.md` as a thin entrypoint only",
    "control/logs/YYYY-MM/",
    "control/templates/cycle-entry.md",
    "control/templates/loop-run.md",
    "control/templates/handoff.md",
  ]);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          implement: path.relative(DIRECTIVE_ROOT, IMPLEMENT_PATH).replace(/\\/g, "/"),
          implementNonEmptyLineCount: countNonEmptyLines(implementText),
          implementSectionCount: countLinesMatching(implementText, /^## /u),
          activeRunbook: path.relative(DIRECTIVE_ROOT, ACTIVE_RUNBOOK_PATH).replace(/\\/g, "/"),
          currentPriority: path.relative(DIRECTIVE_ROOT, CURRENT_PRIORITY_PATH).replace(/\\/g, "/"),
          stopLines: path.relative(DIRECTIVE_ROOT, STOP_LINES_PATH).replace(/\\/g, "/"),
          continuationRules: path
            .relative(DIRECTIVE_ROOT, CONTINUATION_RULES_PATH)
            .replace(/\\/g, "/"),
          loggingRules: path.relative(DIRECTIVE_ROOT, LOGGING_RULES_PATH).replace(/\\/g, "/"),
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
