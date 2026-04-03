import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getDirectiveFrontendCheckJson,
  withDirectiveFrontendCheckServer,
} from "./frontend-check-helpers.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_temporal_durable_execution_dw_web_host_runtime_implementation_slice";
const CANDIDATE_ID = "dw-source-temporal-durable-execution-2026-04-01";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-promotion-readiness.md";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-source-temporal-durable-execution-2026-04-01-promotion-record.md";
const IMPLEMENTATION_SLICE_PATH =
  "runtime/follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-runtime-implementation-slice-01.md";
const IMPLEMENTATION_RESULT_PATH =
  "runtime/follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-runtime-implementation-slice-01-result.md";
const EXPECTED_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
const EXPECTED_PRE_PROMOTION_STAGE = "runtime.promotion_readiness.opened";
const EXPECTED_PROMOTED_STAGE = "runtime.promotion_record.opened";
const EXPECTED_PRE_PROMOTION_NEXT_STEP =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
const EXPECTED_PROMOTED_NEXT_STEP =
  "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.";
const EXPECTED_EXECUTION_STATE =
  "bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted";

function read(relativePath: string) {
  return fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8");
}

function assertIncludes(content: string, needle: string, label: string) {
  assert.equal(content.includes(needle), true, `missing_${label}`);
}

async function main() {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
    includeAnchors: false,
  }).focus;
  const readinessContent = read(PROMOTION_READINESS_PATH);
  const implementationSliceContent = read(IMPLEMENTATION_SLICE_PATH);
  const implementationResultContent = read(IMPLEMENTATION_RESULT_PATH);

  assert.ok(focus?.ok, "missing_focus");
  assert.equal(focus.candidateId, CANDIDATE_ID);
  assert.ok(
    focus.currentStage === EXPECTED_PRE_PROMOTION_STAGE || focus.currentStage === EXPECTED_PROMOTED_STAGE,
    `unexpected_current_stage:${focus.currentStage}`,
  );
  const promotionRecordPresent = focus.currentStage === EXPECTED_PROMOTED_STAGE;
  assert.equal(
    focus.currentHead.artifactPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : PROMOTION_READINESS_PATH,
  );
  assert.equal(
    focus.nextLegalStep,
    promotionRecordPresent ? EXPECTED_PROMOTED_NEXT_STEP : EXPECTED_PRE_PROMOTION_NEXT_STEP,
  );
  assert.equal(focus.runtime?.proposedHost, EXPECTED_HOST);
  assert.equal(focus.runtime?.executionState, EXPECTED_EXECUTION_STATE);
  assert.deepEqual(
    focus.runtime?.promotionReadinessBlockers ?? [],
    promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
  );
  assert.equal(
    focus.linkedArtifacts.runtimePromotionRecordPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );

  assertIncludes(readinessContent, IMPLEMENTATION_SLICE_PATH, "readiness_implementation_slice_path");
  assertIncludes(readinessContent, IMPLEMENTATION_RESULT_PATH, "readiness_implementation_result_path");
  assertIncludes(
    readinessContent,
    "Execution state: bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted",
    "readiness_execution_state",
  );
  assertIncludes(
    readinessContent,
    "Explicit opened runtime-implementation slice:",
    "readiness_opened_runtime_implementation_label",
  );

  assertIncludes(
    implementationSliceContent,
    "Status: `opened_bounded_non_executing_runtime_implementation_slice`",
    "implementation_slice_status",
  );
  assertIncludes(
    implementationResultContent,
    "Result decision: `materially_complete_and_worth_keeping`",
    "implementation_result_status",
  );

  await withDirectiveFrontendCheckServer({ directiveRoot: DIRECTIVE_ROOT }, async (handle) => {
    const detail = await getDirectiveFrontendCheckJson<any>(
      handle.origin,
      `/api/runtime-promotion-readiness/detail?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(detail.ok, true);
    assert.equal(detail.currentStage, focus.currentStage);
    assert.equal(detail.nextLegalStep, focus.nextLegalStep);
    assert.equal(detail.proposedHost, EXPECTED_HOST);
    assert.equal(detail.executionState, EXPECTED_EXECUTION_STATE);
    assert.deepEqual(
      detail.promotionReadinessBlockers,
      promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
    );
    assert.equal(detail.openedRuntimeImplementationSlicePath, IMPLEMENTATION_SLICE_PATH);
    assert.ok(detail.compileContractPath, "missing_compile_contract_path");
    assert.ok(detail.promotionInputPackagePath, "missing_promotion_input_package_path");
    assert.ok(detail.profileCheckerDecisionPath, "missing_profile_checker_decision_path");

    const route = await fetch(
      `${handle.origin}/runtime-promotion-readiness/view?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(route.ok, true, `route_failed:${route.status}`);
    const routeHtml = await route.text();
    assert.match(routeHtml, /<div id="app">/i);

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          candidateId: CANDIDATE_ID,
          currentStage: focus.currentStage,
          proposedHost: EXPECTED_HOST,
          executionState: EXPECTED_EXECUTION_STATE,
          implementationSlicePath: IMPLEMENTATION_SLICE_PATH,
          implementationResultPath: IMPLEMENTATION_RESULT_PATH,
          promotionRecordPresent,
        },
        null,
        2,
      )}\n`,
    );
  });
}

void main();
