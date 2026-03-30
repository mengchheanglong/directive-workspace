import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DirectiveEngine } from "../engine/directive-engine.ts";
import { createDirectiveWorkspaceEngineLanes } from "../engine/directive-workspace-lanes.ts";
import type { DirectiveEngineRunRecord } from "../engine/types.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readStoredRun(relativePath: string) {
  return JSON.parse(
    fs.readFileSync(path.resolve(DIRECTIVE_ROOT, relativePath), "utf8"),
  ) as DirectiveEngineRunRecord;
}

async function main() {
  const engine = new DirectiveEngine({
    laneSet: createDirectiveWorkspaceEngineLanes(),
  });

  const result = await engine.processSource({
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
      notes: [
        "planning",
        "analysis",
        "generation",
        "evaluation",
        "checklist",
        "verify",
        "rollback",
        "decision",
        "log",
      ],
    },
    gaps: [],
  });

  assert.equal(result.ok, true, "DirectiveEngine.processSource should succeed for the staged structural source.");
  const { record } = result;

  assert.equal(
    record.selectedLane.laneId,
    "architecture",
    "The staged structural source should still route to Architecture.",
  );
  assert.ok(
    record.extractionPlan.extractedValue.some((value) =>
      value.startsWith("Stage-aware structural pattern:")
    ),
    "Extraction should preserve the staged structural pattern as explicit output.",
  );
  assert.ok(
    record.extractionPlan.extractedValue.some((value) =>
      value.startsWith("Bounded control/evidence pattern:")
    ),
    "Extraction should preserve the bounded control/evidence pattern as explicit output.",
  );
  assert.match(
    record.adaptationPlan.directiveOwnedForm,
    /preserves explicit stage boundaries/i,
    "Adaptation should still preserve explicit stage boundaries instead of flattening them away.",
  );
  assert.match(
    record.improvementPlan.intendedDelta,
    /later planning stages can build on the adaptation boundary/i,
    "Improvement should explicitly depend on the adaptation boundary.",
  );
  assert.match(
    record.improvementPlan.intendedDelta,
    /instead of recomputing everything from the same flat input/i,
    "Improvement should still reject the original flat-plan pattern.",
  );
  assert.equal(
    record.proofPlan.proofKind,
    "architecture_validation",
    "Proof planning should stay on the Architecture validation path.",
  );
  assert.match(
    record.proofPlan.requiredEvidence.join("\n"),
    /prior extraction, adaptation, and improvement stages/i,
    "Proof should stay anchored to the earlier staged outputs.",
  );
  assert.equal(
    record.proofPlan.requiredGates[0],
    "adaptation_complete",
    "Proof should expose the staged adaptation gate that integration now depends on.",
  );
  assert.equal(
    record.integrationProposal.targetLaneId,
    "architecture",
    "Integration should stay in the Architecture lane for the staged structural source.",
  );
  assert.match(
    record.integrationProposal.nextAction,
    /staged proof boundary/i,
    "Integration should explicitly reference the staged proof boundary.",
  );
  assert.match(
    record.integrationProposal.nextAction,
    /adaptation_complete/i,
    "Integration should depend on the proof gate provided by the staged proof plan.",
  );
  assert.match(
    record.integrationProposal.nextAction,
    /improve stage-aware engine analysis for structural sources/i,
    "Integration should carry the staged improvement goal into the final next action.",
  );

  const runtimeResult = await engine.processSource({
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
      missionAlignmentHint:
        "Turn the source into a reusable callable runtime capability.",
      notes: ["plugin", "reusable", "workflow", "tool", "callable"],
    },
    gaps: [],
  });

  assert.equal(
    runtimeResult.ok,
    true,
    "DirectiveEngine.processSource should succeed for the runtime control source.",
  );
  const runtimeRecord = runtimeResult.record;
  assert.equal(
    runtimeRecord.selectedLane.laneId,
    "runtime",
    "The runtime control source should still route to Runtime.",
  );
  assert.equal(
    runtimeRecord.integrationProposal.handoffArtifactFamily,
    "runtime_follow_up",
    "Runtime integration should still hand off through the runtime follow-up family.",
  );
  assert.equal(
    runtimeRecord.integrationProposal.nextAction,
    "Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary.",
    "Runtime integration should keep the default Runtime next action.",
  );
  assert.equal(
    runtimeRecord.proofPlan.proofKind,
    "runtime_runtime_proof",
    "Runtime control proof should stay on the runtime proof path.",
  );
  assert.deepEqual(
    runtimeRecord.proofPlan.requiredGates,
    ["bounded_runtime_scope", "proof_artifact_present", "host_adapter_review"],
    "Runtime control proof gates should remain unchanged by the staged Architecture refactor.",
  );

  const architectureProofCases = [
    {
      label: "Inspect AI",
      runPath:
        "runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-inspect-ai-2026-03-28-402b52cf.json",
    },
    {
      label: "ts-edge Type-Safe Graph Workflow Engine",
      runPath:
        "runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json",
    },
  ] as const;

  for (const proofCase of architectureProofCases) {
    const storedRun = readStoredRun(proofCase.runPath);
    const replayResult = await engine.processSource({
      mission: {
        currentObjective: storedRun.mission.currentObjective,
        usefulnessSignals: storedRun.mission.usefulnessSignals,
        capabilityLanes: storedRun.mission.capabilityLanes,
        activeMissionMarkdown: storedRun.mission.activeMissionMarkdown,
      },
      source: storedRun.source,
      gaps: storedRun.openGaps,
    });

    assert.equal(
      replayResult.ok,
      true,
      `DirectiveEngine.processSource should succeed for the ${proofCase.label} routing proof case.`,
    );
    const replayRecord = replayResult.record;
    assert.equal(
      replayRecord.selectedLane.laneId,
      "architecture",
      `${proofCase.label} should now route to Architecture instead of Runtime.`,
    );
    assert.equal(
      replayRecord.candidate.usefulnessLevel,
      "meta",
      `${proofCase.label} should now classify as meta-useful Engine pattern extraction.`,
    );
    assert.equal(
      replayRecord.decision.decisionState,
      "accept_for_architecture",
      `${proofCase.label} should now produce an Architecture adoption decision.`,
    );
    assert.equal(
      replayRecord.integrationProposal.handoffArtifactFamily,
      "architecture_adoption",
      `${proofCase.label} should now hand off through the Architecture adoption family.`,
    );
    assert.equal(
      replayRecord.proofPlan.proofKind,
      "architecture_validation",
      `${proofCase.label} should now use the Architecture proof path.`,
    );
    assert.ok(
      replayRecord.routingAssessment.scoreBreakdown.patternExtractionSignal > 0,
      `${proofCase.label} should trigger the bounded pattern-extraction correction signal.`,
    );
    assert.ok(
      replayRecord.routingAssessment.rationale.some((line) =>
        /Pattern-extraction signal is present/i.test(line)
      ),
      `${proofCase.label} should explain the bounded Architecture correction in the routing rationale.`,
    );
  }

  const discoveryResult = await engine.processSource({
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
      summary:
        "intake triage routing signal for an unclear source that still needs discovery review",
      missionAlignmentHint:
        "Useful only if Discovery records it and keeps routing explicit.",
      notes: ["intake", "triage", "routing", "review"],
    },
    gaps: [],
  });

  assert.equal(
    discoveryResult.ok,
    true,
    "DirectiveEngine.processSource should succeed for the Discovery control source.",
  );
  const discoveryRecord = discoveryResult.record;
  assert.equal(
    discoveryRecord.selectedLane.laneId,
    "discovery",
    "The Discovery control source should still route to Discovery.",
  );
  assert.equal(
    discoveryRecord.decision.decisionState,
    "hold_in_discovery",
    "Discovery control decision should still hold the case in Discovery.",
  );
  assert.equal(
    discoveryRecord.integrationProposal.integrationMode,
    "none",
    "Discovery control integration should keep the non-integration mode.",
  );
  assert.equal(
    discoveryRecord.integrationProposal.handoffArtifactFamily,
    "discovery_backlog",
    "Discovery control integration should still use the Discovery backlog family.",
  );
  assert.equal(
    discoveryRecord.integrationProposal.nextAction,
    "Keep the candidate in Discovery until routing clarity improves.",
    "Discovery control integration should keep the default Discovery next action.",
  );
  assert.equal(
    discoveryRecord.proofPlan.proofKind,
    "discovery_review",
    "Discovery control proof should stay on the Discovery review path.",
  );
  assert.deepEqual(
    discoveryRecord.proofPlan.requiredGates,
    ["routing_review", "human_decision_required"],
    "Discovery control proof gates should remain unchanged by the staged Engine refactor.",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        candidateId: record.candidate.candidateId,
        selectedLane: record.selectedLane.laneId,
        improvementGoals: record.improvementPlan.improvementGoals,
        proofGates: record.proofPlan.requiredGates,
        integrationNextAction: record.integrationProposal.nextAction,
        runtimeControl: {
          candidateId: runtimeRecord.candidate.candidateId,
          selectedLane: runtimeRecord.selectedLane.laneId,
          proofKind: runtimeRecord.proofPlan.proofKind,
          integrationNextAction: runtimeRecord.integrationProposal.nextAction,
        },
        architectureProofCases: architectureProofCases.map((proofCase) => ({
          label: proofCase.label,
          runPath: proofCase.runPath,
        })),
        discoveryControl: {
          candidateId: discoveryRecord.candidate.candidateId,
          selectedLane: discoveryRecord.selectedLane.laneId,
          proofKind: discoveryRecord.proofPlan.proofKind,
          integrationNextAction: discoveryRecord.integrationProposal.nextAction,
        },
      },
      null,
      2,
    )}\n`,
  );
}

void main();
