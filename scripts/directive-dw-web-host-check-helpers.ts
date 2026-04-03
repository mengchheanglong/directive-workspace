import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { listCandidateMarkdownFiles } from "./list-candidate-markdown-files.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { buildDirectiveRuntimePromotionAssistanceReport } from "../shared/lib/runtime-promotion-assistance.ts";

export const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const EXPECTED_DW_WEB_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
export const EXPECTED_RUNTIME_PROMOTION_STAGE_PRE_PROMOTION = "runtime.promotion_readiness.opened";
export const EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED = "runtime.promotion_record.opened";
export const EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PRE_PROMOTION =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
export const EXPECTED_RUNTIME_PROMOTION_NEXT_STEP_PROMOTED =
  "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.";

export function assertIncludes(content: string, needle: string, label: string) {
  if (!content.includes(needle)) {
    throw new Error(`missing_${label}`);
  }
}

export function readDirectiveText(relativePath: string) {
  return fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8");
}

export function readDirectiveJson<T>(relativePath: string) {
  return JSON.parse(readDirectiveText(relativePath)) as T;
}

export function loadDwWebHostPromotionCheckerState(input: {
  candidateId: string;
  promotionReadinessPath: string;
}) {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: input.promotionReadinessPath,
    includeAnchors: false,
  }).focus;
  const assistanceReport = buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const recommendation = assistanceReport.recommendations.find((entry) => entry.candidateId === input.candidateId);
  const promotionRecordPresent = focus?.currentStage === EXPECTED_RUNTIME_PROMOTION_STAGE_PROMOTED;
  const promotionRecordPaths = listCandidateMarkdownFiles({
    directiveRoot: DIRECTIVE_ROOT,
    relativeDir: "runtime/promotion-records",
    candidateId: input.candidateId,
  });
  const registryEntryPaths = listCandidateMarkdownFiles({
    directiveRoot: DIRECTIVE_ROOT,
    relativeDir: "runtime/registry",
    candidateId: input.candidateId,
  });

  return {
    focus,
    recommendation,
    promotionRecordPresent,
    promotionRecordPaths,
    registryEntryPaths,
  };
}
