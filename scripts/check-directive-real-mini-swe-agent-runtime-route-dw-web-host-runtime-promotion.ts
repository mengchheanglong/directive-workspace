import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getDirectiveFrontendCheckJson,
  withDirectiveFrontendCheckServer,
} from "./frontend-check-helpers.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { readDirectiveRuntimePromotionSpecification } from "../shared/lib/runtime-promotion-specification.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_real_mini_swe_agent_runtime_route_dw_web_host_runtime_promotion";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-record.md";
const REGISTRY_ENTRY_PATH =
  "runtime/registry/2026-04-02-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-registry-entry.md";
const EXPECTED_HOST = "Directive Workspace web host (frontend/ + hosts/web-host/)";
const EXPECTED_NEXT_LEGAL_STEP =
  "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.";
const EXPECTED_PROMOTION_DECISION =
  "manual_real_mini_swe_agent_runtime_route_dw_web_host_promotion_record_opened";

function readBullet(content: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^-\\s+${escaped}\\s*:\\s*(.+)$`, "im"));
  return match?.[1]?.replace(/^`|`$/g, "").trim() ?? null;
}

async function main() {
  const promotionRecordAbsolutePath = path.join(DIRECTIVE_ROOT, PROMOTION_RECORD_PATH);
  assert.ok(fs.existsSync(promotionRecordAbsolutePath), "mini-swe route promotion record should exist");

  const promotionRecordContent = fs.readFileSync(promotionRecordAbsolutePath, "utf8");
  const readinessFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
  }).focus;
  const promotionRecordFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_RECORD_PATH,
  }).focus;
  const promotionSpecification = readDirectiveRuntimePromotionSpecification({
    directiveRoot: DIRECTIVE_ROOT,
    promotionSpecificationPath: PROMOTION_SPECIFICATION_PATH,
  });

  assert.ok(readinessFocus?.ok, "mini-swe route promotion-readiness focus should resolve");
  assert.ok(promotionRecordFocus?.ok, "mini-swe route promotion-record focus should resolve");
  assert.equal(readinessFocus.currentStage, "runtime.promotion_record.opened");
  assert.equal(readinessFocus.currentHead.artifactPath, PROMOTION_RECORD_PATH);
  assert.equal(readinessFocus.linkedArtifacts.runtimePromotionRecordPath, PROMOTION_RECORD_PATH);
  assert.deepEqual(readinessFocus.runtime?.promotionReadinessBlockers ?? [], []);
  assert.equal(promotionRecordFocus.artifactKind, "runtime_promotion_record");
  assert.equal(promotionRecordFocus.artifactStage, "runtime.promotion_record.opened");
  assert.equal(promotionRecordFocus.currentStage, "runtime.promotion_record.opened");
  assert.equal(promotionRecordFocus.nextLegalStep, EXPECTED_NEXT_LEGAL_STEP);
  assert.deepEqual(promotionRecordFocus.runtime?.promotionReadinessBlockers ?? [], []);
  assert.equal(
    promotionSpecification.linkedArtifacts.promotionRecordPath,
    PROMOTION_RECORD_PATH,
  );

  assert.equal(
    readBullet(promotionRecordContent, "Candidate id"),
    "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Linked Runtime record"),
    "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  );
  assert.equal(readBullet(promotionRecordContent, "Target host"), EXPECTED_HOST);
  assert.equal(
    readBullet(promotionRecordContent, "Quality gate profile"),
    "real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_guard/v1",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Promotion profile family"),
    "bounded_real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Proof shape"),
    "real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_snapshot/v1",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Primary host checker"),
    "npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion",
  );
  assert.equal(readBullet(promotionRecordContent, "Quality gate result"), "pass");
  assert.equal(readBullet(promotionRecordContent, "Validation state"), "validated_locally");
  assert.ok(
    !fs.existsSync(path.join(DIRECTIVE_ROOT, REGISTRY_ENTRY_PATH)),
    "mini-swe route registry acceptance should remain unopened after the manual promotion-record slice",
  );

  await withDirectiveFrontendCheckServer({ directiveRoot: DIRECTIVE_ROOT }, async (handle) => {
    const detail = await getDirectiveFrontendCheckJson<any>(
      handle.origin,
      `/api/runtime-promotion-readiness/detail?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(detail.ok, true);
    assert.equal(detail.currentStage, "runtime.promotion_record.opened");
    assert.equal(detail.nextLegalStep, EXPECTED_NEXT_LEGAL_STEP);
    assert.equal(detail.proposedHost, EXPECTED_HOST);
    assert.equal(detail.hostFacingPromotionDecision, EXPECTED_PROMOTION_DECISION);
    assert.match(detail.executionState || "", /implementation opened/i);
    assert.deepEqual(detail.promotionReadinessBlockers, []);
    assert.ok(detail.openedRuntimeImplementationSlicePath, "missing_opened_runtime_implementation_slice");
    assert.ok(detail.compileContractPath, "missing_compile_contract_path");
    assert.ok(detail.promotionInputPackagePath, "missing_promotion_input_package_path");
    assert.ok(detail.profileCheckerDecisionPath, "missing_profile_checker_decision_path");

    const snapshot = await getDirectiveFrontendCheckJson<any>(handle, "/api/snapshot");
    const queueCase = Array.isArray(snapshot.queue?.entries)
      ? snapshot.queue.entries.find((entry: any) =>
        entry?.candidate_id === "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25")
      : null;
    assert.ok(queueCase, "missing_runtime_queue_case");
    assert.equal(queueCase.current_case_stage, "runtime.promotion_record.opened");
    assert.equal(queueCase.runtime_summary?.proposed_host, EXPECTED_HOST);
    assert.deepEqual(queueCase.runtime_summary?.promotion_readiness_blockers ?? [], []);

    const route = await fetch(
      `${handle.origin}/runtime-promotion-readiness/view?path=${encodeURIComponent(PROMOTION_READINESS_PATH)}`,
    );
    assert.equal(route.ok, true, `route_failed:${route.status}`);
    const routeHtml = await route.text();
    assert.match(routeHtml, /<div id="app">/i);

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          candidateId: readinessFocus.candidateId,
          currentStage: readinessFocus.currentStage,
          currentHead: readinessFocus.currentHead,
          promotionRecordPath: PROMOTION_RECORD_PATH,
          promotionSpecificationPath: PROMOTION_SPECIFICATION_PATH,
          registryEntryPresent: false,
          origin: handle.origin,
        },
        null,
        2,
      )}\n`,
    );
  });
}

void main();
