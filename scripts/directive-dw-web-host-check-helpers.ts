import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getDirectiveFrontendCheckJson,
  withDirectiveFrontendCheckServer,
  type DirectiveFrontendServerHandle,
} from "./frontend-check-helpers.ts";
import { listCandidateMarkdownFiles } from "./list-candidate-markdown-files.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import { buildDirectiveRuntimePromotionAssistanceReport } from "../runtime/lib/runtime-promotion-assistance.ts";
import { readDirectiveRuntimePromotionSpecification } from "../runtime/lib/runtime-promotion-specification.ts";

export const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const EXPECTED_DW_WEB_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
export const EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION = "runtime.promotion_readiness.opened";
export const EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED = "runtime.promotion_record.opened";
export const EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
export const EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED =
  "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.";

const DW_WEB_HOST_GUARD_PATH = "shared/contracts/dw-web-host-seam-review-guard.md";
const PROFILE_CATALOG_PATH = "runtime/meta/PROMOTION_PROFILES.json";
const EXPECTED_PROFILE = "dw_web_host_seam_review_guard/v1";
const EXPECTED_FAMILY = "bounded_dw_web_host_seam_review";
const EXPECTED_PROOF_SHAPE = "dw_web_host_seam_review_snapshot/v1";
const EXPECTED_PRIMARY_CHECKER = "npm run check:directive-dw-web-host-runtime-seam-review";
const EXPECTED_EXECUTION_STATE =
  "bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted";

const directiveTextCache = new Map<string, string>();
const directiveJsonCache = new Map<string, unknown>();
const promotionCheckerStateCache = new Map<string, ReturnType<typeof loadDwWebHostPromotionCheckerState>>();
const promotionSpecificationCache = new Map<
  string,
  ReturnType<typeof readDirectiveRuntimePromotionSpecification>
>();
let runtimePromotionAssistanceReportCache: ReturnType<typeof buildDirectiveRuntimePromotionAssistanceReport> | null =
  null;

export function assertIncludes(content: string, needle: string, label: string) {
  if (!content.includes(needle)) {
    throw new Error(`missing_${label}`);
  }
}

export function readDirectiveText(relativePath: string) {
  const cached = directiveTextCache.get(relativePath);
  if (cached !== undefined) {
    return cached;
  }
  const content = fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8");
  directiveTextCache.set(relativePath, content);
  return content;
}

export function readDirectiveJson<T>(relativePath: string) {
  const cached = directiveJsonCache.get(relativePath);
  if (cached !== undefined) {
    return cached as T;
  }
  const parsed = JSON.parse(readDirectiveText(relativePath)) as T;
  directiveJsonCache.set(relativePath, parsed);
  return parsed;
}

export function loadDwWebHostPromotionCheckerState(input: {
  candidateId: string;
  promotionReadinessPath: string;
}) {
  const cacheKey = `${input.candidateId}::${input.promotionReadinessPath}`;
  const cached = promotionCheckerStateCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: input.promotionReadinessPath,
    includeAnchors: false,
  }).focus;
  runtimePromotionAssistanceReportCache ??= buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const assistanceReport = runtimePromotionAssistanceReportCache;
  const recommendation = assistanceReport.recommendations.find((entry) => entry.candidateId === input.candidateId);
  const promotionRecordPresent = focus?.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED;
  const promotionRecordPaths = listCandidateMarkdownFiles({
    directiveRoot: DIRECTIVE_ROOT,
    relativeDir: "runtime/07-promotion-records",
    candidateId: input.candidateId,
  });
  const registryEntryPaths = listCandidateMarkdownFiles({
    directiveRoot: DIRECTIVE_ROOT,
    relativeDir: "runtime/registry",
    candidateId: input.candidateId,
  });

  const state = {
    focus,
    recommendation,
    promotionRecordPresent,
    promotionRecordPaths,
    registryEntryPaths,
  };
  promotionCheckerStateCache.set(cacheKey, state);
  return state;
}

type DwWebHostSyncCaseConfig = {
  candidateId: string;
  promotionReadinessPath: string;
  promotionSpecPath: string;
  promotionRecordPath: string;
  compileContractPath: string;
  inputPackagePath: string;
  decisionPath: string;
  implementationSlicePath: string;
  implementationResultPath: string;
  registryEntryPath: string;
  commands: {
    compileContract: string;
    inputPackage: string;
    profileCheckerDecision: string;
  };
  checkerIds: {
    retarget: string;
    compileContract: string;
    inputPackage: string;
    profileCheckerDecision: string;
    runtimeImplementationSlice: string;
    runtimePromotion: string;
  };
  runtimePromotion: {
    expectedDecision: string;
    qualityGateProfile: string;
    promotionProfileFamily: string;
    proofShape: string;
    primaryHostChecker: string;
  };
  retargetChecksHostDependence?: boolean;
};

const DW_WEB_HOST_SYNC_CASES = {
  openmoss_pressure: {
    candidateId: "dw-pressure-openmoss-architecture-loop-2026-03-26",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-readiness.md",
    promotionSpecPath:
      "runtime/06-promotion-specifications/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-specification.json",
    promotionRecordPath:
      "runtime/07-promotion-records/2026-04-02-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-record.md",
    compileContractPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-seam-review-compile-contract-01.md",
    inputPackagePath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-promotion-input-package-01.md",
    decisionPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-profile-checker-decision-01.md",
    implementationSlicePath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-runtime-implementation-slice-01.md",
    implementationResultPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-openmoss-architecture-loop-dw-web-host-runtime-implementation-slice-01-result.md",
    registryEntryPath:
      "runtime/08-registry/2026-04-02-dw-pressure-openmoss-architecture-loop-2026-03-26-registry-entry.md",
    commands: {
      compileContract: "npm run check:directive-openmoss-pressure-dw-web-host-seam-review-compile-contract",
      inputPackage: "npm run check:directive-openmoss-pressure-dw-web-host-promotion-input-package",
      profileCheckerDecision: "npm run check:directive-openmoss-pressure-dw-web-host-profile-checker-decision",
    },
    checkerIds: {
      retarget: "directive_openmoss_pressure_dw_web_host_retarget",
      compileContract: "directive_openmoss_pressure_dw_web_host_seam_review_compile_contract",
      inputPackage: "directive_openmoss_pressure_dw_web_host_promotion_input_package",
      profileCheckerDecision: "directive_openmoss_pressure_dw_web_host_profile_checker_decision",
      runtimeImplementationSlice: "directive_openmoss_pressure_dw_web_host_runtime_implementation_slice",
      runtimePromotion: "directive_openmoss_pressure_dw_web_host_runtime_promotion",
    },
    runtimePromotion: {
      expectedDecision: "manual_openmoss_pressure_dw_web_host_promotion_record_opened",
      qualityGateProfile: "openmoss_pressure_dw_web_host_manual_promotion_guard/v1",
      promotionProfileFamily: "bounded_openmoss_pressure_dw_web_host_manual_promotion",
      proofShape: "openmoss_pressure_dw_web_host_manual_promotion_snapshot/v1",
      primaryHostChecker: "npm run check:directive-openmoss-pressure-dw-web-host-runtime-promotion",
    },
  },
  pressure_scientify: {
    candidateId: "dw-pressure-scientify-2026-03-25",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-readiness.md",
    promotionSpecPath:
      "runtime/06-promotion-specifications/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-specification.json",
    promotionRecordPath:
      "runtime/07-promotion-records/2026-04-02-dw-pressure-scientify-2026-03-25-promotion-record.md",
    compileContractPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-seam-review-compile-contract-01.md",
    inputPackagePath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-promotion-input-package-01.md",
    decisionPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-profile-checker-decision-01.md",
    implementationSlicePath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-runtime-implementation-slice-01.md",
    implementationResultPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-runtime-implementation-slice-01-result.md",
    registryEntryPath:
      "runtime/08-registry/2026-04-02-dw-pressure-scientify-2026-03-25-registry-entry.md",
    commands: {
      compileContract: "npm run check:directive-pressure-scientify-dw-web-host-seam-review-compile-contract",
      inputPackage: "npm run check:directive-pressure-scientify-dw-web-host-promotion-input-package",
      profileCheckerDecision: "npm run check:directive-pressure-scientify-dw-web-host-profile-checker-decision",
    },
    checkerIds: {
      retarget: "directive_pressure_scientify_dw_web_host_retarget",
      compileContract: "directive_pressure_scientify_dw_web_host_seam_review_compile_contract",
      inputPackage: "directive_pressure_scientify_dw_web_host_promotion_input_package",
      profileCheckerDecision: "directive_pressure_scientify_dw_web_host_profile_checker_decision",
      runtimeImplementationSlice: "directive_pressure_scientify_dw_web_host_runtime_implementation_slice",
      runtimePromotion: "directive_pressure_scientify_dw_web_host_runtime_promotion",
    },
    runtimePromotion: {
      expectedDecision: "manual_scientify_pressure_dw_web_host_promotion_record_opened",
      qualityGateProfile: "scientify_pressure_dw_web_host_manual_promotion_guard/v1",
      promotionProfileFamily: "bounded_scientify_pressure_dw_web_host_manual_promotion",
      proofShape: "scientify_pressure_dw_web_host_manual_promotion_snapshot/v1",
      primaryHostChecker: "npm run check:directive-pressure-scientify-dw-web-host-runtime-promotion",
    },
  },
  puppeteer_pressure: {
    candidateId: "dw-pressure-puppeteer-bounded-tool-2026-03-25",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-readiness.md",
    promotionSpecPath:
      "runtime/06-promotion-specifications/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-specification.json",
    promotionRecordPath:
      "runtime/07-promotion-records/2026-04-02-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-record.md",
    compileContractPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-seam-review-compile-contract-01.md",
    inputPackagePath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-promotion-input-package-01.md",
    decisionPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-profile-checker-decision-01.md",
    implementationSlicePath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-runtime-implementation-slice-01.md",
    implementationResultPath:
      "runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-runtime-implementation-slice-01-result.md",
    registryEntryPath:
      "runtime/08-registry/2026-04-02-dw-pressure-puppeteer-bounded-tool-2026-03-25-registry-entry.md",
    commands: {
      compileContract: "npm run check:directive-puppeteer-pressure-dw-web-host-seam-review-compile-contract",
      inputPackage: "npm run check:directive-puppeteer-pressure-dw-web-host-promotion-input-package",
      profileCheckerDecision: "npm run check:directive-puppeteer-pressure-dw-web-host-profile-checker-decision",
    },
    checkerIds: {
      retarget: "directive_puppeteer_pressure_dw_web_host_retarget",
      compileContract: "directive_puppeteer_pressure_dw_web_host_seam_review_compile_contract",
      inputPackage: "directive_puppeteer_pressure_dw_web_host_promotion_input_package",
      profileCheckerDecision: "directive_puppeteer_pressure_dw_web_host_profile_checker_decision",
      runtimeImplementationSlice: "directive_puppeteer_pressure_dw_web_host_runtime_implementation_slice",
      runtimePromotion: "directive_puppeteer_pressure_dw_web_host_runtime_promotion",
    },
    runtimePromotion: {
      expectedDecision: "manual_puppeteer_pressure_dw_web_host_promotion_record_opened",
      qualityGateProfile: "puppeteer_pressure_dw_web_host_manual_promotion_guard/v1",
      promotionProfileFamily: "bounded_puppeteer_pressure_dw_web_host_manual_promotion",
      proofShape: "puppeteer_pressure_dw_web_host_manual_promotion_snapshot/v1",
      primaryHostChecker: "npm run check:directive-puppeteer-pressure-dw-web-host-runtime-promotion",
    },
  },
  real_mini_swe_agent_runtime_route_v0: {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
    promotionSpecPath:
      "runtime/06-promotion-specifications/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-specification.json",
    promotionRecordPath:
      "runtime/07-promotion-records/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-record.md",
    compileContractPath:
      "runtime/00-follow-up/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-dw-web-host-seam-review-compile-contract-01.md",
    inputPackagePath:
      "runtime/00-follow-up/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-dw-web-host-promotion-input-package-01.md",
    decisionPath:
      "runtime/00-follow-up/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-dw-web-host-profile-checker-decision-01.md",
    implementationSlicePath:
      "runtime/00-follow-up/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-dw-web-host-runtime-implementation-slice-01.md",
    implementationResultPath:
      "runtime/00-follow-up/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-dw-web-host-runtime-implementation-slice-01-result.md",
    registryEntryPath:
      "runtime/08-registry/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-registry-entry.md",
    commands: {
      compileContract: "npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-seam-review-compile-contract",
      inputPackage: "npm run check:directive-real-mini-swe-agent-runtime-route-v0-dw-web-host-promotion-input-package",
      profileCheckerDecision: "npm run check:directive-real-mini-swe-agent-runtime-route-v0-dw-web-host-profile-checker-decision",
    },
    checkerIds: {
      retarget: "directive_real_mini_swe_agent_runtime_route_dw_web_host_retarget",
      compileContract: "directive_real_mini_swe_agent_runtime_route_dw_web_host_seam_review_compile_contract",
      inputPackage: "directive_real_mini_swe_agent_runtime_route_v0_dw_web_host_promotion_input_package",
      profileCheckerDecision: "directive_real_mini_swe_agent_runtime_route_v0_dw_web_host_profile_checker_decision",
      runtimeImplementationSlice: "directive_real_mini_swe_agent_runtime_route_v0_dw_web_host_runtime_implementation_slice",
      runtimePromotion: "directive_real_mini_swe_agent_runtime_route_dw_web_host_runtime_promotion",
    },
    runtimePromotion: {
      expectedDecision: "manual_real_mini_swe_agent_runtime_route_dw_web_host_promotion_record_opened",
      qualityGateProfile: "real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_guard/v1",
      promotionProfileFamily: "bounded_real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion",
      proofShape: "real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_snapshot/v1",
      primaryHostChecker: "npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion",
    },
  },
  scientify_live_pressure: {
    candidateId: "dw-live-scientify-engine-pressure-2026-03-24",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md",
    promotionSpecPath:
      "runtime/06-promotion-specifications/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-specification.json",
    promotionRecordPath:
      "runtime/07-promotion-records/2026-04-02-dw-live-scientify-engine-pressure-2026-03-24-promotion-record.md",
    compileContractPath:
      "runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-seam-review-compile-contract-01.md",
    inputPackagePath:
      "runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-promotion-input-package-01.md",
    decisionPath:
      "runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-profile-checker-decision-01.md",
    implementationSlicePath:
      "runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-runtime-implementation-slice-01.md",
    implementationResultPath:
      "runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-runtime-implementation-slice-01-result.md",
    registryEntryPath:
      "runtime/08-registry/2026-04-02-dw-live-scientify-engine-pressure-2026-03-24-registry-entry.md",
    commands: {
      compileContract: "npm run check:directive-scientify-dw-web-host-seam-review-compile-contract",
      inputPackage: "npm run check:directive-scientify-dw-web-host-promotion-input-package",
      profileCheckerDecision: "npm run check:directive-scientify-dw-web-host-profile-checker-decision",
    },
    checkerIds: {
      retarget: "directive_scientify_dw_web_host_retarget",
      compileContract: "directive_scientify_dw_web_host_seam_review_compile_contract",
      inputPackage: "directive_scientify_dw_web_host_promotion_input_package",
      profileCheckerDecision: "directive_scientify_dw_web_host_profile_checker_decision",
      runtimeImplementationSlice: "directive_scientify_dw_web_host_runtime_implementation_slice",
      runtimePromotion: "directive_scientify_dw_web_host_runtime_promotion",
    },
    runtimePromotion: {
      expectedDecision: "manual_scientify_dw_web_host_promotion_record_opened",
      qualityGateProfile: "scientify_dw_web_host_manual_promotion_guard/v1",
      promotionProfileFamily: "bounded_scientify_dw_web_host_manual_promotion",
      proofShape: "scientify_dw_web_host_manual_promotion_snapshot/v1",
      primaryHostChecker: "npm run check:directive-scientify-dw-web-host-runtime-promotion",
    },
    retargetChecksHostDependence: false,
  },
  temporal_durable_execution: {
    candidateId: "dw-source-temporal-durable-execution-2026-04-01",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-promotion-readiness.md",
    promotionSpecPath:
      "runtime/06-promotion-specifications/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-promotion-specification.json",
    promotionRecordPath:
      "runtime/07-promotion-records/2026-04-02-dw-source-temporal-durable-execution-2026-04-01-promotion-record.md",
    compileContractPath:
      "runtime/00-follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-seam-review-compile-contract-01.md",
    inputPackagePath:
      "runtime/00-follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-promotion-input-package-01.md",
    decisionPath:
      "runtime/00-follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-profile-checker-decision-01.md",
    implementationSlicePath:
      "runtime/00-follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-runtime-implementation-slice-01.md",
    implementationResultPath:
      "runtime/00-follow-up/2026-04-02-dw-source-temporal-durable-execution-dw-web-host-runtime-implementation-slice-01-result.md",
    registryEntryPath:
      "runtime/08-registry/2026-04-02-dw-source-temporal-durable-execution-2026-04-01-registry-entry.md",
    commands: {
      compileContract: "npm run check:directive-temporal-durable-execution-dw-web-host-seam-review-compile-contract",
      inputPackage: "npm run check:directive-temporal-durable-execution-dw-web-host-promotion-input-package",
      profileCheckerDecision: "npm run check:directive-temporal-durable-execution-dw-web-host-profile-checker-decision",
    },
    checkerIds: {
      retarget: "directive_temporal_durable_execution_dw_web_host_retarget",
      compileContract: "directive_temporal_durable_execution_dw_web_host_seam_review_compile_contract",
      inputPackage: "directive_temporal_durable_execution_dw_web_host_promotion_input_package",
      profileCheckerDecision: "directive_temporal_durable_execution_dw_web_host_profile_checker_decision",
      runtimeImplementationSlice: "directive_temporal_durable_execution_dw_web_host_runtime_implementation_slice",
      runtimePromotion: "directive_temporal_durable_execution_dw_web_host_runtime_promotion",
    },
    runtimePromotion: {
      expectedDecision: "manual_temporal_durable_execution_dw_web_host_promotion_record_opened",
      qualityGateProfile: "temporal_durable_execution_dw_web_host_manual_promotion_guard/v1",
      promotionProfileFamily: "bounded_temporal_durable_execution_dw_web_host_manual_promotion",
      proofShape: "temporal_durable_execution_dw_web_host_manual_promotion_snapshot/v1",
      primaryHostChecker: "npm run check:directive-temporal-durable-execution-dw-web-host-runtime-promotion",
    },
  },
} as const satisfies Record<string, DwWebHostSyncCaseConfig>;

export type DwWebHostSyncCaseKey = keyof typeof DW_WEB_HOST_SYNC_CASES;
export const DW_WEB_HOST_SYNC_CASE_KEYS = Object.keys(
  DW_WEB_HOST_SYNC_CASES,
) as DwWebHostSyncCaseKey[];

function getDwWebHostSyncCaseConfig(caseKey: DwWebHostSyncCaseKey): DwWebHostSyncCaseConfig {
  return DW_WEB_HOST_SYNC_CASES[caseKey];
}

function loadDwWebHostSyncCaseState(caseKey: DwWebHostSyncCaseKey) {
  const config = getDwWebHostSyncCaseConfig(caseKey);
  const state = loadDwWebHostPromotionCheckerState({
    candidateId: config.candidateId,
    promotionReadinessPath: config.promotionReadinessPath,
  });

  return {
    config,
    state,
  };
}

function assertCommonFocusState(
  config: DwWebHostSyncCaseConfig,
  state: ReturnType<typeof loadDwWebHostPromotionCheckerState>,
  options: { includeNextLegalStep: boolean },
) {
  const { focus, promotionRecordPresent } = state;

  assert.ok(focus?.ok, "focus_should_resolve");
  assert.equal(focus.candidateId, config.candidateId);
  assert.ok(
    focus.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION ||
      focus.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED,
    `unexpected_current_stage:${focus.currentStage}`,
  );
  assert.equal(
    focus.currentHead.artifactPath,
    promotionRecordPresent ? config.promotionRecordPath : config.promotionReadinessPath,
  );
  if (options.includeNextLegalStep) {
    assert.equal(
      focus.nextLegalStep,
      promotionRecordPresent
        ? EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED
        : EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION,
    );
  }
  assert.equal(focus.runtime?.proposedHost, EXPECTED_DW_WEB_HOST);
  assert.equal(
    focus.linkedArtifacts.runtimePromotionRecordPath,
    promotionRecordPresent ? config.promotionRecordPath : null,
  );
  assert.deepEqual(
    focus.runtime?.promotionReadinessBlockers ?? [],
    promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
    "unexpected_runtime_promotion_readiness_blockers",
  );
  assert.equal(
    focus.runtime?.executionState,
    "bounded DW web-host seam-review implementation opened, not executing, not host-integrated, not promoted",
  );
}

function assertCommonPromotionSpec(
  config: DwWebHostSyncCaseConfig,
  state: ReturnType<typeof loadDwWebHostPromotionCheckerState>,
  options?: { includeHostDependence?: boolean },
) {
  const promotionSpec = readDirectiveJson<Record<string, any>>(config.promotionSpecPath);

  assert.equal(promotionSpec.candidateId, config.candidateId);
  assert.equal(promotionSpec.proposedHost, EXPECTED_DW_WEB_HOST);
  if (options?.includeHostDependence) {
    assert.equal(promotionSpec.hostDependence, "host_adapter_required");
  }
  assert.equal(
    promotionSpec.linkedArtifacts?.promotionRecordPath ?? null,
    state.promotionRecordPresent ? config.promotionRecordPath : null,
  );

  return promotionSpec;
}

function assertCommonPromotionRecommendation(state: ReturnType<typeof loadDwWebHostPromotionCheckerState>) {
  const { recommendation, promotionRecordPresent } = state;

  assert.ok(recommendation, "missing_candidate_recommendation");
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

  return recommendation;
}

function assertCommonRecordState(
  config: DwWebHostSyncCaseConfig,
  state: ReturnType<typeof loadDwWebHostPromotionCheckerState>,
) {
  const { promotionRecordPaths, promotionRecordPresent, registryEntryPaths } = state;

  assert.equal(
    promotionRecordPaths.length,
    promotionRecordPresent ? 1 : 0,
    "unexpected_promotion_record_count",
  );
  if (promotionRecordPresent) {
    assert.equal(
      `runtime/07-promotion-records/${promotionRecordPaths[0]?.name}`,
      config.promotionRecordPath,
      "unexpected_promotion_record_path",
    );
  }
  assert.equal(registryEntryPaths.length, 0, "registry_entry_should_remain_absent");
}

export function runDwWebHostRetargetCheck(caseKey: DwWebHostSyncCaseKey) {
  const { config, state } = loadDwWebHostSyncCaseState(caseKey);
  const recommendation = assertCommonPromotionRecommendation(state);

  assertCommonFocusState(config, state, { includeNextLegalStep: true });
  assertCommonPromotionSpec(config, state, {
    includeHostDependence: config.retargetChecksHostDependence !== false,
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkedPath: config.promotionReadinessPath,
        promotionSpecificationPath: config.promotionSpecPath,
        candidateId: config.candidateId,
        proposedHost: EXPECTED_DW_WEB_HOST,
        currentStage: state.focus?.currentStage,
        assistanceState: recommendation.assistanceState,
        promotionRecordPresent: state.promotionRecordPresent,
      },
      null,
      2,
    )}\n`,
  );
}

function readDirectiveBulletValue(content: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^-\\s+${escaped}\\s*:\\s*(.+)$`, "im"));
  return match?.[1]?.replace(/^`|`$/g, "").trim() ?? null;
}

function readDwWebHostPromotionSpecification(relativePath: string) {
  const cached = promotionSpecificationCache.get(relativePath);
  if (cached) {
    return cached;
  }
  const specification = readDirectiveRuntimePromotionSpecification({
    directiveRoot: DIRECTIVE_ROOT,
    promotionSpecificationPath: relativePath,
  });
  promotionSpecificationCache.set(relativePath, specification);
  return specification;
}

export function runDwWebHostCaseSyncCheckerMatrix(caseKey: DwWebHostSyncCaseKey) {
  const config = getDwWebHostSyncCaseConfig(caseKey);
  runDwWebHostRetargetCheck(caseKey);
  runDwWebHostCompileContractCheck(caseKey, config.checkerIds.compileContract);
  runDwWebHostInputPackageCheck(caseKey, config.checkerIds.inputPackage);
  runDwWebHostProfileCheckerDecisionCheck(caseKey, config.checkerIds.profileCheckerDecision);
}

async function runWithDirectiveFrontendHandle<T>(
  handleOrOrigin: DirectiveFrontendServerHandle | string | undefined,
  run: (handleOrOrigin: DirectiveFrontendServerHandle | string) => Promise<T>,
) {
  if (handleOrOrigin) {
    return run(handleOrOrigin);
  }

  return withDirectiveFrontendCheckServer({ directiveRoot: DIRECTIVE_ROOT }, run);
}

export async function runDwWebHostRuntimeImplementationSliceCheck(
  caseKey: DwWebHostSyncCaseKey,
  handleOrOrigin?: DirectiveFrontendServerHandle | string,
) {
  const { config, state } = loadDwWebHostSyncCaseState(caseKey);
  const readinessContent = readDirectiveText(config.promotionReadinessPath);
  const implementationSliceContent = readDirectiveText(config.implementationSlicePath);
  const implementationResultContent = readDirectiveText(config.implementationResultPath);

  assertCommonFocusState(config, state, { includeNextLegalStep: true });
  assert.equal(state.focus?.runtime?.executionState, EXPECTED_EXECUTION_STATE);

  assertIncludes(readinessContent, config.implementationSlicePath, "readiness_implementation_slice_path");
  assertIncludes(readinessContent, config.implementationResultPath, "readiness_implementation_result_path");
  assertIncludes(
    readinessContent,
    `Execution state: ${EXPECTED_EXECUTION_STATE}`,
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

  await runWithDirectiveFrontendHandle(handleOrOrigin, async (sharedHandleOrOrigin) => {
    const origin = typeof sharedHandleOrOrigin === "string"
      ? sharedHandleOrOrigin
      : sharedHandleOrOrigin.origin;
    const detail = await getDirectiveFrontendCheckJson<any>(
      sharedHandleOrOrigin,
      `/api/runtime-promotion-readiness/detail?path=${encodeURIComponent(config.promotionReadinessPath)}`,
    );
    assert.equal(detail.ok, true);
    assert.equal(detail.currentStage, state.focus?.currentStage);
    assert.equal(detail.nextLegalStep, state.focus?.nextLegalStep);
    assert.equal(detail.proposedHost, EXPECTED_DW_WEB_HOST);
    assert.equal(detail.executionState, EXPECTED_EXECUTION_STATE);
    assert.deepEqual(
      detail.promotionReadinessBlockers,
      state.promotionRecordPresent ? [] : ["host_facing_promotion_unopened"],
    );
    assert.equal(detail.openedRuntimeImplementationSlicePath, config.implementationSlicePath);
    assert.ok(detail.compileContractPath, "missing_compile_contract_path");
    assert.ok(detail.promotionInputPackagePath, "missing_promotion_input_package_path");
    assert.ok(detail.profileCheckerDecisionPath, "missing_profile_checker_decision_path");

    const route = await fetch(
      `${origin}/runtime-promotion-readiness/view?path=${encodeURIComponent(config.promotionReadinessPath)}`,
    );
    assert.equal(route.ok, true, `route_failed:${route.status}`);
    const routeHtml = await route.text();
    assert.match(routeHtml, /<div id="app">/i);
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: config.checkerIds.runtimeImplementationSlice,
        candidateId: config.candidateId,
        currentStage: state.focus?.currentStage,
        proposedHost: EXPECTED_DW_WEB_HOST,
        executionState: EXPECTED_EXECUTION_STATE,
        implementationSlicePath: config.implementationSlicePath,
        implementationResultPath: config.implementationResultPath,
        promotionRecordPresent: state.promotionRecordPresent,
      },
      null,
      2,
    )}\n`,
  );
}

export async function runDwWebHostRuntimePromotionCheck(
  caseKey: DwWebHostSyncCaseKey,
  handleOrOrigin?: DirectiveFrontendServerHandle | string,
) {
  const { config, state } = loadDwWebHostSyncCaseState(caseKey);
  const promotionRecordAbsolutePath = path.join(DIRECTIVE_ROOT, config.promotionRecordPath);
  assert.ok(fs.existsSync(promotionRecordAbsolutePath), "promotion record should exist");

  const promotionRecordContent = readDirectiveText(config.promotionRecordPath);
  const promotionRecordFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: config.promotionRecordPath,
  }).focus;
  const promotionSpecification = readDwWebHostPromotionSpecification(config.promotionSpecPath);

  assert.ok(state.focus?.ok, "promotion-readiness focus should resolve");
  assert.ok(promotionRecordFocus?.ok, "promotion-record focus should resolve");
  assert.equal(state.focus.currentStage, EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED);
  assert.equal(state.focus.currentHead.artifactPath, config.promotionRecordPath);
  assert.equal(state.focus.linkedArtifacts.runtimePromotionRecordPath, config.promotionRecordPath);
  assert.deepEqual(state.focus.runtime?.promotionReadinessBlockers ?? [], []);
  assert.equal(promotionRecordFocus.artifactKind, "runtime_promotion_record");
  assert.equal(promotionRecordFocus.artifactStage, EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED);
  assert.equal(promotionRecordFocus.currentStage, EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED);
  assert.equal(promotionRecordFocus.nextLegalStep, EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED);
  assert.deepEqual(promotionRecordFocus.runtime?.promotionReadinessBlockers ?? [], []);
  assert.equal(
    promotionSpecification.linkedArtifacts.promotionRecordPath,
    config.promotionRecordPath,
  );

  assert.equal(readDirectiveBulletValue(promotionRecordContent, "Candidate id"), config.candidateId);
  assert.equal(readDirectiveBulletValue(promotionRecordContent, "Target host"), EXPECTED_DW_WEB_HOST);
  assert.equal(
    readDirectiveBulletValue(promotionRecordContent, "Quality gate profile"),
    config.runtimePromotion.qualityGateProfile,
  );
  assert.equal(
    readDirectiveBulletValue(promotionRecordContent, "Promotion profile family"),
    config.runtimePromotion.promotionProfileFamily,
  );
  assert.equal(
    readDirectiveBulletValue(promotionRecordContent, "Proof shape"),
    config.runtimePromotion.proofShape,
  );
  assert.equal(
    readDirectiveBulletValue(promotionRecordContent, "Primary host checker"),
    config.runtimePromotion.primaryHostChecker,
  );
  assert.equal(readDirectiveBulletValue(promotionRecordContent, "Quality gate result"), "pass");
  assert.equal(readDirectiveBulletValue(promotionRecordContent, "Validation state"), "validated_locally");
  assert.ok(
    !fs.existsSync(path.join(DIRECTIVE_ROOT, config.registryEntryPath)),
    "registry acceptance should remain unopened after the manual promotion-record slice",
  );

  await runWithDirectiveFrontendHandle(handleOrOrigin, async (sharedHandleOrOrigin) => {
    const origin = typeof sharedHandleOrOrigin === "string"
      ? sharedHandleOrOrigin
      : sharedHandleOrOrigin.origin;
    const detail = await getDirectiveFrontendCheckJson<any>(
      sharedHandleOrOrigin,
      `/api/runtime-promotion-readiness/detail?path=${encodeURIComponent(config.promotionReadinessPath)}`,
    );
    assert.equal(detail.ok, true);
    assert.equal(detail.currentStage, EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED);
    assert.equal(detail.nextLegalStep, EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED);
    assert.equal(detail.proposedHost, EXPECTED_DW_WEB_HOST);
    assert.equal(detail.hostFacingPromotionDecision, config.runtimePromotion.expectedDecision);
    assert.match(detail.executionState || "", /implementation opened/i);
    assert.deepEqual(detail.promotionReadinessBlockers, []);
    assert.ok(detail.openedRuntimeImplementationSlicePath, "missing_opened_runtime_implementation_slice");
    assert.ok(detail.compileContractPath, "missing_compile_contract_path");
    assert.ok(detail.promotionInputPackagePath, "missing_promotion_input_package_path");
    assert.ok(detail.profileCheckerDecisionPath, "missing_profile_checker_decision_path");

    const snapshot = await getDirectiveFrontendCheckJson<any>(sharedHandleOrOrigin, "/api/snapshot");
    const queueCase = Array.isArray(snapshot.queue?.entries)
      ? snapshot.queue.entries.find((entry: any) => entry?.candidate_id === config.candidateId)
      : null;
    assert.ok(queueCase, "missing_runtime_queue_case");
    assert.equal(queueCase.current_case_stage, EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED);
    assert.equal(queueCase.runtime_summary?.proposed_host, EXPECTED_DW_WEB_HOST);
    assert.deepEqual(queueCase.runtime_summary?.promotion_readiness_blockers ?? [], []);

    const route = await fetch(
      `${origin}/runtime-promotion-readiness/view?path=${encodeURIComponent(config.promotionReadinessPath)}`,
    );
    assert.equal(route.ok, true, `route_failed:${route.status}`);
    const routeHtml = await route.text();
    assert.match(routeHtml, /<div id="app">/i);
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: config.checkerIds.runtimePromotion,
        candidateId: state.focus.candidateId,
        currentStage: state.focus.currentStage,
        currentHead: state.focus.currentHead,
        promotionRecordPath: config.promotionRecordPath,
        promotionSpecificationPath: config.promotionSpecPath,
        registryEntryPresent: false,
      },
      null,
      2,
    )}\n`,
  );
}

export async function runDwWebHostCaseRuntimeCheckerMatrix(
  caseKey: DwWebHostSyncCaseKey,
  handleOrOrigin?: DirectiveFrontendServerHandle | string,
) {
  await runDwWebHostRuntimeImplementationSliceCheck(caseKey, handleOrOrigin);
  await runDwWebHostRuntimePromotionCheck(caseKey, handleOrOrigin);
}

export function runDwWebHostCompileContractCheck(caseKey: DwWebHostSyncCaseKey, checkerId: string) {
  const { config, state } = loadDwWebHostSyncCaseState(caseKey);
  const readinessContent = readDirectiveText(config.promotionReadinessPath);
  const compileContractContent = readDirectiveText(config.compileContractPath);
  const guardContent = readDirectiveText(DW_WEB_HOST_GUARD_PATH);

  assertCommonFocusState(config, state, { includeNextLegalStep: true });
  assertCommonPromotionSpec(config, state);
  const recommendation = assertCommonPromotionRecommendation(state);
  assertCommonRecordState(config, state);

  assertIncludes(
    readinessContent,
    "## Directive Workspace web-host seam-review compile contract",
    "readiness_compile_contract_section",
  );
  assertIncludes(readinessContent, config.compileContractPath, "readiness_compile_contract_path");
  assertIncludes(
    readinessContent,
    `Focused compile-contract checker = ${config.commands.compileContract}`,
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
    config.promotionReadinessPath,
    "compile_contract_readiness_path",
  );
  assertIncludes(
    compileContractContent,
    config.promotionSpecPath,
    "compile_contract_promotion_spec_path",
  );
  assertIncludes(
    compileContractContent,
    config.inputPackagePath,
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
    `/runtime-promotion-readiness/view?path=${config.promotionReadinessPath}`,
    "compile_contract_view_route",
  );
  assertIncludes(
    compileContractContent,
    `/api/runtime-promotion-readiness/detail?path=${config.promotionReadinessPath}`,
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
    config.commands.compileContract,
    "compile_contract_focused_checker",
  );
  assertIncludes(
    compileContractContent,
    config.commands.inputPackage,
    "compile_contract_input_package_checker",
  );

  assertIncludes(
    guardContent,
    "This guard applies only to read-only seam review.",
    "guard_read_only_scope",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId,
        candidateId: config.candidateId,
        currentStage: state.focus?.currentStage,
        proposedHost: state.focus?.runtime?.proposedHost,
        compileContractPath: config.compileContractPath,
        promotionRecordPresent: state.promotionRecordPresent,
        registryEntryPresent: false,
        assistanceState: recommendation.assistanceState,
      },
      null,
      2,
    )}\n`,
  );
}

export function runDwWebHostInputPackageCheck(caseKey: DwWebHostSyncCaseKey, checkerId: string) {
  const { config, state } = loadDwWebHostSyncCaseState(caseKey);
  const readinessContent = readDirectiveText(config.promotionReadinessPath);
  const compileContractContent = readDirectiveText(config.compileContractPath);
  const inputPackageContent = readDirectiveText(config.inputPackagePath);
  const guardContent = readDirectiveText(DW_WEB_HOST_GUARD_PATH);

  assertCommonFocusState(config, state, { includeNextLegalStep: true });
  assertCommonPromotionSpec(config, state);
  const recommendation = assertCommonPromotionRecommendation(state);
  assertCommonRecordState(config, state);

  assertIncludes(
    readinessContent,
    "## Directive Workspace web-host promotion-input package",
    "readiness_input_package_section",
  );
  assertIncludes(readinessContent, config.inputPackagePath, "readiness_input_package_path");
  assertIncludes(
    readinessContent,
    `Focused input-package checker = ${config.commands.inputPackage}`,
    "readiness_input_package_checker",
  );
  assertIncludes(
    readinessContent,
    "Safe output scope =",
    "readiness_input_package_safe_output_scope_prefix",
  );
  assertIncludes(
    readinessContent,
    "no promotion-record creation, no registry acceptance, no host integration writes, no runtime execution",
    "readiness_input_package_safe_output_scope",
  );

  assertIncludes(
    compileContractContent,
    config.inputPackagePath,
    "compile_contract_input_package_path",
  );
  assertIncludes(
    compileContractContent,
    "Focused input-package checker:",
    "compile_contract_input_checker_label",
  );
  assertIncludes(
    compileContractContent,
    config.commands.inputPackage,
    "compile_contract_input_checker",
  );

  assertIncludes(
    inputPackageContent,
    "Status: `explicit_non_promoting_dw_web_host_input_bundle`",
    "input_package_status",
  );
  assertIncludes(
    inputPackageContent,
    config.compileContractPath,
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
    `Focused input-package checker = ${config.commands.inputPackage}`,
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

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId,
        candidateId: config.candidateId,
        currentStage: state.focus?.currentStage,
        proposedHost: state.focus?.runtime?.proposedHost,
        compileContractPath: config.compileContractPath,
        inputPackagePath: config.inputPackagePath,
        promotionRecordPresent: state.promotionRecordPresent,
        registryEntryPresent: false,
        assistanceState: recommendation.assistanceState,
      },
      null,
      2,
    )}\n`,
  );
}

export function runDwWebHostProfileCheckerDecisionCheck(caseKey: DwWebHostSyncCaseKey, checkerId: string) {
  const { config, state } = loadDwWebHostSyncCaseState(caseKey);
  const readinessContent = readDirectiveText(config.promotionReadinessPath);
  const compileContractContent = readDirectiveText(config.compileContractPath);
  const inputPackageContent = readDirectiveText(config.inputPackagePath);
  const decisionContent = readDirectiveText(config.decisionPath);
  const contractContent = readDirectiveText(DW_WEB_HOST_GUARD_PATH);
  const profileCatalog = readDirectiveJson<{ profiles: Array<Record<string, any>> }>(PROFILE_CATALOG_PATH);

  assertCommonFocusState(config, state, { includeNextLegalStep: false });
  assertCommonPromotionSpec(config, state);
  const recommendation = assertCommonPromotionRecommendation(state);
  assertCommonRecordState(config, state);

  const selectedProfile = profileCatalog.profiles.find((entry) => entry.id === EXPECTED_PROFILE);
  assert.ok(selectedProfile, "missing_selected_profile");
  assert.equal(selectedProfile.family, EXPECTED_FAMILY);
  assert.equal(selectedProfile.proofShape, EXPECTED_PROOF_SHAPE);
  assert.equal(selectedProfile.contractPath, DW_WEB_HOST_GUARD_PATH);
  assert.equal(selectedProfile.primaryHostCheckCommand, EXPECTED_PRIMARY_CHECKER);

  assertIncludes(
    readinessContent,
    "## Directive Workspace web-host profile / checker decision",
    "readiness_section",
  );
  assertIncludes(readinessContent, config.decisionPath, "readiness_decision_path");
  assertIncludes(
    readinessContent,
    `Focused profile/checker decision = ${config.commands.profileCheckerDecision}`,
    "readiness_focused_checker",
  );

  assertIncludes(
    compileContractContent,
    config.decisionPath,
    "compile_contract_decision_path",
  );
  assertIncludes(
    compileContractContent,
    config.commands.profileCheckerDecision,
    "compile_contract_focused_checker",
  );

  assertIncludes(inputPackageContent, config.decisionPath, "input_package_decision_path");
  assertIncludes(
    inputPackageContent,
    `Focused profile/checker decision = ${config.commands.profileCheckerDecision}`,
    "input_package_focused_checker",
  );

  assertIncludes(
    decisionContent,
    "Decision status: `bounded_dw_web_host_profile_selected`",
    "decision_status",
  );
  assertIncludes(
    decisionContent,
    config.promotionReadinessPath,
    "decision_readiness_path",
  );
  assertIncludes(
    decisionContent,
    config.inputPackagePath,
    "decision_input_package_path",
  );
  assertIncludes(
    decisionContent,
    config.compileContractPath,
    "decision_compile_contract_path",
  );
  assertIncludes(decisionContent, PROFILE_CATALOG_PATH, "decision_catalog_path");
  assertIncludes(decisionContent, EXPECTED_PROFILE, "decision_profile");
  assertIncludes(decisionContent, EXPECTED_FAMILY, "decision_family");
  assertIncludes(decisionContent, EXPECTED_PROOF_SHAPE, "decision_proof_shape");
  assertIncludes(decisionContent, EXPECTED_PRIMARY_CHECKER, "decision_primary_checker");
  assertIncludes(
    decisionContent,
    config.commands.profileCheckerDecision,
    "decision_focused_checker",
  );
  assertIncludes(decisionContent, DW_WEB_HOST_GUARD_PATH, "decision_contract_path");

  assertIncludes(
    contractContent,
    "Quality gate profile: `dw_web_host_seam_review_guard/v1`",
    "contract_profile_header",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId,
        candidateId: config.candidateId,
        currentStage: state.focus?.currentStage,
        proposedHost: state.focus?.runtime?.proposedHost,
        decisionPath: config.decisionPath,
        promotionRecordPresent: state.promotionRecordPresent,
        registryEntryPresent: false,
        assistanceState: recommendation.assistanceState,
      },
      null,
      2,
    )}\n`,
  );
}
