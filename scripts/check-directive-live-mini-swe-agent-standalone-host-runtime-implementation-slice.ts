import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_live_mini_swe_agent_standalone_host_runtime_implementation_slice";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md";
const IMPLEMENTATION_SLICE_PATH =
  "runtime/follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01.md";
const IMPLEMENTATION_RESULT_PATH =
  "runtime/follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01-result.md";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-record.md";
const EXPECTED_HOST = "Directive Workspace standalone host (hosts/standalone-host/)";
const EXPECTED_NEXT_STEP =
  "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.";

async function main() {
  assert.ok(fs.existsSync(path.join(DIRECTIVE_ROOT, IMPLEMENTATION_SLICE_PATH)), "missing_implementation_slice");
  assert.ok(fs.existsSync(path.join(DIRECTIVE_ROOT, IMPLEMENTATION_RESULT_PATH)), "missing_implementation_result");

  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const descriptor = await host.readLiveMiniSweAgentDescriptor();
    const readinessFocus = resolveDirectiveWorkspaceState({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: PROMOTION_READINESS_PATH,
    }).focus;

    assert.ok(readinessFocus?.ok, "live mini-swe promotion-readiness focus should resolve");
    assert.equal(readinessFocus.currentStage, "runtime.promotion_record.opened");
    assert.equal(readinessFocus.currentHead.artifactPath, PROMOTION_RECORD_PATH);
    assert.equal(readinessFocus.nextLegalStep, EXPECTED_NEXT_STEP);
    assert.equal(readinessFocus.runtime?.proposedHost, EXPECTED_HOST);
    assert.equal(
      readinessFocus.runtime?.executionState,
      "bounded standalone-host descriptor implementation opened, not executing, not host-integrated, not promoted",
    );
    assert.deepEqual(readinessFocus.runtime?.promotionReadinessBlockers ?? [], []);
    assert.equal(descriptor.currentStage, "runtime.promotion_record.opened");
    assert.equal(descriptor.proposedHost, EXPECTED_HOST);
    assert.deepEqual(descriptor.promotionReadinessBlockers, []);

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          candidateId: readinessFocus.candidateId,
          currentStage: readinessFocus.currentStage,
          currentHead: readinessFocus.currentHead.artifactPath,
          implementationSlicePath: IMPLEMENTATION_SLICE_PATH,
          implementationResultPath: IMPLEMENTATION_RESULT_PATH,
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    host.close();
  }
}

void main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checkerId: CHECKER_ID,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
