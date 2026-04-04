import {
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveExplicitApproval,
} from "../../engine/approval-boundary.ts";
import {
  readDirectiveActionRunnerRecord,
  type DirectiveActionRunnerRecord,
  type DirectiveRunnerActionResult,
} from "./directive-runner-state.ts";
import {
  openDirectiveRuntimeProofRuntimeCapabilityBoundary,
  readDirectiveRuntimeProofArtifact,
} from "./runtime-proof-runtime-capability-boundary-opener.ts";
import {
  appendDirectiveRuntimeRunnerEvent,
  buildDirectiveRuntimeRunnerId,
  createDirectiveRuntimeRunnerRecord,
  writeDirectiveRuntimeRunnerRecord,
  writeInterruptedDirectiveRuntimeRunnerRecord,
} from "./runtime-runner-shared.ts";

export type DirectiveRuntimeCapabilityBoundaryRunnerInterruptionPoint =
  | "after_before_action_checkpoint"
  | "after_after_action_checkpoint";

export type DirectiveRuntimeCapabilityBoundaryRunnerSuccessResult = {
  ok: true;
  runnerId: string;
  caseId: string;
  resumed: boolean;
  replayedFromCheckpoint: boolean;
  lifecycleState: "completed";
  checkpointStage: "completed";
  actionResult: DirectiveRunnerActionResult;
};

export type DirectiveRuntimeCapabilityBoundaryRunnerInterruptedResult = {
  ok: false;
  interrupted: true;
  runnerId: string;
  caseId: string;
  resumed: boolean;
  lifecycleState: "interrupted";
  checkpointStage: "before_action" | "after_action";
  reason: string;
};

export type DirectiveRuntimeCapabilityBoundaryRunnerResult =
  | DirectiveRuntimeCapabilityBoundaryRunnerSuccessResult
  | DirectiveRuntimeCapabilityBoundaryRunnerInterruptedResult;

const RUNNER_ID_PREFIX = "runtime-capability-boundary-open";
const RUNNER_ACTION_KIND = "runtime_capability_boundary_open";

function appendRunnerEvent(input: {
  directiveRoot: string;
  runnerId: string;
  caseId: string;
  record: DirectiveActionRunnerRecord;
  eventType: "runner_started" | "runner_resumed" | "runner_completed" | "runner_interrupted";
  occurredAt: string;
  message: string;
}) {
  appendDirectiveRuntimeRunnerEvent({
    ...input,
    actionKind: RUNNER_ACTION_KIND,
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
  return createDirectiveRuntimeRunnerRecord({
    ...input,
    actionKind: RUNNER_ACTION_KIND,
  });
}

function writeRunnerRecord(input: {
  directiveRoot: string;
  record: DirectiveActionRunnerRecord;
}) {
  return writeDirectiveRuntimeRunnerRecord(input);
}

function toRunnerActionResult(input: {
  artifact: ReturnType<typeof readDirectiveRuntimeProofArtifact>;
  result: ReturnType<typeof openDirectiveRuntimeProofRuntimeCapabilityBoundary>;
}) {
  return {
    created: input.result.created,
    directiveRoot: input.result.directiveRoot,
    followUpRelativePath: input.artifact.linkedFollowUpPath,
    runtimeRecordRelativePath: input.artifact.linkedRuntimeRecordPath,
    runtimeRecordAbsolutePath: input.artifact.runtimeRecordArtifact.runtimeRecordAbsolutePath,
    runtimeProofRelativePath: input.result.runtimeProofRelativePath,
    runtimeProofAbsolutePath: input.artifact.runtimeProofAbsolutePath,
    runtimeCapabilityBoundaryRelativePath: input.result.runtimeCapabilityBoundaryRelativePath,
    runtimeCapabilityBoundaryAbsolutePath: input.result.runtimeCapabilityBoundaryAbsolutePath,
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
  return writeInterruptedDirectiveRuntimeRunnerRecord({
    ...input,
    actionKind: RUNNER_ACTION_KIND,
  });
}

export function runDirectiveRuntimeCapabilityBoundaryWithRunner(input: {
  runtimeProofPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
  runnerId?: string | null;
  testInterruptPoint?: DirectiveRuntimeCapabilityBoundaryRunnerInterruptionPoint;
}): DirectiveRuntimeCapabilityBoundaryRunnerResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "run the Runtime capability-boundary opener through the checkpoint runner",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveRuntimeProofArtifact({
    directiveRoot,
    runtimeProofPath: input.runtimeProofPath,
  });
  const caseId = artifact.candidateId;
  const runnerId = (input.runnerId || "").trim() || buildDirectiveRuntimeRunnerId(RUNNER_ID_PREFIX, caseId);
  const existing = readDirectiveActionRunnerRecord({
    directiveRoot,
    runnerId,
  }).record;
  if (existing && existing.actionKind !== "runtime_capability_boundary_open") {
    throw new Error(`invalid_input: runner ${runnerId} is not a Runtime capability-boundary runner`);
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
        message: "Runner resumed from after_action checkpoint without re-executing the capability-boundary opener.",
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
      actionPath: artifact.runtimeProofRelativePath,
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
    message: "Runner checkpointed before calling the Runtime capability-boundary opener.",
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
      result: openDirectiveRuntimeProofRuntimeCapabilityBoundary({
        directiveRoot,
        runtimeProofPath: artifact.runtimeProofRelativePath,
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
      message: "Runner checkpointed after the Runtime capability-boundary opener completed.",
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
