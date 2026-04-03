import assert from "node:assert/strict";
import {
  DIRECTIVE_ROOT,
  EXPECTED_DW_WEB_HOST,
  EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION,
  EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED,
  EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION,
  EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED,
  assertIncludes,
  loadDwWebHostPromotionCheckerState,
  readDirectiveJson,
  readDirectiveText,
} from "./directive-dw-web-host-check-helpers.ts";
const CHECKER_ID = "directive_pressure_scientify_dw_web_host_seam_review_compile_contract";
const CANDIDATE_ID = "dw-pressure-scientify-2026-03-25";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-readiness.md";
const PROMOTION_SPEC_PATH =
  "runtime/06-promotion-specifications/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-pressure-scientify-2026-03-25-promotion-record.md";
const COMPILE_CONTRACT_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-seam-review-compile-contract-01.md";
const INPUT_PACKAGE_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-promotion-input-package-01.md";
const DW_WEB_HOST_GUARD_PATH = "shared/contracts/dw-web-host-seam-review-guard.md";

function main() {
  const { focus, recommendation, promotionRecordPaths, promotionRecordPresent, registryEntryPaths } =
    loadDwWebHostPromotionCheckerState({
      candidateId: CANDIDATE_ID,
      promotionReadinessPath: PROMOTION_READINESS_PATH,
    });

  const readinessContent = readDirectiveText(PROMOTION_READINESS_PATH);
  const promotionSpec = readDirectiveJson<Record<string, any>>(PROMOTION_SPEC_PATH);
  const compileContractContent = readDirectiveText(COMPILE_CONTRACT_PATH);
  const guardContent = readDirectiveText(DW_WEB_HOST_GUARD_PATH);

  assert.ok(focus?.ok, "scientify_pressure_dw_web_host_compile_contract_focus_should_resolve");
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
  assert.equal(
    focus.nextLegalStep,
    promotionRecordPresent
      ? EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED
      : EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION,
  );
  assert.equal(focus.runtime?.proposedHost, EXPECTED_DW_WEB_HOST);
  assert.equal(
    focus.linkedArtifacts.runtimePromotionRecordPath,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );
  assert.deepEqual(
    focus.runtime?.promotionReadinessBlockers ?? [],
    promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
  );
  assert.equal(
    focus.runtime?.executionState,
    "bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted",
  );

  assert.equal(promotionSpec.candidateId, CANDIDATE_ID);
  assert.equal(promotionSpec.proposedHost, EXPECTED_DW_WEB_HOST);
  assert.equal(
    promotionSpec.linkedArtifacts?.promotionRecordPath ?? null,
    promotionRecordPresent ? PROMOTION_RECORD_PATH : null,
  );

  assertIncludes(
    readinessContent,
    "## Directive Workspace web-host seam-review compile contract",
    "readiness_compile_contract_section",
  );
  assertIncludes(
    readinessContent,
    COMPILE_CONTRACT_PATH,
    "readiness_compile_contract_path",
  );
  assertIncludes(
    readinessContent,
    "Focused compile-contract checker = npm run check:directive-pressure-scientify-dw-web-host-seam-review-compile-contract",
    "readiness_compile_contract_checker",
  );
  assertIncludes(
    readinessContent,
    "Quality gate profile = dw_web_host_seam_review_guard/v1",
    "readiness_quality_gate_profile",
  );
  assertIncludes(
    readinessContent,
    "no promotion-record creation, no registry acceptance, no host integration writes, no runtime execution",
    "readiness_safe_output_scope",
  );

  assertIncludes(
    compileContractContent,
    "Status: `explicit_non_promoting_dw_web_host_compile_contract`",
    "compile_contract_status",
  );
  assertIncludes(
    compileContractContent,
    PROMOTION_READINESS_PATH,
    "compile_contract_readiness_path",
  );
  assertIncludes(
    compileContractContent,
    PROMOTION_SPEC_PATH,
    "compile_contract_promotion_spec_path",
  );
  assertIncludes(
    compileContractContent,
    INPUT_PACKAGE_PATH,
    "compile_contract_input_package_path",
  );
  assertIncludes(
    compileContractContent,
    DW_WEB_HOST_GUARD_PATH,
    "compile_contract_guard_path",
  );
  assertIncludes(
    compileContractContent,
    "`frontend/src/app.ts`",
    "compile_contract_frontend_file",
  );
  assertIncludes(
    compileContractContent,
    "`hosts/web-host/server.ts`",
    "compile_contract_server_file",
  );
  assertIncludes(
    compileContractContent,
    "`hosts/web-host/data.ts`",
    "compile_contract_data_file",
  );
  assertIncludes(
    compileContractContent,
    `/runtime-promotion-readiness/view?path=${PROMOTION_READINESS_PATH}`,
    "compile_contract_view_route",
  );
  assertIncludes(
    compileContractContent,
    `/api/runtime-promotion-readiness/detail?path=${PROMOTION_READINESS_PATH}`,
    "compile_contract_detail_route",
  );
  assertIncludes(
    compileContractContent,
    "read_only_lane = canonical Directive Workspace state plus linked Runtime artifacts through the existing DW thin-host reader; write_lane = none",
    "compile_contract_permissions",
  );
  assertIncludes(
    compileContractContent,
    "promotion-record creation",
    "compile_contract_non_authorization_promotion_record",
  );
  assertIncludes(
    compileContractContent,
    "registry acceptance",
    "compile_contract_non_authorization_registry",
  );
  assertIncludes(
    compileContractContent,
    "runtime execution",
    "compile_contract_non_authorization_execution",
  );
  assertIncludes(
    compileContractContent,
    "host integration writes",
    "compile_contract_non_authorization_integration",
  );
  assertIncludes(
    compileContractContent,
    "npm run check:directive-dw-web-host-runtime-seam-review",
    "compile_contract_primary_checker",
  );
  assertIncludes(
    compileContractContent,
    "npm run check:directive-pressure-scientify-dw-web-host-seam-review-compile-contract",
    "compile_contract_focused_checker",
  );
  assertIncludes(
    compileContractContent,
    "npm run check:directive-pressure-scientify-dw-web-host-promotion-input-package",
    "compile_contract_input_package_checker",
  );

  assertIncludes(
    guardContent,
    "This guard applies only to read-only seam review.",
    "guard_read_only_scope",
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
        compileContractPath: COMPILE_CONTRACT_PATH,
        promotionRecordPresent,
        registryEntryPresent: false,
      },
      null,
      2,
    )}\n`,
  );
}

main();
