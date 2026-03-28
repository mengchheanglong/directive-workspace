import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { startDirectiveFrontendServer } from "../hosts/web-host/server.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIRECTIVE_ROOT = path.resolve(SCRIPT_DIR, "..");
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md";
const EXPECTED_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
const EXPECTED_STAGE = "runtime.promotion_readiness.opened";
const EXPECTED_NEXT_STEP =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
const REQUIRED_BLOCKERS = [
  "host_facing_promotion_unopened",
];

function buildFrontend() {
  execSync("npm run frontend:build", {
    cwd: DIRECTIVE_ROOT,
    stdio: "inherit",
  });
}

async function getJson<T>(origin: string, pathname: string) {
  const response = await fetch(`${origin}${pathname}`);
  assert.equal(response.ok, true, `request_failed:${pathname}:${response.status}`);
  return response.json() as Promise<T>;
}

async function main() {
  buildFrontend();

  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
    includeAnchors: false,
  }).focus;

  assert.ok(focus?.ok, "missing_focus");
  assert.equal(focus.currentStage, EXPECTED_STAGE);
  assert.equal(focus.nextLegalStep, EXPECTED_NEXT_STEP);
  assert.equal(focus.runtime?.proposedHost, EXPECTED_HOST);
  for (const blocker of REQUIRED_BLOCKERS) {
    assert.equal(
      focus.runtime?.promotionReadinessBlockers.includes(blocker),
      true,
      `missing_focus_blocker:${blocker}`,
    );
  }

  const handle = await startDirectiveFrontendServer({
    directiveRoot: DIRECTIVE_ROOT,
    host: "127.0.0.1",
    port: 0,
  });

  try {
    const detail = await getJson<any>(
      handle.origin,
      `/api/runtime-promotion-readiness/detail?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(detail.ok, true);
    assert.equal(detail.currentStage, EXPECTED_STAGE);
    assert.equal(detail.nextLegalStep, EXPECTED_NEXT_STEP);
    assert.equal(detail.proposedHost, EXPECTED_HOST);
    assert.equal(detail.hostFacingPromotionDecision, "host_facing_promotion_remains_unopened");
    assert.match(detail.executionState || "", /implementation opened/i);
    for (const blocker of REQUIRED_BLOCKERS) {
      assert.equal(
        Array.isArray(detail.promotionReadinessBlockers) && detail.promotionReadinessBlockers.includes(blocker),
        true,
        `missing_detail_blocker:${blocker}`,
      );
    }
    assert.ok(detail.openedRuntimeImplementationSlicePath, "missing_opened_runtime_implementation_slice");
    assert.ok(detail.compileContractPath, "missing_compile_contract_path");
    assert.ok(detail.promotionInputPackagePath, "missing_promotion_input_package_path");
    assert.ok(detail.profileCheckerDecisionPath, "missing_profile_checker_decision_path");
    assert.ok(detail.promotionGoNoGoDecisionPath, "missing_promotion_go_no_go_decision_path");

    const snapshot = await getJson<any>(handle.origin, "/api/snapshot");
    const activeCase = Array.isArray(snapshot.runtimeSummary?.activeCases)
      ? snapshot.runtimeSummary.activeCases.find((entry: any) =>
        entry?.candidate_id === "dw-mission-openmoss-runtime-orchestration-2026-03-26")
      : null;
    assert.ok(activeCase, "missing_runtime_active_case");
    assert.equal(activeCase.runtime_summary?.proposed_host, EXPECTED_HOST);
    for (const blocker of REQUIRED_BLOCKERS) {
      assert.equal(
        Array.isArray(activeCase.runtime_summary?.promotion_readiness_blockers)
        && activeCase.runtime_summary.promotion_readiness_blockers.includes(blocker),
        true,
        `missing_snapshot_blocker:${blocker}`,
      );
    }

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
      currentStage: EXPECTED_STAGE,
      proposedHost: EXPECTED_HOST,
      blockers: REQUIRED_BLOCKERS,
    }, null, 2)}\n`);
  } finally {
    await handle.close();
  }
}

void main();
