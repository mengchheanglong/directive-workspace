import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DirectiveEngine } from "../engine/directive-engine.ts";
import { createDirectiveWorkspaceEngineLanes } from "../engine/directive-workspace-lanes.ts";
import type { DirectiveEngineRunRecord } from "../engine/types.ts";
import { buildRuntimeCallableExecutionEvidenceReport } from "../runtime/lib/runtime-callable-execution-evidence.ts";
import { buildDirectiveRuntimePromotionAssistanceReport } from "../runtime/lib/runtime-promotion-assistance.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_engine_stage_chaining" as const;
const FAILURE_CONTRACT_VERSION = 1 as const;
const STRUCTURAL_CONTROL_RUNTIME_SKEW_PROBE = "structural_control_runtime_skew" as const;

type EngineInput = Parameters<DirectiveEngine["processSource"]>[0];
type ProbeMode = typeof STRUCTURAL_CONTROL_RUNTIME_SKEW_PROBE;
type ViolationCode =
  | "engine_processing_failed"
  | "selected_lane_mismatch"
  | "missing_extracted_value"
  | "adaptation_plan_mismatch"
  | "improvement_delta_mismatch"
  | "proof_kind_mismatch"
  | "proof_evidence_mismatch"
  | "proof_gate_mismatch"
  | "integration_target_mismatch"
  | "integration_action_mismatch"
  | "handoff_artifact_family_mismatch"
  | "decision_state_mismatch"
  | "usefulness_level_mismatch"
  | "usefulness_rationale_mismatch"
  | "routing_explanation_mismatch"
  | "routing_signal_mismatch"
  | "routing_rationale_mismatch";

type Violation = {
  code: ViolationCode;
  caseId: string;
  path: string;
  message: string;
  expected?: string | number | boolean;
  actual?: string | number | boolean;
};

type Success = {
  ok: true;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  candidateId: string;
  selectedLane: string;
  improvementGoals: string[];
  proofGates: string[];
  integrationNextAction: string;
  runtimeControl: {
    candidateId: string;
    selectedLane: string;
    proofKind: string;
    improvementGoals: string[];
    integrationNextAction: string;
  };
  architectureProofCases: Array<{ label: string; runPath: string }>;
  discoveryControl: {
    candidateId: string;
    selectedLane: string;
    proofKind: string;
    integrationNextAction: string;
  };
};

type Failure = {
  ok: false;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  summary: string;
  violations: Violation[];
};

type CheckResult = Success | Failure;
type Options = { probeMode?: ProbeMode };

function readStoredRun(relativePath: string) {
  return JSON.parse(
    fs.readFileSync(path.resolve(DIRECTIVE_ROOT, relativePath), "utf8"),
  ) as DirectiveEngineRunRecord;
}

function scalarize(value: unknown): string | number | boolean {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  return JSON.stringify(value);
}

function push(violations: Violation[], violation: Violation) {
  violations.push(violation);
}

function eq(
  violations: Violation[],
  caseId: string,
  code: ViolationCode,
  path: string,
  actual: unknown,
  expected: unknown,
  message: string,
) {
  if (actual === expected) {
    return;
  }
  push(violations, {
    code,
    caseId,
    path,
    message,
    expected: scalarize(expected),
    actual: scalarize(actual),
  });
}

function match(
  violations: Violation[],
  caseId: string,
  code: ViolationCode,
  path: string,
  actual: string | undefined,
  expectedPattern: RegExp,
  message: string,
) {
  if (actual && expectedPattern.test(actual)) {
    return;
  }
  push(violations, {
    code,
    caseId,
    path,
    message,
    expected: expectedPattern.source,
    actual: scalarize(actual ?? "missing"),
  });
}

function prefix(
  violations: Violation[],
  caseId: string,
  path: string,
  actual: string[] | undefined,
  expectedPrefix: string,
  message: string,
) {
  if (actual?.some((value) => value.startsWith(expectedPrefix))) {
    return;
  }
  push(violations, {
    code: "missing_extracted_value",
    caseId,
    path,
    message,
    expected: expectedPrefix,
    actual: scalarize(actual ?? "missing"),
  });
}

function arrayMatch(
  violations: Violation[],
  caseId: string,
  code: ViolationCode,
  path: string,
  actual: string[] | undefined,
  expectedPattern: RegExp,
  message: string,
) {
  if (actual?.some((value) => expectedPattern.test(value))) {
    return;
  }
  push(violations, {
    code,
    caseId,
    path,
    message,
    expected: expectedPattern.source,
    actual: scalarize(actual ?? "missing"),
  });
}

function gt(
  violations: Violation[],
  caseId: string,
  path: string,
  actual: number | undefined,
  threshold: number,
  message: string,
) {
  if (typeof actual === "number" && actual > threshold) {
    return;
  }
  push(violations, {
    code: "routing_signal_mismatch",
    caseId,
    path,
    message,
    expected: `>${threshold}`,
    actual: scalarize(actual ?? "missing"),
  });
}

function structuralInput(options: Options): EngineInput {
  if (options.probeMode === STRUCTURAL_CONTROL_RUNTIME_SKEW_PROBE) {
    return {
      mission: {
        currentObjective: "Improve the Directive Workspace engine.",
        usefulnessSignals: [
          "Prefer reusable runtime capability when repeated call value is explicit.",
          "Do not force Architecture when the primary adoption target is a callable runtime tool.",
        ],
        capabilityLanes: ["Runtime", "Architecture"],
      },
      source: {
        sourceType: "github-repo",
        sourceRef: "https://example.com/ts-edge-workflow-runtime-plugin",
        title: "staged workflow runtime plugin",
        summary: "reusable plugin for repeated workflow execution and callable tool packaging",
        missionAlignmentHint: "Turn the source into a reusable callable runtime capability.",
        notes: ["plugin", "reusable", "workflow", "tool", "callable"],
      },
      gaps: [],
    };
  }

  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Prefer Engine-owned workflow structure over flat heuristics.",
        "Preserve explicit stage boundaries when they improve future source adaptation.",
      ],
      capabilityLanes: ["Architecture", "Discovery"],
    },
    source: {
      sourceType: "workflow-writeup",
      sourceRef: "https://example.com/ts-edge-workflow",
      title: "ts-edge staged workflow protocol",
      summary:
        "planning analysis generation evaluation workflow with checklist verify rollback decision log boundaries",
      missionAlignmentHint: "Improve shared Engine stage chaining.",
      notes: ["planning", "analysis", "generation", "evaluation", "checklist", "verify", "rollback", "decision", "log"],
    },
    gaps: [],
  };
}

function runtimeInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Prefer reusable runtime capability only when repeated call value is explicit.",
        "Do not force Architecture when the primary adoption target is a callable runtime tool.",
      ],
      capabilityLanes: ["Runtime", "Architecture"],
    },
    source: {
      sourceType: "github-repo",
      sourceRef: "https://example.com/scientify",
      title: "Scientify literature access plugin",
      summary:
        "reusable plugin for repeated literature search metadata retrieval and paper-access workflows",
      missionAlignmentHint: "Turn the source into a reusable callable runtime capability.",
      notes: ["plugin", "reusable", "workflow", "tool", "callable"],
    },
    gaps: [],
  };
}

function metadataOverrideRuntimeInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Prefer reusable runtime capability when repeated call value is explicit.",
        "Do not let architecture-skewing title terms override a clearly runtime adoption target.",
      ],
      capabilityLanes: ["Runtime", "Architecture"],
    },
    source: {
      sourceType: "github-repo",
      sourceRef: "https://example.com/architecture-decision-records-runtime-plugin",
      title: "Architecture Decision Records runtime plugin",
      summary:
        "A reusable plugin package with executable code for repeated runtime workflow execution and callable delivery.",
      missionAlignmentHint: "Ship this as a reusable runtime capability, not as Architecture doctrine.",
      primaryAdoptionTarget: "runtime",
      containsExecutableCode: true,
      containsWorkflowPattern: true,
      notes: ["plugin", "runtime", "callable", "workflow", "architecture decision records"],
    },
    gaps: [],
  };
}

function metadataArchitectureOverrideInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Prefer Engine self-improvement when a source primarily upgrades Directive Workspace workflow judgment.",
        "Do not force Runtime just because a repo contains executable code when the extracted value is system-improvement logic.",
      ],
      capabilityLanes: ["Architecture", "Runtime"],
    },
    source: {
      sourceType: "github-repo",
      sourceRef: "https://example.com/runtime-evaluator-boundary-kit",
      title: "Runtime evaluator boundary kit",
      summary:
        "Executable code and workflow examples for bounded approval, evaluation, rollback, and reporting boundaries used to improve system judgment.",
      missionAlignmentHint: "Use this to improve Directive Workspace workflow judgment, not to expose a host-callable runtime surface.",
      containsExecutableCode: true,
      containsWorkflowPattern: true,
      improvesDirectiveWorkspace: true,
      workflowBoundaryShape: "bounded_protocol",
      notes: ["engine", "evaluation", "boundary", "protocol", "approval", "reporting"],
    },
    gaps: [],
  };
}

function discoveryInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Keep ambiguous signals in Discovery until routing clarity exists.",
        "Prefer explicit intake, triage, and routing notes for low-confidence candidates.",
      ],
      capabilityLanes: ["Discovery", "Architecture", "Runtime"],
    },
    source: {
      sourceType: "internal-signal",
      sourceRef: "internal://ambiguous-discovery-signal",
      title: "Ambiguous low-confidence routing signal",
      summary: "intake triage routing signal for an unclear source that still needs discovery review",
      missionAlignmentHint: "Useful only if Discovery records it and keeps routing explicit.",
      notes: ["intake", "triage", "routing", "review"],
    },
    gaps: [],
  };
}

function lowConfidenceFallbackInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Keep ambiguous signals in Discovery until routing clarity exists.",
        "Do not assign early Architecture ownership when a weak note has not earned lane clarity.",
      ],
      capabilityLanes: ["Discovery", "Architecture", "Runtime"],
    },
    source: {
      sourceType: "workflow-writeup",
      sourceRef: "https://example.com/unclear-helper-note",
      title: "Unclear helper note",
      summary: "note",
      missionAlignmentHint: "Unclear value.",
      notes: [],
    },
    gaps: [],
  };
}

function gapAlignmentArchitectureInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Prefer open-gap alignment when the source is explicitly improving Engine workflow judgment.",
        "Do not let runtime-looking repo titles override a closer Architecture gap match.",
      ],
      capabilityLanes: ["Architecture", "Runtime"],
    },
    source: {
      sourceType: "github-repo",
      sourceRef: "https://example.com/runtime-guardrail-kit",
      title: "runtime guardrail kit",
      summary:
        "Executable repo with runtime-looking naming, but the extracted value is bounded approval, evaluation, rollback, and reporting discipline for Directive Workspace.",
      missionAlignmentHint:
        "Use this to improve Directive Workspace workflow judgment and proof boundaries, not to expose a host-callable runtime package.",
      containsExecutableCode: true,
      containsWorkflowPattern: true,
      improvesDirectiveWorkspace: true,
      workflowBoundaryShape: "bounded_protocol",
      notes: ["runtime", "plugin", "approval", "evaluation", "rollback", "reporting", "engine"],
    },
    gaps: [
      {
        gapId: "runtime_callable_packaging_gap",
        description: "Need stronger runtime callable packaging and repeated host execution support.",
        priority: "high",
        relatedMissionObjective: "Improve reusable runtime capability packaging.",
        currentState: "Runtime packaging remains manually assembled.",
        desiredState: "Runtime packaging is easier to reuse across repeated host calls.",
        detectedAt: "2026-04-01T00:00:00.000Z",
      },
      {
        gapId: "architecture_workflow_boundary_gap",
        description: "Need stronger engine approval, evaluation, rollback, and reporting boundaries for bounded structural protocols.",
        priority: "medium",
        relatedMissionObjective: "Improve Directive Workspace workflow judgment.",
        currentState: "Engine workflow boundaries are too heuristic.",
        desiredState: "Engine workflow boundaries are explicit and easier to prove.",
        detectedAt: "2026-04-02T00:00:00.000Z",
      },
    ],
  };
}

function ambiguityReviewArchitectureInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Surface routing disagreement explicitly when runtime-looking repos are actually Engine-improvement inputs.",
        "Do not silently flatten keyword-vs-metadata disagreement into a winner without review notes.",
      ],
      capabilityLanes: ["Architecture", "Runtime", "Discovery"],
    },
    source: {
      sourceType: "github-repo",
      sourceRef: "https://example.com/runtime-plugin-boundary-review-kit",
      title: "Runtime plugin boundary review kit",
      summary:
        "Executable runtime plugin examples with repeated callable workflow packaging, plus approval, rollback, and evaluation boundaries for improving Directive Workspace judgment.",
      missionAlignmentHint:
        "Use this to improve Directive Workspace routing and workflow boundaries, even though the repo looks like a runtime plugin.",
      primaryAdoptionTarget: "architecture",
      containsExecutableCode: true,
      containsWorkflowPattern: true,
      improvesDirectiveWorkspace: true,
      workflowBoundaryShape: "bounded_protocol",
      notes: ["runtime", "plugin", "callable", "workflow", "approval", "rollback", "evaluation", "engine"],
    },
    gaps: [],
  };
}

function discoveryArchitectureBoundaryInput(): EngineInput {
  return {
    mission: {
      currentObjective: "Improve the Directive Workspace engine.",
      usefulnessSignals: [
        "Route structural workflow logic into Architecture even when the source talks about intake and routing.",
        "Do not let Discovery front-door vocabulary overread a source that is really describing Engine workflow judgment.",
      ],
      capabilityLanes: ["Discovery", "Architecture"],
    },
    source: {
      sourceType: "workflow-writeup",
      sourceRef: "https://example.com/discovery-intake-review-protocol",
      title: "Discovery intake routing review protocol",
      summary:
        "workflow writeup for intake triage routing review cadence checklist and evaluation boundaries that improve Directive Workspace judgment",
      missionAlignmentHint:
        "Use this to improve Directive Workspace intake and routing judgment rather than process one candidate.",
      containsWorkflowPattern: true,
      notes: ["intake", "routing", "review cadence", "protocol", "evaluation", "engine"],
    },
    gaps: [],
  };
}

async function processCase(
  engine: DirectiveEngine,
  input: EngineInput,
  caseId: string,
  message: string,
  violations: Violation[],
) {
  const result = await engine.processSource(input);
  if (result.ok) {
    return result.record;
  }
  push(violations, {
    code: "engine_processing_failed",
    caseId,
    path: "processSource",
    message,
    expected: true,
    actual: false,
  });
  return null;
}

async function validate(options: Options = {}): Promise<CheckResult> {
  const engine = new DirectiveEngine({ laneSet: createDirectiveWorkspaceEngineLanes() });
  const violations: Violation[] = [];
  const runtimePromotionAssistance = buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const runtimeCallableExecutionEvidence = buildRuntimeCallableExecutionEvidenceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const hasActionableRuntimePromotionSignal = Boolean(runtimePromotionAssistance.topRecommendation);
  const hasActionableRuntimeExecutionEvidence =
    runtimeCallableExecutionEvidence.totalExecutionRecords >= 2;
  const hasRuntimeExecutionFailurePattern =
    runtimeCallableExecutionEvidence.nonSuccessCount > 0;

  const structural = await processCase(
    engine,
    structuralInput(options),
    "structural_control",
    "DirectiveEngine.processSource should succeed for the staged structural source.",
    violations,
  );
  eq(violations, "structural_control", "selected_lane_mismatch", "selectedLane.laneId", structural?.selectedLane.laneId, "architecture", "The staged structural source should still route to Architecture.");
  eq(violations, "structural_control", "usefulness_level_mismatch", "candidate.usefulnessLevel", structural?.candidate.usefulnessLevel, "meta", "The staged structural source should classify as meta-useful Engine self-improvement once the generated plans preserve Engine-owned stage boundaries.");
  prefix(violations, "structural_control", "extractionPlan.extractedValue", structural?.extractionPlan.extractedValue, "Stage-aware structural pattern:", "Extraction should preserve the staged structural pattern as explicit output.");
  prefix(violations, "structural_control", "extractionPlan.extractedValue", structural?.extractionPlan.extractedValue, "Bounded control/evidence pattern:", "Extraction should preserve the bounded control/evidence pattern as explicit output.");
  match(violations, "structural_control", "adaptation_plan_mismatch", "adaptationPlan.directiveOwnedForm", structural?.adaptationPlan.directiveOwnedForm, /preserves explicit stage boundaries/i, "Adaptation should still preserve explicit stage boundaries instead of flattening them away.");
  match(violations, "structural_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", structural?.improvementPlan.intendedDelta, /later planning stages can build on the adaptation boundary/i, "Improvement should explicitly depend on the adaptation boundary.");
  match(violations, "structural_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", structural?.improvementPlan.intendedDelta, /instead of recomputing everything from the same flat input/i, "Improvement should still reject the original flat-plan pattern.");
  match(violations, "structural_control", "usefulness_rationale_mismatch", "analysis.usefulnessRationale", structural?.analysis.usefulnessRationale, /generated adaptation and improvement plans are Engine-self-improvement oriented/i, "Usefulness rationale should now explain the Architecture verdict from the generated plans instead of only from metadata or lane choice.");
  eq(violations, "structural_control", "proof_kind_mismatch", "proofPlan.proofKind", structural?.proofPlan.proofKind, "architecture_validation", "Proof planning should stay on the Architecture validation path.");
  match(violations, "structural_control", "proof_evidence_mismatch", "proofPlan.requiredEvidence", structural?.proofPlan.requiredEvidence.join("\n"), /prior extraction, adaptation, and improvement stages/i, "Proof should stay anchored to the earlier staged outputs.");
  eq(violations, "structural_control", "proof_gate_mismatch", "proofPlan.requiredGates.0", structural?.proofPlan.requiredGates[0], "adaptation_complete", "Proof should expose the staged adaptation gate that integration now depends on.");
  eq(violations, "structural_control", "integration_target_mismatch", "integrationProposal.targetLaneId", structural?.integrationProposal.targetLaneId, "architecture", "Integration should stay in the Architecture lane for the staged structural source.");
  match(violations, "structural_control", "integration_action_mismatch", "integrationProposal.nextAction", structural?.integrationProposal.nextAction, /staged proof boundary/i, "Integration should explicitly reference the staged proof boundary.");
  match(violations, "structural_control", "integration_action_mismatch", "integrationProposal.nextAction", structural?.integrationProposal.nextAction, /adaptation_complete/i, "Integration should depend on the proof gate provided by the staged proof plan.");
  match(violations, "structural_control", "integration_action_mismatch", "integrationProposal.nextAction", structural?.integrationProposal.nextAction, /improve stage-aware engine analysis for structural sources/i, "Integration should carry the staged improvement goal into the final next action.");

  const runtime = await processCase(
    engine,
    runtimeInput(),
    "runtime_control",
    "DirectiveEngine.processSource should succeed for the runtime control source.",
    violations,
  );
  eq(violations, "runtime_control", "selected_lane_mismatch", "selectedLane.laneId", runtime?.selectedLane.laneId, "runtime", "The runtime control source should still route to Runtime.");
  eq(violations, "runtime_control", "handoff_artifact_family_mismatch", "integrationProposal.handoffArtifactFamily", runtime?.integrationProposal.handoffArtifactFamily, "runtime_follow_up", "Runtime integration should still hand off through the runtime follow-up family.");
  match(violations, "runtime_control", "integration_action_mismatch", "integrationProposal.nextAction", runtime?.integrationProposal.nextAction, /Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary\./, "Runtime integration should keep the bounded Runtime next-action baseline.");
  if (hasActionableRuntimePromotionSignal) {
    match(violations, "runtime_control", "integration_action_mismatch", "integrationProposal.nextAction", runtime?.integrationProposal.nextAction, /promotion assistance only as a reviewable soft signal/i, "Runtime integration should include the recommendation-first promotion-assistance soft signal when Runtime assistance has an actionable top recommendation.");
    match(violations, "runtime_control", "integration_action_mismatch", "integrationProposal.nextAction", runtime?.integrationProposal.nextAction, /before any later promotion follow-through/i, "Runtime integration should reflect the current evidence-backed promotion-assistance follow-through boundary when a top recommendation exists.");
    arrayMatch(violations, "runtime_control", "integration_action_mismatch", "improvementPlan.improvementGoals", runtime?.improvementPlan.improvementGoals, /before suggesting promotion follow-through/i, "Runtime improvement planning should incorporate the active promotion-assistance soft signal when Runtime assistance has an actionable top recommendation.");
    match(violations, "runtime_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", runtime?.improvementPlan.intendedDelta, /Runtime promotion evidence signal: \d+ validated manual promotion cycles exist/i, "Runtime improvement planning should cite the evidence-backed promotion signal when Runtime assistance has an actionable top recommendation.");
  }
  if (hasActionableRuntimeExecutionEvidence) {
    match(violations, "runtime_control", "integration_action_mismatch", "integrationProposal.nextAction", runtime?.integrationProposal.nextAction, /callable execution evidence only as a reviewable soft signal/i, "Runtime integration should carry forward the bounded callable-execution evidence signal once repo-root execution history exists.");
    match(violations, "runtime_control", "integration_action_mismatch", "integrationProposal.nextAction", runtime?.integrationProposal.nextAction, /before widening host consumption or broader Runtime surface claims/i, "Runtime integration should keep execution evidence review-only before any broader Runtime expansion.");
    match(violations, "runtime_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", runtime?.improvementPlan.intendedDelta, /Runtime callable execution evidence signal: \d+ bounded execution records exist across \d+ capabilities/i, "Runtime improvement planning should cite the callable-execution evidence summary once repo-root execution history exists.");
  }
  if (hasRuntimeExecutionFailurePattern) {
    arrayMatch(violations, "runtime_control", "integration_action_mismatch", "improvementPlan.improvementGoals", runtime?.improvementPlan.improvementGoals, /callable input-boundary clarity/i, "Runtime improvement planning should turn bounded callable failure patterns into an explicit follow-up priority.");
    match(violations, "runtime_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", runtime?.improvementPlan.intendedDelta, /validation_error/i, "Runtime improvement planning should preserve the concrete failure-pattern label from the execution evidence signal.");
  }
  eq(violations, "runtime_control", "proof_kind_mismatch", "proofPlan.proofKind", runtime?.proofPlan.proofKind, "runtime_runtime_proof", "Runtime control proof should stay on the runtime proof path.");
  eq(violations, "runtime_control", "proof_gate_mismatch", "proofPlan.requiredGates", JSON.stringify(runtime?.proofPlan.requiredGates), JSON.stringify(["bounded_runtime_scope", "proof_artifact_present", "host_adapter_review"]), "Runtime control proof gates should remain unchanged by the staged Architecture refactor.");

  const metadataOverrideRuntime = await processCase(
    engine,
    metadataOverrideRuntimeInput(),
    "runtime_metadata_override",
    "DirectiveEngine.processSource should succeed for a runtime-targeted source with architecture-skewing title terms.",
    violations,
  );
  eq(violations, "runtime_metadata_override", "selected_lane_mismatch", "selectedLane.laneId", metadataOverrideRuntime?.selectedLane.laneId, "runtime", "Structured runtime metadata should override architecture-skewing title keywords.");
  eq(violations, "runtime_metadata_override", "usefulness_level_mismatch", "candidate.usefulnessLevel", metadataOverrideRuntime?.candidate.usefulnessLevel, "direct", "A runtime-targeted executable source should keep direct usefulness.");
  eq(violations, "runtime_metadata_override", "routing_signal_mismatch", "routingAssessment.recommendedRecordShape", metadataOverrideRuntime?.routingAssessment.recommendedRecordShape, "fast_path", "High-confidence Runtime routes without an open gap should still expand into fast-path instead of falling back to queue-only.");
  eq(violations, "runtime_metadata_override", "routing_signal_mismatch", "routingAssessment.needsHumanReview", metadataOverrideRuntime?.routingAssessment.needsHumanReview, false, "High-confidence Runtime routes without signal conflict should not require extra human review only because no open gap matched.");
  eq(violations, "runtime_metadata_override", "routing_signal_mismatch", "candidate.requiresHumanReview", metadataOverrideRuntime?.candidate.requiresHumanReview, false, "Candidate review state should stay aligned with the corrected no-gap Runtime routing policy.");
  match(violations, "runtime_metadata_override", "usefulness_rationale_mismatch", "analysis.usefulnessRationale", metadataOverrideRuntime?.analysis.usefulnessRationale, /generated Runtime adaptation and improvement plans target reusable callable runtime value/i, "Runtime usefulness rationale should now explain the direct verdict from the generated Runtime plans.");
  arrayMatch(violations, "runtime_metadata_override", "routing_rationale_mismatch", "routingAssessment.rationale", metadataOverrideRuntime?.routingAssessment.rationale, /Primary adoption target metadata is set to runtime/i, "Routing rationale should explain that structured adoption-target metadata influenced the decision.");
  arrayMatch(violations, "runtime_metadata_override", "routing_rationale_mismatch", "routingAssessment.rationale", metadataOverrideRuntime?.routingAssessment.rationale, /strong Runtime signals justify bounded follow-through even without an open gap match/i, "Routing rationale should explain why fast-path remains justified without an open gap.");
  arrayMatch(violations, "runtime_metadata_override", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.metadataSignals", metadataOverrideRuntime?.routingAssessment.explanationBreakdown.metadataSignals, /Metadata-derived lane scores: discovery=\d+, architecture=\d+, runtime=\d+\./, "Routing assessment should expose a stable metadata score breakdown.");

  const metadataOverrideArchitecture = await processCase(
    engine,
    metadataArchitectureOverrideInput(),
    "architecture_metadata_override",
    "DirectiveEngine.processSource should succeed for an executable source explicitly marked as system-improvement-oriented.",
    violations,
  );
  eq(violations, "architecture_metadata_override", "selected_lane_mismatch", "selectedLane.laneId", metadataOverrideArchitecture?.selectedLane.laneId, "architecture", "System-improvement metadata should override executable-repo runtime skew when the source is really Engine-improvement work.");
  eq(violations, "architecture_metadata_override", "usefulness_level_mismatch", "candidate.usefulnessLevel", metadataOverrideArchitecture?.candidate.usefulnessLevel, "meta", "A source explicitly marked as improving Directive Workspace itself should classify as meta-useful.");
  match(violations, "architecture_metadata_override", "usefulness_rationale_mismatch", "analysis.usefulnessRationale", metadataOverrideArchitecture?.analysis.usefulnessRationale, /generated adaptation and improvement plans are Engine-self-improvement oriented/i, "Architecture usefulness rationale should still be explained from the generated plans.");
  arrayMatch(violations, "architecture_metadata_override", "routing_rationale_mismatch", "routingAssessment.rationale", metadataOverrideArchitecture?.routingAssessment.rationale, /source primarily improves Directive Workspace itself/i, "Routing rationale should explain the explicit system-improvement metadata signal.");
  arrayMatch(violations, "architecture_metadata_override", "routing_rationale_mismatch", "routingAssessment.rationale", metadataOverrideArchitecture?.routingAssessment.rationale, /workflow-boundary metadata is set to bounded_protocol/i, "Routing rationale should explain the workflow-boundary-shape signal.");
  arrayMatch(violations, "architecture_metadata_override", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.metadataSignals", metadataOverrideArchitecture?.routingAssessment.explanationBreakdown.metadataSignals, /source primarily improves Directive Workspace itself/i, "Structured metadata explanation should expose the Architecture-driving system-improvement signal.");

  const architectureGapAlignment = await processCase(
    engine,
    gapAlignmentArchitectureInput(),
    "architecture_gap_alignment",
    "DirectiveEngine.processSource should succeed for an executable source whose closest open gap is architectural despite runtime-skewing wording.",
    violations,
  );
  eq(violations, "architecture_gap_alignment", "selected_lane_mismatch", "selectedLane.laneId", architectureGapAlignment?.selectedLane.laneId, "architecture", "Open-gap alignment plus structured system-improvement signals should keep this executable source on the Architecture lane.");
  eq(violations, "architecture_gap_alignment", "usefulness_level_mismatch", "candidate.usefulnessLevel", architectureGapAlignment?.candidate.usefulnessLevel, "meta", "Architecture gap alignment should still classify as meta-useful Engine improvement.");
  eq(violations, "architecture_gap_alignment", "routing_signal_mismatch", "routingAssessment.matchedGapId", architectureGapAlignment?.routingAssessment.matchedGapId, "architecture_workflow_boundary_gap", "Gap matching should prefer the architecture workflow-boundary gap over the runtime packaging gap.");
  arrayMatch(violations, "architecture_gap_alignment", "routing_rationale_mismatch", "routingAssessment.rationale", architectureGapAlignment?.routingAssessment.rationale, /Structured source signals added \d+ points of gap alignment for architecture_workflow_boundary_gap/i, "Routing rationale should explain that structured source signals strengthened the selected gap match.");
  arrayMatch(violations, "architecture_gap_alignment", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.gapAlignmentSignals", architectureGapAlignment?.routingAssessment.explanationBreakdown.gapAlignmentSignals, /Gap-derived lane scores: discovery=\d+, architecture=\d+, runtime=\d+\./, "Routing assessment should expose a stable gap score breakdown.");
  arrayMatch(violations, "architecture_gap_alignment", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.gapAlignmentSignals", architectureGapAlignment?.routingAssessment.explanationBreakdown.gapAlignmentSignals, /Structured source signals added \d+ points of gap alignment for architecture_workflow_boundary_gap/i, "Structured gap-alignment explanation should expose why the architecture gap won.");

  const ambiguityReviewArchitecture = await processCase(
    engine,
    ambiguityReviewArchitectureInput(),
    "architecture_ambiguity_review",
    "DirectiveEngine.processSource should succeed for a source whose keyword and metadata winners disagree.",
    violations,
  );
  eq(violations, "architecture_ambiguity_review", "selected_lane_mismatch", "selectedLane.laneId", ambiguityReviewArchitecture?.selectedLane.laneId, "architecture", "Architecture should still win when explicit system-improvement metadata outweighs runtime-skewing repo language.");
  eq(violations, "architecture_ambiguity_review", "decision_state_mismatch", "decision.decisionState", ambiguityReviewArchitecture?.decision.decisionState, "needs_human_review", "Conflicted Architecture routes should emit the explicit needs_human_review decision state instead of masquerading as already accepted Architecture adoption.");
  eq(violations, "architecture_ambiguity_review", "routing_signal_mismatch", "routingAssessment.routeConflict", ambiguityReviewArchitecture?.routingAssessment.routeConflict, true, "Route conflict should be raised when signal families disagree on the winning lane.");
  eq(violations, "architecture_ambiguity_review", "routing_signal_mismatch", "routingAssessment.recommendedRecordShape", ambiguityReviewArchitecture?.routingAssessment.recommendedRecordShape, "split_case", "Conflicted Architecture routes should require the fuller split-case record instead of opening a fast-path.");
  eq(violations, "architecture_ambiguity_review", "routing_signal_mismatch", "routingAssessment.needsHumanReview", ambiguityReviewArchitecture?.routingAssessment.needsHumanReview, true, "Signal-family disagreement should force human review even when a lane winner exists.");
  arrayMatch(violations, "architecture_ambiguity_review", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.ambiguitySignals", ambiguityReviewArchitecture?.routingAssessment.explanationBreakdown.ambiguitySignals, /Signal disagreement requires review:/i, "Ambiguity explanation should expose the conflicting signal families.");
  arrayMatch(violations, "architecture_ambiguity_review", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.ambiguitySignals", ambiguityReviewArchitecture?.routingAssessment.explanationBreakdown.ambiguitySignals, /Top lane architecture beat .* by \d+ points/i, "Ambiguity explanation should expose the top-vs-runner-up score delta.");
  arrayMatch(violations, "architecture_ambiguity_review", "routing_rationale_mismatch", "routingAssessment.rationale", ambiguityReviewArchitecture?.routingAssessment.rationale, /Signal disagreement requires review:/i, "Routing rationale should explicitly say when signal families disagree.");
  arrayMatch(violations, "architecture_ambiguity_review", "routing_rationale_mismatch", "routingAssessment.rationale", ambiguityReviewArchitecture?.routingAssessment.rationale, /conflicted Architecture route needs the fuller structural record/i, "Routing rationale should explain why conflicted Architecture routes expand to split-case.");
  match(violations, "architecture_ambiguity_review", "decision_state_mismatch", "decision.summary", ambiguityReviewArchitecture?.decision.summary, /needs_human_review.*must be reviewed explicitly before downstream adoption/i, "Decision summary should explain that the bounded route still requires explicit review before downstream adoption.");

  const discoveryArchitectureBoundary = await processCase(
    engine,
    discoveryArchitectureBoundaryInput(),
    "discovery_architecture_boundary",
    "DirectiveEngine.processSource should succeed for a structural source that uses Discovery vocabulary.",
    violations,
  );
  eq(violations, "discovery_architecture_boundary", "selected_lane_mismatch", "selectedLane.laneId", discoveryArchitectureBoundary?.selectedLane.laneId, "architecture", "Discovery-looking workflow vocabulary should not override a structural Architecture source.");
  eq(violations, "discovery_architecture_boundary", "routing_signal_mismatch", "routingAssessment.confidence", discoveryArchitectureBoundary?.routingAssessment.confidence, "high", "Structural discovery-vs-architecture cases should score confidently toward Architecture after the overread correction.");
  eq(violations, "discovery_architecture_boundary", "routing_signal_mismatch", "routingAssessment.recommendedRecordShape", discoveryArchitectureBoundary?.routingAssessment.recommendedRecordShape, "split_case", "High-confidence Architecture routes without an open gap should still expand into a split-case record instead of falling back to queue-only.");
  eq(violations, "discovery_architecture_boundary", "routing_signal_mismatch", "routingAssessment.needsHumanReview", discoveryArchitectureBoundary?.routingAssessment.needsHumanReview, false, "High-confidence Architecture routes without signal conflict should not require extra human review only because no open gap matched.");
  eq(violations, "discovery_architecture_boundary", "routing_signal_mismatch", "candidate.requiresHumanReview", discoveryArchitectureBoundary?.candidate.requiresHumanReview, false, "Candidate review state should stay aligned with the corrected no-gap Architecture routing policy.");
  arrayMatch(violations, "discovery_architecture_boundary", "routing_rationale_mismatch", "routingAssessment.rationale", discoveryArchitectureBoundary?.routingAssessment.rationale, /Structural-source correction is present:/i, "Routing rationale should explain the structural discovery-overread correction.");
  arrayMatch(violations, "discovery_architecture_boundary", "routing_rationale_mismatch", "routingAssessment.rationale", discoveryArchitectureBoundary?.routingAssessment.rationale, /strong Architecture signals justify a fuller structural record even without an open gap match/i, "Routing rationale should explain why split-case remains justified without an open gap.");
  arrayMatch(violations, "discovery_architecture_boundary", "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.keywordSignals", discoveryArchitectureBoundary?.routingAssessment.explanationBreakdown.keywordSignals, /Structural-source correction is present:/i, "Keyword explanation should expose the structural discovery-overread correction.");

  const architectureProofCases = [
    {
      label: "Inspect AI",
      runPath: "runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-inspect-ai-2026-03-28-402b52cf.json",
    },
    {
      label: "ts-edge Type-Safe Graph Workflow Engine",
      runPath: "runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json",
    },
  ] as const;

  for (const proofCase of architectureProofCases) {
    const storedRun = readStoredRun(proofCase.runPath);
    const replay = await processCase(
      engine,
      {
        mission: {
          currentObjective: storedRun.mission.currentObjective,
          usefulnessSignals: storedRun.mission.usefulnessSignals,
          capabilityLanes: storedRun.mission.capabilityLanes,
          activeMissionMarkdown: storedRun.mission.activeMissionMarkdown,
        },
        source: storedRun.source,
        gaps: storedRun.openGaps,
      },
      `architecture_replay:${proofCase.label}`,
      `DirectiveEngine.processSource should succeed for the ${proofCase.label} routing proof case.`,
      violations,
    );
    eq(violations, `architecture_replay:${proofCase.label}`, "selected_lane_mismatch", "selectedLane.laneId", replay?.selectedLane.laneId, "architecture", `${proofCase.label} should now route to Architecture instead of Runtime.`);
    eq(violations, `architecture_replay:${proofCase.label}`, "usefulness_level_mismatch", "candidate.usefulnessLevel", replay?.candidate.usefulnessLevel, "meta", `${proofCase.label} should now classify as meta-useful Engine pattern extraction.`);
    match(violations, `architecture_replay:${proofCase.label}`, "usefulness_rationale_mismatch", "analysis.usefulnessRationale", replay?.analysis.usefulnessRationale, /generated adaptation and improvement plans are Engine-self-improvement oriented/i, `${proofCase.label} should explain meta usefulness from the generated Architecture plans.`);
    eq(violations, `architecture_replay:${proofCase.label}`, "decision_state_mismatch", "decision.decisionState", replay?.decision.decisionState, "needs_human_review", `${proofCase.label} should now surface the explicit human-review decision state because the route remains Architecture-oriented but still materially conflicted.`);
    eq(violations, `architecture_replay:${proofCase.label}`, "handoff_artifact_family_mismatch", "integrationProposal.handoffArtifactFamily", replay?.integrationProposal.handoffArtifactFamily, "architecture_adoption", `${proofCase.label} should now hand off through the Architecture adoption family.`);
    eq(violations, `architecture_replay:${proofCase.label}`, "proof_kind_mismatch", "proofPlan.proofKind", replay?.proofPlan.proofKind, "architecture_validation", `${proofCase.label} should now use the Architecture proof path.`);
    gt(violations, `architecture_replay:${proofCase.label}`, "routingAssessment.scoreBreakdown.patternExtractionSignal", replay?.routingAssessment.scoreBreakdown.patternExtractionSignal, 0, `${proofCase.label} should trigger the bounded pattern-extraction correction signal.`);
    arrayMatch(violations, `architecture_replay:${proofCase.label}`, "routing_rationale_mismatch", "routingAssessment.rationale", replay?.routingAssessment.rationale, /Pattern-extraction signal is present/i, `${proofCase.label} should explain the bounded Architecture correction in the routing rationale.`);
    arrayMatch(violations, `architecture_replay:${proofCase.label}`, "routing_explanation_mismatch", "routingAssessment.explanationBreakdown.keywordSignals", replay?.routingAssessment.explanationBreakdown.keywordSignals, /Keyword-derived lane scores: discovery=\d+, architecture=\d+, runtime=\d+\./, `${proofCase.label} should expose a stable keyword score breakdown.`);
  }

  const discovery = await processCase(
    engine,
    discoveryInput(),
    "discovery_control",
    "DirectiveEngine.processSource should succeed for the Discovery control source.",
    violations,
  );
  eq(violations, "discovery_control", "selected_lane_mismatch", "selectedLane.laneId", discovery?.selectedLane.laneId, "discovery", "The Discovery control source should still route to Discovery.");
  eq(violations, "discovery_control", "decision_state_mismatch", "decision.decisionState", discovery?.decision.decisionState, "hold_in_discovery", "Discovery control decision should still hold the case in Discovery.");

  const lowConfidenceFallback = await processCase(
    engine,
    lowConfidenceFallbackInput(),
    "low_confidence_fallback",
    "DirectiveEngine.processSource should succeed for a weak structural note that has not earned lane ownership.",
    violations,
  );
  eq(violations, "low_confidence_fallback", "selected_lane_mismatch", "selectedLane.laneId", lowConfidenceFallback?.selectedLane.laneId, "discovery", "Low-confidence no-gap notes should stay in Discovery instead of inheriting weak Architecture ownership.");
  eq(violations, "low_confidence_fallback", "decision_state_mismatch", "decision.decisionState", lowConfidenceFallback?.decision.decisionState, "hold_in_discovery", "Low-confidence fallback cases should hold in Discovery.");
  eq(violations, "low_confidence_fallback", "routing_signal_mismatch", "routingAssessment.confidence", lowConfidenceFallback?.routingAssessment.confidence, "low", "The fallback case should remain low-confidence.");
  eq(violations, "low_confidence_fallback", "routing_signal_mismatch", "routingAssessment.recommendedRecordShape", lowConfidenceFallback?.routingAssessment.recommendedRecordShape, "queue_only", "Low-confidence fallback cases should remain queue-only.");
  arrayMatch(violations, "low_confidence_fallback", "routing_rationale_mismatch", "routingAssessment.rationale", lowConfidenceFallback?.routingAssessment.rationale, /stays in Discovery instead of assigning early architecture ownership/i, "Routing rationale should explain the low-confidence fallback to Discovery.");
  eq(violations, "discovery_control", "integration_target_mismatch", "integrationProposal.integrationMode", discovery?.integrationProposal.integrationMode, "none", "Discovery control integration should keep the non-integration mode.");
  eq(violations, "discovery_control", "handoff_artifact_family_mismatch", "integrationProposal.handoffArtifactFamily", discovery?.integrationProposal.handoffArtifactFamily, "discovery_backlog", "Discovery control integration should still use the Discovery backlog family.");
  eq(violations, "discovery_control", "integration_action_mismatch", "integrationProposal.nextAction", discovery?.integrationProposal.nextAction, "Keep the candidate in Discovery until routing clarity improves.", "Discovery control integration should keep the default Discovery next action.");
  eq(violations, "discovery_control", "proof_kind_mismatch", "proofPlan.proofKind", discovery?.proofPlan.proofKind, "discovery_review", "Discovery control proof should stay on the Discovery review path.");
  eq(violations, "discovery_control", "proof_gate_mismatch", "proofPlan.requiredGates", JSON.stringify(discovery?.proofPlan.requiredGates), JSON.stringify(["routing_review", "human_decision_required"]), "Discovery control proof gates should remain unchanged by the staged Engine refactor.");

  if (violations.length > 0) {
    return {
      ok: false,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      summary: "Directive Engine stage chaining contract violated.",
      violations,
    };
  }

  return {
    ok: true,
    checkerId: CHECKER_ID,
    failureContractVersion: FAILURE_CONTRACT_VERSION,
    candidateId: structural!.candidate.candidateId,
    selectedLane: structural!.selectedLane.laneId,
    improvementGoals: structural!.improvementPlan.improvementGoals,
    proofGates: structural!.proofPlan.requiredGates,
    integrationNextAction: structural!.integrationProposal.nextAction,
    runtimeControl: {
      candidateId: runtime!.candidate.candidateId,
      selectedLane: runtime!.selectedLane.laneId,
      proofKind: runtime!.proofPlan.proofKind,
      improvementGoals: runtime!.improvementPlan.improvementGoals,
      integrationNextAction: runtime!.integrationProposal.nextAction,
    },
    architectureProofCases: architectureProofCases.map((proofCase) => ({ label: proofCase.label, runPath: proofCase.runPath })),
    discoveryControl: {
      candidateId: discovery!.candidate.candidateId,
      selectedLane: discovery!.selectedLane.laneId,
      proofKind: discovery!.proofPlan.proofKind,
      integrationNextAction: discovery!.integrationProposal.nextAction,
    },
  };
}

function resolveOptionsFromArgs(args: string[]): Options {
  const probeArg = args.find((arg) => arg.startsWith("--probe="));
  if (!probeArg) {
    return {};
  }
  const probeMode = probeArg.slice("--probe=".length);
  if (probeMode !== STRUCTURAL_CONTROL_RUNTIME_SKEW_PROBE) {
    throw new Error(`Unsupported directive-engine-stage-chaining probe mode: ${probeMode}`);
  }
  return { probeMode };
}

function isDirectExecution() {
  const currentFile = path.resolve(fileURLToPath(import.meta.url));
  const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return currentFile === executedFile;
}

async function main() {
  const result = await validate(resolveOptionsFromArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (isDirectExecution()) {
  void main();
}
