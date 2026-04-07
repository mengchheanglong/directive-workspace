import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import { buildDirectiveRuntimePromotionAssistanceReport } from "../runtime/lib/runtime-promotion-assistance.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CANDIDATE_ID = "dw-pressure-mini-swe-agent-2026-03-25";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-promotion-readiness.md";
const PROMOTION_SPEC_PATH =
  "runtime/06-promotion-specifications/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-promotion-specification.json";
const EXPECTED_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
const EXPECTED_STAGE = "runtime.promotion_readiness.opened";
const EXPECTED_NEXT_STEP =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";

function main() {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
    includeAnchors: false,
  }).focus;

  assert.ok(focus?.ok, "missing_focus");
  assert.equal(focus.currentStage, EXPECTED_STAGE);
  assert.equal(focus.currentHead.artifactPath, PROMOTION_READINESS_PATH);
  assert.equal(focus.nextLegalStep, EXPECTED_NEXT_STEP);
  assert.equal(focus.runtime?.proposedHost, EXPECTED_HOST);
  assert.deepEqual(
    focus.runtime?.promotionReadinessBlockers ?? [],
    ["runtime_implementation_unopened", "host_facing_promotion_unopened"],
  );
  assert.equal(focus.linkedArtifacts.runtimePromotionRecordPath, null);
  assert.equal(
    focus.runtime?.executionState,
    "not executing, not host-integrated, not implemented, not promoted",
  );

  const promotionSpec = JSON.parse(
    fs.readFileSync(path.join(DIRECTIVE_ROOT, PROMOTION_SPEC_PATH), "utf8"),
  );
  assert.equal(promotionSpec.candidateId, CANDIDATE_ID);
  assert.equal(promotionSpec.proposedHost, EXPECTED_HOST);
  assert.equal(promotionSpec.hostDependence, "host_adapter_required");
  assert.equal(promotionSpec.linkedArtifacts?.promotionRecordPath ?? null, null);

  const report = buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const recommendation = report.recommendations.find((entry) => entry.candidateId === CANDIDATE_ID);
  assert.ok(recommendation, "missing_recommendation");
  assert.equal(recommendation.assistanceState, "blocked_other");
  assert.equal(recommendation.recommendedActionKind, "none");
  assert.equal(recommendation.hostScope, "directive_workspace_host");
  assert.deepEqual(recommendation.missingPrerequisites, []);
  assert.equal(recommendation.supportingArtifacts.existingPromotionRecordPaths.length, 0);
  assert.equal(
    recommendation.supportingArtifacts.parkDecisionArtifact,
    "control/logs/2026-04/2026-04-02-pressure-mini-swe-dw-web-host-manual-promotion-park-decision.md",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkedPath: PROMOTION_READINESS_PATH,
        promotionSpecificationPath: PROMOTION_SPEC_PATH,
        candidateId: CANDIDATE_ID,
        proposedHost: EXPECTED_HOST,
        currentStage: focus.currentStage,
        assistanceState: recommendation.assistanceState,
      },
      null,
      2,
    )}\n`,
  );
}

main();
