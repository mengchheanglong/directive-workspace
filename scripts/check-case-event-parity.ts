import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readDirectiveCaseMirrorEvents } from "../engine/cases/case-event-log.ts";
import {
  mirrorDirectiveDiscoveryFrontDoorSubmission,
  readDirectiveMirroredDiscoveryCaseRecord,
} from "../engine/cases/case-store.ts";
import { submitDirectiveDiscoveryFrontDoor } from "../discovery/lib/discovery-front-door.ts";
import { writeJson } from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}



async function main() {
  await withTempDirectiveRoot({ prefix: "directive-case-event-parity-" }, async (directiveRoot) => {
    writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), {
      status: "primary",
      updatedAt: "2026-03-29",
      entries: [],
    });
    writeJson(path.join(directiveRoot, "discovery", "capability-gaps.json"), {
      status: "active",
      updatedAt: "2026-03-29",
      gaps: [
        {
          gap_id: "gap-directive-engine-materialization",
          description: "Canonical Directive Workspace engine surface remains only partially materialized.",
          priority: "high",
          related_mission_objective: "Directive engine materialization",
          current_state: "Source intake and routing still live partly outside the state-first substrate.",
          desired_state: "Source intake and routing emit durable mirrored case/event state in parallel with current artifacts.",
          detected_at: "2026-03-29",
          resolved_at: null,
        },
      ],
    });
    ensureParentDir(path.join(directiveRoot, "knowledge", "active-mission.md"));
    fs.copyFileSync(
      path.join(DIRECTIVE_ROOT, "knowledge", "active-mission.md"),
      path.join(directiveRoot, "knowledge", "active-mission.md"),
    );

    const result = await submitDirectiveDiscoveryFrontDoor({
      directiveRoot,
      request: {
        candidate_id: "phase-1a-case-event-parity-check",
        candidate_name: "Phase 1A Case Event Parity Check",
        source_type: "github-repo",
        source_reference: "https://github.com/langchain-ai/openevals",
        mission_alignment:
          "Exercise the real Discovery front door while keeping current read truth unchanged.",
        capability_gap_id: "gap-directive-engine-materialization",
        operating_mode: "note",
      },
      receivedAt: "2026-03-29T00:00:00.000Z",
    });

    const mirrored = readDirectiveMirroredDiscoveryCaseRecord({
      directiveRoot,
      caseId: result.candidateId,
    });
    assert.ok(mirrored.record, "Mirrored case record was not written");
    assert.equal(mirrored.record?.candidateId, result.candidateId);
    assert.equal(mirrored.record?.routeTarget, result.discovery.routingTarget);
    assert.equal(mirrored.record?.operatingMode, result.queueEntry.operating_mode ?? null);
    assert.equal(mirrored.record?.queueStatus, result.queueEntry.status);
    assert.deepEqual(mirrored.record?.linkedArtifacts, {
      intakeRecordPath: result.createdPaths.intakeRecordPath,
      triageRecordPath: result.createdPaths.triageRecordPath,
      routingRecordPath: result.createdPaths.routingRecordPath,
      engineRunRecordPath: result.engine.recordRelativePath,
      engineRunReportPath: result.engine.reportRelativePath,
      architectureHandoffPath: null,
      architectureDecisionPath: null,
      runtimeFollowUpPath: null,
      runtimeRecordPath: null,
      runtimeProofPath: null,
      runtimeCapabilityBoundaryPath: null,
      runtimePromotionReadinessPath: null,
      resultRecordPath: null,
    });

    const initialEvents = readDirectiveCaseMirrorEvents({
      directiveRoot,
      caseId: result.candidateId,
    });
    assert.deepEqual(
      initialEvents.events.map((event) => event.eventType),
      ["source_submitted", "triaged", "routed"],
      "Mirrored event sequence did not match the minimal Phase 1A contract",
    );

    const rerun = mirrorDirectiveDiscoveryFrontDoorSubmission({
      directiveRoot,
      caseId: result.candidateId,
      candidateId: result.candidateId,
      candidateName: result.queueEntry.candidate_name,
      sourceType: result.queueEntry.source_type,
      sourceReference: result.queueEntry.source_reference,
      receivedAt: "2026-03-29T00:00:00.000Z",
      decisionState: result.discovery.decisionState,
      routeTarget: result.discovery.routingTarget,
      operatingMode: result.queueEntry.operating_mode ?? null,
      queueStatus: result.queueEntry.status,
      linkedArtifacts: {
        intakeRecordPath: result.createdPaths.intakeRecordPath,
        triageRecordPath: result.createdPaths.triageRecordPath,
        routingRecordPath: result.createdPaths.routingRecordPath,
        engineRunRecordPath: result.engine.recordRelativePath,
        engineRunReportPath: result.engine.reportRelativePath,
      },
    });
    assert.equal(
      rerun.appendedEvents.length,
      0,
      "Reapplying the same successful front-door mirror should not append duplicate events",
    );

    const finalEvents = readDirectiveCaseMirrorEvents({
      directiveRoot,
      caseId: result.candidateId,
    });
    assert.equal(finalEvents.events.length, 3, "Mirror rerun created duplicate events");

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          candidateId: result.candidateId,
          routeTarget: result.discovery.routingTarget,
          queueStatus: result.queueEntry.status,
          caseRecordPath: path.relative(directiveRoot, mirrored.caseRecordPath).replace(/\\/g, "/"),
          eventLogPath: path.relative(directiveRoot, initialEvents.eventLogPath).replace(/\\/g, "/"),
          eventTypes: finalEvents.events.map((event) => event.eventType),
        },
        null,
        2,
      )}\n`,
    );
  });
}

await main();
