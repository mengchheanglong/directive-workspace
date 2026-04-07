import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DIRECTIVE_ENGINE_RUN_RECORD_KIND,
  DIRECTIVE_ENGINE_RUN_RECORD_SCHEMA_REF,
  DIRECTIVE_ENGINE_RUN_RECORD_SCHEMA_VERSION,
} from "../engine/types.ts";
import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { readJson } from "./checker-test-helpers.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENGINE_RUN_SCHEMA_PATH = path.join(
  DIRECTIVE_ROOT,
  "shared",
  "schemas",
  "directive-engine-run-record.schema.json",
);

async function main() {
  assert.ok(fs.existsSync(ENGINE_RUN_SCHEMA_PATH), `missing_engine_run_schema:${ENGINE_RUN_SCHEMA_PATH}`);
  const schema = readJson<Record<string, unknown>>(ENGINE_RUN_SCHEMA_PATH);
  assert.equal(schema.title, "Directive Engine Run Record");
  assert.equal(schema.$id, "https://directive-workspace.dev/schemas/directive-engine-run-record.schema.json");
  assert.deepEqual(
    (schema.properties as Record<string, { const?: unknown }>).recordKind?.const,
    DIRECTIVE_ENGINE_RUN_RECORD_KIND,
  );

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-engine-run-canonical-"));
  const host = createStandaloneFilesystemHost({
    directiveRoot: tempRoot,
    receivedAt: "2026-04-05T00:00:00.000Z",
    unresolvedGapIds: ["architecture_workflow_boundary_gap"],
  });

  try {
    const result = await host.submitDiscoveryEntryWithEngine({
      candidate_id: "engine-run-canonical-surface-check",
      candidate_name: "Engine Run Canonical Surface Check",
      source_type: "github-repo",
      source_reference: "https://example.com/engine-run-canonical-surface-check",
      mission_alignment: "Improve Engine reporting clarity and keep routing proof explicit.",
      primary_adoption_target: "architecture",
      contains_executable_code: true,
      contains_workflow_pattern: true,
      improves_directive_workspace: true,
      workflow_boundary_shape: "bounded_protocol",
      capability_gap_id: "architecture_workflow_boundary_gap",
    });
    assert.equal(result.engine.ok, true);
    assert.equal(result.engine.processed, true);
    assert.ok(result.engine.path);
    assert.ok(result.engine.reportPath);

    const record = readJson<Record<string, unknown>>(result.engine.path as string);
    assert.equal(record.$schema, DIRECTIVE_ENGINE_RUN_RECORD_SCHEMA_REF);
    assert.equal(record.schemaVersion, DIRECTIVE_ENGINE_RUN_RECORD_SCHEMA_VERSION);
    assert.equal(record.recordKind, DIRECTIVE_ENGINE_RUN_RECORD_KIND);
    assert.ok("reviewGuidance" in ((record.routingAssessment as Record<string, unknown>) ?? {}));

    const reportContent = fs.readFileSync(result.engine.reportPath as string, "utf8");
    assert.match(reportContent, /^# Directive Engine Run/mu);
    assert.match(reportContent, /- Schema version: `2`/u);
    assert.match(reportContent, /- Schema ref: `shared\/schemas\/directive-engine-run-record\.schema\.json`/u);
    assert.match(reportContent, /## Routing Explanation Breakdown/u);
    assert.match(reportContent, /## Gap Pressure/u);
    assert.match(reportContent, /## Review Handling Guidance/u);

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: "directive_engine_run_canonical_surface",
          schemaRef: DIRECTIVE_ENGINE_RUN_RECORD_SCHEMA_REF,
          schemaVersion: DIRECTIVE_ENGINE_RUN_RECORD_SCHEMA_VERSION,
          recordKind: DIRECTIVE_ENGINE_RUN_RECORD_KIND,
          reportSections: [
            "Routing Explanation Breakdown",
            "Gap Pressure",
            "Review Handling Guidance",
          ],
          recordPath: path.relative(tempRoot, result.engine.path as string).replace(/\\/g, "/"),
          reportPath: path.relative(tempRoot, result.engine.reportPath as string).replace(/\\/g, "/"),
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    host.close();
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

void main();
