import crypto from "node:crypto";

import { createMemoryDirectiveEngineStore, type DirectiveEngineStore } from "./storage.ts";
import { assessDirectiveEngineRouting } from "./routing.ts";
import {
  classifyDirectiveEngineUsefulness,
  explainDirectiveEngineUsefulness,
} from "./usefulness.ts";
import {
  resolveDirectiveEngineLane,
  type DirectiveEngineLanePlanningInput,
  type DirectiveEngineLaneSet,
} from "./lane.ts";
import {
  DIRECTIVE_ENGINE_SUPPORTED_SOURCE_TYPES,
  type DirectiveEngineAdaptationPlan,
  type DirectiveEngineAnalysis,
  type DirectiveEngineCandidate,
  type DirectiveEngineDecision,
  type DirectiveEngineEvent,
  type DirectiveEngineExtractionPlan,
  type DirectiveEngineHostAdapter,
  type DirectiveEngineIntegrationMode,
  type DirectiveEngineIntegrationProposal,
  type DirectiveEngineImprovementPlan,
  type DirectiveEngineMissionContext,
  type DirectiveEngineMissionInput,
  type DirectiveEngineProcessSourceInput,
  type DirectiveEngineProcessSourceResult,
  type DirectiveEngineProofPlan,
  type DirectiveEngineReportPlan,
  type DirectiveEngineRunRecord,
  type DirectiveEngineSelectedLane,
  type DirectiveEngineSourceItem,
} from "./types.ts";

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeNotes(notes: string[] | null | undefined) {
  return (notes ?? []).map((note) => normalizeText(note)).filter(Boolean);
}

function sanitizeIdSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSectionBody(markdown: string, heading: string) {
  const pattern = new RegExp(
    `^## ${escapeRegex(heading)}\\r?\\n([\\s\\S]*?)(?=^##\\s|\\Z)`,
    "m",
  );
  return markdown.match(pattern)?.[1]?.trim() ?? "";
}

function parseMissionMarkdown(markdown: string) {
  const currentObjective = getSectionBody(markdown, "Current Objective")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
  const usefulnessSignals = getSectionBody(
    markdown,
    "What Usefulness Means Under This Objective",
  )
    .split(/\r?\n/)
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
  const capabilityLanes = getSectionBody(markdown, "Capability Lanes That Matter Most")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, "").trim());

  return {
    currentObjective,
    usefulnessSignals,
    capabilityLanes,
  };
}

function buildMissionMarkdown(input: DirectiveEngineMissionInput) {
  const objective =
    normalizeText(input.currentObjective) || "Mission objective not provided.";
  const usefulnessSignals = (input.usefulnessSignals ?? []).filter(Boolean);
  const capabilityLanes = (input.capabilityLanes ?? []).filter(Boolean);

  return [
    "# Active Mission",
    "",
    "## Current Objective",
    "",
    objective,
    "",
    "## What Usefulness Means Under This Objective",
    "",
    ...(usefulnessSignals.length > 0
      ? usefulnessSignals.map((signal) => `- ${signal}`)
      : ["- Mission usefulness signals not provided."]),
    "",
    "## Capability Lanes That Matter Most",
    "",
    ...(capabilityLanes.length > 0
      ? capabilityLanes.map((lane, index) => `${index + 1}. ${lane}`)
      : ["1. Capability lanes not provided."]),
  ].join("\n");
}

function resolveMissionContext(
  input: DirectiveEngineMissionInput,
): DirectiveEngineMissionContext {
  const activeMissionMarkdown =
    normalizeText(input.activeMissionMarkdown) || buildMissionMarkdown(input);
  const parsed = parseMissionMarkdown(activeMissionMarkdown);

  return {
    missionId: normalizeText(input.missionId) || null,
    currentObjective:
      normalizeText(input.currentObjective) || parsed.currentObjective,
    usefulnessSignals:
      (input.usefulnessSignals ?? []).filter(Boolean).length > 0
        ? (input.usefulnessSignals ?? []).map((value) => normalizeText(value)).filter(Boolean)
        : parsed.usefulnessSignals,
    capabilityLanes:
      (input.capabilityLanes ?? []).filter(Boolean).length > 0
        ? (input.capabilityLanes ?? []).map((value) => normalizeText(value)).filter(Boolean)
        : parsed.capabilityLanes,
    activeMissionMarkdown,
  };
}

function normalizeSourceType(value: unknown): DirectiveEngineSourceItem["sourceType"] {
  const normalized = normalizeText(value).toLowerCase();
  const match = DIRECTIVE_ENGINE_SUPPORTED_SOURCE_TYPES.find((item) => item === normalized);
  if (match) {
    return match;
  }
  throw new Error(
    `directive_engine_invalid_source_type: ${String(value ?? "")}; supported types: ${DIRECTIVE_ENGINE_SUPPORTED_SOURCE_TYPES.join(", ")}`,
  );
}

function deriveCandidateId(source: DirectiveEngineSourceItem) {
  return (
    sanitizeIdSegment(normalizeText(source.sourceId))
    || sanitizeIdSegment(normalizeText(source.title))
    || sanitizeIdSegment(normalizeText(source.sourceRef))
    || `directive-source-${crypto.randomUUID().slice(0, 8)}`
  );
}

function deriveIntegrationMode(input: {
  source: DirectiveEngineSourceItem;
  defaultIntegrationMode: DirectiveEngineIntegrationMode;
  valuableWithoutHostRuntime: boolean;
}): DirectiveEngineIntegrationMode {
  if (input.defaultIntegrationMode === "none") {
    return "none";
  }

  if (!input.valuableWithoutHostRuntime) {
    if (
      input.source.sourceType === "github-repo"
      || input.source.sourceType === "external-system"
    ) {
      return "reimplement";
    }
  }

  return input.defaultIntegrationMode;
}

function buildDefaultProofPlan(
  input: DirectiveEngineLanePlanningInput,
): DirectiveEngineProofPlan {
  return {
    proofKind: `${input.lane.laneId}_proof`,
    objective: `Prove the ${input.lane.label} path is safe, bounded, and useful under the current mission.`,
    requiredEvidence: [
      "lane rationale recorded",
      "bounded next action recorded",
      "proof owner identified",
    ],
    requiredGates: [
      "scope_review",
      "boundary_review",
      "rollback_review",
    ],
    rollbackPrompt:
      "Keep the candidate at its current state and avoid downstream integration until the proof boundary is clearer.",
  };
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeText(value))
        .filter(Boolean),
    ),
  );
}

function buildSourceAnalysis(
  input: {
    planningInput: DirectiveEngineLanePlanningInput;
    usefulnessRationale: string;
  },
): DirectiveEngineAnalysis {
  return {
    missionFitSummary:
      normalizeText(input.planningInput.source.summary)
      || `Assess ${input.planningInput.source.title || input.planningInput.candidateId} against mission "${input.planningInput.mission.currentObjective}".`,
    primaryAdoptionQuestion:
      "What is the primary adoption target of the extracted value?",
    matchedCapabilityGapId: input.planningInput.routingAssessment.matchedGapId,
    usefulnessRationale: input.usefulnessRationale,
    rationale: [...input.planningInput.routingAssessment.rationale],
  };
}

function buildExtractionPlan(
  input: DirectiveEngineLanePlanningInput,
): DirectiveEngineExtractionPlan {
  const extractedValue = uniqueStrings([
    input.source.summary,
    ...(input.source.notes ?? []).slice(0, 3),
  ]);
  const excludedBaggage = uniqueStrings([
    input.source.sourceType === "github-repo" || input.source.sourceType === "external-system"
      ? "source-specific implementation baggage"
      : "non-mission-relevant source detail",
    input.lane.hostDependence === "host_adapter_required"
      ? "host-local assumptions from the original source"
      : "unadapted source terminology",
  ]);

  return {
    extractedValue:
      extractedValue.length > 0
        ? extractedValue
        : [`Potential ${input.lane.label} value from ${input.source.title || input.candidateId}.`],
    excludedBaggage,
  };
}

function buildAdaptationPlan(
  input: DirectiveEngineLanePlanningInput,
): DirectiveEngineAdaptationPlan {
  switch (input.lane.laneId) {
    case "discovery":
      return {
        directiveOwnedForm:
          "Mission-aware Discovery intake case with explicit routing, boundary, and usefulness notes.",
        adaptedValue: [
          "Normalize the source into a Discovery-owned intake and routing case.",
          "Preserve ambiguity without forcing downstream adoption too early.",
        ],
      };
    case "architecture":
      return {
        directiveOwnedForm:
          "Directive-owned Engine logic or operating-code asset such as a contract, schema, template, policy, or shared lib.",
        adaptedValue: [
          "Convert extracted mechanisms into Engine-owned logic or operating assets.",
          "Strip source baggage before adoption into the Engine.",
        ],
      };
    default:
      return {
        directiveOwnedForm:
          "Directive-owned runtime capability or transformation artifact behind a host adapter boundary.",
        adaptedValue: [
          "Convert the extracted mechanism into a bounded reusable runtime surface.",
          "Keep host-specific behavior behind the adapter boundary.",
        ],
      };
  }
}

function buildImprovementPlan(
  input: DirectiveEngineLanePlanningInput,
): DirectiveEngineImprovementPlan {
  switch (input.lane.laneId) {
    case "discovery":
      return {
        improvementGoals: [
          "improve intake efficiency",
          "improve routing clarity",
        ],
        intendedDelta:
          "Make source selection and routing clearer and more reusable than the original source context.",
      };
    case "architecture":
      return {
        improvementGoals: [
          "improve engine self-improvement quality",
          "improve future source adaptation quality",
        ],
        intendedDelta:
          "Turn extracted mechanisms into Directive-owned improvements that compound future source consumption.",
      };
    default:
      return {
        improvementGoals: [
          "improve runtime reuse",
          "improve speed, cost, reliability, or structure while preserving behavior",
        ],
        intendedDelta:
          "Operationalize the value in a reusable runtime shape with stronger boundaries than the source.",
      };
  }
}

function buildIntegrationProposal(
  input: DirectiveEngineLanePlanningInput,
): DirectiveEngineIntegrationProposal {
  const integrationMode = deriveIntegrationMode({
    source: input.source,
    defaultIntegrationMode: input.lane.defaultIntegrationMode,
    valuableWithoutHostRuntime: input.lane.valuableWithoutHostRuntime,
  });

  const base: DirectiveEngineIntegrationProposal = {
    targetLaneId: input.lane.laneId,
    targetLaneLabel: input.lane.label,
    integrationMode,
    hostDependence: input.lane.hostDependence,
    valuableWithoutHostRuntime: input.lane.valuableWithoutHostRuntime,
    handoffArtifactFamily: input.lane.handoffArtifactFamily,
    nextAction: input.lane.nextAction,
    requiresHumanReview: input.routingAssessment.needsHumanReview,
  };

  const overrides = input.lane.planIntegration?.(input) ?? {};
  return {
    ...base,
    ...overrides,
  };
}

function buildDecision(input: {
  lane: DirectiveEngineSelectedLane;
  candidate: DirectiveEngineCandidate;
  integrationProposal: DirectiveEngineIntegrationProposal;
}): DirectiveEngineDecision {
  let decisionState: DirectiveEngineDecision["decisionState"];
  if (input.lane.laneId === "discovery") {
    decisionState = "hold_in_discovery";
  } else if (input.lane.laneId === "architecture") {
    decisionState = "accept_for_architecture";
  } else {
    decisionState = "route_to_forge_follow_up";
  }

  return {
    decisionState,
    adoptionTargetLaneId: input.lane.laneId,
    adoptionTargetLaneLabel: input.lane.label,
    requiresHumanApproval: true,
    summary:
      `Preliminary engine decision: ${decisionState} for ${input.lane.label}${input.candidate.requiresHumanReview ? " with additional human review required" : ""}, pending human approval before final adoption.`,
    rationale: [
      ...input.candidate.rationale,
      input.integrationProposal.nextAction,
    ],
  };
}

function buildReportPlan(input: {
  lane: DirectiveEngineSelectedLane;
  decision: DirectiveEngineDecision;
  integrationProposal: DirectiveEngineIntegrationProposal;
  usefulnessRationale: string;
}): DirectiveEngineReportPlan {
  const reportKind =
    input.lane.laneId === "discovery"
      ? "discovery_routing_report"
      : input.lane.laneId === "architecture"
        ? "architecture_adaptation_report"
        : "forge_follow_up_report";

  const requiredDestinations = [
    "directive_workspace_record",
    "directive_workspace_report_sync",
  ];

  if (input.integrationProposal.hostDependence === "host_adapter_required") {
    requiredDestinations.push("host_adapter_report");
  }

  return {
    reportKind,
    summary:
      `Sync the ${input.decision.decisionState} decision and ${input.integrationProposal.integrationMode} integration plan into Directive Workspace reporting surfaces. Usefulness rationale: ${input.usefulnessRationale}`,
    usefulnessRationale: input.usefulnessRationale,
    requiredDestinations,
    syncRequired: true,
  };
}

function buildEvents(input: {
  receivedAt: string;
  analysis: DirectiveEngineAnalysis;
  candidate: DirectiveEngineCandidate;
  extractionPlan: DirectiveEngineExtractionPlan;
  adaptationPlan: DirectiveEngineAdaptationPlan;
  improvementPlan: DirectiveEngineImprovementPlan;
  proofPlan: DirectiveEngineProofPlan;
  decision: DirectiveEngineDecision;
  integrationProposal: DirectiveEngineIntegrationProposal;
  reportPlan: DirectiveEngineReportPlan;
}): DirectiveEngineEvent[] {
  return [
    {
      type: "source_ingested",
      at: input.receivedAt,
      summary: `Source captured for candidate ${input.candidate.candidateId}.`,
    },
    {
      type: "source_analyzed",
      at: input.receivedAt,
      summary: `${input.analysis.missionFitSummary} Usefulness rationale: ${input.analysis.usefulnessRationale}`,
    },
    {
      type: "candidate_routed",
      at: input.receivedAt,
      summary:
        `Candidate routed to ${input.candidate.recommendedLaneId} with usefulness level ${input.candidate.usefulnessLevel}. ${input.analysis.usefulnessRationale}`,
    },
    {
      type: "value_extracted",
      at: input.receivedAt,
      summary: `Extracted ${input.extractionPlan.extractedValue.length} value signals and excluded ${input.extractionPlan.excludedBaggage.length} baggage signals.`,
    },
    {
      type: "value_adapted",
      at: input.receivedAt,
      summary: input.adaptationPlan.directiveOwnedForm,
    },
    {
      type: "value_improved",
      at: input.receivedAt,
      summary: input.improvementPlan.intendedDelta,
    },
    {
      type: "proof_planned",
      at: input.receivedAt,
      summary: `Proof plan ${input.proofPlan.proofKind} prepared.`,
    },
    {
      type: "decision_recorded",
      at: input.receivedAt,
      summary: input.decision.summary,
    },
    {
      type: "integration_proposed",
      at: input.receivedAt,
      summary: `Integration proposal targets ${input.integrationProposal.targetLaneId} via ${input.integrationProposal.handoffArtifactFamily}.`,
    },
    {
      type: "report_planned",
      at: input.receivedAt,
      summary: input.reportPlan.summary,
    },
  ];
}

export class DirectiveEngine {
  readonly store: DirectiveEngineStore;
  readonly laneSet: DirectiveEngineLaneSet;
  readonly hostAdapters: DirectiveEngineHostAdapter[];

  constructor(input: {
    laneSet: DirectiveEngineLaneSet;
    store?: DirectiveEngineStore;
    hostAdapters?: DirectiveEngineHostAdapter[];
  }) {
    if (!input.laneSet) {
      throw new Error(
        "directive_engine_lane_set_required: construct DirectiveEngine with an explicit lane set",
      );
    }

    this.laneSet = input.laneSet;
    this.store = input.store ?? createMemoryDirectiveEngineStore();
    this.hostAdapters = [...(input.hostAdapters ?? [])];
  }

  async processSource(
    input: DirectiveEngineProcessSourceInput,
  ): Promise<DirectiveEngineProcessSourceResult> {
    const receivedAt =
      normalizeText(input.receivedAt) || new Date().toISOString();
    const mission = resolveMissionContext(input.mission);
    const source: DirectiveEngineSourceItem = {
      ...input.source,
      sourceType: normalizeSourceType(input.source.sourceType),
      sourceRef: normalizeText(input.source.sourceRef),
      title: normalizeText(input.source.title),
      summary: normalizeText(input.source.summary) || null,
      missionAlignmentHint: normalizeText(input.source.missionAlignmentHint) || null,
      capabilityGapId: normalizeText(input.source.capabilityGapId) || null,
      notes: normalizeNotes(input.source.notes),
    };
    const candidateId = deriveCandidateId(source);
    const openGaps = [...(input.gaps ?? [])];
    const routingAssessment = assessDirectiveEngineRouting({
      source,
      mission,
      openGaps,
    });
    const lane = resolveDirectiveEngineLane({
      laneSet: this.laneSet,
      laneId: routingAssessment.recommendedLaneId,
    });
    const planningInput: DirectiveEngineLanePlanningInput = {
      source,
      mission,
      openGaps,
      candidateId,
      receivedAt,
      routingAssessment,
      lane,
    };
    const usefulnessLevel = this.laneSet.refineUsefulness
      ? this.laneSet.refineUsefulness(planningInput)
      : classifyDirectiveEngineUsefulness(planningInput);
    const usefulnessRationale = explainDirectiveEngineUsefulness(
      planningInput,
      usefulnessLevel,
    );
    const selectedLane: DirectiveEngineSelectedLane = {
      laneId: lane.laneId,
      label: lane.label,
      hostDependence: lane.hostDependence,
      valuableWithoutHostRuntime: lane.valuableWithoutHostRuntime,
    };
    const candidate: DirectiveEngineCandidate = {
      candidateId,
      candidateName: source.title || candidateId,
      recommendedLaneId: routingAssessment.recommendedLaneId,
      recommendedLaneLabel: lane.label,
      recommendedRecordShape: routingAssessment.recommendedRecordShape,
      usefulnessLevel,
      missionPriorityScore: routingAssessment.missionPriorityScore,
      confidence: routingAssessment.confidence,
      matchedGapId: routingAssessment.matchedGapId,
      matchedGapRank: routingAssessment.matchedGapRank,
      requiresHumanReview: routingAssessment.needsHumanReview,
      rationale: [...routingAssessment.rationale],
    };
    const analysis = buildSourceAnalysis({
      planningInput,
      usefulnessRationale,
    });
    const extractionPlan = buildExtractionPlan(planningInput);
    const adaptationPlan = buildAdaptationPlan(planningInput);
    const improvementPlan = buildImprovementPlan(planningInput);
    const proofPlan = lane.planProof
      ? lane.planProof(planningInput)
      : buildDefaultProofPlan(planningInput);
    const integrationProposal = buildIntegrationProposal(planningInput);
    const decision = buildDecision({
      lane: selectedLane,
      candidate,
      integrationProposal,
    });
    const reportPlan = buildReportPlan({
      lane: selectedLane,
      decision,
      integrationProposal,
      usefulnessRationale,
    });
    const runRecord: DirectiveEngineRunRecord = {
      runId: crypto.randomUUID(),
      receivedAt,
      source,
      mission,
      openGaps,
      selectedLane,
      candidate,
      analysis,
      routingAssessment,
      extractionPlan,
      adaptationPlan,
      improvementPlan,
      proofPlan,
      decision,
      integrationProposal,
      reportPlan,
      events: buildEvents({
        receivedAt,
        analysis,
        candidate,
        extractionPlan,
        adaptationPlan,
        improvementPlan,
        proofPlan,
        decision,
        integrationProposal,
        reportPlan,
      }),
    };

    await this.store.writeRun(runRecord);

    const adapterResults = [];
    for (const adapter of this.hostAdapters) {
      const adapterResult = adapter.onRunRecorded
        ? await adapter.onRunRecorded(runRecord)
        : undefined;
      adapterResults.push({
        adapterId: adapter.id,
        accepted: adapterResult?.accepted ?? true,
        note: normalizeText(adapterResult?.note) || null,
      });
    }

    return {
      ok: true,
      record: runRecord,
      adapterResults,
    };
  }

  async getRun(runId: string) {
    return this.store.readRun(runId);
  }

  async listRuns() {
    return this.store.listRuns();
  }
}
