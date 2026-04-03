import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import {
  writeDirectiveMirroredDiscoveryCaseRecord,
  readDirectiveMirroredDiscoveryCaseRecord,
  type DirectiveMirroredDiscoveryCaseRecord,
} from "../shared/lib/case-store.ts";
import {
  appendDirectiveCaseMirrorEvents,
  readDirectiveCaseMirrorEvents,
  type DirectiveCaseMirrorEvent,
} from "../shared/lib/case-event-log.ts";

/**
 * Backfill case models for all queue entries that don't have one yet.
 *
 * For entries with routing_record_path, resolves through the canonical surface
 * to populate currentStage and nextLegalStep so the case planner can operate.
 *
 * For entries without routing_record_path (legacy), creates minimal case records
 * from queue metadata.
 */

const DIRECTIVE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  received_at: string;
  status: string;
  routing_target: string | null;
  operating_mode: string | null;
  routed_at: string | null;
  completed_at: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
  fast_path_record_path?: string | null;
  capability_gap_id?: string | null;
  notes?: string | null;
};

type BackfillResult = {
  totalEntries: number;
  alreadyHadCaseFile: number;
  backfilled: number;
  backfilledWithCanonicalResolution: number;
  backfilledMinimal: number;
  errors: string[];
};

function readQueueEntries(): QueueEntry[] {
  const queuePath = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
  const data = JSON.parse(fs.readFileSync(queuePath, "utf8")) as {
    entries?: QueueEntry[];
  };
  return data.entries ?? [];
}

function resolveCanonicalState(routingRecordPath: string) {
  try {
    const state = resolveDirectiveWorkspaceState({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: routingRecordPath,
      includeAnchors: false,
    });
    if (!state.focus) return null;
    return {
      currentStage: state.focus.currentStage as string | null,
      nextLegalStep: state.focus.nextLegalStep as string | null,
      artifactStage: state.focus.artifactStage as string | null,
      integrityState: state.focus.integrityState as string | null,
      currentHeadPath: (state.focus as Record<string, unknown>).currentHeadPath as string | null ?? null,
      routeTarget: state.focus.routeTarget as string | null,
      candidateId: state.focus.candidateId as string | null,
    };
  } catch {
    return null;
  }
}

function inferLinkedArtifacts(entry: QueueEntry) {
  const base: DirectiveMirroredDiscoveryCaseRecord["linkedArtifacts"] = {
    intakeRecordPath: entry.fast_path_record_path ?? null,
    triageRecordPath: null,
    routingRecordPath: entry.routing_record_path ?? null,
    engineRunRecordPath: null,
    engineRunReportPath: null,
    architectureHandoffPath: null,
    architectureDecisionPath: null,
    runtimeFollowUpPath: null,
    runtimeRecordPath: null,
    runtimeProofPath: null,
    runtimeCapabilityBoundaryPath: null,
    runtimePromotionReadinessPath: null,
    resultRecordPath: entry.result_record_path ?? null,
  };
  return base;
}

function mapDecisionState(entry: QueueEntry): string {
  if (entry.routing_target === "reject") return "reject";
  if (entry.routing_target === "defer" || entry.routing_target === "monitor") return "defer";
  if (entry.routing_target === "reference") return "reference";
  if (entry.routing_target === "architecture") return "adopt";
  if (entry.routing_target === "runtime") return "adopt";
  return "pending";
}

function backfillEntry(
  entry: QueueEntry,
  result: BackfillResult,
): void {
  const candidateId = entry.candidate_id;

  const existing = readDirectiveMirroredDiscoveryCaseRecord({
    directiveRoot: DIRECTIVE_ROOT,
    caseId: candidateId,
  });

  if (existing.record) {
    result.alreadyHadCaseFile += 1;
    // Even if the record exists, ensure state_materialized event is present
    // if we can resolve canonical state
    if (entry.routing_record_path) {
      const canonical = resolveCanonicalState(entry.routing_record_path);
      if (canonical?.currentStage) {
        ensureStateMaterializedEvent(candidateId, entry, canonical);
      }
    }
    return;
  }

  const linkedArtifacts = inferLinkedArtifacts(entry);
  const receivedAt = `${entry.received_at}T00:00:00.000Z`;

  const record: DirectiveMirroredDiscoveryCaseRecord = {
    schemaVersion: 1,
    mirrorKind: "discovery_front_door_submission",
    caseId: candidateId,
    candidateId,
    candidateName: entry.candidate_name,
    sourceType: entry.source_type,
    sourceReference: entry.source_reference,
    decisionState: mapDecisionState(entry),
    routeTarget: entry.routing_target,
    operatingMode: entry.operating_mode,
    queueStatus: entry.status,
    createdAt: receivedAt,
    updatedAt: receivedAt,
    linkedArtifacts,
    projectionInputs: null,
  };

  writeDirectiveMirroredDiscoveryCaseRecord({
    directiveRoot: DIRECTIVE_ROOT,
    record,
  });

  // Build initial events
  const events: DirectiveCaseMirrorEvent[] = [
    {
      schemaVersion: 1,
      eventId: `${candidateId}:source_submitted:v1`,
      caseId: candidateId,
      candidateId,
      candidateName: entry.candidate_name,
      sequence: 1,
      eventType: "source_submitted",
      occurredAt: receivedAt,
      queueStatus: "pending",
      routeTarget: entry.routing_target,
      operatingMode: entry.operating_mode,
      linkedArtifactPath: linkedArtifacts.intakeRecordPath,
    },
  ];

  if (entry.routed_at) {
    events.push({
      schemaVersion: 1,
      eventId: `${candidateId}:routed:v1`,
      caseId: candidateId,
      candidateId,
      candidateName: entry.candidate_name,
      sequence: 2,
      eventType: "routed",
      occurredAt: `${entry.routed_at}T00:00:00.000Z`,
      queueStatus: entry.status,
      routeTarget: entry.routing_target,
      operatingMode: entry.operating_mode,
      linkedArtifactPath: linkedArtifacts.routingRecordPath,
    });
  }

  appendDirectiveCaseMirrorEvents({
    directiveRoot: DIRECTIVE_ROOT,
    caseId: candidateId,
    events,
  });

  // Resolve canonical state and add state_materialized event
  if (entry.routing_record_path) {
    const canonical = resolveCanonicalState(entry.routing_record_path);
    if (canonical?.currentStage) {
      ensureStateMaterializedEvent(candidateId, entry, canonical);
      result.backfilledWithCanonicalResolution += 1;
    } else {
      result.backfilledMinimal += 1;
    }
  } else {
    result.backfilledMinimal += 1;
  }

  result.backfilled += 1;
}

function ensureStateMaterializedEvent(
  candidateId: string,
  entry: QueueEntry,
  canonical: NonNullable<ReturnType<typeof resolveCanonicalState>>,
) {
  const existingEvents = readDirectiveCaseMirrorEvents({
    directiveRoot: DIRECTIVE_ROOT,
    caseId: candidateId,
  });

  // Skip if a state_materialized event already exists with the same stage
  const hasMatchingMaterialized = existingEvents.events.some(
    (e) =>
      e.eventType === "state_materialized"
      && e.currentStage === canonical.currentStage,
  );
  if (hasMatchingMaterialized) return;

  const nextSequence =
    existingEvents.events.reduce(
      (max, e) => Math.max(max, e.sequence),
      0,
    ) + 1;

  const event: DirectiveCaseMirrorEvent = {
    schemaVersion: 1,
    eventId: `${candidateId}:state_materialized:backfill_v1`,
    caseId: candidateId,
    candidateId,
    candidateName: entry.candidate_name,
    sequence: nextSequence,
    eventType: "state_materialized",
    occurredAt: new Date().toISOString(),
    queueStatus: entry.status,
    routeTarget: canonical.routeTarget ?? entry.routing_target,
    operatingMode: entry.operating_mode,
    linkedArtifactPath: canonical.currentHeadPath,
    currentHeadPath: canonical.currentHeadPath,
    currentStage: canonical.currentStage,
    nextLegalStep: canonical.nextLegalStep,
  };

  appendDirectiveCaseMirrorEvents({
    directiveRoot: DIRECTIVE_ROOT,
    caseId: candidateId,
    events: [event],
  });
}

function main() {
  const entries = readQueueEntries();
  const result: BackfillResult = {
    totalEntries: entries.length,
    alreadyHadCaseFile: 0,
    backfilled: 0,
    backfilledWithCanonicalResolution: 0,
    backfilledMinimal: 0,
    errors: [],
  };

  for (const entry of entries) {
    try {
      backfillEntry(entry, result);
    } catch (err) {
      result.errors.push(
        `${entry.candidate_id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (result.errors.length > 0) {
    process.exit(1);
  }
}

main();
