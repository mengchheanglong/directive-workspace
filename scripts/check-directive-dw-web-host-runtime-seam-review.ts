import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getDirectiveFrontendCheckJson,
  withDirectiveFrontendCheckServer,
} from "./frontend-check-helpers.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIRECTIVE_ROOT = path.resolve(SCRIPT_DIR, "..");
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md";
const EXPECTED_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";

async function main() {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
    includeAnchors: false,
  }).focus;

  assert.ok(focus?.ok, "missing_focus");
  const expectedStage = focus.currentStage;
  const expectedNextStep = focus.nextLegalStep;
  const expectedBlockers = focus.runtime?.promotionReadinessBlockers ?? [];

  assert.equal(focus.currentStage, expectedStage);
  assert.equal(focus.nextLegalStep, expectedNextStep);
  assert.equal(focus.runtime?.proposedHost, EXPECTED_HOST);

  await withDirectiveFrontendCheckServer({ directiveRoot: DIRECTIVE_ROOT }, async (handle) => {
    const detail = await getDirectiveFrontendCheckJson<any>(
      handle.origin,
      `/api/runtime-promotion-readiness/detail?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(detail.ok, true);
    assert.equal(detail.currentStage, expectedStage);
    assert.equal(detail.nextLegalStep, expectedNextStep);
    assert.equal(detail.proposedHost, EXPECTED_HOST);
    assert.ok(detail.hostFacingPromotionDecision, "missing_host_facing_promotion_decision");
    assert.equal(detail.executionState, focus.runtime?.executionState);
    assert.deepEqual(detail.promotionReadinessBlockers ?? [], expectedBlockers);
    assert.ok(detail.openedRuntimeImplementationSlicePath, "missing_opened_runtime_implementation_slice");
    assert.ok(detail.compileContractPath, "missing_compile_contract_path");
    assert.ok(detail.promotionInputPackagePath, "missing_promotion_input_package_path");
    assert.ok(detail.profileCheckerDecisionPath, "missing_profile_checker_decision_path");
    assert.ok(detail.promotionGoNoGoDecisionPath, "missing_promotion_go_no_go_decision_path");

    const snapshot = await getJson<any>(handle.origin, "/api/snapshot");
    const queueCase = Array.isArray(snapshot.queue?.entries)
      ? snapshot.queue.entries.find((entry: any) =>
        entry?.candidate_id === "dw-mission-openmoss-runtime-orchestration-2026-03-26")
      : null;
    assert.ok(queueCase, "missing_runtime_queue_case");
    assert.equal(queueCase.current_case_stage, expectedStage);
    assert.equal(queueCase.current_case_next_legal_step, expectedNextStep);
    assert.equal(queueCase.runtime_summary?.proposed_host, EXPECTED_HOST);
    assert.deepEqual(queueCase.runtime_summary?.promotion_readiness_blockers ?? [], expectedBlockers);

    const route = await fetch(
      `${handle.origin}/runtime-promotion-readiness/view?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(route.ok, true, `route_failed:${route.status}`);
    const routeHtml = await route.text();
    assert.match(routeHtml, /<div id="app">/i);

    process.stdout.write(`${JSON.stringify({
      ok: true,
      origin: handle.origin,
      checkedPath: PROMOTION_READINESS_PATH,
      currentStage: expectedStage,
      proposedHost: EXPECTED_HOST,
      blockers: expectedBlockers,
    }, null, 2)}\n`);
  });
}

void main();
