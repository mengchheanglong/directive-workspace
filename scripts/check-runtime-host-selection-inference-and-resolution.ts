import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  renderRuntimeFollowUpRecord,
  type RuntimeFollowUpRecordRequest,
} from "../runtime/lib/runtime-follow-up-record-writer.ts";
import {
  writeRuntimeHostSelectionResolution,
  readRuntimeHostSelectionResolution,
  resolveRuntimeHostSelectionResolutionPath,
} from "../runtime/lib/runtime-host-selection-resolution.ts";
import {
  evaluatePreHostRuntimePromotionRecordPrerequisites,
} from "../runtime/lib/runtime-promotion-record-writer.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assertions: string[] = [];
const cleanupPaths: string[] = [];

function pass(label: string) {
  assertions.push(label);
}

function cleanup() {
  for (const p of cleanupPaths) {
    try { fs.unlinkSync(p); } catch { /* noop */ }
  }
}

try {
  // ─── Test 1: Host inference renders in follow-up record ───
  const inferredRequest: RuntimeFollowUpRecordRequest = {
    candidate_id: "test-inference-candidate",
    candidate_name: "Test Inference Candidate",
    follow_up_date: "2026-04-07",
    current_decision_state: "route_to_runtime_follow_up",
    origin_track: "discovery-routing-approval",
    runtime_value_to_operationalize: "Test value",
    proposed_host: "Directive Workspace standalone host (hosts/standalone-host/)",
    host_selection_mode: "inferred",
    proposed_host_confidence: "medium",
    proposed_integration_mode: "reimplement",
    rollback: "Revert the follow-up.",
    no_op_path: "Do nothing.",
    review_cadence: "Next pass.",
    current_status: "pending_review",
  };
  const rendered = renderRuntimeFollowUpRecord(inferredRequest);
  assert.ok(
    rendered.includes("Host selection mode: `inferred`"),
    "inferred follow-up should contain host_selection_mode",
  );
  assert.ok(
    rendered.includes("Proposed host confidence: `medium`"),
    "inferred follow-up should contain proposed_host_confidence",
  );
  assert.ok(
    rendered.includes("Directive Workspace standalone host"),
    "inferred follow-up should contain the inferred host",
  );
  pass("regression: host inference fields render in follow-up record");

  // ─── Test 2: Manual-required renders without inference fields ───
  const manualRequest: RuntimeFollowUpRecordRequest = {
    ...inferredRequest,
    candidate_id: "test-manual-candidate",
    proposed_host: "pending_host_selection",
    host_selection_mode: undefined,
    proposed_host_confidence: undefined,
  };
  const manualRendered = renderRuntimeFollowUpRecord(manualRequest);
  assert.ok(
    manualRendered.includes("pending_host_selection"),
    "manual follow-up should contain pending_host_selection",
  );
  assert.ok(
    !manualRendered.includes("Host selection mode"),
    "manual follow-up without host_selection_mode should omit that field",
  );
  pass("negative: manual_required omits inference metadata when not set");

  // ─── Test 3: Host selection resolution write/read cycle ───
  const testPromotionReadinessPath =
    "runtime/05-promotion-readiness/2026-04-07-test-host-resolution-candidate-promotion-readiness.md";
  const testPromotionReadinessAbsolutePath =
    path.join(DIRECTIVE_ROOT, testPromotionReadinessPath);

  // Create a minimal promotion-readiness stub for the test
  fs.mkdirSync(path.dirname(testPromotionReadinessAbsolutePath), { recursive: true });
  fs.writeFileSync(
    testPromotionReadinessAbsolutePath,
    [
      "# Test Candidate Promotion Readiness",
      "",
      "- Candidate id: test-host-resolution-candidate",
      "- Candidate name: Test Host Resolution Candidate",
      "- Proposed host: `pending_host_selection`",
      "- Host selection mode: `manual_required`",
      "- Proposed host confidence: `low`",
      "",
    ].join("\n"),
    "utf8",
  );
  cleanupPaths.push(testPromotionReadinessAbsolutePath);

  const resolutionResult = writeRuntimeHostSelectionResolution({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath: testPromotionReadinessPath,
    decision: "select_standalone",
    selectedHost: "",
    rationale: "Test: standalone host is appropriate for this filesystem-based candidate.",
    reviewedBy: "test-operator",
  });

  assert.equal(resolutionResult.ok, true);
  assert.equal(resolutionResult.created, true);
  assert.equal(
    resolutionResult.resolution.resolvedHost,
    "Directive Workspace standalone host (hosts/standalone-host/)",
  );
  assert.equal(resolutionResult.resolution.originalProposedHost, "pending_host_selection");
  cleanupPaths.push(
    path.join(DIRECTIVE_ROOT, resolutionResult.hostSelectionResolutionRelativePath),
  );
  pass("regression: host selection resolution writes and resolves host correctly");

  // ─── Test 4: Read back the resolution ───
  const readBack = readRuntimeHostSelectionResolution({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath: testPromotionReadinessPath,
  });
  assert.ok(readBack !== null, "read back should find the resolution");
  assert.equal(readBack!.resolvedHost, "Directive Workspace standalone host (hosts/standalone-host/)");
  assert.equal(readBack!.decision, "select_standalone");
  assert.equal(readBack!.originalProposedHost, "pending_host_selection");
  pass("regression: host selection resolution round-trips through write/read");

  // ─── Test 5: Resolution path derivation ───
  const derivedPath = resolveRuntimeHostSelectionResolutionPath({
    promotionReadinessPath: testPromotionReadinessPath,
  });
  assert.ok(
    derivedPath.endsWith("host-selection-resolution.md"),
    "derived path should end with host-selection-resolution.md",
  );
  assert.ok(
    derivedPath.startsWith("runtime/05-promotion-readiness/"),
    "derived path should stay in the promotion-readiness directory",
  );
  pass("boundary: resolution path derivation produces correct suffix");

  // ─── Test 6: Missing resolution returns null ───
  const nonExistentRead = readRuntimeHostSelectionResolution({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-01-01-nonexistent-candidate-promotion-readiness.md",
  });
  assert.equal(nonExistentRead, null, "missing resolution should return null");
  pass("negative: missing resolution returns null");

  // ─── Test 7: Defer decision preserves pending_host_selection ───
  // Clean up previous resolution first
  const deferResolutionPath = path.join(
    DIRECTIVE_ROOT,
    resolutionResult.hostSelectionResolutionRelativePath,
  );
  fs.unlinkSync(deferResolutionPath);
  cleanupPaths.splice(cleanupPaths.indexOf(deferResolutionPath), 1);

  const deferResult = writeRuntimeHostSelectionResolution({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath: testPromotionReadinessPath,
    decision: "defer",
    selectedHost: "",
    rationale: "Test: deferring host selection for now.",
    reviewedBy: "test-operator",
  });
  assert.equal(deferResult.resolution.resolvedHost, "pending_host_selection");
  assert.equal(deferResult.resolution.resolvedConfidence, "low");
  cleanupPaths.push(
    path.join(DIRECTIVE_ROOT, deferResult.hostSelectionResolutionRelativePath),
  );
  pass("negative: defer decision preserves pending_host_selection");

  // ─── Test 8: Live candidate with pending_host_selection in markdown ───
  // The promotion-readiness markdown still says pending_host_selection.
  // Whether a host selection resolution artifact exists determines the effective state.
  const livePromotionReadinessPath =
    "runtime/05-promotion-readiness/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-readiness.md";
  if (fs.existsSync(path.join(DIRECTIVE_ROOT, livePromotionReadinessPath))) {
    const livePrereqs = evaluatePreHostRuntimePromotionRecordPrerequisites({
      directiveRoot: DIRECTIVE_ROOT,
      promotionReadinessPath: livePromotionReadinessPath,
    });
    // The original markdown always says pending_host_selection
    assert.equal(livePrereqs.proposedHost, "pending_host_selection");

    // Check whether a resolution artifact exists for this candidate
    const liveResolution = readRuntimeHostSelectionResolution({
      directiveRoot: DIRECTIVE_ROOT,
      promotionReadinessPath: livePromotionReadinessPath,
    });

    if (liveResolution) {
      // Resolution exists: effective host should be resolved, hostSelected should be true
      assert.ok(
        livePrereqs.effectiveProposedHost !== "pending_host_selection",
        "live candidate with resolution should have effective host resolved",
      );
      assert.equal(livePrereqs.executionGuards.hostSelected, true);
      pass("live: candidate with resolution has effective host resolved and hostSelected true");
    } else {
      // No resolution: effective host stays pending, hostSelected should be false
      assert.equal(livePrereqs.effectiveProposedHost, "pending_host_selection");
      assert.equal(livePrereqs.executionGuards.hostSelected, false);
      assert.ok(
        livePrereqs.missingPrerequisites.includes("proposedHost"),
        "live candidate without resolution should still have proposedHost in missing prerequisites",
      );
      pass("live: candidate without resolution is correctly blocked with pending_host_selection");
    }
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checker: "runtime-host-selection-inference-and-resolution",
        assertionsPassed: assertions.length,
        assertions,
      },
      null,
      2,
    )}\n`,
  );
} catch (error) {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checker: "runtime-host-selection-inference-and-resolution",
        assertionsPassed: assertions.length,
        assertions,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exitCode = 1;
} finally {
  cleanup();
}
