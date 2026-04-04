import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DirectiveEngine } from "../engine/directive-engine.ts";
import { createDirectiveWorkspaceEngineLanes } from "../engine/directive-workspace-lanes.ts";
import type { DirectiveEngineRunRecord } from "../engine/types.ts";
import { buildRuntimeCallableExecutionEvidenceReport } from "../shared/lib/runtime-callable-execution-evidence.ts";
import { buildDirectiveRuntimePromotionAssistanceReport } from "../shared/lib/runtime-promotion-assistance.ts";

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
  prefix(violations, "structural_control", "extractionPlan.extractedValue", structural?.extractionPlan.extractedValue, "Stage-aware structural pattern:", "Extraction should preserve the staged structural pattern as explicit output.");
  prefix(violations, "structural_control", "extractionPlan.extractedValue", structural?.extractionPlan.extractedValue, "Bounded control/evidence pattern:", "Extraction should preserve the bounded control/evidence pattern as explicit output.");
  match(violations, "structural_control", "adaptation_plan_mismatch", "adaptationPlan.directiveOwnedForm", structural?.adaptationPlan.directiveOwnedForm, /preserves explicit stage boundaries/i, "Adaptation should still preserve explicit stage boundaries instead of flattening them away.");
  match(violations, "structural_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", structural?.improvementPlan.intendedDelta, /later planning stages can build on the adaptation boundary/i, "Improvement should explicitly depend on the adaptation boundary.");
  match(violations, "structural_control", "improvement_delta_mismatch", "improvementPlan.intendedDelta", structural?.improvementPlan.intendedDelta, /instead of recomputing everything from the same flat input/i, "Improvement should still reject the original flat-plan pattern.");
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
  arrayMatch(violations, "runtime_metadata_override", "routing_rationale_mismatch", "routingAssessment.rationale", metadataOverrideRuntime?.routingAssessment.rationale, /Primary adoption target metadata is set to runtime/i, "Routing rationale should explain that structured adoption-target metadata influenced the decision.");

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
    eq(violations, `architecture_replay:${proofCase.label}`, "decision_state_mismatch", "decision.decisionState", replay?.decision.decisionState, "accept_for_architecture", `${proofCase.label} should now produce an Architecture adoption decision.`);
    eq(violations, `architecture_replay:${proofCase.label}`, "handoff_artifact_family_mismatch", "integrationProposal.handoffArtifactFamily", replay?.integrationProposal.handoffArtifactFamily, "architecture_adoption", `${proofCase.label} should now hand off through the Architecture adoption family.`);
    eq(violations, `architecture_replay:${proofCase.label}`, "proof_kind_mismatch", "proofPlan.proofKind", replay?.proofPlan.proofKind, "architecture_validation", `${proofCase.label} should now use the Architecture proof path.`);
    gt(violations, `architecture_replay:${proofCase.label}`, "routingAssessment.scoreBreakdown.patternExtractionSignal", replay?.routingAssessment.scoreBreakdown.patternExtractionSignal, 0, `${proofCase.label} should trigger the bounded pattern-extraction correction signal.`);
    arrayMatch(violations, `architecture_replay:${proofCase.label}`, "routing_rationale_mismatch", "routingAssessment.rationale", replay?.routingAssessment.rationale, /Pattern-extraction signal is present/i, `${proofCase.label} should explain the bounded Architecture correction in the routing rationale.`);
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
