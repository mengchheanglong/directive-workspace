import {
  normalizeDirectiveWorkspaceRoot,
  normalizeDirectiveApprovalActor,
  requireDirectiveExplicitApproval,
  requireDirectiveString,
  resolveDirectiveWorkspaceRelativePath,
} from "../../engine/approval-boundary.ts";
import {
  appendDirectiveRuntimeTwoStepSequenceEvents,
  nextDirectiveRuntimeTwoStepSequenceEventSequence,
  readDirectiveRuntimeTwoStepSequenceRecord,
  resolveDirectiveTwoStepSequenceRecordPath,
  type DirectiveRunnerActionResult,
  type DirectiveRuntimeTwoStepSequenceCheckpointStage,
  type DirectiveRuntimeTwoStepSequenceEvent,
  type DirectiveRuntimeTwoStepSequenceRecord,
  type DirectiveRuntimeTwoStepSequenceStepRecord,
  writeDirectiveRuntimeTwoStepSequenceRecord,
} from "./directive-runner-state.ts";
import {
  runDirectiveRuntimeActionByExplicitInvocation,
  type DirectiveRuntimeSharedInvocationSuccessResult,
} from "./runtime-runner-invocation.ts";
import { readDirectiveRuntimeFollowUpArtifact } from "./runtime-follow-up-opener.ts";

export type DirectiveRuntimeFollowUpProofSequenceAction =
  | "runtime_follow_up_open"
  | "runtime_proof_open";

export type DirectiveRuntimeFollowUpProofSequenceStepInput = {
  actionKind: DirectiveRuntimeFollowUpProofSequenceAction;
  targetPath: string;
  approvedBy: string;
};

export type DirectiveRuntimeFollowUpProofSequenceInterruptionPoint =
  | "after_before_step_1_checkpoint"
  | "after_step_1_checkpoint"
  | "after_step_2_checkpoint";

export type DirectiveRuntimeFollowUpProofSequenceInput = {
  steps: [
    DirectiveRuntimeFollowUpProofSequenceStepInput,
    DirectiveRuntimeFollowUpProofSequenceStepInput,
  ];
  approved?: boolean;
  directiveRoot?: string;
  sequenceId?: string | null;
  testInterruptPoint?: DirectiveRuntimeFollowUpProofSequenceInterruptionPoint;
};

type DirectiveRuntimeFollowUpProofSequenceBaseResult = {
  sequenceId: string;
  caseId: string;
  resumed: boolean;
  declaredActionCount: 2;
  executedActionCount: 0 | 1 | 2;
  completedStepCount: 0 | 1 | 2;
  lifecycleState: DirectiveRuntimeTwoStepSequenceRecord["lifecycleState"];
  checkpointStage: DirectiveRuntimeTwoStepSequenceRecord["checkpointStage"];
  sequenceRecordPath: string;
  sequenceRecord: DirectiveRuntimeTwoStepSequenceRecord;
};

export type DirectiveRuntimeFollowUpProofSequenceSuccessResult =
  DirectiveRuntimeFollowUpProofSequenceBaseResult & {
    ok: true;
    replayedFromCheckpoint: boolean;
    lifecycleState: "completed";
    checkpointStage: "completed";
    stepResults: [
      DirectiveRunnerActionResult,
      DirectiveRunnerActionResult,
    ];
  };

export type DirectiveRuntimeFollowUpProofSequenceInterruptedResult =
  DirectiveRuntimeFollowUpProofSequenceBaseResult & {
    ok: false;
    interrupted: true;
    lifecycleState: "interrupted";
    checkpointStage: "before_step_1" | "after_step_1" | "after_step_2";
    reason: string;
  };

export type DirectiveRuntimeFollowUpProofSequenceResult =
  | DirectiveRuntimeFollowUpProofSequenceSuccessResult
  | DirectiveRuntimeFollowUpProofSequenceInterruptedResult;

type NormalizedTwoStepSequence = {
  caseId: string;
  sequenceId: string;
  steps: [
    DirectiveRuntimeTwoStepSequenceStepRecord,
    DirectiveRuntimeTwoStepSequenceStepRecord,
  ];
};

const REQUIRED_SEQUENCE: [
  DirectiveRuntimeFollowUpProofSequenceAction,
  DirectiveRuntimeFollowUpProofSequenceAction,
] = [
  "runtime_follow_up_open",
  "runtime_proof_open",
] as const;

function buildDefaultSequenceId(caseId: string) {
  return `runtime-follow-up-proof-sequence-${caseId}`;
}

function createRunnerId(input: {
  sequenceId: string;
  stepIndex: 1 | 2;
  actionKind: DirectiveRuntimeFollowUpProofSequenceAction;
}) {
  return `${input.sequenceId}-step-${input.stepIndex}-${input.actionKind}`;
}

function normalizeDeclaredSequence(input: {
  directiveRoot: string;
  sequenceId?: string | null;
  steps: [
    DirectiveRuntimeFollowUpProofSequenceStepInput,
    DirectiveRuntimeFollowUpProofSequenceStepInput,
  ];
}): NormalizedTwoStepSequence {
  if (input.steps.length !== 2) {
    throw new Error("invalid_input: this experiment requires exactly two predeclared Runtime actions");
  }

  const normalizedStep1Action = input.steps[0].actionKind;
  const normalizedStep2Action = input.steps[1].actionKind;
  if (
    normalizedStep1Action !== REQUIRED_SEQUENCE[0]
    || normalizedStep2Action !== REQUIRED_SEQUENCE[1]
  ) {
    throw new Error(
      `invalid_input: this experiment only supports the ordered Runtime action pair ${REQUIRED_SEQUENCE.join(" -> ")}`,
    );
  }

  const followUpTargetPath = resolveDirectiveWorkspaceRelativePath(
    input.directiveRoot,
    input.steps[0].targetPath,
    "steps[0].targetPath",
  );
  const followUpArtifact = readDirectiveRuntimeFollowUpArtifact({
    directiveRoot: input.directiveRoot,
    followUpPath: followUpTargetPath,
  });
  const proofTargetPath = resolveDirectiveWorkspaceRelativePath(
    input.directiveRoot,
    input.steps[1].targetPath,
    "steps[1].targetPath",
  );
  if (proofTargetPath !== followUpArtifact.runtimeRecordRelativePath) {
    throw new Error(
      `invalid_input: steps[1].targetPath must exactly match the Runtime record opened by step 1 (${followUpArtifact.runtimeRecordRelativePath})`,
    );
  }

  const caseId = followUpArtifact.candidateId;
  const sequenceId = (input.sequenceId || "").trim() || buildDefaultSequenceId(caseId);
  return {
    caseId,
    sequenceId,
    steps: [
      {
        stepIndex: 1,
        actionKind: "runtime_follow_up_open",
        targetPath: followUpTargetPath,
        approvedBy: normalizeDirectiveApprovalActor(
          requireDirectiveString(input.steps[0].approvedBy, "steps[0].approvedBy"),
        ),
        runnerId: createRunnerId({
          sequenceId,
          stepIndex: 1,
          actionKind: "runtime_follow_up_open",
        }),
        completedAt: null,
        actionResult: null,
      },
      {
        stepIndex: 2,
        actionKind: "runtime_proof_open",
        targetPath: proofTargetPath,
        approvedBy: normalizeDirectiveApprovalActor(
          requireDirectiveString(input.steps[1].approvedBy, "steps[1].approvedBy"),
        ),
        runnerId: createRunnerId({
          sequenceId,
          stepIndex: 2,
          actionKind: "runtime_proof_open",
        }),
        completedAt: null,
        actionResult: null,
      },
    ],
  };
}

function createSequenceRecord(input: {
  sequenceId: string;
  caseId: string;
  steps: [
    DirectiveRuntimeTwoStepSequenceStepRecord,
    DirectiveRuntimeTwoStepSequenceStepRecord,
  ];
  startedAt: string;
  updatedAt: string;
  attempts: number;
  lifecycleState: DirectiveRuntimeTwoStepSequenceRecord["lifecycleState"];
  checkpointStage: DirectiveRuntimeTwoStepSequenceRecord["checkpointStage"];
  completedStepCount: 0 | 1 | 2;
  lastError: DirectiveRuntimeTwoStepSequenceRecord["lastError"];
}) {
  return {
    schemaVersion: 1,
    sequenceId: input.sequenceId,
    caseId: input.caseId,
    lifecycleState: input.lifecycleState,
    checkpointStage: input.checkpointStage,
    startedAt: input.startedAt,
    updatedAt: input.updatedAt,
    attempts: input.attempts,
    declaredActionCount: 2,
    completedStepCount: input.completedStepCount,
    steps: input.steps,
    lastError: input.lastError,
  } satisfies DirectiveRuntimeTwoStepSequenceRecord;
}

function writeSequenceRecord(input: {
  directiveRoot: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
}) {
  return writeDirectiveRuntimeTwoStepSequenceRecord({
    directiveRoot: input.directiveRoot,
    record: input.record,
  }).record;
}

function appendSequenceEvent(input: {
  directiveRoot: string;
  sequenceId: string;
  caseId: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
  eventType: DirectiveRuntimeTwoStepSequenceEvent["eventType"];
  occurredAt: string;
  message: string;
}) {
  const sequence = nextDirectiveRuntimeTwoStepSequenceEventSequence({
    directiveRoot: input.directiveRoot,
    sequenceId: input.sequenceId,
  });
  appendDirectiveRuntimeTwoStepSequenceEvents({
    directiveRoot: input.directiveRoot,
    sequenceId: input.sequenceId,
    events: [
      {
        schemaVersion: 1,
        eventId: `${input.sequenceId}:${sequence}:${input.eventType}`,
        sequenceId: input.sequenceId,
        caseId: input.caseId,
        sequence,
        eventType: input.eventType,
        occurredAt: input.occurredAt,
        lifecycleState: input.record.lifecycleState,
        checkpointStage: input.record.checkpointStage,
        message: input.message,
      },
    ],
  });
}

function recordsMatchDeclaredSequence(input: {
  declared: NormalizedTwoStepSequence;
  record: DirectiveRuntimeTwoStepSequenceRecord;
}) {
  return input.record.caseId === input.declared.caseId
    && input.record.steps[0].actionKind === input.declared.steps[0].actionKind
    && input.record.steps[0].targetPath === input.declared.steps[0].targetPath
    && input.record.steps[1].actionKind === input.declared.steps[1].actionKind
    && input.record.steps[1].targetPath === input.declared.steps[1].targetPath;
}

function checkpointSequence(input: {
  directiveRoot: string;
  sequenceId: string;
  caseId: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
  eventType:
    | "sequence_invoked"
    | "sequence_resumed"
    | "before_step_1_checkpointed"
    | "after_step_1_checkpointed"
    | "after_step_2_checkpointed"
    | "sequence_completed";
  occurredAt: string;
  message: string;
}) {
  appendSequenceEvent(input);
  return input.record;
}

function interruptedResult(input: {
  sequenceRecordPath: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
  resumed: boolean;
  executedActionCount: 0 | 1 | 2;
  reason: string;
}): DirectiveRuntimeFollowUpProofSequenceInterruptedResult {
  return {
    ok: false,
    interrupted: true,
    sequenceId: input.record.sequenceId,
    caseId: input.record.caseId,
    resumed: input.resumed,
    declaredActionCount: 2,
    executedActionCount: input.executedActionCount,
    completedStepCount: input.record.completedStepCount,
    lifecycleState: "interrupted",
    checkpointStage: input.record.checkpointStage,
    sequenceRecordPath: input.sequenceRecordPath,
    sequenceRecord: input.record,
    reason: input.reason,
  };
}

function successResult(input: {
  sequenceRecordPath: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
  resumed: boolean;
  replayedFromCheckpoint: boolean;
  executedActionCount: 0 | 1 | 2;
}): DirectiveRuntimeFollowUpProofSequenceSuccessResult {
  const step1Result = input.record.steps[0].actionResult;
  const step2Result = input.record.steps[1].actionResult;
  if (!step1Result || !step2Result) {
    throw new Error(
      `invalid_state: completed sequence ${input.record.sequenceId} is missing one or more step results`,
    );
  }

  return {
    ok: true,
    sequenceId: input.record.sequenceId,
    caseId: input.record.caseId,
    resumed: input.resumed,
    replayedFromCheckpoint: input.replayedFromCheckpoint,
    declaredActionCount: 2,
    executedActionCount: input.executedActionCount,
    completedStepCount: 2,
    lifecycleState: "completed",
    checkpointStage: "completed",
    sequenceRecordPath: input.sequenceRecordPath,
    sequenceRecord: input.record,
    stepResults: [step1Result, step2Result],
  };
}

function writeInterruptedSequenceRecord(input: {
  directiveRoot: string;
  sequenceRecordPath: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
  resumed: boolean;
  checkpointStage: "before_step_1" | "after_step_1" | "after_step_2";
  occurredAt: string;
  reason: string;
  executedActionCount: 0 | 1 | 2;
}) {
  const interruptedRecord = writeSequenceRecord({
    directiveRoot: input.directiveRoot,
    record: {
      ...input.record,
      lifecycleState: "interrupted",
      checkpointStage: input.checkpointStage,
      updatedAt: input.occurredAt,
    },
  });

  appendSequenceEvent({
    directiveRoot: input.directiveRoot,
    sequenceId: interruptedRecord.sequenceId,
    caseId: interruptedRecord.caseId,
    record: interruptedRecord,
    eventType: "sequence_interrupted",
    occurredAt: input.occurredAt,
    message: input.reason,
  });

  return interruptedResult({
    sequenceRecordPath: input.sequenceRecordPath,
    record: interruptedRecord,
    resumed: input.resumed,
    executedActionCount: input.executedActionCount,
    reason: input.reason,
  });
}

function assertSharedStepSuccess(
  result: ReturnType<typeof runDirectiveRuntimeActionByExplicitInvocation>,
): asserts result is DirectiveRuntimeSharedInvocationSuccessResult {
  if (!result.ok) {
    throw new Error(
      `invalid_state: shared invocation unexpectedly interrupted at ${result.actionKind}: ${result.reason}`,
    );
  }
}

function runStep(input: {
  directiveRoot: string;
  approved: boolean | undefined;
  step: DirectiveRuntimeTwoStepSequenceStepRecord;
}) {
  const result = runDirectiveRuntimeActionByExplicitInvocation({
    directiveRoot: input.directiveRoot,
    actionKind: input.step.actionKind,
    targetPath: input.step.targetPath,
    approved: input.approved,
    approvedBy: input.step.approvedBy ?? undefined,
    runnerId: input.step.runnerId,
  });
  assertSharedStepSuccess(result);
  return result;
}

function sequenceFailed(input: {
  directiveRoot: string;
  sequenceRecordPath: string;
  record: DirectiveRuntimeTwoStepSequenceRecord;
  checkpointStage: DirectiveRuntimeTwoStepSequenceCheckpointStage;
  error: unknown;
}) {
  const failedAt = new Date().toISOString();
  const message = input.error instanceof Error ? input.error.message : "unknown two-step sequence failure";
  const failedRecord = writeSequenceRecord({
    directiveRoot: input.directiveRoot,
    record: {
      ...input.record,
      lifecycleState: "failed",
      checkpointStage: input.checkpointStage,
      updatedAt: failedAt,
      lastError: {
        name: input.error instanceof Error ? input.error.name || "Error" : "Error",
        message,
        at: failedAt,
        stage: input.checkpointStage,
      },
    },
  });
  appendSequenceEvent({
    directiveRoot: input.directiveRoot,
    sequenceId: failedRecord.sequenceId,
    caseId: failedRecord.caseId,
    record: failedRecord,
    eventType: "sequence_failed",
    occurredAt: failedAt,
    message,
  });
  throw input.error;
}

export function runDirectiveRuntimeFollowUpProofTwoStepSequence(
  input: DirectiveRuntimeFollowUpProofSequenceInput,
): DirectiveRuntimeFollowUpProofSequenceResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "run the explicit Runtime follow-up -> proof two-step sequence",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const declared = normalizeDeclaredSequence({
    directiveRoot,
    sequenceId: input.sequenceId,
    steps: input.steps,
  });
  const sequenceRecordPath = resolveDirectiveTwoStepSequenceRecordPath({
    directiveRoot,
    sequenceId: declared.sequenceId,
  });
  const existing = readDirectiveRuntimeTwoStepSequenceRecord({
    directiveRoot,
    sequenceId: declared.sequenceId,
  }).record;
  if (existing && !recordsMatchDeclaredSequence({
    declared,
    record: existing,
  })) {
    throw new Error(
      `invalid_input: sequence ${declared.sequenceId} already exists for a different declared two-step Runtime sequence`,
    );
  }

  const resumed = existing !== null;
  if (existing?.lifecycleState === "completed") {
    return successResult({
      sequenceRecordPath,
      record: existing,
      resumed,
      replayedFromCheckpoint: true,
      executedActionCount: 0,
    });
  }

  if (existing?.checkpointStage === "after_step_2" && existing.completedStepCount === 2) {
    const completedAt = new Date().toISOString();
    const completedRecord = writeSequenceRecord({
      directiveRoot,
      record: {
        ...existing,
        lifecycleState: "completed",
        checkpointStage: "completed",
        updatedAt: completedAt,
        lastError: null,
      },
    });
    appendSequenceEvent({
      directiveRoot,
      sequenceId: completedRecord.sequenceId,
      caseId: completedRecord.caseId,
      record: completedRecord,
      eventType: "sequence_resumed",
      occurredAt: completedAt,
      message: "Two-step sequence resumed from after_step_2 checkpoint without re-executing any step.",
    });
    appendSequenceEvent({
      directiveRoot,
      sequenceId: completedRecord.sequenceId,
      caseId: completedRecord.caseId,
      record: completedRecord,
      eventType: "sequence_completed",
      occurredAt: completedAt,
      message: "Two-step sequence completed from stored after_step_2 checkpoint.",
    });
    return successResult({
      sequenceRecordPath,
      record: completedRecord,
      resumed,
      replayedFromCheckpoint: true,
      executedActionCount: 0,
    });
  }

  const startedAt = existing?.startedAt ?? new Date().toISOString();
  let record = writeSequenceRecord({
    directiveRoot,
    record: createSequenceRecord({
      sequenceId: declared.sequenceId,
      caseId: declared.caseId,
      steps: existing?.steps ?? declared.steps,
      startedAt,
      updatedAt: new Date().toISOString(),
      attempts: (existing?.attempts ?? 0) + 1,
      lifecycleState: "running",
      checkpointStage: existing?.checkpointStage === "after_step_1" && existing.completedStepCount === 1
        ? "after_step_1"
        : "before_step_1",
      completedStepCount: existing?.completedStepCount ?? 0,
      lastError: null,
    }),
  });

  const sequenceStartedAt = new Date().toISOString();
  appendSequenceEvent({
    directiveRoot,
    sequenceId: record.sequenceId,
    caseId: record.caseId,
    record,
    eventType: resumed ? "sequence_resumed" : "sequence_invoked",
    occurredAt: sequenceStartedAt,
    message: resumed
      ? "Two-step sequence resumed from stored sequence state."
      : "Two-step sequence invoked for the first time.",
  });

  if (record.completedStepCount === 0) {
    appendSequenceEvent({
      directiveRoot,
      sequenceId: record.sequenceId,
      caseId: record.caseId,
      record,
      eventType: "before_step_1_checkpointed",
      occurredAt: sequenceStartedAt,
      message: "Two-step sequence checkpointed before step 1.",
    });
    if (input.testInterruptPoint === "after_before_step_1_checkpoint") {
      return writeInterruptedSequenceRecord({
        directiveRoot,
        sequenceRecordPath,
        record,
        resumed,
        checkpointStage: "before_step_1",
        occurredAt: new Date().toISOString(),
        reason: "Interrupted immediately after before_step_1 checkpoint.",
        executedActionCount: 0,
      });
    }
  }

  let executedActionCount = 0 as 0 | 1 | 2;

  try {
    if (record.completedStepCount === 0) {
      const step1Result = runStep({
        directiveRoot,
        approved: input.approved,
        step: record.steps[0],
      });
      executedActionCount = 1;
      const afterStep1At = new Date().toISOString();
      record = writeSequenceRecord({
        directiveRoot,
        record: {
          ...record,
          lifecycleState: "running",
          checkpointStage: "after_step_1",
          updatedAt: afterStep1At,
          completedStepCount: 1,
          steps: [
            {
              ...record.steps[0],
              completedAt: afterStep1At,
              actionResult: step1Result.actionResult,
            },
            record.steps[1],
          ],
        },
      });
      checkpointSequence({
        directiveRoot,
        sequenceId: record.sequenceId,
        caseId: record.caseId,
        record,
        eventType: "after_step_1_checkpointed",
        occurredAt: afterStep1At,
        message: "Two-step sequence checkpointed after step 1 completed.",
      });
      if (input.testInterruptPoint === "after_step_1_checkpoint") {
        return writeInterruptedSequenceRecord({
          directiveRoot,
          sequenceRecordPath,
          record,
          resumed,
          checkpointStage: "after_step_1",
          occurredAt: new Date().toISOString(),
          reason: "Interrupted immediately after after_step_1 checkpoint.",
          executedActionCount,
        });
      }
    }

    const step1ActionResult = record.steps[0].actionResult;
    if (!step1ActionResult) {
      throw new Error(
        `invalid_state: two-step sequence ${record.sequenceId} cannot continue to step 2 without a completed step 1 result`,
      );
    }
    if (record.steps[1].targetPath !== step1ActionResult.runtimeRecordRelativePath) {
      throw new Error(
        `invalid_input: declared step 2 target ${record.steps[1].targetPath} does not match step 1 opened Runtime record ${step1ActionResult.runtimeRecordRelativePath}`,
      );
    }

    if (record.completedStepCount < 2) {
      const step2Result = runStep({
        directiveRoot,
        approved: input.approved,
        step: record.steps[1],
      });
      executedActionCount = (executedActionCount + 1) as 1 | 2;
      const afterStep2At = new Date().toISOString();
      record = writeSequenceRecord({
        directiveRoot,
        record: {
          ...record,
          lifecycleState: "running",
          checkpointStage: "after_step_2",
          updatedAt: afterStep2At,
          completedStepCount: 2,
          steps: [
            record.steps[0],
            {
              ...record.steps[1],
              completedAt: afterStep2At,
              actionResult: step2Result.actionResult,
            },
          ],
        },
      });
      checkpointSequence({
        directiveRoot,
        sequenceId: record.sequenceId,
        caseId: record.caseId,
        record,
        eventType: "after_step_2_checkpointed",
        occurredAt: afterStep2At,
        message: "Two-step sequence checkpointed after step 2 completed.",
      });
      if (input.testInterruptPoint === "after_step_2_checkpoint") {
        return writeInterruptedSequenceRecord({
          directiveRoot,
          sequenceRecordPath,
          record,
          resumed,
          checkpointStage: "after_step_2",
          occurredAt: new Date().toISOString(),
          reason: "Interrupted immediately after after_step_2 checkpoint.",
          executedActionCount,
        });
      }
    }

    const completedAt = new Date().toISOString();
    const completedRecord = writeSequenceRecord({
      directiveRoot,
      record: {
        ...record,
        lifecycleState: "completed",
        checkpointStage: "completed",
        updatedAt: completedAt,
        lastError: null,
      },
    });
    appendSequenceEvent({
      directiveRoot,
      sequenceId: completedRecord.sequenceId,
      caseId: completedRecord.caseId,
      record: completedRecord,
      eventType: "sequence_completed",
      occurredAt: completedAt,
      message: "Two-step explicit Runtime sequence completed.",
    });
    return successResult({
      sequenceRecordPath,
      record: completedRecord,
      resumed,
      replayedFromCheckpoint: false,
      executedActionCount,
    });
  } catch (error) {
    return sequenceFailed({
      directiveRoot,
      sequenceRecordPath,
      record,
      checkpointStage: record.checkpointStage,
      error,
    });
  }
}
