import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appendDirectiveCaseMirrorEvents } from "../engine/cases/case-event-log.ts";
import { materializeDirectiveMirroredCaseSnapshot } from "../engine/cases/case-snapshot.ts";
import {
  writeDirectiveMirroredDiscoveryCaseRecord,
  type DirectiveMirroredDiscoveryCaseRecord,
} from "../engine/cases/case-store.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../discovery/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import type { DiscoveryIntakeQueueEntry } from "../discovery/lib/discovery-intake-queue-writer.ts";
import { readJson } from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GOLDEN_CANDIDATE_IDS = [
  "dw-source-openevals-2026-03-28",
  "dw-source-inspect-ai-2026-03-28",
  "dw-source-promptwizard-2026-03-28",
  "dw-source-ts-edge-2026-03-27",
  "dw-source-scientify-research-workflow-plugin-2026-03-27",
] as const;

function loadGoldenQueueEntries() {
  const queueDocument = readJson<{ entries: DiscoveryIntakeQueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );
  return GOLDEN_CANDIDATE_IDS.map((candidateId) => {
    const entry = queueDocument.entries.find((item) => item.candidate_id === candidateId) ?? null;
    assert.ok(entry, `Golden case missing from discovery queue: ${candidateId}`);
    assert.ok(entry?.routing_record_path, `Golden case missing routing record: ${candidateId}`);
    return entry as DiscoveryIntakeQueueEntry;
  });
}

function buildMirroredRecord(input: {
  queueEntry: DiscoveryIntakeQueueEntry;
  routing: ReturnType<typeof readDirectiveDiscoveryRoutingArtifact>;
  authoritative: NonNullable<ReturnType<typeof resolveDirectiveWorkspaceState>["focus"]>;
}): DirectiveMirroredDiscoveryCaseRecord {
  return {
    schemaVersion: 1,
    mirrorKind: "discovery_front_door_submission",
    caseId: input.queueEntry.candidate_id,
    candidateId: input.queueEntry.candidate_id,
    candidateName: input.queueEntry.candidate_name,
    sourceType: input.queueEntry.source_type,
    sourceReference: input.queueEntry.source_reference,
    decisionState: input.routing.decisionState,
    routeTarget: input.authoritative.routeTarget,
    operatingMode: input.queueEntry.operating_mode ?? null,
    queueStatus: input.queueEntry.status,
    createdAt: input.routing.routingDate,
    updatedAt: input.routing.routingDate,
    linkedArtifacts: {
      intakeRecordPath: input.routing.linkedIntakeRecord,
      triageRecordPath: input.routing.linkedTriageRecord,
      routingRecordPath: input.routing.routingRelativePath,
      engineRunRecordPath: input.routing.engineRunRecordPath,
      engineRunReportPath: input.routing.engineRunReportPath,
      resultRecordPath: input.queueEntry.result_record_path ?? null,
    },
  };
}

async function main() {
  const goldenEntries = loadGoldenQueueEntries();

  await withTempDirectiveRoot({ prefix: "directive-case-snapshot-parity-" }, async (directiveRoot) => {
    const results = [];

    for (const queueEntry of goldenEntries) {
      const routing = readDirectiveDiscoveryRoutingArtifact({
        directiveRoot: DIRECTIVE_ROOT,
        routingPath: queueEntry.routing_record_path ?? "",
      });
      const authoritative = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: queueEntry.routing_record_path ?? null,
      });
      const authoritativeFocus = authoritative.focus;
      assert.ok(authoritativeFocus?.ok, `Authoritative focus failed: ${queueEntry.candidate_id}`);

      const record = buildMirroredRecord({
        queueEntry,
        routing,
        authoritative: authoritativeFocus,
      });
      writeDirectiveMirroredDiscoveryCaseRecord({
        directiveRoot,
        record,
      });

      appendDirectiveCaseMirrorEvents({
        directiveRoot,
        caseId: queueEntry.candidate_id,
        events: [
          {
            schemaVersion: 1,
            eventId: `${queueEntry.candidate_id}:source_submitted:backfill-v1`,
            caseId: queueEntry.candidate_id,
            candidateId: queueEntry.candidate_id,
            candidateName: queueEntry.candidate_name,
            sequence: 1,
            eventType: "source_submitted",
            occurredAt: `${routing.routingDate}T00:00:00.000Z`,
            queueStatus: "pending",
            routeTarget: null,
            operatingMode: queueEntry.operating_mode ?? null,
            linkedArtifactPath: routing.linkedIntakeRecord,
            decisionState: null,
          },
          {
            schemaVersion: 1,
            eventId: `${queueEntry.candidate_id}:triaged:backfill-v1`,
            caseId: queueEntry.candidate_id,
            candidateId: queueEntry.candidate_id,
            candidateName: queueEntry.candidate_name,
            sequence: 2,
            eventType: "triaged",
            occurredAt: `${routing.routingDate}T00:00:00.000Z`,
            queueStatus: "pending",
            routeTarget: null,
            operatingMode: queueEntry.operating_mode ?? null,
            linkedArtifactPath: routing.linkedTriageRecord,
            decisionState: null,
          },
          {
            schemaVersion: 1,
            eventId: `${queueEntry.candidate_id}:routed:backfill-v1`,
            caseId: queueEntry.candidate_id,
            candidateId: queueEntry.candidate_id,
            candidateName: queueEntry.candidate_name,
            sequence: 3,
            eventType: "routed",
            occurredAt: `${routing.routingDate}T00:00:00.000Z`,
            queueStatus: "routed",
            routeTarget: authoritativeFocus.routeTarget,
            operatingMode: queueEntry.operating_mode ?? null,
            linkedArtifactPath: routing.routingRelativePath,
            decisionState: routing.decisionState,
          },
          {
            schemaVersion: 1,
            eventId: `${queueEntry.candidate_id}:state_materialized:backfill-v1`,
            caseId: queueEntry.candidate_id,
            candidateId: queueEntry.candidate_id,
            candidateName: queueEntry.candidate_name,
            sequence: 4,
            eventType: "state_materialized",
            occurredAt: `${routing.routingDate}T00:00:00.000Z`,
            queueStatus: queueEntry.status,
            routeTarget: authoritativeFocus.routeTarget,
            operatingMode: queueEntry.operating_mode ?? null,
            linkedArtifactPath: authoritativeFocus.currentHead.artifactPath,
            decisionState: routing.decisionState,
            currentHeadPath: authoritativeFocus.currentHead.artifactPath,
            currentStage: authoritativeFocus.currentStage,
            nextLegalStep: authoritativeFocus.nextLegalStep,
          },
        ],
      });

      const snapshotA = materializeDirectiveMirroredCaseSnapshot({
        directiveRoot,
        caseId: queueEntry.candidate_id,
      });
      const snapshotB = materializeDirectiveMirroredCaseSnapshot({
        directiveRoot,
        caseId: queueEntry.candidate_id,
      });
      assert.deepEqual(snapshotA, snapshotB, `Snapshot replay was not deterministic: ${queueEntry.candidate_id}`);
      assert.equal(snapshotA.ok, true, `Snapshot materialization failed: ${queueEntry.candidate_id}`);

      assert.equal(snapshotA.candidateId, authoritativeFocus.candidateId);
      assert.equal(snapshotA.candidateName, authoritativeFocus.candidateName);
      assert.equal(snapshotA.routeTarget, authoritativeFocus.routeTarget);
      assert.equal(snapshotA.operatingMode, authoritativeFocus.discovery.operatingMode);
      assert.equal(snapshotA.queueStatus, authoritativeFocus.discovery.queueStatus);
      assert.equal(snapshotA.currentHeadPath, authoritativeFocus.currentHead.artifactPath);
      assert.equal(snapshotA.currentStage, authoritativeFocus.currentStage);
      assert.equal(snapshotA.nextLegalStep, authoritativeFocus.nextLegalStep);
      assert.equal(snapshotA.linkedArtifacts.intakeRecordPath, authoritativeFocus.linkedArtifacts.discoveryIntakePath);
      assert.equal(snapshotA.linkedArtifacts.triageRecordPath, authoritativeFocus.linkedArtifacts.discoveryTriagePath);
      assert.equal(snapshotA.linkedArtifacts.routingRecordPath, authoritativeFocus.linkedArtifacts.discoveryRoutingPath);
      assert.equal(snapshotA.linkedArtifacts.engineRunRecordPath, authoritativeFocus.linkedArtifacts.engineRunRecordPath);
      assert.equal(snapshotA.linkedArtifacts.engineRunReportPath, authoritativeFocus.linkedArtifacts.engineRunReportPath);
      assert.equal(
        snapshotA.linkedArtifacts.resultRecordPath,
        queueEntry.result_record_path ?? null,
      );

      results.push({
        candidateId: snapshotA.candidateId,
        routeTarget: snapshotA.routeTarget,
        operatingMode: snapshotA.operatingMode,
        queueStatus: snapshotA.queueStatus,
        currentHeadPath: snapshotA.currentHeadPath,
        currentStage: snapshotA.currentStage,
      });
    }

    process.stdout.write(`${JSON.stringify({ ok: true, checked: results }, null, 2)}\n`);
  });
}

await main();
