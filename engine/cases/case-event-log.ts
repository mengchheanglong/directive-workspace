import fs from "node:fs";
import path from "node:path";

export type DirectiveCaseMirrorEventType =
  | "source_submitted"
  | "triaged"
  | "routed"
  | "note_architecture_closed"
  | "runtime_follow_up_opened"
  | "runtime_proof_opened"
  | "runtime_capability_boundary_opened"
  | "runtime_promotion_readiness_opened"
  | "state_materialized";

export type DirectiveCaseMirrorEvent = {
  schemaVersion: 1;
  eventId: string;
  caseId: string;
  candidateId: string;
  candidateName: string;
  sequence: number;
  eventType: DirectiveCaseMirrorEventType;
  occurredAt: string;
  queueStatus: string | null;
  routeTarget: string | null;
  operatingMode: string | null;
  linkedArtifactPath: string | null;
  decisionState?: string | null;
  currentHeadPath?: string | null;
  currentStage?: string | null;
  nextLegalStep?: string | null;
};

function normalizeAbsolutePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJsonLines<T>(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return [] as T[];
  }

  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as T);
}

function appendJsonLine(filePath: string, value: unknown) {
  ensureParentDir(filePath);
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function sanitizeCaseId(value: string) {
  return String(value)
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function resolveDirectiveCaseEventLogPath(input: {
  directiveRoot: string;
  caseId: string;
}) {
  const fileName = `${sanitizeCaseId(input.caseId) || "directive-case"}.jsonl`;
  return normalizeAbsolutePath(
    path.join(input.directiveRoot, "state", "case-events", fileName),
  );
}

export function readDirectiveCaseMirrorEvents(input: {
  directiveRoot: string;
  caseId: string;
}) {
  const eventLogPath = resolveDirectiveCaseEventLogPath(input);
  return {
    eventLogPath,
    events: readJsonLines<DirectiveCaseMirrorEvent>(eventLogPath),
  };
}

export function appendDirectiveCaseMirrorEvents(input: {
  directiveRoot: string;
  caseId: string;
  events: DirectiveCaseMirrorEvent[];
}) {
  const { eventLogPath, events: existingEvents } = readDirectiveCaseMirrorEvents({
    directiveRoot: input.directiveRoot,
    caseId: input.caseId,
  });
  const existingIds = new Set(existingEvents.map((event) => event.eventId));
  const appendedEvents: DirectiveCaseMirrorEvent[] = [];

  for (const event of input.events) {
    if (existingIds.has(event.eventId)) {
      continue;
    }

    appendJsonLine(eventLogPath, event);
    existingIds.add(event.eventId);
    appendedEvents.push(event);
  }

  return {
    eventLogPath,
    appendedEvents,
    events: [...existingEvents, ...appendedEvents],
  };
}
