import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appendDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE } from "../engine/workspace-truth.ts";
import { planDirectiveMirroredCaseNextStep } from "../shared/lib/case-planner.ts";
import { materializeDirectiveMirroredCaseSnapshot } from "../shared/lib/case-snapshot.ts";
import {
  writeDirectiveMirroredDiscoveryCaseRecord,
  type DirectiveMirroredDiscoveryCaseRecord,
} from "../shared/lib/case-store.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  status: string;
  routing_target: string | null;
  operating_mode?: string | null;
  intake_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GOLDEN_CANDIDATE_IDS = [
  "dw-source-openevals-2026-03-28",
  "dw-source-inspect-ai-2026-03-28",
  "dw-source-promptwizard-2026-03-28",
  "dw-source-ts-edge-2026-03-27",
  "dw-source-scientify-research-workflow-plugin-2026-03-27",
  "dw-pressure-openmoss-architecture-loop-2026-03-26",
  "dw-mission-core-principles-operating-discipline-2026-03-26",
  "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26",
] as const;

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

async function withTempDirectiveRoot(run: (directiveRoot: string) => Promise<void> | void) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-case-planner-parity-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    await run(directiveRoot);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function loadGoldenQueueEntries() {
  const queueDocument = readJson<{ entries: QueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );
  return GOLDEN_CANDIDATE_IDS.map((candidateId) => {
    const entry = queueDocument.entries.find((item) => item.candidate_id === candidateId) ?? null;
    assert.ok(entry, `Golden case missing from discovery queue: ${candidateId}`);
    assert.ok(entry?.routing_record_path, `Golden case missing routing record: ${candidateId}`);
    return entry as QueueEntry;
  });
}

function buildMirroredRecord(input: {
  queueEntry: QueueEntry;
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

function expectedOutcomeForCase(input: {
  candidateId: string;
}) {
  switch (input.candidateId) {
    case "dw-source-openevals-2026-03-28":
    case "dw-source-inspect-ai-2026-03-28":
    case "dw-source-promptwizard-2026-03-28":
      return "stop";
    case "dw-source-ts-edge-2026-03-27":
    case "dw-source-scientify-research-workflow-plugin-2026-03-27":
    case "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26":
      return "parked";
    case "dw-pressure-openmoss-architecture-loop-2026-03-26":
      return "waiting_review";
    case "dw-mission-core-principles-operating-discipline-2026-03-26":
      return "recommend_task";
    default:
      throw new Error(`Missing expected planner outcome for ${input.candidateId}`);
  }
}

async function main() {
  const goldenEntries = loadGoldenQueueEntries();

  await withTempDirectiveRoot(async (directiveRoot) => {
    const checked = [];

    for (const queueEntry of goldenEntries) {
      const routing = readDirectiveDiscoveryRoutingArtifact({
        directiveRoot: DIRECTIVE_ROOT,
        routingPath: queueEntry.routing_record_path ?? "",
      });
      const authoritative = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: queueEntry.routing_record_path ?? null,
      });
      const focus = authoritative.focus;
      assert.ok(focus?.ok, `Authoritative focus failed: ${queueEntry.candidate_id}`);

      writeDirectiveMirroredDiscoveryCaseRecord({
        directiveRoot,
        record: buildMirroredRecord({
          queueEntry,
          routing,
          authoritative: focus,
        }),
      });

      appendDirectiveCaseMirrorEvents({
        directiveRoot,
        caseId: queueEntry.candidate_id,
        events: [
          {
            schemaVersion: 1,
            eventId: `${queueEntry.candidate_id}:source_submitted:planner-backfill-v1`,
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
            eventId: `${queueEntry.candidate_id}:triaged:planner-backfill-v1`,
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
            eventId: `${queueEntry.candidate_id}:routed:planner-backfill-v1`,
            caseId: queueEntry.candidate_id,
            candidateId: queueEntry.candidate_id,
            candidateName: queueEntry.candidate_name,
            sequence: 3,
            eventType: "routed",
            occurredAt: `${routing.routingDate}T00:00:00.000Z`,
            queueStatus: "routed",
            routeTarget: focus.routeTarget,
            operatingMode: queueEntry.operating_mode ?? null,
            linkedArtifactPath: routing.routingRelativePath,
            decisionState: routing.decisionState,
          },
          {
            schemaVersion: 1,
            eventId: `${queueEntry.candidate_id}:state_materialized:planner-backfill-v1`,
            caseId: queueEntry.candidate_id,
            candidateId: queueEntry.candidate_id,
            candidateName: queueEntry.candidate_name,
            sequence: 4,
            eventType: "state_materialized",
            occurredAt: `${routing.routingDate}T00:00:00.000Z`,
            queueStatus: focus.discovery.queueStatus,
            routeTarget: focus.routeTarget,
            operatingMode: focus.discovery.operatingMode,
            linkedArtifactPath: focus.currentHead.artifactPath,
            decisionState: routing.decisionState,
            currentHeadPath: focus.currentHead.artifactPath,
            currentStage: focus.currentStage,
            nextLegalStep: focus.nextLegalStep,
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
      assert.deepEqual(snapshotA, snapshotB, `Snapshot must remain deterministic before planning: ${queueEntry.candidate_id}`);

      const planA = planDirectiveMirroredCaseNextStep({ snapshot: snapshotA });
      const planB = planDirectiveMirroredCaseNextStep({ snapshot: snapshotB });
      assert.deepEqual(planA, planB, `Planner output was not deterministic: ${queueEntry.candidate_id}`);

      const expectedOutcome = expectedOutcomeForCase({
        candidateId: queueEntry.candidate_id,
      });
      assert.equal(planA.outcome, expectedOutcome, `Planner outcome mismatch for ${queueEntry.candidate_id}`);

      switch (expectedOutcome) {
        case "stop":
        case "parked":
          assert.notEqual(planA.outcome, "recommend_task", `Planner should not invent a task for ${queueEntry.candidate_id}`);
          assert.notEqual(planA.outcome, "waiting_review", `Planner should not overstate pending review for ${queueEntry.candidate_id}`);
          assert.notEqual(planA.outcome, "blocked", `Planner should not misclassify a healthy stop boundary as blocked for ${queueEntry.candidate_id}`);
          if (queueEntry.candidate_id === "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26") {
            assert.equal(
              snapshotA.ok ? snapshotA.currentStage : null,
              "discovery.monitor.active",
              "Discovery monitor control should materialize as a Discovery-held non-advancing current stage",
            );
            assert.match(
              planA.legalBecause,
              /discovery monitor|keep the source in discovery/i,
              "Discovery monitor control should preserve the explicit hold boundary rather than inventing a task",
            );
          }
          break;
        case "waiting_review":
          assert.equal(
            planA.reviewTarget,
            "runtime",
            `Waiting-review case should stay on the Runtime review boundary for ${queueEntry.candidate_id}`,
          );
          assert.match(
            planA.legalBecause,
            /review the runtime follow-up/i,
            `Waiting-review case should preserve the explicit review boundary for ${queueEntry.candidate_id}`,
          );
          break;
        case "recommend_task":
          assert.equal(
            planA.task.kind,
            "confirm_retention",
            `Recommend-task case should open the bounded retention task for ${queueEntry.candidate_id}`,
          );
          assert.ok(
            planA.task.requiredPreconditionsSatisfied.includes("snapshot_current_stage_known"),
            `Recommend-task case should keep the minimal bounded preconditions for ${queueEntry.candidate_id}`,
          );
          assert.match(
            planA.task.legalBecause,
            /confirm retention/i,
            `Recommend-task case should preserve the explicit next legal step for ${queueEntry.candidate_id}`,
          );
          break;
        default:
          expectedOutcome satisfies never;
      }

      checked.push({
        candidateId: queueEntry.candidate_id,
        outcome: planA.outcome,
        currentStage: snapshotA.ok ? snapshotA.currentStage : null,
        nextLegalStep: snapshotA.ok ? snapshotA.nextLegalStep : null,
      });
    }

    assert.ok(
      checked.some((entry) => entry.outcome === "stop"),
      "Planner golden set must include at least one explicit stop outcome",
    );
    assert.ok(
      checked.some((entry) => entry.outcome === "parked"),
      "Planner golden set must include at least one parked outcome",
    );
    assert.ok(
      checked.some((entry) => entry.outcome === "waiting_review"),
      "Planner golden set must include at least one waiting-review outcome when a real review boundary exists",
    );
    assert.ok(
      checked.some((entry) => entry.outcome === "recommend_task"),
      "Planner golden set must include at least one bounded positive recommendation when a real legal task exists",
    );

    const blockedFixture = {
      ok: true as const,
      caseId: "fixture:blocked-integrity",
      candidateId: "fixture:blocked-integrity",
      candidateName: "Blocked Integrity Fixture",
      routeTarget: "architecture",
      operatingMode: "standard",
      queueStatus: "routed",
      decisionState: "accept_for_architecture",
      currentHeadPath: "discovery/routing-log/fixture-blocked-routing-record.md",
      currentStage: "discovery.route.architecture",
      nextLegalStep: DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
      latestEventType: "state_materialized" as const,
      materializedFromEventId: "fixture:blocked-integrity:state_materialized:v1",
      linkedArtifacts: {
        intakeRecordPath: "discovery/intake/fixture-blocked-intake.md",
        triageRecordPath: "discovery/triage/fixture-blocked-triage.md",
        routingRecordPath: "discovery/routing-log/fixture-blocked-routing-record.md",
        engineRunRecordPath: null,
        engineRunReportPath: null,
        resultRecordPath: null,
      },
    };
    const blockedPlanA = planDirectiveMirroredCaseNextStep({ snapshot: blockedFixture });
    const blockedPlanB = planDirectiveMirroredCaseNextStep({ snapshot: blockedFixture });
    assert.deepEqual(blockedPlanA, blockedPlanB, "Blocked fixture planner output was not deterministic");
    assert.equal(blockedPlanA.outcome, "blocked", "Blocked integrity fixture should remain blocked");
    assert.deepEqual(
      blockedPlanA.blockedOn,
      ["integrity_repair"],
      "Blocked integrity fixture should preserve the bounded integrity repair blocker",
    );
    assert.match(
      blockedPlanA.highestConfidenceWhy,
      /declares advancement blocked/i,
      "Blocked integrity fixture should explain that the legal-next-step text already blocks advancement",
    );

    process.stdout.write(`${JSON.stringify({ ok: true, checked, blockedFixture: blockedPlanA }, null, 2)}\n`);
  });
}

await main();
