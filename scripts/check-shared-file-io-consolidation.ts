import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE_IO_PATH = path.join(DIRECTIVE_ROOT, "shared/lib/file-io.ts");

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

const fileIoSrc = readFile(FILE_IO_PATH);

check("shared/lib/file-io.ts exists", () => {
  assert.ok(fs.existsSync(FILE_IO_PATH), "file-io.ts must exist");
});

check("exports readUtf8", () => {
  assertContains(fileIoSrc, "export function readUtf8(", "file-io.ts");
});

check("exports writeUtf8", () => {
  assertContains(fileIoSrc, "export function writeUtf8(", "file-io.ts");
});

check("exports readJson", () => {
  assertContains(fileIoSrc, "export function readJson<T>(", "file-io.ts");
});

check("exports writeJson", () => {
  assertContains(fileIoSrc, "export function writeJson(", "file-io.ts");
});

check("exports writeJsonAtomic", () => {
  assertContains(fileIoSrc, "export function writeJsonAtomic(", "file-io.ts");
});

check("exports readJsonLines", () => {
  assertContains(fileIoSrc, "export function readJsonLines<T>(", "file-io.ts");
});

check("exports readJsonOptional", () => {
  assertContains(fileIoSrc, "export function readJsonOptional<T>(", "file-io.ts");
});

check("exports appendJsonLine", () => {
  assertContains(fileIoSrc, "export function appendJsonLine(", "file-io.ts");
});

// --- readJson strips BOM ---

check("readJson strips UTF-8 BOM", () => {
  assertContains(fileIoSrc, "\\uFEFF", "file-io.ts");
});

// --- writeJson and writeJsonAtomic create parent directories ---

check("writeJson creates parent directories", () => {
  assertContains(fileIoSrc, "mkdirSync(path.dirname(filePath), { recursive: true })", "file-io.ts");
});

// --- Consumer migration: no private duplicates remain in migrated files ---

const MIGRATED_CONSUMERS: Array<{ relativePath: string; removedFunctions: string[] }> = [
  {
    relativePath: "engine/coordination/autonomous-lane-loop.ts",
    removedFunctions: ["function readJsonFile", "function writeJsonFile", "function writeTextFile"],
  },
  {
    relativePath: "engine/coordination/runtime-promotion-automation.ts",
    removedFunctions: ["function readJsonFile"],
  },
  {
    relativePath: "engine/coordination/completion-slice-selector.ts",
    removedFunctions: ["function readJsonFile"],
  },
  {
    relativePath: "discovery/lib/discovery-front-door.ts",
    removedFunctions: ["function writeUtf8"],
  },
  {
    relativePath: "discovery/lib/discovery-front-door-projections.ts",
    removedFunctions: ["function writeUtf8"],
  },
  {
    relativePath: "discovery/lib/discovery-route-opener.ts",
    removedFunctions: ["function readUtf8"],
  },
  {
    relativePath: "discovery/lib/discovery-intake-lifecycle-sync.ts",
    removedFunctions: ["function readUtf8"],
  },
  {
    relativePath: "architecture/lib/architecture-note-closeout-projections.ts",
    removedFunctions: ["function writeUtf8"],
  },
  {
    relativePath: "architecture/lib/architecture-adoption-decision-store.ts",
    removedFunctions: ["function readJson", "function writeJsonAtomic"],
  },
  {
    relativePath: "architecture/lib/operator-simplicity-loop-control.ts",
    removedFunctions: ["function readJsonFile"],
  },
  {
    relativePath: "hosts/standalone-host/bootstrap.ts",
    removedFunctions: ["function ensureDirectory", "function writeJson", "function writeText"],
  },
  {
    relativePath: "hosts/standalone-host/cli.ts",
    removedFunctions: ["function readJsonFile"],
  },
  {
    relativePath: "hosts/integration-kit/cli/host-integration-kit-cli.ts",
    removedFunctions: ["function readJsonFile"],
  },
  {
    relativePath: "engine/cases/case-event-log.ts",
    removedFunctions: ["function readJsonLines", "function appendJsonLine", "function ensureParentDir"],
  },
  {
    relativePath: "engine/execution/directive-runner-state.ts",
    removedFunctions: ["function readJsonLines", "function appendJsonLine", "function ensureParentDir"],
  },
  {
    relativePath: "hosts/standalone-host/server.ts",
    removedFunctions: ["function writeJsonAtomic", "function appendJsonLine", "function ensureParentDirectory"],
  },
];

for (const consumer of MIGRATED_CONSUMERS) {
  const consumerPath = path.join(DIRECTIVE_ROOT, consumer.relativePath);
  const consumerSrc = readFile(consumerPath);
  const shortName = consumer.relativePath.split("/").pop()!;

  check(`${shortName} imports from shared/lib/file-io.ts`, () => {
    assertContains(consumerSrc, "shared/lib/file-io.ts", shortName);
  });

  for (const removedFn of consumer.removedFunctions) {
    check(`${shortName} no longer has private ${removedFn}`, () => {
      assert.ok(
        !consumerSrc.includes(removedFn),
        `${shortName} should not contain "${removedFn}" — it should import from shared/lib/file-io.ts`,
      );
    });
  }
}

// --- Re-export delegates: files that now re-export from shared/lib/file-io.ts ---

check("checker-test-helpers.ts re-exports from shared/lib/file-io.ts", () => {
  const src = readFile(path.join(DIRECTIVE_ROOT, "scripts/checker-test-helpers.ts"));
  assertContains(src, "shared/lib/file-io.ts", "checker-test-helpers.ts");
  assert.ok(
    !src.includes("JSON.parse(fs.readFileSync"),
    "checker-test-helpers.ts should not have its own JSON.parse(fs.readFileSync) — it should re-export from shared",
  );
});

check("architecture-deep-tail-artifact-helpers.ts delegates to shared/lib/file-io.ts", () => {
  const src = readFile(path.join(DIRECTIVE_ROOT, "architecture/lib/architecture-deep-tail-artifact-helpers.ts"));
  assertContains(src, "shared/lib/file-io.ts", "architecture-deep-tail-artifact-helpers.ts");
  assert.ok(
    !src.includes("JSON.parse(fs.readFileSync"),
    "architecture-deep-tail-artifact-helpers.ts should not have its own JSON.parse(fs.readFileSync) — it should delegate to shared",
  );
});

// --- Behavioral tests ---

import {
  readUtf8,
  writeUtf8,
  readJson,
  readJsonOptional,
  writeJson,
  writeJsonAtomic,
  appendJsonLine,
  readJsonLines,
} from "../shared/lib/file-io.ts";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dw-file-io-check-"));

check("writeJson + readJson round-trip", () => {
  const target = path.join(tmpDir, "sub", "roundtrip.json");
  const payload = { alpha: 1, beta: [2, 3] };
  writeJson(target, payload);
  const loaded = readJson<typeof payload>(target);
  assert.deepStrictEqual(loaded, payload);
});

check("writeJson output is pretty-printed with trailing newline", () => {
  const target = path.join(tmpDir, "pretty.json");
  writeJson(target, { x: 1 });
  const raw = fs.readFileSync(target, "utf8");
  assert.ok(raw.includes("\n"), "output should contain newlines (pretty-printed)");
  assert.ok(raw.endsWith("}\n"), "output should end with }\\n");
});

check("writeJsonAtomic + readJson round-trip", () => {
  const target = path.join(tmpDir, "atomic", "data.json");
  const payload = { key: "value" };
  writeJsonAtomic(target, payload);
  const loaded = readJson<typeof payload>(target);
  assert.deepStrictEqual(loaded, payload);
  // tmp file should not remain
  assert.ok(!fs.existsSync(`${target}.tmp`), ".tmp file should be cleaned up");
});

check("writeUtf8 + readUtf8 round-trip", () => {
  const target = path.join(tmpDir, "nested", "text.txt");
  writeUtf8(target, "hello world");
  const content = readUtf8(target);
  assert.strictEqual(content, "hello world");
});

check("readJson strips BOM from file", () => {
  const target = path.join(tmpDir, "bom.json");
  fs.writeFileSync(target, "\uFEFF{\"bomKey\":42}", "utf8");
  const loaded = readJson<{ bomKey: number }>(target);
  assert.strictEqual(loaded.bomKey, 42);
});

check("readJson throws on missing file", () => {
  assert.throws(
    () => readJson(path.join(tmpDir, "nonexistent.json")),
    /ENOENT/,
  );
});

check("readJson throws on invalid JSON", () => {
  const target = path.join(tmpDir, "bad.json");
  fs.writeFileSync(target, "not json at all", "utf8");
  assert.throws(() => readJson(target));
});

check("readJsonLines returns empty array for missing file", () => {
  const result = readJsonLines(path.join(tmpDir, "no-such-file.jsonl"));
  assert.deepStrictEqual(result, []);
});

check("readJsonLines parses newline-delimited JSON", () => {
  const target = path.join(tmpDir, "lines.jsonl");
  fs.writeFileSync(target, '{"a":1}\n{"a":2}\n\n{"a":3}\n', "utf8");
  const result = readJsonLines<{ a: number }>(target);
  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].a, 1);
  assert.strictEqual(result[2].a, 3);
});

check("readJsonOptional returns parsed JSON for existing file", () => {
  const target = path.join(tmpDir, "optional-exists.json");
  writeJson(target, { found: true });
  const result = readJsonOptional<{ found: boolean }>(target);
  assert.deepStrictEqual(result, { found: true });
});

check("readJsonOptional returns null for missing file", () => {
  const result = readJsonOptional(path.join(tmpDir, "optional-missing.json"));
  assert.strictEqual(result, null);
});

check("appendJsonLine creates file and appends", () => {
  const target = path.join(tmpDir, "append-sub", "appended.jsonl");
  appendJsonLine(target, { seq: 1 });
  appendJsonLine(target, { seq: 2 });
  const lines = readJsonLines<{ seq: number }>(target);
  assert.strictEqual(lines.length, 2);
  assert.strictEqual(lines[0].seq, 1);
  assert.strictEqual(lines[1].seq, 2);
});

// --- Cleanup ---

fs.rmSync(tmpDir, { recursive: true, force: true });

// --- Intentionally NOT migrated (semantic variants should still exist) ---

check("run-evidence-aggregation.ts still has its own null-on-error readJson", () => {
  const src = readFile(
    path.join(DIRECTIVE_ROOT, "engine/execution/run-evidence-aggregation.ts"),
  );
  assert.ok(
    src.includes("function readJson") || src.includes("function readJsonSafe"),
    "run-evidence-aggregation.ts should retain its own error-handling readJson variant",
  );
});

check("runtime-registry-acceptance-gate.ts still has its own violations-pattern readJsonFile", () => {
  const src = readFile(
    path.join(DIRECTIVE_ROOT, "runtime/lib/runtime-registry-acceptance-gate.ts"),
  );
  assert.ok(
    src.includes("function readJsonFile"),
    "runtime-registry-acceptance-gate.ts should retain its violations-pattern readJsonFile",
  );
});

// --- Summary ---

console.log(
  `check-shared-file-io-consolidation: ${passed} passed, ${failed} failed`,
);
for (const line of assertions) {
  console.log(line);
}
if (failed > 0) {
  process.exit(1);
}
