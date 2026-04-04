import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveActionRunnerEvents,
  readDirectiveActionRunnerRecord,
} from "../shared/lib/directive-runner-state.ts";
import type { DiscoveryIntakeQueueEntry } from "../shared/lib/discovery-intake-queue-writer.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { readDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import { openDirectiveRuntimePromotionReadiness } from "../shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts";
import { runDirectiveRuntimePromotionReadinessWithRunner } from "../shared/lib/runtime-promotion-readiness-runner.ts";
import {
  copyRelativeFile,
  extractOpenedBy,
  readJson,
  uniqueRelativePaths,
  writeJson,
} from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CASE_UNDER_TEST = {
  candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  promotionReadinessPath: "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
} as const;

function seedRuntimePromotionDirectiveRoot(directiveRoot: string) {
  const queueDocument = readJson<{ entries: DiscoveryIntakeQueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );
  const queueEntry = queueDocument.entries.find((item) => item.candidate_id === CASE_UNDER_TEST.candidateId) ?? null;
  assert.ok(queueEntry, `Missing queue entry for ${CASE_UNDER_TEST.candidateId}`);
  const routing = readDirectiveDiscoveryRoutingArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    routingPath: queueEntry.routing_record_path ?? "",
  });
  const liveFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: CASE_UNDER_TEST.promotionReadinessPath,
  }).focus;
  assert.ok(liveFocus?.ok, `Live Runtime promotion-readiness state did not resolve for ${CASE_UNDER_TEST.candidateId}`);

  for (const relativePath of uniqueRelativePaths([
    queueEntry.intake_record_path,
    routing.linkedTriageRecord,
    queueEntry.routing_record_path,
    routing.engineRunRecordPath,
    routing.engineRunReportPath,
    CASE_UNDER_TEST.followUpPath,
    CASE_UNDER_TEST.runtimeRecordPath,
  ])) {
    copyRelativeFile(relativePath, DIRECTIVE_ROOT, directiveRoot, "Missing source file for runner copy");
  }

  writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), {
    status: "primary",
    updatedAt: "2026-03-29",
    entries: [
      {
        ...queueEntry,
        status: "routed",
        completed_at: null,
        result_record_path: CASE_UNDER_TEST.followUpPath,
      },
    ],
  });

  return {
    queueEntry,
    liveFocus,
    liveProofMarkdown: fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
      "utf8",
    ),
    liveCapabilityBoundaryMarkdown: fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
      "utf8",
    ),
    livePromotionReadinessMarkdown: fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.promotionReadinessPath),
      "utf8",
    ),
    proofOpenedBy: extractOpenedBy(
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
    ),
    boundaryOpenedBy: extractOpenedBy(
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath), "utf8"),
    ),
    promotionOpenedBy: extractOpenedBy(
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.promotionReadinessPath), "utf8"),
    ),
  };
}

function assertResolvedStateMatchesLive(input: {
  directiveRoot: string;
  liveFocus: NonNullable<ReturnType<typeof resolveDirectiveWorkspaceState>["focus"]>;
}) {
  const tempFocus = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    artifactPath: CASE_UNDER_TEST.promotionReadinessPath,
  }).focus;
  assert.ok(tempFocus?.ok, "Generated Runtime promotion-readiness state did not resolve");
  assert.equal(tempFocus.currentHead.artifactPath, input.liveFocus.currentHead.artifactPath);
  assert.equal(tempFocus.currentStage, input.liveFocus.currentStage);
  assert.equal(tempFocus.nextLegalStep, input.liveFocus.nextLegalStep);
}

function primeCapabilityBoundaryOpen(directiveRoot: string, proofOpenedBy: string, boundaryOpenedBy: string) {
  openDirectiveRuntimeRecordProof({
    directiveRoot,
    runtimeRecordPath: CASE_UNDER_TEST.runtimeRecordPath,
    approved: true,
    approvedBy: proofOpenedBy,
  });
  openDirectiveRuntimeProofRuntimeCapabilityBoundary({
    directiveRoot,
    runtimeProofPath: CASE_UNDER_TEST.runtimeProofPath,
    approved: true,
    approvedBy: boundaryOpenedBy,
  });
}

function scenarioDirectBaseline() {
  withTempDirectiveRoot({ prefix: "directive-runtime-promotion-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimePromotionDirectiveRoot(directiveRoot);
    primeCapabilityBoundaryOpen(directiveRoot, seeded.proofOpenedBy, seeded.boundaryOpenedBy);
    const result = openDirectiveRuntimePromotionReadiness({
      directiveRoot,
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
    });

    assert.equal(result.created, true, "Direct promotion-readiness opener should create the promotion artifact");
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.promotionReadinessPath), "utf8"),
      seeded.livePromotionReadinessMarkdown,
    );
    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioFreshRunner() {
  withTempDirectiveRoot({ prefix: "directive-runtime-promotion-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimePromotionDirectiveRoot(directiveRoot);
    primeCapabilityBoundaryOpen(directiveRoot, seeded.proofOpenedBy, seeded.boundaryOpenedBy);
    const runnerId = "runtime-promotion-runner-fresh";
    const result = runDirectiveRuntimePromotionReadinessWithRunner({
      directiveRoot,
      runnerId,
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
    });

    assert.equal(result.ok, true);
    assert.equal(result.replayedFromCheckpoint, false);
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.promotionReadinessPath), "utf8"),
      seeded.livePromotionReadinessMarkdown,
    );

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "Fresh promotion runner record should exist");
    assert.equal(runnerRecord.lifecycleState, "completed");
    assert.equal(runnerRecord.checkpointStage, "completed");
    assert.equal(runnerRecord.attempts, 1);

    const runnerEvents = readDirectiveActionRunnerEvents({
      directiveRoot,
      runnerId,
    }).events.map((event) => event.eventType);
    assert.deepEqual(runnerEvents, [
      "runner_invoked",
      "before_action_checkpointed",
      "after_action_checkpointed",
      "runner_completed",
    ]);

    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioInterruptedBeforeActionThenResumed() {
  withTempDirectiveRoot({ prefix: "directive-runtime-promotion-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimePromotionDirectiveRoot(directiveRoot);
    primeCapabilityBoundaryOpen(directiveRoot, seeded.proofOpenedBy, seeded.boundaryOpenedBy);
    const runnerId = "runtime-promotion-runner-before-action";
    const interrupted = runDirectiveRuntimePromotionReadinessWithRunner({
      directiveRoot,
      runnerId,
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
      testInterruptPoint: "after_before_action_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "before_action");
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.promotionReadinessPath)),
      false,
      "Interrupted-before-action run must not create the promotion-readiness artifact",
    );

    const resumed = runDirectiveRuntimePromotionReadinessWithRunner({
      directiveRoot,
      runnerId,
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
    });
    assert.equal(resumed.ok, true);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, false);

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "Resumed promotion runner record should exist");
    assert.equal(runnerRecord.lifecycleState, "completed");
    assert.equal(runnerRecord.attempts, 2);

    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.promotionReadinessPath), "utf8"),
      seeded.livePromotionReadinessMarkdown,
    );
    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioInterruptedAfterActionThenResumed() {
  withTempDirectiveRoot({ prefix: "directive-runtime-promotion-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimePromotionDirectiveRoot(directiveRoot);
    primeCapabilityBoundaryOpen(directiveRoot, seeded.proofOpenedBy, seeded.boundaryOpenedBy);
    const runnerId = "runtime-promotion-runner-after-action";
    const interrupted = runDirectiveRuntimePromotionReadinessWithRunner({
      directiveRoot,
      runnerId,
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
      testInterruptPoint: "after_after_action_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "after_action");
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.promotionReadinessPath), "utf8"),
      seeded.livePromotionReadinessMarkdown,
    );

    const resumed = runDirectiveRuntimePromotionReadinessWithRunner({
      directiveRoot,
      runnerId,
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
    });
    assert.equal(resumed.ok, true);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, true);

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "After-action promotion runner record should exist");
    assert.equal(runnerRecord.lifecycleState, "completed");
    assert.equal(runnerRecord.attempts, 1);

    const mirrorEvents = readDirectiveCaseMirrorEvents({
      directiveRoot,
      caseId: CASE_UNDER_TEST.candidateId,
    }).events.filter((event) => event.eventType === "runtime_promotion_readiness_opened");
    assert.equal(mirrorEvents.length, 1, "Resume from after_action must not re-open promotion readiness");

    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioApprovalAndStaleHeadGuards() {
  withTempDirectiveRoot({ prefix: "directive-runtime-promotion-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimePromotionDirectiveRoot(directiveRoot);
    primeCapabilityBoundaryOpen(directiveRoot, seeded.proofOpenedBy, seeded.boundaryOpenedBy);

    const missingApprovalRunnerId = "runtime-promotion-runner-missing-approval";
    assert.throws(
      () =>
        runDirectiveRuntimePromotionReadinessWithRunner({
          directiveRoot,
          runnerId: missingApprovalRunnerId,
          capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
        }),
      /explicit approval/i,
      "Promotion runner should keep the explicit approval guard",
    );
    assert.equal(
      readDirectiveActionRunnerRecord({
        directiveRoot,
        runnerId: missingApprovalRunnerId,
      }).record,
      null,
      "Missing approval must not create runner state",
    );

    runDirectiveRuntimePromotionReadinessWithRunner({
      directiveRoot,
      runnerId: "runtime-promotion-runner-success-first",
      capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: seeded.promotionOpenedBy,
    });

    const staleRunnerId = "runtime-promotion-runner-stale-head";
    assert.throws(
      () =>
        runDirectiveRuntimePromotionReadinessWithRunner({
          directiveRoot,
          runnerId: staleRunnerId,
          capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
          approved: true,
          approvedBy: seeded.promotionOpenedBy,
        }),
      /live current stage/i,
      "Promotion runner should preserve stale-head guard behavior",
    );

    const failedRunnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: staleRunnerId,
    }).record;
    assert.ok(failedRunnerRecord, "Failed stale-head promotion runner should persist state");
    assert.equal(failedRunnerRecord.lifecycleState, "failed");
    assert.equal(failedRunnerRecord.checkpointStage, "before_action");
    assert.match(failedRunnerRecord.lastError?.message || "", /live current stage/i);
  });
}

function main() {
  scenarioDirectBaseline();
  scenarioFreshRunner();
  scenarioInterruptedBeforeActionThenResumed();
  scenarioInterruptedAfterActionThenResumed();
  scenarioApprovalAndStaleHeadGuards();

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      candidateId: CASE_UNDER_TEST.candidateId,
      opener: "runtime_promotion_readiness_open",
      runner: "checkpoint_resume_kernel",
      interruptionCoverage: [
        "before_action",
        "after_action",
      ],
      guardCoverage: [
        "explicit_approval",
        "stale_head",
      ],
    },
  }, null, 2)}\n`);
}

main();
