import assert from "node:assert/strict";
import {
  EXPECTED_DW_WEB_HOST,
  EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION,
  EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED,
  EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION,
  EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED,
  loadDwWebHostPromotionCheckerState,
  readDirectiveJson,
} from "./directive-dw-web-host-check-helpers.ts";

const CANDIDATE_ID = "dw-live-scientify-engine-pressure-2026-03-24";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md";
const PROMOTION_SPEC_PATH =
  "runtime/06-promotion-specifications/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-live-scientify-engine-pressure-2026-03-24-promotion-record.md";

function main() {
  const { focus, recommendation, promotionRecordPresent } = loadDwWebHostPromotionCheckerState({
    candidateId: CANDIDATE_ID,
    promotionReadinessPath: PROMOTION_READINESS_PATH,
  });

  assert.ok(focus?.ok, "missing_focus");
  assert.ok(
    focus.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION ||
      focus.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED,
    `unexpected_current_stage:${focus.currentStage}`,
  );
  assert.equal(
    focus.currentHead.artifactPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : PROMOTION_READINESS_PATH,
  );
  assert.equal(
    focus.nextLegalStep,
    promotionRecordPresent
      ? EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED
      : EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION,
  );
  assert.equal(focus.runtime?.proposedHost, EXPECTED_DW_WEB_HOST);
  assert.deepEqual(
    focus.runtime?.promotionReadinessBlockers ?? [],
    promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
    "unexpected_runtime_promotion_readiness_blockers",
  );
  assert.equal(
    focus.linkedArtifacts.runtimePromotionRecordPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );
  assert.equal(
    focus.runtime?.executionState,
    "bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted",
  );

  const promotionSpec = readDirectiveJson<Record<string, any>>(PROMOTION_SPEC_PATH);
  assert.equal(promotionSpec.candidateId, CANDIDATE_ID);
  assert.equal(promotionSpec.proposedHost, EXPECTED_DW_WEB_HOST);
  assert.equal(
    promotionSpec.linkedArtifacts?.promotionRecordPath ?? null,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );

  assert.ok(recommendation, "missing_recommendation");
  assert.equal(
    recommendation.assistanceState,
    promotionRecordPresent ? "already_promoted_manual_cycle" : "ready_for_manual_promotion_seam_decision",
  );
  assert.equal(
    recommendation.recommendedActionKind,
    promotionRecordPresent ? "none" : "request_manual_promotion_seam_decision",
  );
  assert.equal(recommendation.hostScope, "directive_workspace_host");
  assert.deepEqual(
    recommendation.missingPrerequisites,
    promotionRecordPresent ? ["promotionRecordState.unopened"] : [],
  );
  assert.equal(
    recommendation.supportingArtifacts.existingPromotionRecordPaths.length,
    promotionRecordPresent ? 1 : 0,
  );

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checkedPath: PROMOTION_READINESS_PATH,
    promotionSpecificationPath: PROMOTION_SPEC_PATH,
    candidateId: CANDIDATE_ID,
    proposedHost: EXPECTED_DW_WEB_HOST,
    currentStage: focus.currentStage,
    assistanceState: recommendation.assistanceState,
    promotionRecordPresent,
  }, null, 2)}\n`);
}

main();
