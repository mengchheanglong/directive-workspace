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
import { withTempDirectiveRoot } from "./temp-directive-root.ts";
import {
  runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence,
  type DirectiveRuntimeProofCapabilityBoundarySequenceInput,
  type DirectiveRuntimeProofCapabilityBoundarySequenceResult,
} from "../shared/lib/runtime-proof-capability-boundary-sequence.ts";

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
    CASE_UNDER_TEST.runtimeRecordPath,
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

function buildDeclaredSteps(): DirectiveRuntimeProofCapabilityBoundarySequenceInput["steps"] {
  const liveRuntimeProof = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  const liveCapabilityBoundary = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
    "utf8",
  );
  return [
    {
      actionKind: "runtime_proof_open",
      targetPath: CASE_UNDER_TEST.runtimeRecordPath,
      approvedBy: extractOpenedBy(liveRuntimeProof),
    },
    {
      actionKind: "runtime_capability_boundary_open",
      targetPath: CASE_UNDER_TEST.runtimeProofPath,
      approvedBy: extractOpenedBy(liveCapabilityBoundary),
    },
  ];
}

function assertSuccess(
  result: DirectiveRuntimeProofCapabilityBoundarySequenceResult,
): asserts result is Extract<DirectiveRuntimeProofCapabilityBoundarySequenceResult, { ok: true }> {
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
    runtimeCapabilityBoundaryRelativePath: actionResult.runtimeCapabilityBoundaryRelativePath ?? null,
    candidateId: actionResult.candidateId,
    candidateName: actionResult.candidateName,
  };
}

function assertNoThirdStepTriggered(directiveRoot: string) {
  assert.equal(
    fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimePromotionReadinessPath)),
    false,
    "Two-step experiment must not create a promotion-readiness artifact",
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
  const proof = runDirectiveRuntimeActionByExplicitInvocation({
    directiveRoot,
    actionKind: steps[0].actionKind,
    targetPath: steps[0].targetPath,
    approved: true,
    approvedBy: steps[0].approvedBy,
    runnerId: "baseline-proof",
  });
  assert.ok(proof.ok, "Baseline proof must succeed");

  const capabilityBoundary = runDirectiveRuntimeActionByExplicitInvocation({
    directiveRoot,
    actionKind: steps[1].actionKind,
    targetPath: steps[1].targetPath,
    approved: true,
    approvedBy: steps[1].approvedBy,
    runnerId: "baseline-capability-boundary",
  });
  assert.ok(capabilityBoundary.ok, "Baseline capability-boundary open must succeed");

  return {
    proof,
    capabilityBoundary,
  };
}

function scenarioFreshSequenceMatchesDirectPath() {
  withTempDirectiveRoot({ prefix: "directive-runtime-two-step-" }, (directRoot) => {
    seedDirectiveRoot(directRoot);
    const direct = directSingleActionBaseline(directRoot);

    withTempDirectiveRoot({ prefix: "directive-runtime-two-step-" }, (sequenceRoot) => {
      seedDirectiveRoot(sequenceRoot);
      const result = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
        ["runtime_proof_open", "runtime_capability_boundary_open"],
      );

      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeProofPath),
        readRelativeContent(directRoot, CASE_UNDER_TEST.runtimeProofPath),
      );
      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
        readRelativeContent(directRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
      );
      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeProofPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
      );
      assert.equal(
        readRelativeContent(sequenceRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath), "utf8"),
      );

      assert.deepEqual(
        result.stepResults.map((entry) => comparableActionResult(entry)),
        [
          comparableActionResult(direct.proof.actionResult),
          comparableActionResult(direct.capabilityBoundary.actionResult),
        ],
      );

      const directFocus = resolveFocusOrThrow({
        directiveRoot: directRoot,
        artifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
        label: "Direct two-step baseline",
      });
      const sequenceFocus = resolveFocusOrThrow({
        directiveRoot: sequenceRoot,
        artifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
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
  withTempDirectiveRoot({ prefix: "directive-runtime-two-step-" }, (directiveRoot) => {
    seedDirectiveRoot(directiveRoot);
    const interrupted = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeProofPath)),
      false,
    );
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath)),
      false,
    );

    const resumed = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-before-step-1",
      steps: buildDeclaredSteps(),
      approved: true,
    });
    assertSuccess(resumed);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.executedActionCount, 2);
    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeProofPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
    );
    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath), "utf8"),
    );
    assertNoThirdStepTriggered(directiveRoot);
  });
}

function scenarioInterruptedAfterStep1ThenResumed() {
  withTempDirectiveRoot({ prefix: "directive-runtime-two-step-" }, (directiveRoot) => {
    seedDirectiveRoot(directiveRoot);
    const interrupted = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeProofPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath), "utf8"),
    );
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath)),
      false,
      "After-step-1 interruption must stop before creating the capability-boundary artifact",
    );

    const sequenceRecordBeforeResume = readDirectiveRuntimeTwoStepSequenceRecord({
      directiveRoot,
      sequenceId: "two-step-after-step-1",
    }).record;
    assert.ok(sequenceRecordBeforeResume, "Interrupted sequence record should exist");
    assert.equal(sequenceRecordBeforeResume.completedStepCount, 1);

    const resumed = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
        eventType: "runtime_proof_opened",
      }),
      1,
      "Resume after step 1 must not re-open the Runtime proof",
    );
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_capability_boundary_opened",
      }),
      1,
      "Resume after step 1 must open the capability boundary exactly once",
    );

    const step1RunnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: resumed.sequenceRecord.steps[0].runnerId,
    }).record;
    assert.ok(step1RunnerRecord, "Step 1 runner record should exist");
    assert.equal(step1RunnerRecord.attempts, 1);

    assert.equal(
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath), "utf8"),
    );
    assertNoThirdStepTriggered(directiveRoot);
  });
}

function scenarioInterruptedAfterStep2ThenResumed() {
  withTempDirectiveRoot({ prefix: "directive-runtime-two-step-" }, (directiveRoot) => {
    seedDirectiveRoot(directiveRoot);
    const interrupted = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
      readRelativeContent(directiveRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath), "utf8"),
    );

    const resumed = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
        eventType: "runtime_proof_opened",
      }),
      1,
    );
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_capability_boundary_opened",
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
  withTempDirectiveRoot({ prefix: "directive-runtime-two-step-" }, (directiveRoot) => {
    seedDirectiveRoot(directiveRoot);

    assert.throws(
      () =>
        runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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

    const completed = runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
      directiveRoot,
      sequenceId: "two-step-first-completion",
      steps: buildDeclaredSteps(),
      approved: true,
    });
    assertSuccess(completed);

    assert.throws(
      () =>
        runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
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
    assertNoThirdStepTriggered(directiveRoot);
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
        "runtime_proof_open",
        "runtime_capability_boundary_open",
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
        "runtime_promotion_readiness_open",
      ],
    },
  }, null, 2)}\n`);
}

main();
