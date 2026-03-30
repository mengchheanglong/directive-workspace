import {
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveExplicitApproval,
} from "../../engine/approval-boundary.ts";
import {
  appendDirectiveActionRunnerEvents,
  nextDirectiveActionRunnerEventSequence,
  readDirectiveActionRunnerRecord,
  type DirectiveActionRunnerEvent,
  type DirectiveActionRunnerRecord,
  type DirectiveRunnerActionResult,
  writeDirectiveActionRunnerRecord,
} from "./directive-runner-state.ts";
import {
  openDirectiveRuntimeRecordProof,
  readDirectiveRuntimeRecordArtifact,
} from "./runtime-record-proof-opener.ts";

export type DirectiveRuntimeProofOpenRunnerInterruptionPoint =
  | "after_before_action_checkpoint"
  | "after_after_action_checkpoint";

export type DirectiveRuntimeProofOpenRunnerSuccessResult = {
  ok: true;
  runnerId: string;
  caseId: string;
  resumed: boolean;
  replayedFromCheckpoint: boolean;
  lifecycleState: "completed";
  checkpointStage: "completed";
  actionResult: DirectiveRunnerActionResult;
};

export type DirectiveRuntimeProofOpenRunnerInterruptedResult = {
  ok: false;
  interrupted: true;
  runnerId: string;
  caseId: string;
  resumed: boolean;
  lifecycleState: "interrupted";
  checkpointStage: "before_action" | "after_action";
  reason: string;
};

export type DirectiveRuntimeProofOpenRunnerResult =
  | DirectiveRuntimeProofOpenRunnerSuccessResult
  | DirectiveRuntimeProofOpenRunnerInterruptedResult;

function buildDefaultRunnerId(caseId: string) {
  return `runtime-proof-open-${caseId}`;
}

function appendRunnerEvent(input: {
  directiveRoot: string;
  runnerId: string;
  caseId: string;
  record: DirectiveActionRunnerRecord;
  eventType: DirectiveActionRunnerEvent["eventType"];
  occurredAt: string;
  message: string;
}) {
  const sequence = nextDirectiveActionRunnerEventSequence({
    directiveRoot: input.directiveRoot,
    runnerId: input.runnerId,
  });
  appendDirectiveActionRunnerEvents({
    directiveRoot: input.directiveRoot,
    runnerId: input.runnerId,
    events: [
      {
        schemaVersion: 1,
        eventId: `${input.runnerId}:${sequence}:${input.eventType}`,
        runnerId: input.runnerId,
        caseId: input.caseId,
        actionKind: "runtime_proof_open",
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

function createRunnerRecord(input: {
  runnerId: string;
  caseId: string;
  actionPath: string;
  startedAt: string;
  updatedAt: string;
  attempts: number;
  lifecycleState: DirectiveActionRunnerRecord["lifecycleState"];
  checkpointStage: DirectiveActionRunnerRecord["checkpointStage"];
  lastError: DirectiveActionRunnerRecord["lastError"];
  actionResult: DirectiveActionRunnerRecord["actionResult"];
}) {
  return {
    schemaVersion: 1,
    runnerId: input.runnerId,
    caseId: input.caseId,
    actionKind: "runtime_proof_open",
    lifecycleState: input.lifecycleState,
    checkpointStage: input.checkpointStage,
    actionPath: input.actionPath,
    startedAt: input.startedAt,
    updatedAt: input.updatedAt,
    attempts: input.attempts,
    lastError: input.lastError,
    actionResult: input.actionResult,
  } satisfies DirectiveActionRunnerRecord;
}

function writeRunnerRecord(input: {
  directiveRoot: string;
  record: DirectiveActionRunnerRecord;
}) {
  return writeDirectiveActionRunnerRecord({
    directiveRoot: input.directiveRoot,
    record: input.record,
  }).record;
}

function toRunnerActionResult(input: {
  artifact: ReturnType<typeof readDirectiveRuntimeRecordArtifact>;
  result: ReturnType<typeof openDirectiveRuntimeRecordProof>;
}) {
  return {
    created: input.result.created,
    directiveRoot: input.result.directiveRoot,
    followUpRelativePath: input.artifact.linkedFollowUpRecord,
    runtimeRecordRelativePath: input.result.runtimeRecordRelativePath,
    runtimeRecordAbsolutePath: input.artifact.runtimeRecordAbsolutePath,
    runtimeProofRelativePath: input.result.runtimeProofRelativePath,
    runtimeProofAbsolutePath: input.result.runtimeProofAbsolutePath,
    candidateId: input.result.candidateId,
    candidateName: input.result.candidateName,
  } satisfies DirectiveRunnerActionResult;
}

function writeInterruptedRecord(input: {
  directiveRoot: string;
  runnerId: string;
  caseId: string;
  record: DirectiveActionRunnerRecord;
  checkpointStage: "before_action" | "after_action";
  occurredAt: string;
  reason: string;
}) {
  const interruptedRecord = writeRunnerRecord({
    directiveRoot: input.directiveRoot,
    record: {
      ...input.record,
      lifecycleState: "interrupted",
      checkpointStage: input.checkpointStage,
      updatedAt: input.occurredAt,
    },
  });

  appendRunnerEvent({
    directiveRoot: input.directiveRoot,
    runnerId: input.runnerId,
    caseId: input.caseId,
    record: interruptedRecord,
    eventType: "runner_interrupted",
    occurredAt: input.occurredAt,
    message: input.reason,
  });

  return interruptedRecord;
}

export function runDirectiveRuntimeProofOpenWithRunner(input: {
  runtimeRecordPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
  runnerId?: string | null;
  testInterruptPoint?: DirectiveRuntimeProofOpenRunnerInterruptionPoint;
}): DirectiveRuntimeProofOpenRunnerResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "run the Runtime proof opener through the checkpoint runner",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveRuntimeRecordArtifact({
    directiveRoot,
    runtimeRecordPath: input.runtimeRecordPath,
  });
  const caseId = artifact.candidateId;
  const runnerId = (input.runnerId || "").trim() || buildDefaultRunnerId(caseId);
  const existing = readDirectiveActionRunnerRecord({
    directiveRoot,
    runnerId,
  }).record;
  if (existing && existing.actionKind !== "runtime_proof_open") {
    throw new Error(`invalid_input: runner ${runnerId} is not a Runtime proof runner`);
  }

  const resumed = existing !== null;
  if (existing?.lifecycleState === "completed" && existing.actionResult) {
    return {
      ok: true,
      runnerId,
      caseId,
      resumed,
      replayedFromCheckpoint: true,
      lifecycleState: "completed",
      checkpointStage: "completed",
      actionResult: existing.actionResult,
    };
  }

  if (existing?.checkpointStage === "after_action" && existing.actionResult) {
    const completedAt = new Date().toISOString();
    const completedRecord = writeRunnerRecord({
      directiveRoot,
      record: {
        ...existing,
        lifecycleState: "completed",
        checkpointStage: "completed",
        updatedAt: completedAt,
        lastError: null,
      },
    });

    if (resumed) {
      appendRunnerEvent({
        directiveRoot,
        runnerId,
        caseId,
        record: completedRecord,
        eventType: "runner_resumed",
        occurredAt: completedAt,
        message: "Runner resumed from after_action checkpoint without re-executing the proof opener.",
      });
    }
    appendRunnerEvent({
      directiveRoot,
      runnerId,
      caseId,
      record: completedRecord,
      eventType: "runner_completed",
      occurredAt: completedAt,
      message: "Runner completed from stored after_action checkpoint.",
    });

    return {
      ok: true,
      runnerId,
      caseId,
      resumed,
      replayedFromCheckpoint: true,
      lifecycleState: "completed",
      checkpointStage: "completed",
      actionResult: completedRecord.actionResult!,
    };
  }

  const startedAt = existing?.startedAt ?? new Date().toISOString();
  const beforeActionAt = new Date().toISOString();
  const beforeActionRecord = writeRunnerRecord({
    directiveRoot,
    record: createRunnerRecord({
      runnerId,
      caseId,
      actionPath: artifact.runtimeRecordRelativePath,
      startedAt,
      updatedAt: beforeActionAt,
      attempts: (existing?.attempts ?? 0) + 1,
      lifecycleState: "running",
      checkpointStage: "before_action",
      lastError: null,
      actionResult: null,
    }),
  });

  appendRunnerEvent({
    directiveRoot,
    runnerId,
    caseId,
    record: beforeActionRecord,
    eventType: resumed ? "runner_resumed" : "runner_invoked",
    occurredAt: beforeActionAt,
    message: resumed
      ? "Runner resumed and restored the before_action checkpoint."
      : "Runner invoked for the first time.",
  });
  appendRunnerEvent({
    directiveRoot,
    runnerId,
    caseId,
    record: beforeActionRecord,
    eventType: "before_action_checkpointed",
    occurredAt: beforeActionAt,
    message: "Runner checkpointed before calling the Runtime proof opener.",
  });

  if (input.testInterruptPoint === "after_before_action_checkpoint") {
    writeInterruptedRecord({
      directiveRoot,
      runnerId,
      caseId,
      record: beforeActionRecord,
      checkpointStage: "before_action",
      occurredAt: new Date().toISOString(),
      reason: "Interrupted immediately after before_action checkpoint.",
    });
    return {
      ok: false,
      interrupted: true,
      runnerId,
      caseId,
      resumed,
      lifecycleState: "interrupted",
      checkpointStage: "before_action",
      reason: "Interrupted immediately after before_action checkpoint.",
    };
  }

  try {
    const actionResult = toRunnerActionResult({
      artifact,
      result: openDirectiveRuntimeRecordProof({
        directiveRoot,
        runtimeRecordPath: artifact.runtimeRecordRelativePath,
        approved: input.approved,
        approvedBy: input.approvedBy,
      }),
    });
    const afterActionAt = new Date().toISOString();
    const afterActionRecord = writeRunnerRecord({
      directiveRoot,
      record: {
        ...beforeActionRecord,
        lifecycleState: "running",
        checkpointStage: "after_action",
        updatedAt: afterActionAt,
        lastError: null,
        actionResult,
      },
    });

    appendRunnerEvent({
      directiveRoot,
      runnerId,
      caseId,
      record: afterActionRecord,
      eventType: "after_action_checkpointed",
      occurredAt: afterActionAt,
      message: "Runner checkpointed after the Runtime proof opener completed.",
    });

    if (input.testInterruptPoint === "after_after_action_checkpoint") {
      writeInterruptedRecord({
        directiveRoot,
        runnerId,
        caseId,
        record: afterActionRecord,
        checkpointStage: "after_action",
        occurredAt: new Date().toISOString(),
        reason: "Interrupted immediately after after_action checkpoint.",
      });
      return {
        ok: false,
        interrupted: true,
        runnerId,
        caseId,
        resumed,
        lifecycleState: "interrupted",
        checkpointStage: "after_action",
        reason: "Interrupted immediately after after_action checkpoint.",
      };
    }

    const completedAt = new Date().toISOString();
    const completedRecord = writeRunnerRecord({
      directiveRoot,
      record: {
        ...afterActionRecord,
        lifecycleState: "completed",
        checkpointStage: "completed",
        updatedAt: completedAt,
      },
    });

    appendRunnerEvent({
      directiveRoot,
      runnerId,
      caseId,
      record: completedRecord,
      eventType: "runner_completed",
      occurredAt: completedAt,
      message: "Runner completed after the after_action checkpoint.",
    });

    return {
      ok: true,
      runnerId,
      caseId,
      resumed,
      replayedFromCheckpoint: false,
      lifecycleState: "completed",
      checkpointStage: "completed",
      actionResult: completedRecord.actionResult!,
    };
  } catch (error) {
    const failedAt = new Date().toISOString();
    const message = error instanceof Error ? error.message : "unknown runner failure";
    const failedRecord = writeRunnerRecord({
      directiveRoot,
      record: {
        ...beforeActionRecord,
        lifecycleState: "failed",
        checkpointStage: "before_action",
        updatedAt: failedAt,
        lastError: {
          name: error instanceof Error ? error.name || "Error" : "Error",
          message,
          at: failedAt,
          stage: "before_action",
        },
      },
    });

    appendRunnerEvent({
      directiveRoot,
      runnerId,
      caseId,
      record: failedRecord,
      eventType: "runner_failed",
      occurredAt: failedAt,
      message,
    });
    throw error;
  }
}
