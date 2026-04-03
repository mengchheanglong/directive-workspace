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
const CHECKER_ID = "directive_puppeteer_pressure_dw_web_host_promotion_input_package";
const CANDIDATE_ID = "dw-pressure-puppeteer-bounded-tool-2026-03-25";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-readiness.md";
const PROMOTION_SPEC_PATH =
  "runtime/06-promotion-specifications/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-record.md";
const COMPILE_CONTRACT_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-seam-review-compile-contract-01.md";
const INPUT_PACKAGE_PATH =
  "runtime/follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-promotion-input-package-01.md";
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
  const inputPackageContent = readDirectiveText(INPUT_PACKAGE_PATH);
  const guardContent = readDirectiveText(DW_WEB_HOST_GUARD_PATH);

  assert.ok(focus?.ok, "puppeteer_pressure_dw_web_host_input_package_focus_should_resolve");
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
    "## Directive Workspace web-host promotion-input package",
    "readiness_input_package_section",
  );
  assertIncludes(
    readinessContent,
    INPUT_PACKAGE_PATH,
    "readiness_input_package_path",
  );
  assertIncludes(
    readinessContent,
    "Focused input-package checker = npm run check:directive-puppeteer-pressure-dw-web-host-promotion-input-package",
    "readiness_input_package_checker",
  );
  assertIncludes(
    readinessContent,
    "Safe output scope = Puppeteer pressure seam-review page plus thin-host detail payload and package/checker snapshots only; no promotion-record creation, no registry acceptance, no host integration writes, no runtime execution",
    "readiness_input_package_safe_output_scope",
  );

  assertIncludes(
    compileContractContent,
    INPUT_PACKAGE_PATH,
    "compile_contract_input_package_path",
  );
  assertIncludes(
    compileContractContent,
    "Focused input-package checker:",
    "compile_contract_input_checker_label",
  );
  assertIncludes(
    compileContractContent,
    "npm run check:directive-puppeteer-pressure-dw-web-host-promotion-input-package",
    "compile_contract_input_checker",
  );

  assertIncludes(
    inputPackageContent,
    "Status: `explicit_non_promoting_dw_web_host_input_bundle`",
    "input_package_status",
  );
  assertIncludes(
    inputPackageContent,
    COMPILE_CONTRACT_PATH,
    "input_package_compile_contract_path",
  );
  assertIncludes(
    inputPackageContent,
    DW_WEB_HOST_GUARD_PATH,
    "input_package_guard_path",
  );
  assertIncludes(
    inputPackageContent,
    "`Directive Workspace web host (frontend/ + hosts/web-host/)`",
    "input_package_host",
  );
  assertIncludes(
    inputPackageContent,
    "read_only_lane = canonical Directive Workspace state plus linked Runtime artifacts through the existing DW thin-host reader; write_lane = none",
    "input_package_permissions",
  );
  assertIncludes(
    inputPackageContent,
    "Quality gate profile = dw_web_host_seam_review_guard/v1",
    "input_package_quality_gate_profile",
  );
  assertIncludes(
    inputPackageContent,
    "Primary host checker = npm run check:directive-dw-web-host-runtime-seam-review",
    "input_package_primary_host_checker",
  );
  assertIncludes(
    inputPackageContent,
    "Focused input-package checker = npm run check:directive-puppeteer-pressure-dw-web-host-promotion-input-package",
    "input_package_focused_checker",
  );
  assertIncludes(
    inputPackageContent,
    "host-facing promotion record creation",
    "input_package_non_authorization_promotion_record",
  );
  assertIncludes(
    inputPackageContent,
    "registry acceptance",
    "input_package_non_authorization_registry",
  );
  assertIncludes(
    inputPackageContent,
    "host integration rollout",
    "input_package_non_authorization_integration",
  );
  assertIncludes(
    inputPackageContent,
    "runtime execution",
    "input_package_non_authorization_execution",
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
        inputPackagePath: INPUT_PACKAGE_PATH,
        promotionRecordPresent,
        registryEntryPresent: false,
      },
      null,
      2,
    )}\n`,
  );
}

main();
