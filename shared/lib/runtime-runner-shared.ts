import {
  appendDirectiveActionRunnerEvents,
  nextDirectiveActionRunnerEventSequence,
  type DirectiveActionRunnerEvent,
  type DirectiveActionRunnerRecord,
  writeDirectiveActionRunnerRecord,
} from "./directive-runner-state.ts";

export function buildDirectiveRuntimeRunnerId(prefix: string, caseId: string) {
  return `${prefix}-${caseId}`;
}

export function appendDirectiveRuntimeRunnerEvent(input: {
  directiveRoot: string;
  runnerId: string;
  caseId: string;
  actionKind: DirectiveActionRunnerRecord["actionKind"];
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
        actionKind: input.actionKind,
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

export function createDirectiveRuntimeRunnerRecord(input: {
  runnerId: string;
  caseId: string;
  actionKind: DirectiveActionRunnerRecord["actionKind"];
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
    actionKind: input.actionKind,
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

export function writeDirectiveRuntimeRunnerRecord(input: {
  directiveRoot: string;
  record: DirectiveActionRunnerRecord;
}) {
  return writeDirectiveActionRunnerRecord({
    directiveRoot: input.directiveRoot,
    record: input.record,
  }).record;
}

export function writeInterruptedDirectiveRuntimeRunnerRecord(input: {
  directiveRoot: string;
  runnerId: string;
  caseId: string;
  actionKind: DirectiveActionRunnerRecord["actionKind"];
  record: DirectiveActionRunnerRecord;
  checkpointStage: "before_action" | "after_action";
  occurredAt: string;
  reason: string;
}) {
  const interruptedRecord = writeDirectiveRuntimeRunnerRecord({
    directiveRoot: input.directiveRoot,
    record: {
      ...input.record,
      lifecycleState: "interrupted",
      checkpointStage: input.checkpointStage,
      updatedAt: input.occurredAt,
    },
  });

  appendDirectiveRuntimeRunnerEvent({
    directiveRoot: input.directiveRoot,
    runnerId: input.runnerId,
    caseId: input.caseId,
    actionKind: input.actionKind,
    record: interruptedRecord,
    eventType: "runner_interrupted",
    occurredAt: input.occurredAt,
    message: input.reason,
  });

  return interruptedRecord;
}
