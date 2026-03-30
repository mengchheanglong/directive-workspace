import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadDirectiveArchitectureAdoptionDecisionArtifact,
} from "../shared/lib/architecture-adoption-decision-store.ts";
import {
  closeDirectiveArchitectureNoteHandoff,
  readDirectiveArchitectureBoundedResultArtifact,
} from "../shared/lib/architecture-bounded-closeout.ts";
import {
  materializeDirectiveNoteArchitectureCloseoutProjectionSet,
  writeDirectiveNoteArchitectureCloseoutProjectionSet,
} from "../shared/lib/architecture-note-closeout-projections.ts";
import { readDirectiveArchitectureHandoffArtifact } from "../shared/lib/architecture-handoff-start.ts";
import { appendDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
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
  notes?: string | null;
  completed_at?: string | null;
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOTE_CASES = [
  {
    candidateId: "dw-source-openevals-2026-03-28",
    handoffPath: "architecture/02-experiments/2026-03-28-dw-source-openevals-2026-03-28-engine-handoff.md",
    resultPath: "architecture/02-experiments/2026-03-28-dw-source-openevals-2026-03-28-bounded-result.md",
  },
  {
    candidateId: "dw-source-inspect-ai-2026-03-28",
    handoffPath: "architecture/02-experiments/2026-03-28-dw-source-inspect-ai-2026-03-28-engine-handoff.md",
    resultPath: "architecture/02-experiments/2026-03-28-dw-source-inspect-ai-2026-03-28-bounded-result.md",
  },
  {
    candidateId: "dw-source-promptwizard-2026-03-28",
    handoffPath: "architecture/02-experiments/2026-03-28-dw-source-promptwizard-2026-03-28-engine-handoff.md",
    resultPath: "architecture/02-experiments/2026-03-28-dw-source-promptwizard-2026-03-28-bounded-result.md",
  },
] as const;

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyRelativeFile(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  assert.ok(fs.existsSync(sourcePath), `Missing source file for parity copy: ${relativePath}`);
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function withTempDirectiveRoot(run: (directiveRoot: string) => void) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-note-closeout-projection-parity-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    run(directiveRoot);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function parseClosedBy(closeoutApproval: string) {
  const match = closeoutApproval.match(/reviewed by (.+?) directly from NOTE-mode handoff/i);
  assert.ok(match?.[1], `Unable to parse NOTE closeout actor from: ${closeoutApproval}`);
  return match[1].trim();
}

function resolveValueShapeFromArtifactType(artifactType: string) {
  switch (artifactType) {
    case "contract":
      return "interface_or_handoff" as const;
    case "schema":
      return "data_shape" as const;
    case "template":
      return "working_document" as const;
    case "policy":
      return "behavior_rule" as const;
    case "reference-pattern":
      return "design_pattern" as const;
    case "shared-lib":
      return "executable_logic" as const;
    case "doctrine-update":
      return "operating_model_change" as const;
    default:
      throw new Error(`Unsupported artifact type for NOTE closeout parity: ${artifactType}`);
  }
}

function normalizeTransformedArtifacts(items: string[]) {
  return items.filter((item) => !/^none explicitly materialized/i.test(item));
}

function stripNoteCloseoutFromNotes(value: string | null | undefined) {
  return String(value ?? "")
    .split(" | ")
    .filter((entry) => !/NOTE-mode Architecture closeout by/i.test(entry))
    .join(" | ")
    .trim();
}

function buildMirroredRecord(input: {
  queueEntry: QueueEntry;
  routing: ReturnType<typeof readDirectiveDiscoveryRoutingArtifact>;
  handoff: ReturnType<typeof readDirectiveArchitectureHandoffArtifact>;
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
    routeTarget: "architecture",
    operatingMode: input.queueEntry.operating_mode ?? null,
    queueStatus: "routed",
    createdAt: `${input.handoff.date}T00:00:00.000Z`,
    updatedAt: `${input.handoff.date}T00:00:00.000Z`,
    linkedArtifacts: {
      intakeRecordPath: input.queueEntry.intake_record_path ?? input.routing.linkedIntakeRecord ?? null,
      triageRecordPath: input.routing.linkedTriageRecord,
      routingRecordPath: input.queueEntry.routing_record_path ?? null,
      engineRunRecordPath: input.handoff.engineRunRecordPath,
      engineRunReportPath: input.handoff.engineRunReportPath,
      architectureHandoffPath: input.handoff.handoffRelativePath,
      architectureDecisionPath: null,
      resultRecordPath: null,
    },
    projectionInputs: null,
  };
}

function seedRoutedMirror(input: {
  directiveRoot: string;
  queueEntry: QueueEntry;
  routing: ReturnType<typeof readDirectiveDiscoveryRoutingArtifact>;
  handoff: ReturnType<typeof readDirectiveArchitectureHandoffArtifact>;
}) {
  writeDirectiveMirroredDiscoveryCaseRecord({
    directiveRoot: input.directiveRoot,
    record: buildMirroredRecord(input),
  });

  appendDirectiveCaseMirrorEvents({
    directiveRoot: input.directiveRoot,
    caseId: input.queueEntry.candidate_id,
    events: [
      {
        schemaVersion: 1,
        eventId: `${input.queueEntry.candidate_id}:source_submitted:note-projection-parity-v1`,
        caseId: input.queueEntry.candidate_id,
        candidateId: input.queueEntry.candidate_id,
        candidateName: input.queueEntry.candidate_name,
        sequence: 1,
        eventType: "source_submitted",
        occurredAt: `${input.handoff.date}T00:00:00.000Z`,
        queueStatus: "pending",
        routeTarget: null,
        operatingMode: input.queueEntry.operating_mode ?? null,
        linkedArtifactPath: input.queueEntry.intake_record_path ?? input.routing.linkedIntakeRecord ?? null,
        decisionState: null,
      },
      {
        schemaVersion: 1,
        eventId: `${input.queueEntry.candidate_id}:triaged:note-projection-parity-v1`,
        caseId: input.queueEntry.candidate_id,
        candidateId: input.queueEntry.candidate_id,
        candidateName: input.queueEntry.candidate_name,
        sequence: 2,
        eventType: "triaged",
        occurredAt: `${input.handoff.date}T00:00:00.000Z`,
        queueStatus: "pending",
        routeTarget: null,
        operatingMode: input.queueEntry.operating_mode ?? null,
        linkedArtifactPath: input.routing.linkedTriageRecord,
        decisionState: null,
      },
      {
        schemaVersion: 1,
        eventId: `${input.queueEntry.candidate_id}:routed:note-projection-parity-v1`,
        caseId: input.queueEntry.candidate_id,
        candidateId: input.queueEntry.candidate_id,
        candidateName: input.queueEntry.candidate_name,
        sequence: 3,
        eventType: "routed",
        occurredAt: `${input.handoff.date}T00:00:00.000Z`,
        queueStatus: "routed",
        routeTarget: "architecture",
        operatingMode: input.queueEntry.operating_mode ?? null,
        linkedArtifactPath: input.queueEntry.routing_record_path ?? null,
        decisionState: input.routing.decisionState,
      },
    ],
  });
}

function buildReplayInput(input: {
  handoffPath: string;
  resultPath: string;
}) {
  const resultArtifact = readDirectiveArchitectureBoundedResultArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    resultPath: input.resultPath,
  });
  const decisionArtifact = loadDirectiveArchitectureAdoptionDecisionArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    recordRelativePath: resultArtifact.resultRelativePath,
  }).artifact;
  const stayExperimentalReason = decisionArtifact.decision.stay_experimental_reason ?? "";

  return {
    handoffPath: input.handoffPath,
    snapshotAt: `${resultArtifact.experimentDate}T00:00:00.000Z`,
    closedBy: parseClosedBy(resultArtifact.closeoutApproval),
    resultSummary: resultArtifact.resultSummary,
    primaryEvidencePath: resultArtifact.primaryEvidencePath,
    transformedArtifactsProduced: normalizeTransformedArtifacts(
      resultArtifact.transformedArtifactsProduced,
    ),
    nextDecision: resultArtifact.nextDecision as "needs-more-evidence" | "adopt" | "defer" | "reject",
    valueShape: resolveValueShapeFromArtifactType(decisionArtifact.artifact_type),
    adaptationQuality: decisionArtifact.adaptation_quality,
    improvementQuality: decisionArtifact.improvement_quality ?? "skipped",
    proofExecuted: !stayExperimentalReason.includes("Required proof has not been executed yet."),
    targetArtifactClarified: decisionArtifact.readiness_check.adaptation_decision_complete,
    deltaEvidencePresent: decisionArtifact.readiness_check.delta_evidence_present,
    noUnresolvedBaggage: decisionArtifact.readiness_check.no_unresolved_baggage,
    productArtifactMaterialized: decisionArtifact.decision.completion_status === "product_materialized",
  };
}

function prepareTempCase(input: {
  directiveRoot: string;
  queueEntry: QueueEntry;
  handoffPath: string;
}) {
  const routing = readDirectiveDiscoveryRoutingArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    routingPath: input.queueEntry.routing_record_path ?? "",
  });
  const handoff = readDirectiveArchitectureHandoffArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    handoffPath: input.handoffPath,
  });

  for (const relativePath of [
    input.queueEntry.intake_record_path ?? routing.linkedIntakeRecord,
    routing.linkedTriageRecord,
    input.queueEntry.routing_record_path ?? null,
    handoff.handoffRelativePath,
    handoff.engineRunRecordPath,
    handoff.engineRunReportPath,
  ]) {
    if (relativePath) {
      copyRelativeFile(relativePath, input.directiveRoot);
    }
  }

  seedRoutedMirror({
    directiveRoot: input.directiveRoot,
    queueEntry: input.queueEntry,
    routing,
    handoff,
  });
}

function main() {
  const queuePath = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
  const queueDocument = readJson<{ entries: QueueEntry[] }>(queuePath);

  withTempDirectiveRoot((directiveRoot) => {
    const tempQueue = structuredClone(queueDocument);

    for (const proofCase of NOTE_CASES) {
      const entry = tempQueue.entries.find((item) => item.candidate_id === proofCase.candidateId) ?? null;
      assert.ok(entry, `Missing NOTE proof case in queue: ${proofCase.candidateId}`);

      entry.status = "routed";
      entry.completed_at = null;
      entry.result_record_path = null;
      entry.notes = stripNoteCloseoutFromNotes(entry.notes);

      prepareTempCase({
        directiveRoot,
        queueEntry: entry,
        handoffPath: proofCase.handoffPath,
      });
    }

    writeJson(
      path.join(directiveRoot, "discovery", "intake-queue.json"),
      tempQueue,
    );

    const checked = [];

    for (const proofCase of NOTE_CASES) {
      const liveResult = fs.readFileSync(path.join(DIRECTIVE_ROOT, proofCase.resultPath), "utf8");
      const liveDecision = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, proofCase.resultPath.replace(/\.md$/u, "-adoption-decision.json")),
        "utf8",
      );
      const replayInput = buildReplayInput(proofCase);
      const result = closeDirectiveArchitectureNoteHandoff({
        directiveRoot,
        ...replayInput,
      });

      assert.equal(result.created, true, `NOTE closeout should create the bounded result for ${proofCase.candidateId}`);

      const tempResultPath = path.join(directiveRoot, proofCase.resultPath);
      const tempDecisionPath = path.join(
        directiveRoot,
        proofCase.resultPath.replace(/\.md$/u, "-adoption-decision.json"),
      );
      const generatedResult = fs.readFileSync(tempResultPath, "utf8");
      const generatedDecision = fs.readFileSync(tempDecisionPath, "utf8");

      assert.equal(generatedResult, liveResult, `Generated NOTE bounded result drifted for ${proofCase.candidateId}`);
      assert.equal(generatedDecision, liveDecision, `Generated NOTE decision artifact drifted for ${proofCase.candidateId}`);
      assert.ok(
        !fs.existsSync(path.join(directiveRoot, proofCase.handoffPath.replace(/-engine-handoff\.md$/u, "-bounded-start.md"))),
        `NOTE closeout must not introduce a bounded start for ${proofCase.candidateId}`,
      );

      const projectionSet = materializeDirectiveNoteArchitectureCloseoutProjectionSet({
        directiveRoot,
        caseId: proofCase.candidateId,
      });
      assert.equal(projectionSet.ok, true, `Projection materialization failed for ${proofCase.candidateId}`);
      assert.equal(projectionSet.compatibility.boundedStartRequired, false);
      assert.equal(projectionSet.markdown.result, liveResult);
      assert.equal(projectionSet.decisionJson, liveDecision);

      fs.unlinkSync(tempResultPath);
      fs.unlinkSync(tempDecisionPath);

      const regenerated = writeDirectiveNoteArchitectureCloseoutProjectionSet({
        directiveRoot,
        caseId: proofCase.candidateId,
      });
      assert.equal(regenerated.ok, true, `Projection rewrite failed for ${proofCase.candidateId}`);
      assert.equal(fs.readFileSync(tempResultPath, "utf8"), liveResult);
      assert.equal(fs.readFileSync(tempDecisionPath, "utf8"), liveDecision);

      const rerun = closeDirectiveArchitectureNoteHandoff({
        directiveRoot,
        ...replayInput,
      });
      assert.equal(rerun.created, false, `NOTE closeout rerun should be idempotent for ${proofCase.candidateId}`);
      assert.equal(fs.readFileSync(tempResultPath, "utf8"), liveResult);
      assert.equal(fs.readFileSync(tempDecisionPath, "utf8"), liveDecision);

      const resolved = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: proofCase.resultPath,
      });
      const focus = resolved.focus;
      assert.ok(focus?.ok, `State resolver failed on generated NOTE result for ${proofCase.candidateId}`);
      assert.equal(focus.currentHead.artifactPath, proofCase.resultPath);
      assert.equal(focus.currentStage, "architecture.bounded_result.stay_experimental");
      assert.match(
        focus.nextLegalStep,
        /No automatic Architecture step is open/i,
        `Generated NOTE result overstates continuation for ${proofCase.candidateId}: ${focus.nextLegalStep}`,
      );

      checked.push({
        candidateId: proofCase.candidateId,
        currentStage: focus.currentStage,
        nextLegalStep: focus.nextLegalStep,
        latestCurrentHead: focus.currentHead.artifactPath,
      });
    }

    process.stdout.write(`${JSON.stringify({ ok: true, checked }, null, 2)}\n`);
  });
}

main();
