import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import { buildDirectiveRuntimePromotionAssistanceReport } from "../runtime/lib/runtime-promotion-assistance.ts";
import {
  runDirectiveRuntimeV0LiveMiniSweAgentCallableIntegration,
} from "../runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_live_mini_swe_agent_runtime_callable";
const CALLABLE_STUB_PATH =
  "runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-record.md";
const EXPECTED_HOST = "Directive Workspace standalone host (hosts/standalone-host/)";

function main() {
  const callableRuntime = runDirectiveRuntimeV0LiveMiniSweAgentCallableIntegration();
  const readinessFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
  }).focus;
  const callableFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: CALLABLE_STUB_PATH,
  }).focus;
  const report = buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const recommendation = report.recommendations.find((entry) =>
    entry.candidateId === "dw-live-mini-swe-agent-engine-pressure-2026-03-24"
  );

  assert.ok(readinessFocus?.ok, "live mini-swe promotion-readiness focus should resolve");
  assert.ok(callableFocus?.ok, "live mini-swe callable integration focus should resolve");
  assert.ok(recommendation, "missing_runtime_promotion_assistance_recommendation");
  assert.equal(callableRuntime.status, "not_implemented");
  assert.equal(
    callableRuntime.callableId,
    "2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration",
  );
  assert.equal(
    callableFocus.artifactStage,
    "runtime.callable_stub.not_implemented",
  );
  assert.equal(readinessFocus.runtime?.proposedHost, EXPECTED_HOST);
  assert.equal(
    readinessFocus.linkedArtifacts.runtimeCallableStubPath,
    CALLABLE_STUB_PATH,
  );
  assert.equal(
    readinessFocus.linkedArtifacts.runtimePromotionSpecificationPath,
    PROMOTION_SPECIFICATION_PATH,
  );
  assert.equal(
    readinessFocus.linkedArtifacts.runtimePromotionRecordPath,
    PROMOTION_RECORD_PATH,
  );
  assert.equal(recommendation.assistanceState, "already_promoted_manual_cycle");
  assert.equal(recommendation.recommendedActionKind, "none");

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        callableId: callableRuntime.callableId,
        runtimeCallableStubPath: readinessFocus.linkedArtifacts.runtimeCallableStubPath,
        runtimePromotionRecordPath:
          readinessFocus.linkedArtifacts.runtimePromotionRecordPath,
        runtimePromotionSpecificationPath:
          readinessFocus.linkedArtifacts.runtimePromotionSpecificationPath,
        currentStage: readinessFocus.currentStage,
        assistanceState: recommendation.assistanceState,
      },
      null,
      2,
    )}\n`,
  );
}

main();
