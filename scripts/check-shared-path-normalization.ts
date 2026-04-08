import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PATH_NORM_PATH = path.join(DIRECTIVE_ROOT, "shared/lib/path-normalization.ts");
const DIRECTIVE_RELATIVE_PATH_PATH = path.join(DIRECTIVE_ROOT, "shared/lib/directive-relative-path.ts");

function readFile(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function assertContains(source: string, needle: string, label: string) {
  assert.ok(source.includes(needle), `${label} must contain "${needle}"`);
}

const assertions: string[] = [];
let passed = 0;
let failed = 0;

function check(label: string, fn: () => void) {
  try {
    fn();
    passed++;
    assertions.push(`  PASS: ${label}`);
  } catch (error) {
    failed++;
    const message = error instanceof Error ? error.message : String(error);
    assertions.push(`  FAIL: ${label} — ${message}`);
  }
}

// --- Module exists and exports ---

const pathNormSrc = readFile(PATH_NORM_PATH);
const directiveRelativePathSrc = readFile(DIRECTIVE_RELATIVE_PATH_PATH);

check("shared/lib/path-normalization.ts exists", () => {
  assert.ok(fs.existsSync(PATH_NORM_PATH));
});

check("exports normalizeAbsolutePath", () => {
  assertContains(pathNormSrc, "export function normalizeAbsolutePath(", "path-normalization.ts");
});

check("exports normalizeRelativePath", () => {
  assertContains(pathNormSrc, "export function normalizeRelativePath(", "path-normalization.ts");
});

check("shared/lib/directive-relative-path.ts exists", () => {
  assert.ok(fs.existsSync(DIRECTIVE_RELATIVE_PATH_PATH));
});

check("exports normalizeDirectiveRelativePath", () => {
  assertContains(
    directiveRelativePathSrc,
    "export function normalizeDirectiveRelativePath(",
    "directive-relative-path.ts",
  );
});

check("exports resolveDirectiveRelativePath", () => {
  assertContains(
    directiveRelativePathSrc,
    "export function resolveDirectiveRelativePath(",
    "directive-relative-path.ts",
  );
});

// --- Consumer migration: private duplicates removed ---

const MIGRATED_CONSUMERS: Array<{ relativePath: string; removedFunctions: string[] }> = [
  { relativePath: "engine/cases/case-event-log.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "engine/cases/case-store.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "engine/execution/directive-runner-state.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/standalone-host/server.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/standalone-host/bootstrap.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/standalone-host/runtime.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/standalone-host/runtime-lane.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/standalone-host/persistence.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/standalone-host/config.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "discovery/lib/discovery-front-door.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "discovery/importers/research-engine-discovery-import.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "runtime/lib/runtime-registry-acceptance-gate.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "runtime/lib/runtime-callable-execution-evidence.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "runtime/core/callable-execution.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "shared/lib/directive-workspace-artifact-storage.ts", removedFunctions: ["function normalizeAbsolutePath"] },
  { relativePath: "hosts/web-host/server.ts", removedFunctions: ["function normalizePath"] },
  { relativePath: "hosts/web-host/data.ts", removedFunctions: ["function normalizePath", "function normalizeRelativePath"] },
  { relativePath: "scripts/check-architecture-composition.ts", removedFunctions: ["function normalizePath"] },
  { relativePath: "engine/coordination/runtime-promotion-automation.ts", removedFunctions: ["function normalizeRelativePath"] },
];

for (const consumer of MIGRATED_CONSUMERS) {
  const consumerPath = path.join(DIRECTIVE_ROOT, consumer.relativePath);
  const consumerSrc = readFile(consumerPath);
  const shortName = consumer.relativePath.split("/").pop()!;

  check(`${shortName} imports from shared/lib/path-normalization.ts`, () => {
    assertContains(consumerSrc, "path-normalization.ts", shortName);
  });

  for (const removedFn of consumer.removedFunctions) {
    check(`${shortName} no longer has private ${removedFn}`, () => {
      assert.ok(
        !consumerSrc.includes(removedFn),
        `${shortName} should not contain "${removedFn}"`,
      );
    });
  }
}

// --- Re-export delegates ---

check("architecture-deep-tail-artifact-helpers.ts re-exports normalizePath from shared", () => {
  const src = readFile(path.join(DIRECTIVE_ROOT, "architecture/lib/architecture-deep-tail-artifact-helpers.ts"));
  assertContains(src, "path-normalization.ts", "architecture-deep-tail-artifact-helpers.ts");
  assert.ok(
    !src.includes("path.resolve(filePath).replace"),
    "should not have inline implementation",
  );
});

check("architecture-deep-tail-artifact-helpers.ts re-exports directive-relative-path helpers from shared", () => {
  const src = readFile(path.join(DIRECTIVE_ROOT, "architecture/lib/architecture-deep-tail-artifact-helpers.ts"));
  assertContains(src, "directive-relative-path.ts", "architecture-deep-tail-artifact-helpers.ts");
  assert.ok(
    !src.includes("export function resolveDirectiveRelativePath("),
    "architecture-deep-tail-artifact-helpers.ts should not keep an inline resolveDirectiveRelativePath implementation",
  );
});

check("engine/state/shared.ts re-exports from shared", () => {
  const src = readFile(path.join(DIRECTIVE_ROOT, "engine/state/shared.ts"));
  assertContains(src, "path-normalization.ts", "engine/state/shared.ts");
  assert.ok(
    !src.includes("path.resolve(filePath).replace"),
    "should not have inline implementation",
  );
});

check("engine/state/shared.ts re-exports directive-relative-path helpers from shared", () => {
  const src = readFile(path.join(DIRECTIVE_ROOT, "engine/state/shared.ts"));
  assertContains(src, "directive-relative-path.ts", "engine/state/shared.ts");
  assert.ok(
    !src.includes("export function resolveDirectiveRelativePath("),
    "engine/state/shared.ts should not keep an inline resolveDirectiveRelativePath implementation",
  );
});

// --- Behavioral tests ---

import {
  normalizeAbsolutePath,
  normalizeRelativePath,
} from "../shared/lib/path-normalization.ts";
import {
  normalizeDirectiveRelativePath,
  resolveDirectiveRelativePath,
} from "../shared/lib/directive-relative-path.ts";

check("normalizeAbsolutePath resolves and forward-slashes", () => {
  const result = normalizeAbsolutePath("C:\\Users\\test\\file.ts");
  assert.ok(!result.includes("\\"), "should not contain backslashes");
  assert.ok(result.includes("/"), "should contain forward slashes");
});

check("normalizeAbsolutePath is idempotent", () => {
  const first = normalizeAbsolutePath("/some/path/file.ts");
  const second = normalizeAbsolutePath(first);
  assert.strictEqual(first, second);
});

check("normalizeRelativePath replaces backslashes", () => {
  const result = normalizeRelativePath("engine\\state\\shared.ts");
  assert.strictEqual(result, "engine/state/shared.ts");
});

check("normalizeRelativePath passes through forward slashes", () => {
  const result = normalizeRelativePath("engine/state/shared.ts");
  assert.strictEqual(result, "engine/state/shared.ts");
});

check("normalizeDirectiveRelativePath validates non-empty strings and normalizes slashes", () => {
  const result = normalizeDirectiveRelativePath("engine\\state\\shared.ts", "artifactPath");
  assert.strictEqual(result, "engine/state/shared.ts");
});

check("resolveDirectiveRelativePath keeps paths within directive workspace", () => {
  const result = resolveDirectiveRelativePath(
    DIRECTIVE_ROOT,
    path.join(DIRECTIVE_ROOT, "engine", "state", "shared.ts"),
    "artifactPath",
  );
  assert.strictEqual(result, "engine/state/shared.ts");
});

check("resolveDirectiveRelativePath rejects paths outside directive workspace", () => {
  assert.throws(
    () => resolveDirectiveRelativePath(DIRECTIVE_ROOT, "../outside.txt", "artifactPath"),
    /artifactPath must stay within directive-workspace/,
  );
});

// --- Summary ---

console.log(`check-shared-path-normalization: ${passed} passed, ${failed} failed`);
for (const line of assertions) {
  console.log(line);
}
if (failed > 0) {
  process.exit(1);
}
