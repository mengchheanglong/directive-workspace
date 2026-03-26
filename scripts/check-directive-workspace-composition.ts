import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
  DIRECTIVE_WORKSPACE_PRODUCT_TRUTH,
} from "../engine/workspace-truth.ts";
import { readFrontendQueueOverview } from "../hosts/web-host/data.ts";
import { runDirectiveArchitectureCompositionCheck } from "./check-architecture-composition.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { openDirectiveDiscoveryRoute } from "../shared/lib/discovery-route-opener.ts";
import { openDirectiveRuntimeFollowUp } from "../shared/lib/runtime-follow-up-opener.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import { openDirectiveRuntimePromotionReadiness } from "../shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ARCHITECTURE_ROUTE_PATH =
  "discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md";
const RUNTIME_ROUTE_PATH =
  "discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md";
const ARCHITECTURE_EVALUATION_PATH =
  "architecture/09-post-consumption-evaluations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-evaluation.md";
const ARCHITECTURE_BOUNDED_RESULT_PATH =
  "architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md";
const RUNTIME_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md";
const RUNTIME_PROOF_PATH =
  "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md";
const RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH =
  "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md";
const RUNTIME_ROUTE_PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md";
const RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH =
  "runtime/04-capability-boundaries/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-runtime-capability-boundary.md";
const PRESSURE_KARPATHY_CANDIDATE_ID = "dw-pressure-karpathy-autoresearch-2026-03-25";
const PRESSURE_KARPATHY_HEAD_PATH =
  "architecture/02-experiments/2026-03-25-dw-pressure-karpathy-autoresearch-2026-03-25-bounded-result.md";
const PRESSURE_MINI_SWE_CANDIDATE_ID = "dw-pressure-mini-swe-agent-2026-03-25";
const PRESSURE_MINI_SWE_HEAD_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-promotion-readiness.md";
const PRESSURE_PAPERCODER_CANDIDATE_ID = "dw-pressure-papercoder-2026-03-25";
const PRESSURE_PAPERCODER_HEAD_PATH =
  "architecture/02-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result.md";

function uniqueRelativePaths(paths: Array<string | null | undefined>) {
  return [...new Set(paths.filter((value): value is string => Boolean(value)))];
}

function expectFocus(relativePath: string, directiveRoot = DIRECTIVE_ROOT) {
  const report = resolveDirectiveWorkspaceState({
    directiveRoot,
    artifactPath: relativePath,
  });
  assert.ok(report.focus, `missing focus for ${relativePath}`);
  return report.focus;
}

function expectNoDrift(relativePath: string, focus: ReturnType<typeof expectFocus>) {
  assert.equal(
    focus.integrityState,
    "ok",
    `${relativePath} unexpectedly resolved as broken: ${focus.inconsistentLinks.join(", ")}`,
  );
  assert.equal(
    focus.missingExpectedArtifacts.length,
    0,
    `${relativePath} is missing expected artifacts: ${focus.missingExpectedArtifacts.join(", ")}`,
  );
  assert.equal(
    focus.inconsistentLinks.length,
    0,
    `${relativePath} has inconsistent links: ${focus.inconsistentLinks.join(", ")}`,
  );
}

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyRelativeFile(relativePath: string, stagedRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`copy source missing: ${relativePath}`);
  }
  const targetPath = path.join(stagedRoot, relativePath);
  ensureParentDir(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
}

function writeRelativeFile(relativePath: string, stagedRoot: string, transform: (content: string) => string) {
  const targetPath = path.join(stagedRoot, relativePath);
  const existing = fs.readFileSync(targetPath, "utf8");
  fs.writeFileSync(targetPath, transform(existing), "utf8");
}

function withStagedDirectiveRoot(label: string, run: (stagedRoot: string) => void) {
  const stagedRoot = fs.mkdtempSync(path.join(os.tmpdir(), `directive-workspace-${label}-`));
  try {
    run(stagedRoot);
  } finally {
    fs.rmSync(stagedRoot, { recursive: true, force: true });
  }
}

function expectBlockedAdvancement(relativePath: string, focus: ReturnType<typeof expectFocus>) {
  assert.equal(focus.integrityState, "broken", `${relativePath} should resolve as broken`);
  assert.equal(
    focus.artifactNextLegalStep,
    DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
    `${relativePath} still exposes an optimistic artifact-local next step: ${focus.artifactNextLegalStep}`,
  );
  assert.equal(
    focus.nextLegalStep,
    DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
    `${relativePath} still exposes an optimistic case-level next step: ${focus.nextLegalStep}`,
  );
}

function main() {
  runDirectiveArchitectureCompositionCheck();

  const overview = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
  });
  assert.ok(overview.ok, "Directive Workspace overview resolver failed");
  assert.ok(overview.anchors.length >= 4, "Expected at least four canonical product anchors");
  assert.deepEqual(
    overview.product.fieldInterpretation,
    DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.fieldInterpretation,
    "Overview field-interpretation semantics drifted away from the Engine-owned truth catalog",
  );
  assert.deepEqual(
    overview.product.proven,
    [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.proven],
    "Overview proven-state catalog drifted away from the Engine-owned truth catalog",
  );
  assert.deepEqual(
    overview.product.partiallyBuilt,
    [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.partiallyBuilt],
    "Overview partially-built catalog drifted away from the Engine-owned truth catalog",
  );
  assert.deepEqual(
    overview.product.intentionallyMinimal,
    [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.intentionallyMinimal],
    "Overview intentionally-minimal catalog drifted away from the Engine-owned truth catalog",
  );
  assert.equal(
    overview.product.fieldInterpretation.currentHead,
    DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.fieldInterpretation.currentHead,
    "Overview current-head interpretation drifted away from the Engine-owned truth catalog",
  );

  const architectureRoute = expectFocus(ARCHITECTURE_ROUTE_PATH);
  assert.equal(architectureRoute.lane, "discovery");
  assert.equal(architectureRoute.routeTarget, "architecture");
  assert.equal(architectureRoute.artifactStage, "discovery.route.architecture");
  assert.ok(
    architectureRoute.currentStage.startsWith("architecture."),
    `Architecture route did not resolve downstream Architecture truth: ${architectureRoute.currentStage}`,
  );
  assert.ok(
    architectureRoute.nextLegalStep.includes("Architecture")
    || architectureRoute.nextLegalStep.includes("bounded closeout")
    || architectureRoute.nextLegalStep.includes("bounded result")
    || architectureRoute.nextLegalStep.includes("implementation target")
    || architectureRoute.nextLegalStep.includes("implementation result")
    || architectureRoute.nextLegalStep.includes("retention")
    || architectureRoute.nextLegalStep.includes("integration record")
    || architectureRoute.nextLegalStep.includes("consumption"),
    `Architecture route next step is not explicit enough: ${architectureRoute.nextLegalStep}`,
  );
  assert.ok(architectureRoute.linkedArtifacts.discoveryIntakePath);
  assert.ok(architectureRoute.linkedArtifacts.engineRunRecordPath);
  expectNoDrift(ARCHITECTURE_ROUTE_PATH, architectureRoute);

  const runtimeRoute = expectFocus(RUNTIME_ROUTE_PATH);
  assert.equal(runtimeRoute.lane, "discovery");
  assert.equal(runtimeRoute.routeTarget, "runtime");
  assert.equal(runtimeRoute.artifactStage, "discovery.route.runtime");
  assert.equal(runtimeRoute.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimeRoute.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime route next step is not honest about the current seam: ${runtimeRoute.nextLegalStep}`,
  );
  assert.ok(runtimeRoute.linkedArtifacts.runtimeFollowUpPath);
  assert.ok(runtimeRoute.linkedArtifacts.runtimeRecordPath);
  assert.ok(runtimeRoute.linkedArtifacts.runtimeProofPath);
  assert.equal(
    runtimeRoute.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
    RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
  );
  assert.equal(
    runtimeRoute.linkedArtifacts.runtimePromotionReadinessPath,
    RUNTIME_ROUTE_PROMOTION_READINESS_PATH,
  );
  expectNoDrift(RUNTIME_ROUTE_PATH, runtimeRoute);

  const architectureEvaluation = expectFocus(ARCHITECTURE_EVALUATION_PATH);
  assert.equal(architectureEvaluation.lane, "architecture");
  assert.equal(architectureEvaluation.currentStage, "architecture.post_consumption_evaluation.keep");
  assert.ok(
    architectureEvaluation.nextLegalStep.includes("No automatic Architecture step is open"),
    `Architecture evaluation overstates downstream movement: ${architectureEvaluation.nextLegalStep}`,
  );
  assert.ok(architectureEvaluation.linkedArtifacts.architectureIntegrationRecordPath);
  assert.ok(architectureEvaluation.linkedArtifacts.architectureEvaluationPath);
  expectNoDrift(ARCHITECTURE_EVALUATION_PATH, architectureEvaluation);

  const architectureBoundedResult = expectFocus(ARCHITECTURE_BOUNDED_RESULT_PATH);
  assert.equal(architectureBoundedResult.lane, "architecture");
  assert.equal(architectureBoundedResult.artifactStage, "architecture.bounded_result.stay_experimental");
  assert.equal(architectureBoundedResult.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.equal(
    architectureBoundedResult.missingExpectedArtifacts.length,
    0,
    "Architecture bounded result should not demand a continuation artifact after the chain already moved into adoption/materialization",
  );
  expectNoDrift(ARCHITECTURE_BOUNDED_RESULT_PATH, architectureBoundedResult);

  const runtimeFollowUp = expectFocus(RUNTIME_FOLLOW_UP_PATH);
  assert.equal(runtimeFollowUp.lane, "runtime");
  assert.equal(runtimeFollowUp.artifactStage, "runtime.follow_up.pending_review");
  assert.equal(runtimeFollowUp.currentStage, "runtime.promotion_readiness.opened");
  expectNoDrift(RUNTIME_FOLLOW_UP_PATH, runtimeFollowUp);

  const runtimeProof = expectFocus(RUNTIME_PROOF_PATH);
  assert.equal(runtimeProof.lane, "runtime");
  assert.equal(runtimeProof.artifactStage, "runtime.proof.opened");
  assert.equal(runtimeProof.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimeProof.artifactNextLegalStep.includes("runtime capability boundary"),
    `Runtime proof artifact-local next step drifted: ${runtimeProof.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeProof.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime proof next step drifted: ${runtimeProof.nextLegalStep}`,
  );
  assert.ok(runtimeProof.linkedArtifacts.runtimeRecordPath);
  assert.equal(
    runtimeProof.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
    RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
  );
  assert.equal(
    runtimeProof.linkedArtifacts.runtimePromotionReadinessPath,
    RUNTIME_ROUTE_PROMOTION_READINESS_PATH,
  );
  expectNoDrift(RUNTIME_PROOF_PATH, runtimeProof);

  const runtimeRouteCapabilityBoundary = expectFocus(RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH);
  assert.equal(runtimeRouteCapabilityBoundary.lane, "runtime");
  assert.equal(runtimeRouteCapabilityBoundary.artifactStage, "runtime.runtime_capability_boundary.opened");
  assert.equal(
    runtimeRouteCapabilityBoundary.currentStage,
    "runtime.promotion_readiness.opened",
  );
  assert.ok(
    runtimeRouteCapabilityBoundary.artifactNextLegalStep.includes("promotion-readiness artifact"),
    `Runtime runtime capability boundary artifact-local next step drifted: ${runtimeRouteCapabilityBoundary.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeRouteCapabilityBoundary.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime route capability boundary overstates downstream movement: ${runtimeRouteCapabilityBoundary.nextLegalStep}`,
  );
  expectNoDrift(RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH, runtimeRouteCapabilityBoundary);

  const runtimePromotionReadiness = expectFocus(RUNTIME_ROUTE_PROMOTION_READINESS_PATH);
  assert.equal(runtimePromotionReadiness.lane, "runtime");
  assert.equal(runtimePromotionReadiness.artifactStage, "runtime.promotion_readiness.opened");
  assert.equal(runtimePromotionReadiness.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimePromotionReadiness.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime promotion-readiness next step drifted: ${runtimePromotionReadiness.nextLegalStep}`,
  );
  assert.equal(
    runtimePromotionReadiness.runtime?.proposedHost,
    "pending_host_selection",
    "Runtime promotion-readiness should expose the unresolved proposed host through the shared resolver",
  );
  assert.ok(
    runtimePromotionReadiness.runtime?.promotionReadinessBlockers.includes("proposed_host_pending_selection"),
    `Runtime promotion-readiness should expose the pending-host blocker, got: ${runtimePromotionReadiness.runtime?.promotionReadinessBlockers.join(", ")}`,
  );
  assert.ok(
    runtimePromotionReadiness.runtime?.promotionReadinessBlockers.includes("host_facing_promotion_unopened"),
    `Runtime promotion-readiness should expose that host-facing promotion remains unopened, got: ${runtimePromotionReadiness.runtime?.promotionReadinessBlockers.join(", ")}`,
  );
  expectNoDrift(RUNTIME_ROUTE_PROMOTION_READINESS_PATH, runtimePromotionReadiness);

  const runtimeCapabilityBoundary = expectFocus(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH);
  assert.equal(runtimeCapabilityBoundary.lane, "runtime");
  assert.equal(
    runtimeCapabilityBoundary.currentStage,
    "runtime.runtime_capability_boundary.opened",
  );
  assert.ok(
    runtimeCapabilityBoundary.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime capability boundary overstates downstream movement: ${runtimeCapabilityBoundary.nextLegalStep}`,
  );
  assert.ok(runtimeCapabilityBoundary.linkedArtifacts.runtimeCallableStubPath);
  expectNoDrift(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, runtimeCapabilityBoundary);

  const queueOverview = readFrontendQueueOverview({
    directiveRoot: DIRECTIVE_ROOT,
    maxEntries: 500,
  });
  const pressureKarpathyEntry = queueOverview.entries.find((entry) => entry.candidate_id === PRESSURE_KARPATHY_CANDIDATE_ID);
  assert.ok(pressureKarpathyEntry, "Missing queue entry for pressure-run Karpathy case");
  assert.equal(
    pressureKarpathyEntry.current_head?.artifact_path,
    PRESSURE_KARPATHY_HEAD_PATH,
    "Queue current head should point at the Architecture bounded result for the Karpathy pressure-run case",
  );
  assert.equal(
    pressureKarpathyEntry.current_head?.artifact_stage,
    "architecture.bounded_result.stay_experimental",
    "Queue current head stage should reflect the Architecture bounded result stage for the Karpathy pressure-run case",
  );
  assert.equal(
    pressureKarpathyEntry.current_case_stage,
    "architecture.bounded_result.stay_experimental",
    "Queue case stage should reflect the current Architecture case state for the Karpathy pressure-run case",
  );
  assert.notEqual(
    pressureKarpathyEntry.result_record_path,
    pressureKarpathyEntry.current_head?.artifact_path,
    "Karpathy pressure-run case should distinguish the first downstream stub from the live current artifact",
  );

  const pressureMiniSweEntry = queueOverview.entries.find((entry) => entry.candidate_id === PRESSURE_MINI_SWE_CANDIDATE_ID);
  assert.ok(pressureMiniSweEntry, "Missing queue entry for pressure-run mini-swe-agent case");
  assert.equal(
    pressureMiniSweEntry.current_head?.artifact_path,
    PRESSURE_MINI_SWE_HEAD_PATH,
    "Queue current head should point at promotion-readiness for the mini-swe-agent pressure-run case",
  );
  assert.equal(
    pressureMiniSweEntry.current_head?.artifact_stage,
    "runtime.promotion_readiness.opened",
    "Queue current head stage should reflect Runtime promotion-readiness for the mini-swe-agent pressure-run case",
  );
  assert.equal(
    pressureMiniSweEntry.current_case_stage,
    "runtime.promotion_readiness.opened",
    "Queue case stage should reflect Runtime promotion-readiness for the mini-swe-agent pressure-run case",
  );
  assert.notEqual(
    pressureMiniSweEntry.result_record_path,
    pressureMiniSweEntry.current_head?.artifact_path,
    "mini-swe-agent pressure-run case should distinguish the first Runtime stub from the live current artifact",
  );

  const pressurePaperCoderEntry = queueOverview.entries.find((entry) => entry.candidate_id === PRESSURE_PAPERCODER_CANDIDATE_ID);
  assert.ok(pressurePaperCoderEntry, "Missing queue entry for pressure-run PaperCoder case");
  assert.equal(
    pressurePaperCoderEntry.current_head?.artifact_path,
    PRESSURE_PAPERCODER_HEAD_PATH,
    "Queue current head should point at the Architecture bounded result for the PaperCoder pressure-run case",
  );
  assert.equal(
    pressurePaperCoderEntry.current_head?.artifact_stage,
    "architecture.bounded_result.adopt",
    "Queue current head stage should reflect the Architecture bounded result stage for the PaperCoder pressure-run case",
  );
  assert.equal(
    pressurePaperCoderEntry.current_case_stage,
    "architecture.bounded_result.adopt",
    "Queue case stage should reflect the Architecture bounded result state for the PaperCoder pressure-run case",
  );

  const runtimeRecordPath = runtimeFollowUp.linkedArtifacts.runtimeRecordPath;
  assert.ok(runtimeRecordPath, "Runtime follow-up should resolve a Runtime v0 record path");

  withStagedDirectiveRoot("negative-route-mismatch", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      "discovery/intake-queue.json",
      ...Object.values(runtimeRoute.linkedArtifacts),
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile("discovery/intake-queue.json", stagedRoot, (content) => {
      const payload = JSON.parse(content) as { entries?: Array<Record<string, unknown>> };
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      const targetEntry = entries.find((entry) => entry.candidate_id === runtimeRoute.candidateId);
      assert.ok(targetEntry, "Expected staged queue entry for Runtime route negative case");
      targetEntry.routing_target = "architecture";
      return `${JSON.stringify(payload, null, 2)}\n`;
    });

    const brokenRoute = expectFocus(RUNTIME_ROUTE_PATH, stagedRoot);
    expectBlockedAdvancement(RUNTIME_ROUTE_PATH, brokenRoute);
    assert.ok(
      brokenRoute.inconsistentLinks.some((entry) => entry.includes("queue routing target")),
      `Expected queue mismatch to be detected, got: ${brokenRoute.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("negative-runtime-record-link", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      runtimeRecordPath,
      runtimeFollowUp.linkedArtifacts.runtimeProofPath,
      runtimeFollowUp.linkedArtifacts.discoveryRoutingPath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile(runtimeRecordPath, stagedRoot, (content) =>
      content.replace(
        /^- Source follow-up record: .+$/m,
        "- Source follow-up record: runtime/follow-up/missing-runtime-follow-up-record.md",
      ));

    const brokenRuntimeRecord = expectFocus(runtimeRecordPath, stagedRoot);
    expectBlockedAdvancement(runtimeRecordPath, brokenRuntimeRecord);
    assert.ok(
      brokenRuntimeRecord.inconsistentLinks.some((entry) => entry.includes("linked follow-up artifact")),
      `Expected missing follow-up link to be detected, got: ${brokenRuntimeRecord.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("negative-capability-boundary-link", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH,
      runtimeCapabilityBoundary.linkedArtifacts.runtimeRecordPath,
      runtimeCapabilityBoundary.linkedArtifacts.runtimeCallableStubPath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, stagedRoot, (content) =>
      content.replace(
        /^- Proof artifact: .+$/m,
        "- Proof artifact: runtime/03-proof/missing-proof-artifact.md",
      ));

    const brokenCapabilityBoundary = expectFocus(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, stagedRoot);
    expectBlockedAdvancement(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, brokenCapabilityBoundary);
    assert.ok(
      brokenCapabilityBoundary.inconsistentLinks.some((entry) => entry.includes("missing linked Runtime proof artifact")),
      `Expected missing Runtime proof artifact to be detected, got: ${brokenCapabilityBoundary.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("negative-malformed-runtime-record", (stagedRoot) => {
    copyRelativeFile(runtimeRecordPath, stagedRoot);
    writeRelativeFile(runtimeRecordPath, stagedRoot, (content) =>
      content.replace(/^- Current status: .+\r?\n/m, ""),
    );

    assert.throws(
      () => expectFocus(runtimeRecordPath, stagedRoot),
      /current status/i,
      "Malformed Runtime record should fail clearly",
    );
  });

  assert.throws(
    () =>
      resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: path.resolve(DIRECTIVE_ROOT, "..", "CLAUDE.md"),
      }),
    /must stay within directive-workspace/i,
    "Artifact paths outside directive-workspace should be rejected",
  );

  withStagedDirectiveRoot("route-opener-approval-idempotency", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      runtimeRoute.linkedArtifacts.discoveryIntakePath,
      runtimeRoute.linkedArtifacts.discoveryTriagePath,
      runtimeRoute.linkedArtifacts.engineRunRecordPath,
      runtimeRoute.linkedArtifacts.engineRunReportPath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () => openDirectiveDiscoveryRoute({ directiveRoot: stagedRoot, routingPath: RUNTIME_ROUTE_PATH }),
      /explicit approval/i,
      "Discovery route opener should require explicit approval",
    );

    const first = openDirectiveDiscoveryRoute({
      directiveRoot: stagedRoot,
      routingPath: RUNTIME_ROUTE_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(first.created, true, "Discovery route opener should create the downstream stub on first approval");

    const second = openDirectiveDiscoveryRoute({
      directiveRoot: stagedRoot,
      routingPath: RUNTIME_ROUTE_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(second.created, false, "Discovery route opener should be idempotent on repeated approval");
  });

  withStagedDirectiveRoot("follow-up-opener-approval-idempotency", (stagedRoot) => {
    copyRelativeFile(RUNTIME_FOLLOW_UP_PATH, stagedRoot);

    assert.throws(
      () => openDirectiveRuntimeFollowUp({ directiveRoot: stagedRoot, followUpPath: RUNTIME_FOLLOW_UP_PATH }),
      /explicit approval/i,
      "Runtime follow-up opener should require explicit approval",
    );

    const first = openDirectiveRuntimeFollowUp({
      directiveRoot: stagedRoot,
      followUpPath: RUNTIME_FOLLOW_UP_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(first.created, true, "Runtime follow-up opener should create the Runtime record on first approval");

    const second = openDirectiveRuntimeFollowUp({
      directiveRoot: stagedRoot,
      followUpPath: RUNTIME_FOLLOW_UP_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(second.created, false, "Runtime follow-up opener should be idempotent on repeated approval");
  });

  assert.ok(runtimeFollowUp.linkedArtifacts.runtimeRecordPath, "Runtime follow-up should resolve a Runtime record path");
  withStagedDirectiveRoot("runtime-record-opener-approval-idempotency", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      runtimeFollowUp.linkedArtifacts.runtimeRecordPath,
      RUNTIME_FOLLOW_UP_PATH,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () =>
        openDirectiveRuntimeRecordProof({
          directiveRoot: stagedRoot,
          runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
        }),
      /explicit approval/i,
      "Runtime record opener should require explicit approval",
    );

    const first = openDirectiveRuntimeRecordProof({
      directiveRoot: stagedRoot,
      runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(first.created, true, "Runtime record opener should create the proof artifact on first approval");

    const second = openDirectiveRuntimeRecordProof({
      directiveRoot: stagedRoot,
      runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(second.created, false, "Runtime record opener should be idempotent on repeated approval");
  });

  withStagedDirectiveRoot("runtime-proof-opener-approval-idempotency", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_PROOF_PATH,
      runtimeProof.linkedArtifacts.runtimeRecordPath,
      runtimeProof.linkedArtifacts.runtimeFollowUpPath,
      runtimeProof.linkedArtifacts.discoveryRoutingPath,
      runtimeProof.linkedArtifacts.discoveryIntakePath,
      runtimeProof.linkedArtifacts.engineRunRecordPath,
      runtimeProof.linkedArtifacts.engineRunReportPath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () =>
        openDirectiveRuntimeProofRuntimeCapabilityBoundary({
          directiveRoot: stagedRoot,
          runtimeProofPath: RUNTIME_PROOF_PATH,
        }),
      /explicit approval/i,
      "Runtime proof opener should require explicit approval",
    );

    const first = openDirectiveRuntimeProofRuntimeCapabilityBoundary({
      directiveRoot: stagedRoot,
      runtimeProofPath: RUNTIME_PROOF_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(
      first.created,
      true,
      "Runtime proof opener should create the runtime capability boundary on first approval",
    );

    const second = openDirectiveRuntimeProofRuntimeCapabilityBoundary({
      directiveRoot: stagedRoot,
      runtimeProofPath: RUNTIME_PROOF_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(
      second.created,
      false,
      "Runtime proof opener should be idempotent on repeated approval",
    );
  });

  withStagedDirectiveRoot("runtime-promotion-readiness-opener-approval-idempotency", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
      runtimeRouteCapabilityBoundary.linkedArtifacts.runtimeProofPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.runtimeRecordPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.runtimeFollowUpPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.discoveryRoutingPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.discoveryIntakePath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.engineRunRecordPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.engineRunReportPath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () =>
        openDirectiveRuntimePromotionReadiness({
          directiveRoot: stagedRoot,
          capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
        }),
      /explicit approval/i,
      "Runtime promotion-readiness opener should require explicit approval",
    );

    const first = openDirectiveRuntimePromotionReadiness({
      directiveRoot: stagedRoot,
      capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(
      first.created,
      true,
      "Runtime promotion-readiness opener should create the promotion-readiness artifact on first approval",
    );

    const second = openDirectiveRuntimePromotionReadiness({
      directiveRoot: stagedRoot,
      capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(
      second.created,
      false,
      "Runtime promotion-readiness opener should be idempotent on repeated approval",
    );
  });

  assert.throws(
    () =>
      openDirectiveRuntimeFollowUp({
        directiveRoot: DIRECTIVE_ROOT,
        followUpPath: path.resolve(DIRECTIVE_ROOT, "..", "CLAUDE.md"),
        approved: true,
      }),
    /must stay within directive-workspace/i,
    "Openers should reject out-of-root paths through the shared approval-boundary helper",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        directiveRoot: DIRECTIVE_ROOT,
        anchorsChecked: [
          ARCHITECTURE_ROUTE_PATH,
          RUNTIME_ROUTE_PATH,
          ARCHITECTURE_EVALUATION_PATH,
          ARCHITECTURE_BOUNDED_RESULT_PATH,
          RUNTIME_FOLLOW_UP_PATH,
          RUNTIME_PROOF_PATH,
          RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
          RUNTIME_ROUTE_PROMOTION_READINESS_PATH,
          RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH,
        ],
        negativeCasesChecked: [
          "discovery queue routing mismatch blocks advancement",
          "runtime record missing linked follow-up blocks advancement",
          "runtime capability boundary missing linked proof blocks advancement",
          "malformed Runtime record fails clearly",
          "artifact path containment is enforced",
        ],
        openerSemanticsChecked: [
          "discovery route opener requires approval and stays idempotent",
          "runtime follow-up opener requires approval and stays idempotent",
          "runtime record proof opener requires approval and stays idempotent",
          "runtime proof boundary opener requires approval and stays idempotent",
          "runtime promotion-readiness opener requires approval and stays idempotent",
          "openers reject out-of-root paths",
        ],
        overview: {
          totalEngineRuns: overview.engine.totalRuns,
          anchorCount: overview.anchors.length,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
