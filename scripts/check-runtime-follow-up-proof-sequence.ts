import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveActionRunnerRecord,
  readDirectiveRuntimeTwoStepSequenceEvents,
  readDirectiveRuntimeTwoStepSequenceRecord,
  type DirectiveRunnerActionResult,
} from "../shared/lib/directive-runner-state.ts";
import { readDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { runDirectiveRuntimeActionByExplicitInvocation } from "../shared/lib/runtime-runner-invocation.ts";
import {
  runDirectiveRuntimeFollowUpProofTwoStepSequence,
  type DirectiveRuntimeFollowUpProofSequenceInput,
  type DirectiveRuntimeFollowUpProofSequenceResult,
} from "../shared/lib/runtime-follow-up-proof-sequence.ts";

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  status: string;
  routing_target: string | null;
  intake_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
  notes?: string | null;
  completed_at?: string | null;
  operating_mode?: string | null;
};

type RuntimeFocus = NonNullable<ReturnType<typeof resolveDirectiveWorkspaceState>["focus"]>;

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CASE_UNDER_TEST = {
  candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  runtimePromotionReadinessPath: "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
} as const;

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyRelativeFile(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  assert.ok(fs.existsSync(sourcePath), `Missing source file for two-step copy: ${relativePath}`);
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
}

function copyRelativeFiles(relativePaths: Array<string | null | undefined>, directiveRoot: string) {
  for (const relativePath of uniqueRelativePaths(relativePaths)) {
    copyRelativeFile(relativePath, directiveRoot);
  }
}

function withTempDirectiveRoot(run: (directiveRoot: string) => void) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-two-step-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    run(directiveRoot);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function extractReviewedBy(markdown: string) {
  const match = markdown.match(/- Reviewed by: `([^`]+)`/u);
  assert.ok(match?.[1], "Unable to parse Runtime review actor");
  return match[1];
}

function extractOpenedBy(markdown: string) {
  const match = markdown.match(/- Opened by: `([^`]+)`/u);
  assert.ok(match?.[1], "Unable to parse Runtime opened-by actor");
  return match[1];
}

function seedDirectiveRoot(directiveRoot: string) {
  const queueDocument = readJson<{ entries: QueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );
  const queueEntry = queueDocument.entries.find(
    (item) => item.candidate_id === CASE_UNDER_TEST.candidateId,
  ) ?? null;
  assert.ok(queueEntry, `Missing queue entry for ${CASE_UNDER_TEST.candidateId}`);

  const routing = readDirectiveDiscoveryRoutingArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    routingPath: queueEntry.routing_record_path ?? "",
  });
  copyRelativeFiles([
    queueEntry.intake_record_path,
    routing.linkedTriageRecord,
    queueEntry.routing_record_path,
    routing.engineRunRecordPath,
    routing.engineRunReportPath,
    CASE_UNDER_TEST.followUpPath,
  ], directiveRoot);

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
}

function resolveFocusOrThrow(input: {
  directiveRoot: string;
  artifactPath: string;
  label: string;
}) {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    artifactPath: input.artifactPath,
  }).focus;
  assert.ok(focus?.ok, `${input.label} state did not resolve`);
  return focus;
}

function readRelativeContent(directiveRoot: string, relativePath: string) {
  return fs.readFileSync(path.join(directiveRoot, relativePath), "utf8");
}

function countMirrorEvents(input: {
  directiveRoot: string;
  eventType: string;
}) {
  return readDirectiveCaseMirrorEvents({
    directiveRoot: input.directiveRoot,
    caseId: CASE_UNDER_TEST.candidateId,
  }).events.filter((event) => event.eventType === input.eventType).length;
}

function buildDeclaredSteps(): DirectiveRuntimeFollowUpProofSequenceInput["steps"] {
  const liveRuntimeRecord = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath),
    "utf8",
  );
  const liveRuntimeProof = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  return [
    {
      actionKind: "runtime_follow_up_open",
      targetPath: CASE_UNDER_TEST.followUpPath,
      approvedBy: extractReviewedBy(liveRuntimeRecord),
    },
    {
      actionKind: "runtime_proof_open",
      targetPath: CASE_UNDER_TEST.runtimeRecordPath,
      approvedBy: extractOpenedBy(liveRuntimeProof),
    },
  ];
}

function assertSuccess(
  result: DirectiveRuntimeFollowUpProofSequenceResult,
): asserts result is Extract<DirectiveRuntimeFollowUpProofSequenceResult, { ok: true }> {
  if (!result.ok) {
    throw new Error(`Expected sequence success but got interruption: ${result.reason}`);
  }
}

function comparableActionResult(actionResult: DirectiveRunnerActionResult) {
  return {
    created: actionResult.created,
    followUpRelativePath: actionResult.followUpRelativePath,
    runtimeRecordRelativePath: actionResult.runtimeRecordRelativePath,
    runtimeProofRelativePath: actionResult.runtimeProofRelativePath ?? null,
    candidateId: actionResult.candidateId,
    candidateName: actionResult.candidateName,
  };
}

function assertNoThirdStepTriggered(directiveRoot: string) {
  assert.equal(
    fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath)),
    false,
    "Two-step experiment must not create a capability-boundary artifact",
  );
  assert.equal(
    fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimePromotionReadinessPath)),
    false,
    "Two-step experiment must not create a promotion-readiness artifact",
  );
  assert.equal(
    countMirrorEvents({
      directiveRoot,
      eventType: "runtime_capability_boundary_opened",
    }),
    0,
    "Two-step experiment must not emit capability-boundary open events",
  );
  assert.equal(
    countMirrorEvents({
      directiveRoot,
      eventType: "runtime_promotion_readiness_opened",
    }),
    0,
    "Two-step experiment must not emit promotion-readiness open events",
  );
}

function directSingleActionBaseline(directiveRoot: string) {
  const steps = buildDeclaredSteps();
  const followUp = runDirectiveRuntimeActionByExplicitInvocation({
    directiveRoot,
    actionKind: steps[0].actionKind,
    targetPath: steps[0].targetPath,
    approved: true,
    approvedBy: steps[0].approvedBy,
    runnerId: "baseline-follow-up",
  });
  assert.ok(followUp.ok, "Baseline follow-up must succeed");

  const proof = runDirectiveRuntimeActionByExplicitInvocation({
    directiveRoot,
    actionKind: steps[1].actionKind,
    targetPath: steps[1].targetPath,
    approved: true,
    approvedBy: steps[1].approvedBy,
    runnerId: "baseline-proof",
  });
  assert.ok(proof.ok, "Baseline proof must succeed");

  return {
    followUp,
    proof,
  };
}

function scenarioFreshSequenceMatchesDirectPath() {
  withTempDirectiveRoot((directRoot) => {
    seedDirectiveRoot(directRoot);
    const direct = directSingleActionBaseline(directRoot);

    withTempDirectiveRoot((sequenceRoot) => {
      seedDirectiveRoot(sequenceRoot);
      const result = runDirectiveRuntimeFollowUpProofTwoStepSequence({
        directiveRoot: sequenceRoot,
        sequenceId: "two-step-fresh",
        steps: buildDeclaredSteps(),
        approved: true,
      });
      assertSuccess(result);

      assert.equal(result.declaredActionCount, 2);
      assert.equal(result.executedActionCount, 2);
      assert.equal(result.completedStepCount, 2);
      assert.equal(result.sequenceRecord.completedStepCount, 2);
      assert.deepEqual(
        result.sequenceRecord.steps.map((step) => step.actionKind),
        ["runtime_follow_up_open", "runtime_proof_open"],
      );

      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeRecordPath),
        readRelativeContent(directRoot, CASE_UNDER_TEST.runtimeRecordPath),
      );
      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeProofPath),
        readRelativeContent(directRoot, CASE_UNDER_TEST.runtimeProofPath),
      );
      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeRecordPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      );
      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeProofPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
      );

      assert.deepEqual(
        result.stepResults.map((entry) => comparableActionResult(entry)),
        [
          comparableActionResult(direct.followUp.actionResult),
          comparableActionResult(direct.proof.actionResult),
        ],
      );

      const directFocus = resolveFocusOrThrow({
        directiveRoot: directRoot,
        artifactPath: CASE_UNDER_TEST.runtimeProofPath,
        label: "Direct two-step baseline",
      });
      const sequenceFocus = resolveFocusOrThrow({
        directiveRoot: sequenceRoot,
        artifactPath: CASE_UNDER_TEST.runtimeProofPath,
        label: "Two-step experiment",
      });
      assert.equal(sequenceFocus.currentHead.artifactPath, directFocus.currentHead.artifactPath);
      assert.equal(sequenceFocus.currentStage, directFocus.currentStage);
      assert.equal(sequenceFocus.nextLegalStep, directFocus.nextLegalStep);

      assertNoThirdStepTriggered(sequenceRoot);

      const sequenceEvents = readDirectiveRuntimeTwoStepSequenceEvents({
        directiveRoot: sequenceRoot,
        sequenceId: "two-step-fresh",
      }).events.map((event) => event.eventType);
      assert.deepEqual(sequenceEvents, [
        "sequence_invoked",
        "before_step_1_checkpointed",
        "after_step_1_checkpointed",
        "after_step_2_checkpointed",
        "sequence_completed",
      ]);
    });
  });
}

function scenarioInterruptedBeforeStep1ThenResumed() {
  withTempDirectiveRoot((directiveRoot) => {
    seedDirectiveRoot(directiveRoot);
    const interrupted = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-before-step-1",
      steps: buildDeclaredSteps(),
      approved: true,
      testInterruptPoint: "after_before_step_1_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "before_step_1");
    assert.equal(interrupted.executedActionCount, 0);
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath)),
      false,
    );
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeProofPath)),
      false,
    );

    const resumed = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-before-step-1",
      steps: buildDeclaredSteps(),
      approved: true,
    });
    assertSuccess(resumed);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.executedActionCount, 2);
    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
    );
    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeProofPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
    );
    assertNoThirdStepTriggered(directiveRoot);
  });
}

function scenarioInterruptedAfterStep1ThenResumed() {
  withTempDirectiveRoot((directiveRoot) => {
    seedDirectiveRoot(directiveRoot);
    const interrupted = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-after-step-1",
      steps: buildDeclaredSteps(),
      approved: true,
      testInterruptPoint: "after_step_1_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "after_step_1");
    assert.equal(interrupted.executedActionCount, 1);
    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeRecordPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
    );
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeProofPath)),
      false,
      "After-step-1 interruption must stop before creating the proof artifact",
    );

    const sequenceRecordBeforeResume = readDirectiveRuntimeTwoStepSequenceRecord({
      directiveRoot,
      sequenceId: "two-step-after-step-1",
    }).record;
    assert.ok(sequenceRecordBeforeResume, "Interrupted sequence record should exist");
    assert.equal(sequenceRecordBeforeResume.completedStepCount, 1);

    const resumed = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-after-step-1",
      steps: buildDeclaredSteps(),
      approved: true,
    });
    assertSuccess(resumed);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.executedActionCount, 1);
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_follow_up_opened",
      }),
      1,
      "Resume after step 1 must not re-open the Runtime follow-up",
    );
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_proof_opened",
      }),
      1,
      "Resume after step 1 must open proof exactly once",
    );

    const step1RunnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: resumed.sequenceRecord.steps[0].runnerId,
    }).record;
    assert.ok(step1RunnerRecord, "Step 1 runner record should exist");
    assert.equal(step1RunnerRecord.attempts, 1);

    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeProofPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
    );
    assertNoThirdStepTriggered(directiveRoot);
  });
}

function scenarioInterruptedAfterStep2ThenResumed() {
  withTempDirectiveRoot((directiveRoot) => {
    seedDirectiveRoot(directiveRoot);
    const interrupted = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-after-step-2",
      steps: buildDeclaredSteps(),
      approved: true,
      testInterruptPoint: "after_step_2_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "after_step_2");
    assert.equal(interrupted.executedActionCount, 2);
    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeProofPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
    );

    const resumed = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-after-step-2",
      steps: buildDeclaredSteps(),
      approved: true,
    });
    assertSuccess(resumed);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, true);
    assert.equal(resumed.executedActionCount, 0);
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_follow_up_opened",
      }),
      1,
    );
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_proof_opened",
      }),
      1,
    );

    const step2RunnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: resumed.sequenceRecord.steps[1].runnerId,
    }).record;
    assert.ok(step2RunnerRecord, "Step 2 runner record should exist");
    assert.equal(step2RunnerRecord.attempts, 1);
    assertNoThirdStepTriggered(directiveRoot);
  });
}

function scenarioApprovalAndStaleHeadGuards() {
  withTempDirectiveRoot((directiveRoot) => {
    seedDirectiveRoot(directiveRoot);

    assert.throws(
      () =>
        runDirectiveRuntimeFollowUpProofTwoStepSequence({
          directiveRoot,
          sequenceId: "two-step-missing-approval",
          steps: buildDeclaredSteps(),
        }),
      /explicit approval/i,
      "Two-step sequence should preserve explicit approval",
    );
    assert.equal(
      readDirectiveRuntimeTwoStepSequenceRecord({
        directiveRoot,
        sequenceId: "two-step-missing-approval",
      }).record,
      null,
      "Missing approval must not create sequence state",
    );

    const completed = runDirectiveRuntimeFollowUpProofTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-first-completion",
      steps: buildDeclaredSteps(),
      approved: true,
    });
    assertSuccess(completed);

    assert.throws(
      () =>
        runDirectiveRuntimeFollowUpProofTwoStepSequence({
          directiveRoot,
          sequenceId: "two-step-stale-head",
          steps: buildDeclaredSteps(),
          approved: true,
        }),
      /live current stage/i,
      "Two-step sequence should preserve stale-head guard behavior",
    );

    const failedRecord = readDirectiveRuntimeTwoStepSequenceRecord({
      directiveRoot,
      sequenceId: "two-step-stale-head",
    }).record;
    assert.ok(failedRecord, "Failed stale-head sequence should persist state");
    assert.equal(failedRecord.lifecycleState, "failed");
    assert.equal(failedRecord.checkpointStage, "before_step_1");
    assert.match(failedRecord.lastError?.message || "", /live current stage/i);
  });
}

function main() {
  scenarioFreshSequenceMatchesDirectPath();
  scenarioInterruptedBeforeStep1ThenResumed();
  scenarioInterruptedAfterStep1ThenResumed();
  scenarioInterruptedAfterStep2ThenResumed();
  scenarioApprovalAndStaleHeadGuards();

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      candidateId: CASE_UNDER_TEST.candidateId,
      sequence: [
        "runtime_follow_up_open",
        "runtime_proof_open",
      ],
      explicitOnly: true,
      interruptionCoverage: [
        "before_step_1",
        "after_step_1",
        "after_step_2",
      ],
      preservedGuards: [
        "explicit_approval",
        "stale_head",
      ],
      prohibitedAutoOpens: [
        "runtime_capability_boundary_open",
        "runtime_promotion_readiness_open",
      ],
    },
  }, null, 2)}\n`);
}

main();
