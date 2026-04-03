import assert from "node:assert/strict";
import {
  DIRECTIVE_ROOT,
  EXPECTED_DW_WEB_HOST,
  EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION,
  EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED,
  assertIncludes,
  loadDwWebHostPromotionCheckerState,
  readDirectiveJson,
  readDirectiveText,
} from "./directive-dw-web-host-check-helpers.ts";

const CHECKER_ID = "directive_openmoss_pressure_dw_web_host_profile_checker_decision";
const CANDIDATE_ID = "dw-pressure-openmoss-architecture-loop-2026-03-26";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-readiness.md";
const PROMOTION_SPEC_PATH =
  "runtime/06-promotion-specifications/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-record.md";
const COMPILE_CONTRACT_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-seam-review-compile-contract-01.md";
const INPUT_PACKAGE_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-promotion-input-package-01.md";
const DECISION_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-profile-checker-decision-01.md";
const PROFILE_CATALOG_PATH = "runtime/PROMOTION_PROFILES.json";
const CONTRACT_PATH = "shared/contracts/dw-web-host-seam-review-guard.md";
const EXPECTED_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
const EXPECTED_PRE_PROMOTION_STAGE = "runtime.promotion_readiness.opened";
const EXPECTED_PROMOTED_STAGE = "runtime.promotion_record.opened";
const EXPECTED_PROFILE = "dw_web_host_seam_review_guard/v1";
const EXPECTED_FAMILY = "bounded_dw_web_host_seam_review";
const EXPECTED_PROOF_SHAPE = "dw_web_host_seam_review_snapshot/v1";
const EXPECTED_PRIMARY_CHECKER = "npm run check:directive-dw-web-host-runtime-seam-review";

function main() {
  const { focus, recommendation, promotionRecordPaths, promotionRecordPresent, registryEntryPaths } =
    loadDwWebHostPromotionCheckerState({
      candidateId: CANDIDATE_ID,
      promotionReadinessPath: PROMOTION_READINESS_PATH,
    });

  const readinessContent = readDirectiveText(PROMOTION_READINESS_PATH);
  const promotionSpec = readDirectiveJson<Record<string, any>>(PROMOTION_SPEC_PATH);
  const compileContractContent = readDirectiveText(COMPILE_CONTRACT_PATH);
  const inputPackageContent = readDirectiveText(INPUT_PACKAGE_PATH);
  const decisionContent = readDirectiveText(DECISION_PATH);
  const contractContent = readDirectiveText(CONTRACT_PATH);
  const profileCatalog = readDirectiveJson<{ profiles: Array<Record<string, any>> }>(PROFILE_CATALOG_PATH);

  assert.ok(focus?.ok, "focus_should_resolve");
  assert.equal(focus.candidateId, CANDIDATE_ID);
  assert.ok(
    focus.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION ||
      focus.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED,
    `unexpected_current_stage:${focus.currentStage}`,
  );
  assert.equal(
    focus.currentHead.artifactPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : PROMOTION_READINESS_PATH,
  );
  assert.equal(focus.runtime?.proposedHost, EXPECTED_DW_WEB_HOST);
  assert.equal(
    focus.linkedArtifacts.runtimePromotionRecordPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );
  assert.equal(
    focus.runtime?.executionState,
    "bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted",
  );
  assert.deepEqual(
    focus.runtime?.promotionReadinessBlockers ?? [],
    promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
  );

  assert.equal(promotionSpec.candidateId, CANDIDATE_ID);
  assert.equal(promotionSpec.proposedHost, EXPECTED_HOST);
  assert.equal(
    promotionSpec.linkedArtifacts?.promotionRecordPath ?? null,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );

  const selectedProfile = profileCatalog.profiles.find((entry: { id: string }) => entry.id === EXPECTED_PROFILE);
  assert.ok(selectedProfile, "missing_selected_profile");
  assert.equal(selectedProfile.family, EXPECTED_FAMILY);
  assert.equal(selectedProfile.proofShape, EXPECTED_PROOF_SHAPE);
  assert.equal(selectedProfile.contractPath, CONTRACT_PATH);
  assert.equal(selectedProfile.primaryHostCheckCommand, EXPECTED_PRIMARY_CHECKER);

  assertIncludes(readinessContent, "## Directive Workspace web-host profile / checker decision", "readiness_section");
  assertIncludes(readinessContent, DECISION_PATH, "readiness_decision_path");
  assertIncludes(
    readinessContent,
    "Focused profile/checker decision = npm run check:directive-openmoss-pressure-dw-web-host-profile-checker-decision",
    "readiness_focused_checker",
  );

  assertIncludes(compileContractContent, DECISION_PATH, "compile_contract_decision_path");
  assertIncludes(
    compileContractContent,
    "npm run check:directive-openmoss-pressure-dw-web-host-profile-checker-decision",
    "compile_contract_focused_checker",
  );

  assertIncludes(inputPackageContent, DECISION_PATH, "input_package_decision_path");
  assertIncludes(
    inputPackageContent,
    "Focused profile/checker decision = npm run check:directive-openmoss-pressure-dw-web-host-profile-checker-decision",
    "input_package_focused_checker",
  );

  assertIncludes(
    decisionContent,
    "Decision status: `bounded_dw_web_host_profile_selected`",
    "decision_status",
  );
  assertIncludes(decisionContent, PROMOTION_READINESS_PATH, "decision_readiness_path");
  assertIncludes(decisionContent, INPUT_PACKAGE_PATH, "decision_input_package_path");
  assertIncludes(decisionContent, COMPILE_CONTRACT_PATH, "decision_compile_contract_path");
  assertIncludes(decisionContent, PROFILE_CATALOG_PATH, "decision_catalog_path");
  assertIncludes(decisionContent, EXPECTED_PROFILE, "decision_profile");
  assertIncludes(decisionContent, EXPECTED_FAMILY, "decision_family");
  assertIncludes(decisionContent, EXPECTED_PROOF_SHAPE, "decision_proof_shape");
  assertIncludes(decisionContent, EXPECTED_PRIMARY_CHECKER, "decision_primary_checker");
  assertIncludes(
    decisionContent,
    "npm run check:directive-openmoss-pressure-dw-web-host-profile-checker-decision",
    "decision_focused_checker",
  );
  assertIncludes(decisionContent, CONTRACT_PATH, "decision_contract_path");

  assertIncludes(
    contractContent,
    "Quality gate profile: `dw_web_host_seam_review_guard/v1`",
    "contract_profile_header",
  );

  assert.equal(
    promotionRecordPaths.length,
    promotionRecordPresent ? 1 : 0,
    "unexpected_promotion_record_count",
  );
  if (promotionRecordPresent) {
    assert.equal(
      `runtime/promotion-records/${promotionRecordPaths[0]?.name}`,
      PROMOTION_RECORD_PATH,
      "unexpected_promotion_record_path",
    );
  }
  assert.equal(registryEntryPaths.length, 0, "registry_entry_should_remain_absent");

  assert.ok(recommendation, "missing_candidate_recommendation");
  assert.equal(
    recommendation?.assistanceState,
    promotionRecordPresent ? "already_promoted_manual_cycle" : "ready_for_manual_promotion_seam_decision",
  );
  assert.deepEqual(
    recommendation?.missingPrerequisites,
    promotionRecordPresent ? ["promotionRecordState.unopened"] : [],
  );
  assert.equal(
    recommendation?.supportingArtifacts.existingPromotionRecordPaths.length,
    promotionRecordPresent ? 1 : 0,
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        candidateId: CANDIDATE_ID,
        currentStage: focus.currentStage,
        proposedHost: focus.runtime?.proposedHost,
        decisionPath: DECISION_PATH,
        promotionRecordPresent,
        registryEntryPresent: false,
      },
      null,
      2,
    )}\n`,
  );
}

main();
