import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveActionRunnerEvents,
  readDirectiveActionRunnerRecord,
} from "../../shared/lib/directive-runner-state.ts";
import type { DiscoveryIntakeQueueEntry } from "../../shared/lib/discovery-intake-queue-writer.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../../shared/lib/dw-state.ts";
import { readDirectiveCaseMirrorEvents } from "../../shared/lib/case-event-log.ts";
import { openDirectiveRuntimeFollowUp } from "../../shared/lib/runtime-follow-up-opener.ts";
import { runDirectiveRuntimeFollowUpWithRunner } from "../../shared/lib/runtime-follow-up-runner.ts";
import {
  copyRelativeFile,
  extractReviewedBy,
  readJson,
  uniqueRelativePaths,
  writeJson,
} from "../checker-test-helpers.ts";
import { withTempDirectiveRoot } from "../temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CASE_UNDER_TEST = {
  candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
} as const;

function seedRuntimeFollowUpDirectiveRoot(directiveRoot: string) {
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
    artifactPath: CASE_UNDER_TEST.runtimeRecordPath,
  }).focus;
  assert.ok(liveFocus?.ok, `Live Runtime state did not resolve for ${CASE_UNDER_TEST.candidateId}`);

  for (const relativePath of uniqueRelativePaths([
    queueEntry.intake_record_path,
    routing.linkedTriageRecord,
    queueEntry.routing_record_path,
    routing.engineRunRecordPath,
    routing.engineRunReportPath,
    CASE_UNDER_TEST.followUpPath,
    liveFocus.linkedArtifacts.runtimeProofPath,
    liveFocus.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
    liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
    liveFocus.linkedArtifacts.runtimePromotionRecordPath,
    liveFocus.linkedArtifacts.runtimePromotionSpecificationPath,
    liveFocus.linkedArtifacts.runtimeCallableStubPath,
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
    liveRuntimeRecord: fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath),
      "utf8",
    ),
    approvedBy: extractReviewedBy(
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      "Unable to parse Runtime review actor from runtime record",
    ),
  };
}

function assertResolvedStateMatchesLive(input: {
  directiveRoot: string;
  liveFocus: NonNullable<ReturnType<typeof resolveDirectiveWorkspaceState>["focus"]>;
}) {
  const tempFocus = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    artifactPath: CASE_UNDER_TEST.runtimeRecordPath,
  }).focus;
  assert.ok(tempFocus?.ok, "Generated Runtime state did not resolve");
  assert.equal(tempFocus.currentHead.artifactPath, input.liveFocus.currentHead.artifactPath);
  assert.equal(tempFocus.currentStage, input.liveFocus.currentStage);
  assert.equal(tempFocus.nextLegalStep, input.liveFocus.nextLegalStep);
}

function scenarioDirectBaseline() {
  withTempDirectiveRoot({ prefix: "directive-runtime-follow-up-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimeFollowUpDirectiveRoot(directiveRoot);
    const result = openDirectiveRuntimeFollowUp({
      directiveRoot,
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
    });

    assert.equal(result.created, true, "Direct opener should create the runtime record");
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      seeded.liveRuntimeRecord,
    );
    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioFreshRunner() {
  withTempDirectiveRoot({ prefix: "directive-runtime-follow-up-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimeFollowUpDirectiveRoot(directiveRoot);
    const runnerId = "runtime-follow-up-runner-fresh";
    const result = runDirectiveRuntimeFollowUpWithRunner({
      directiveRoot,
      runnerId,
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
    });

    assert.equal(result.ok, true);
    assert.equal(result.replayedFromCheckpoint, false);
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      seeded.liveRuntimeRecord,
    );

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "Fresh runner record should exist");
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
  withTempDirectiveRoot({ prefix: "directive-runtime-follow-up-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimeFollowUpDirectiveRoot(directiveRoot);
    const runnerId = "runtime-follow-up-runner-before-action";
    const interrupted = runDirectiveRuntimeFollowUpWithRunner({
      directiveRoot,
      runnerId,
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
      testInterruptPoint: "after_before_action_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "before_action");
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath)),
      false,
      "Interrupted-before-action run must not create the runtime record",
    );

    const resumed = runDirectiveRuntimeFollowUpWithRunner({
      directiveRoot,
      runnerId,
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
    });
    assert.equal(resumed.ok, true);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, false);

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "Resumed runner record should exist");
    assert.equal(runnerRecord.lifecycleState, "completed");
    assert.equal(runnerRecord.attempts, 2);

    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      seeded.liveRuntimeRecord,
    );
    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioInterruptedAfterActionThenResumed() {
  withTempDirectiveRoot({ prefix: "directive-runtime-follow-up-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimeFollowUpDirectiveRoot(directiveRoot);
    const runnerId = "runtime-follow-up-runner-after-action";
    const interrupted = runDirectiveRuntimeFollowUpWithRunner({
      directiveRoot,
      runnerId,
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
      testInterruptPoint: "after_after_action_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "after_action");
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      seeded.liveRuntimeRecord,
    );

    const resumed = runDirectiveRuntimeFollowUpWithRunner({
      directiveRoot,
      runnerId,
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
    });
    assert.equal(resumed.ok, true);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, true);

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "After-action runner record should exist");
    assert.equal(runnerRecord.lifecycleState, "completed");
    assert.equal(runnerRecord.attempts, 1);

    const mirrorEvents = readDirectiveCaseMirrorEvents({
      directiveRoot,
      caseId: CASE_UNDER_TEST.candidateId,
    }).events.filter((event) => event.eventType === "runtime_follow_up_opened");
    assert.equal(mirrorEvents.length, 1, "Resume from after_action must not re-open the Runtime follow-up");

    assertResolvedStateMatchesLive({
      directiveRoot,
      liveFocus: seeded.liveFocus,
    });
  });
}

function scenarioApprovalAndStaleHeadGuards() {
  withTempDirectiveRoot({ prefix: "directive-runtime-follow-up-runner-" }, (directiveRoot) => {
    const seeded = seedRuntimeFollowUpDirectiveRoot(directiveRoot);
    const missingApprovalRunnerId = "runtime-follow-up-runner-missing-approval";
    assert.throws(
      () =>
        runDirectiveRuntimeFollowUpWithRunner({
          directiveRoot,
          runnerId: missingApprovalRunnerId,
          followUpPath: CASE_UNDER_TEST.followUpPath,
        }),
      /explicit approval/i,
      "Runner should keep the explicit approval guard",
    );
    assert.equal(
      readDirectiveActionRunnerRecord({
        directiveRoot,
        runnerId: missingApprovalRunnerId,
      }).record,
      null,
      "Missing approval must not create runner state",
    );

    runDirectiveRuntimeFollowUpWithRunner({
      directiveRoot,
      runnerId: "runtime-follow-up-runner-success-first",
      followUpPath: CASE_UNDER_TEST.followUpPath,
      approved: true,
      approvedBy: seeded.approvedBy,
    });

    const staleRunnerId = "runtime-follow-up-runner-stale-head";
    assert.throws(
      () =>
        runDirectiveRuntimeFollowUpWithRunner({
          directiveRoot,
          runnerId: staleRunnerId,
          followUpPath: CASE_UNDER_TEST.followUpPath,
          approved: true,
          approvedBy: seeded.approvedBy,
        }),
      /live current stage/i,
      "Runner should preserve stale-head guard behavior",
    );

    const failedRunnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: staleRunnerId,
    }).record;
    assert.ok(failedRunnerRecord, "Failed stale-head runner should persist state");
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
      opener: "runtime_follow_up_open",
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
