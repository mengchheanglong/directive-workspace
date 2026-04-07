import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { determineDiscoverySubmissionShape } from "../discovery/lib/discovery-submission-router.ts";
import {
  openDirectiveDiscoveryRoute,
  readDirectiveDiscoveryRoutingArtifact,
} from "../discovery/lib/discovery-route-opener.ts";
import { runDirectiveAutonomousLaneLoopSupervised } from "../engine/coordination/autonomous-lane-loop.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import {
  adaptResearchEngineCandidateToDirectiveRequest,
  allocateResearchEngineImportedCandidateId,
  importResearchEngineDiscoveryBundle,
  loadResearchEngineDiscoveryBundle,
  selectResearchEngineCandidatesForImport,
} from "../hosts/adapters/research-engine-discovery-import.ts";
import { readJson, writeJson } from "./checker-test-helpers.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizeEngineCandidateId(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

async function withTempDirectiveRoot(run: (directiveRoot: string, bundleDir: string) => Promise<void>) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-research-engine-import-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  const bundleDir = path.join(tempRoot, "research-engine-artifacts");

  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    fs.mkdirSync(bundleDir, { recursive: true });
    await run(directiveRoot, bundleDir);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function writeResearchEngineFixture(bundleDir: string) {
  writeJson(path.join(bundleDir, "source_intelligence_packet.json"), {
    packet_kind: "research_engine.source_intelligence_packet",
    contract_version: 1,
    mission_id: "research-engine-shadow-import-check",
    generated_at: "2026-04-01T00:00:00.000Z",
    decision_boundary:
      "Research Engine gathers source intelligence and scoring signals only; it does not decide what Directive Workspace Discovery should adopt or route.",
    strong_signals: [
      {
        name: "PaperQA2",
        link: "https://github.com/Future-House/paper-qa",
        why: "Strong signal for further Discovery review because evidence ranking and metadata discipline are clearly visible.",
      },
      {
        name: "LangGraph",
        link: "https://docs.langchain.com/oss/javascript/langgraph/durable-execution",
        why: "Strong signal for further Discovery review because resumable, inspectable execution is clearly documented.",
      },
    ],
  });

  writeJson(path.join(bundleDir, "dw_discovery_packet.json"), {
    packet_kind: "research_engine.dw_discovery_packet",
    contract_version: 1,
    mission_id: "research-engine-shadow-import-check",
    generated_at: "2026-04-01T00:00:00.000Z",
    decision_boundary:
      "Research Engine prepares Discovery-facing candidate packets; Directive Workspace Discovery retains final route and adoption authority.",
    candidates: [
      {
        candidate_id: "paperqa2",
        candidate_name: "PaperQA2",
        source_kind: "system",
        source_reference: "https://github.com/Future-House/paper-qa",
        mission_relevance:
          "Improves evidence ranking, source limiting, metadata enrichment, and citation-grounded answer assembly.",
        initial_value_hypothesis:
          "Useful source-intelligence signal for explicit evidence discipline rather than report-only behavior.",
        initial_baggage_signals: [
          "Python-first runtime assumptions may not transfer cleanly into DW.",
        ],
        capability_gap_hint: "Need stronger evidence ranking, trust signals, and citation discipline.",
        evidence_bundle_refs: ["paperqa2-e1", "paperqa2-e2"],
        evidence_cluster_summary: [
          "Duplicate evidence clusters are low; metadata and citation signals are well represented.",
        ],
        contradiction_flags: ["metadata-coverage-uncertain"],
        discovery_signal_band: "strong",
        signal_total_score: 86,
        signal_score_summary:
          "Strong Discovery review signal from Research Engine scoring. Score summary: total=86; relevance=9/10; evidence_quality=9/10; inspectability=9/10; subsystem_reuse=9/10; novelty=4/10.",
        provenance_summary: ["primary via official repo"],
        freshness_summary:
          "Latest normalized evidence captured at 2026-04-01T00:00:00.000Z. Signal=current.",
        recommended_lane_target: "architecture",
        lane_target_rationale:
          "Primary value improves Directive Workspace workflow, evaluation, or source-intelligence structure.",
        workflow_phase_scores: { discovery: 9, reporting: 7 },
        structural_extraction_recommendations: [
          "Extract the evidence-quality mechanism rather than the surrounding source-specific product shell.",
        ],
        structural_avoid_recommendations: [
          "Do not treat the source as a novel primary base without stronger live evidence.",
        ],
        review_guidance_summary:
          "Architecture-oriented structural candidate: extract the Engine-improvement mechanism and keep the downstream record bounded.",
        review_guidance_action:
          "Route through Discovery into Architecture review, then keep the follow-through proportional to the actual mechanism being extracted.",
        review_guidance_stop_line:
          "Do not widen the case into full adoption if the source only contributes a narrow workflow or evaluator improvement.",
        uncertainty_notes: [
          "Current run is catalog-backed and should later be upgraded to live-provider evidence.",
        ],
      },
      {
        candidate_id: "langgraph",
        candidate_name: "LangGraph",
        source_kind: "framework",
        source_reference: "https://docs.langchain.com/oss/javascript/langgraph/durable-execution",
        mission_relevance:
          "Adds resumable, inspectable execution for long-running or interruptible research runs.",
        initial_value_hypothesis:
          "Useful source-intelligence signal for run durability and stateful research orchestration.",
        initial_baggage_signals: [
          "Execution-model scope is broader than current Discovery-only need.",
        ],
        capability_gap_hint: "Need durable execution and pause/resume semantics for research runs.",
        evidence_bundle_refs: ["langgraph-e1", "langgraph-e2"],
        evidence_cluster_summary: [
          "Durability evidence is strong, but downstream host fit remains unproven.",
        ],
        discovery_signal_band: "review",
        signal_total_score: 75,
        signal_score_summary:
          "Mixed Discovery review signal; candidate may still be useful, but novelty, evidence strength, or bounded reuse remains inconclusive. Score summary: total=75; relevance=7/10; evidence_quality=9/10; inspectability=9/10; subsystem_reuse=8/10; novelty=4/10.",
        provenance_summary: ["primary via official docs"],
        freshness_summary:
          "Latest normalized evidence captured at 2026-04-01T00:00:00.000Z. Signal=current.",
        recommended_lane_target: "architecture",
        lane_target_rationale:
          "Primary value improves Directive Workspace workflow, evaluation, or source-intelligence structure.",
        workflow_phase_scores: { discovery: 8, reflection: 8 },
        structural_extraction_recommendations: [
          "Extract the reusable workflow or mechanism boundary rather than the full source system.",
        ],
        structural_avoid_recommendations: [
          "Do not treat the source as a novel primary base without stronger live evidence.",
        ],
        review_guidance_summary:
          "Architecture-oriented structural candidate: extract the Engine-improvement mechanism and keep the downstream record bounded.",
        review_guidance_action:
          "Route through Discovery into Architecture review, then keep the follow-through proportional to the actual mechanism being extracted.",
        review_guidance_stop_line:
          "Do not widen the case into full adoption if the source only contributes a narrow workflow or evaluator improvement.",
        uncertainty_notes: [
          "Fit depends on whether long-running resumability is required in current DW usage.",
        ],
      },
      {
        candidate_id: "gpt-researcher",
        candidate_name: "GPT Researcher",
        source_kind: "system",
        source_reference: "https://github.com/assafelovic/gpt-researcher",
        mission_relevance: "Baseline comparison candidate for source curation loops.",
        discovery_signal_band: "weak",
        signal_total_score: 78,
        signal_score_summary:
          "Weak or noisy Discovery review signal due to baseline overlap, limited evidence quality, low relevance, or both. Score summary: total=78; relevance=8/10; evidence_quality=9/10; inspectability=9/10; subsystem_reuse=8/10; novelty=1/10.",
        recommended_lane_target: "discovery",
        lane_target_rationale:
          "Current value is still mainly Discovery review/comparison pressure rather than ready Runtime or Architecture adoption.",
        workflow_phase_scores: { discovery: 8, reporting: 7 },
        structural_extraction_recommendations: [],
        structural_avoid_recommendations: [],
        review_guidance_summary:
          "Discovery comparison/review candidate: useful for curation pressure, but not yet lane-ready.",
        review_guidance_action:
          "Keep the source in Discovery review and only advance if a clearer Architecture or Runtime adoption target appears.",
        review_guidance_stop_line:
          "Do not force downstream adoption from a comparison-only or low-confidence source packet.",
        uncertainty_notes: [
          "Current run is catalog-backed and should later be upgraded to live-provider evidence.",
        ],
      },
      {
        candidate_id: "open-deep-research",
        candidate_name: "Open Deep Research",
        source_kind: "framework",
        source_reference: "https://github.com/langchain-ai/open_deep_research",
        mission_relevance:
          "Breaks deep research into typed phases instead of collapsing everything into an answer loop.",
        initial_value_hypothesis:
          "Best conceptual base for Research Engine because its orchestration boundaries map cleanly to planning, discovery, compression, and reporting.",
        initial_baggage_signals: [
          "LangGraph-flavored orchestration assumptions",
          "Report-centric end shape",
        ],
        capability_gap_hint:
          "Need reusable phase boundaries and provider seams for bounded research runs.",
        evidence_bundle_refs: ["open-deep-research-e1", "open-deep-research-e2"],
        evidence_cluster_summary: [
          "Typed planning, discovery, compression, and reporting stages remain explicit across the evidence set.",
        ],
        contradiction_flags: [],
        discovery_signal_band: "review",
        signal_total_score: 81,
        signal_score_summary:
          "Baseline-overlap candidate still carries bounded structural extraction value. Structurally useful despite baseline overlap: preserve the bounded workflow or mechanism signal for extraction, but do not treat the source as a novel primary base. Score summary: total=81; relevance=8/10; evidence_quality=9/10; inspectability=9/10; subsystem_reuse=8/10; novelty=1/10.",
        provenance_summary: ["primary via official repo"],
        freshness_summary:
          "Latest normalized evidence captured at 2026-04-01T00:00:00.000Z. Signal=current.",
        structural_signal_band: "extractive_structural",
        structural_signal_summary:
          "Structurally useful despite baseline overlap: preserve the bounded workflow or mechanism signal for extraction, but do not treat the source as a novel primary base.",
        workflow_phase_labels: ["planning", "discovery", "compression", "reporting"],
        provider_seam_summary: "Reusable provider seams for bounded research runs.",
        workflow_boundary_shape_hint: "bounded_protocol",
        recommended_lane_target: "architecture",
        lane_target_rationale:
          "Primary value is Architecture-oriented extraction: preserve workflow/provider boundaries while keeping baseline-overlap expectations explicit.",
        workflow_phase_scores: { planning: 9, discovery: 10, compression: 9, reporting: 7 },
        structural_extraction_recommendations: [
          "Extract the explicit phase model (planning, discovery, compression, reporting) as a Directive-owned workflow contract.",
          "Extract the provider seam as a bounded interface between acquisition and downstream synthesis/reporting.",
          "Extract the bounded protocol boundary so acquisition, compression, and reporting remain separable.",
        ],
        structural_avoid_recommendations: [
          "Do not import LangGraph-specific orchestration assumptions wholesale.",
          "Do not import the report-centric or answer-first end shape wholesale.",
          "Do not treat the source as a novel primary base without stronger live evidence.",
        ],
        review_guidance_summary:
          "Extractive structural candidate: keep the reusable mechanism and bounded workflow, but hold novelty claims low.",
        review_guidance_action:
          "Use this as an Architecture extraction/reference source. Extract only the bounded mechanisms listed here and reject wholesale framework adoption.",
        review_guidance_stop_line:
          "Do not auto-promote this source to primary-base status or direct Runtime adoption without stronger live evidence.",
        uncertainty_notes: [
          "Current run is catalog-backed and should later be upgraded to live-provider evidence.",
        ],
      },
      {
        candidate_id: "deep-researcher-runtime",
        candidate_name: "jackswl/deep-researcher",
        source_kind: "system",
        source_reference: "https://github.com/jackswl/deep-researcher",
        mission_relevance:
          "Provides a reusable runtime execution capability for repeated deep-research runs.",
        initial_value_hypothesis:
          "Packaged runtime capability for repeated execution.",
        initial_baggage_signals: [
          "Requires bounded host integration review.",
        ],
        capability_gap_hint:
          "Need a reusable runtime execution surface.",
        evidence_bundle_refs: ["deep-researcher-e1", "deep-researcher-e2"],
        evidence_cluster_summary: [
          "Runtime execution behavior is explicit and repeatable.",
        ],
        contradiction_flags: [],
        discovery_signal_band: "strong",
        signal_total_score: 84,
        signal_score_summary:
          "Strong Discovery review signal from Research Engine scoring. Score summary: total=84; relevance=9/10; evidence_quality=8/10; inspectability=8/10; subsystem_reuse=9/10; novelty=5/10.",
        provenance_summary: ["primary via official repo"],
        freshness_summary:
          "Latest normalized evidence captured at 2026-04-01T00:00:00.000Z. Signal=current.",
        recommended_lane_target: "runtime",
        lane_target_rationale:
          "Primary value is reusable runtime capability packaging for repeated execution.",
        workflow_phase_scores: {},
        structural_extraction_recommendations: [],
        structural_avoid_recommendations: [],
        review_guidance_summary:
          "Runtime-oriented candidate: preserve the reusable capability boundary and require proof before promotion.",
        review_guidance_action:
          "Route through Discovery into Runtime review and keep the reusable capability/package boundary explicit.",
        review_guidance_stop_line:
          "Do not treat the source as structural Architecture improvement without separate Engine-workflow proof.",
        uncertainty_notes: [
          "Host-fit validation remains required before promotion.",
        ],
      },
    ],
    holds_and_rejections: [
      {
        candidate_id: "vane",
        candidate_name: "Vane",
        source_kind: "system",
        source_reference: "https://github.com/ItzCrazyKns/Vane",
        mission_relevance: "Hold for thin UI inspection ideas only.",
        rejection_or_hold_reasons: ["Baseline overlap and answer-first product framing."],
        discovery_signal_band: "hold_or_reject",
        signal_total_score: null,
        signal_score_summary:
          "Held or rejected for Discovery review: Baseline overlap and answer-first product framing. Score summary: total=n/a; relevance=1/10; evidence_quality=8/10; inspectability=8/10; subsystem_reuse=1/10; novelty=1/10.",
        recommended_lane_target: "discovery",
        lane_target_rationale:
          "Current value is still mainly Discovery review/comparison pressure rather than ready Runtime or Architecture adoption.",
        workflow_phase_scores: {},
        structural_extraction_recommendations: [],
        structural_avoid_recommendations: [],
        review_guidance_summary:
          "Discovery comparison/review candidate: useful for curation pressure, but not yet lane-ready.",
        review_guidance_action:
          "Keep the source in Discovery review and only advance if a clearer Architecture or Runtime adoption target appears.",
        review_guidance_stop_line:
          "Do not force downstream adoption from a comparison-only or low-confidence source packet.",
        uncertainty_notes: [
          "Current run is catalog-backed and should later be upgraded to live-provider evidence.",
        ],
      },
    ],
  });

  writeJson(path.join(bundleDir, "dw_import_bundle.json"), {
    packet_kind: "research_engine.dw_import_bundle",
    contract_version: 1,
    mission_id: "research-engine-shadow-import-check",
    generated_at: "2026-04-01T00:00:00.000Z",
    decision_boundary:
      "This bundle is import-ready for Directive Workspace Discovery review only; it must not be treated as a routing or adoption decision.",
    import_ready: true,
    artifact_refs: {
      source_intelligence_packet: "source_intelligence_packet.json",
      dw_discovery_packet: "dw_discovery_packet.json",
    },
  });
}

async function main() {
  await withTempDirectiveRoot(async (directiveRoot, bundleDir) => {
    writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), {
      status: "primary",
      updatedAt: "2026-04-01",
      entries: [],
    });
    writeJson(path.join(directiveRoot, "discovery", "capability-gaps.json"), {
      status: "active",
      updatedAt: "2026-04-01",
      gaps: [
        {
          gap_id: "gap-shadow-import-seam",
          description: "Need a bounded external source-intelligence import seam.",
          priority: "high",
          related_mission_objective: "Discovery external-source intake discipline",
          current_state: "External research packets remain manual.",
          desired_state: "External source-intelligence packets can enter through the canonical Discovery front door.",
          detected_at: "2026-04-01",
          resolved_at: null,
        },
        {
          gap_id: "gap-runtime-execution-surface",
          description: "Need a reusable runtime execution surface for repeated callable runs.",
          priority: "high",
          related_mission_objective: "Runtime reusable capability packaging and proof discipline",
          current_state: "Runtime execution assets exist but repeated callable packaging remains ad hoc.",
          desired_state: "Runtime candidates route with high-confidence into bounded Runtime follow-through.",
          detected_at: "2026-04-01",
          resolved_at: null,
        },
      ],
    });
    writeJson(path.join(directiveRoot, "control", "state", "autonomous-lane-loop-policy.json"), {
      enabled: true,
      approvedBy: "research-engine-import-check",
      maxActionsPerRun: 2,
      discovery: {
        autoOpenRoute: true,
        requireNoHumanReview: true,
        minimumConfidence: "high",
      },
      architecture: {
        autoStartFromHandoff: true,
        autoCloseBoundedStart: true,
        autoAdoptBoundedResult: true,
        autoCreateImplementationTargetForPlannedNext: true,
        autoCompleteMaterializationChain: true,
      },
      runtime: {
        autoAdvanceToPromotionReadiness: true,
        autoGeneratePromotionSpecification: true,
        autoCreatePromotionRecord: true,
        requireNoHumanReview: true,
      },
    });
    ensureParentDir(path.join(directiveRoot, "knowledge", "active-mission.md"));
    fs.copyFileSync(
      path.join(DIRECTIVE_ROOT, "knowledge", "active-mission.md"),
      path.join(directiveRoot, "knowledge", "active-mission.md"),
    );
    writeResearchEngineFixture(bundleDir);

    const loaded = loadResearchEngineDiscoveryBundle(path.join(bundleDir, "dw_import_bundle.json"));
    const selected = selectResearchEngineCandidatesForImport({
      sourceIntelligencePacket: loaded.sourceIntelligencePacket,
      discoveryPacket: loaded.discoveryPacket,
    });

    assert.equal(selected.length, 2, "default import should only select strong signals");
    assert.deepEqual(
      selected.map((entry) => entry.candidate.candidate_id),
      ["paperqa2", "langgraph"],
    );

    const adapted = adaptResearchEngineCandidateToDirectiveRequest({
      bundleManifestPath: loaded.bundleManifestPath,
      bundle: loaded.bundle,
      sourceIntelligencePacket: loaded.sourceIntelligencePacket,
      discoveryPacket: loaded.discoveryPacket,
      candidate: selected[0].candidate,
      strongSignalReason: selected[0].strongSignalReason,
      importedCandidateId: allocateResearchEngineImportedCandidateId({
        candidateId: selected[0].candidate.candidate_id,
        bundleGeneratedAt: loaded.bundle.generated_at,
        receivedAt: "2026-04-01T00:00:00.000Z",
      }),
    });
    assert.equal(adapted.boundedRecordShape, "queue_only");
    assert.equal(determineDiscoverySubmissionShape(adapted.request), "queue_only");
    assert.equal(adapted.request.source_type, "external-system");
    assert.equal(adapted.request.operating_mode, "note");
    assert.equal(adapted.request.fast_path, undefined);
    assert.equal(adapted.request.case_record, undefined);
    assert.equal(adapted.request.contains_executable_code, true);
    assert.equal(adapted.request.improves_directive_workspace, true);
    assert.match(
      adapted.request.notes ?? "",
      /Discovery retains final route and adoption authority/i,
      "adapter notes must preserve the decision boundary",
    );
    assert.doesNotMatch(
      adapted.request.notes ?? "",
      /Adoption target hint:|Usefulness level hint:|routing considerations/i,
      "Discovery import notes must not carry external routing or adoption intent through the front door",
    );
    assert.match(
      adapted.request.notes ?? "",
      /Discovery signal band: strong/i,
      "adapter notes must preserve the compact Discovery signal band",
    );
    assert.match(
      adapted.request.notes ?? "",
      /Signal total score: 86\./i,
      "adapter notes must preserve the compact signal total score",
    );

    const importResult = await importResearchEngineDiscoveryBundle({
      directiveRoot,
      bundlePath: path.join(bundleDir, "dw_import_bundle.json"),
      receivedAt: "2026-04-01T00:00:00.000Z",
    });

    assert.equal(importResult.importedCount, 2);
    assert.deepEqual(importResult.selectedSourceCandidateIds, ["paperqa2", "langgraph"]);

    const queue = readJson<{
      entries: Array<{
        candidate_id: string;
        operating_mode: string | null;
        submission_origin: string | null;
        discovery_signal_band: string | null;
        signal_total_score: number | null;
        signal_score_summary: string | null;
        notes: string | null;
      }>;
    }>(
      path.join(directiveRoot, "discovery", "intake-queue.json"),
    );
    assert.deepEqual(
      queue.entries.map((entry) => entry.candidate_id).sort((left, right) => left.localeCompare(right)),
      [
        "research-engine-langgraph-20260401t000000z-20260401t000000z",
        "research-engine-paperqa2-20260401t000000z-20260401t000000z",
      ],
    );
    assert.ok(
      queue.entries.every((entry) => entry.operating_mode === "note"),
      "imported entries must remain note-only submissions",
    );
    assert.ok(
      queue.entries.every((entry) => entry.submission_origin === "research-engine"),
      "imported entries must record research-engine as the Discovery submission origin",
    );
    assert.ok(
      queue.entries.some((entry) => entry.discovery_signal_band === "strong"),
      "imported entries should persist the compact Research Engine signal band structurally",
    );
    assert.ok(
      queue.entries.some((entry) => entry.signal_total_score === 86),
      "imported entries should persist the compact signal total score structurally",
    );
    assert.ok(
      queue.entries.some((entry) => /Score summary:/i.test(entry.signal_score_summary ?? "")),
      "imported entries should persist the compact signal score summary structurally",
    );
    assert.ok(
      queue.entries.every((entry) =>
        /^research-engine-[a-z0-9-]+-20260401t000000z-20260401t000000z(?:-r\d+)?$/i.test(
          entry.candidate_id,
        )),
      "imported candidate ids must be explicit run-scoped research-engine identifiers",
    );
    assert.ok(
      queue.entries.some((entry) => /Baggage signals:/i.test(entry.notes ?? "")),
      "Discovery notes should preserve baggage signals that help triage",
    );
    assert.ok(
      queue.entries.some((entry) => /Evidence cluster summary:/i.test(entry.notes ?? "")),
      "Discovery notes should preserve evidence clustering context",
    );
    assert.ok(
      queue.entries.some((entry) => /Contradiction flags:/i.test(entry.notes ?? "")),
      "Discovery notes should preserve contradiction context when present",
    );
    assert.ok(
      queue.entries.some((entry) => /Signal score summary:/i.test(entry.notes ?? "")),
      "Discovery notes should preserve a compact signal score summary for triage",
    );
    assert.ok(
      queue.entries.some((entry) => /Discovery signal band: strong/i.test(entry.notes ?? "")),
      "Discovery notes should preserve the Research Engine signal band",
    );

    const openDeepResearchImport = await importResearchEngineDiscoveryBundle({
      directiveRoot,
      bundlePath: path.join(bundleDir, "dw_import_bundle.json"),
      candidateIds: ["open-deep-research"],
      receivedAt: "2026-04-01T01:00:00.000Z",
    });
    assert.equal(openDeepResearchImport.importedCount, 1);
    assert.deepEqual(openDeepResearchImport.selectedSourceCandidateIds, ["open-deep-research"]);
    const openDeepResearchCandidate = loaded.discoveryPacket.candidates.find(
      (candidate) => candidate.candidate_id === "open-deep-research",
    );
    assert.ok(openDeepResearchCandidate, "open-deep-research candidate should exist in the Discovery packet");
    assert.deepEqual(
      openDeepResearchCandidate?.workflow_phase_labels,
      ["planning", "discovery", "compression", "reporting"],
      "Research Engine should emit the extracted phased research model explicitly in the DW packet",
    );
    assert.equal(
      openDeepResearchCandidate?.structural_signal_band,
      "extractive_structural",
      "Research Engine should classify structurally useful baseline-overlap candidates explicitly instead of flattening them into weak/noisy only",
    );
    assert.match(
      openDeepResearchCandidate?.structural_signal_summary ?? "",
      /Structurally useful despite baseline overlap/i,
      "Research Engine should preserve the structural extraction rationale explicitly in the DW packet",
    );
    assert.equal(
      openDeepResearchCandidate?.provider_seam_summary,
      "Reusable provider seams for bounded research runs.",
      "Research Engine should emit the extracted provider seam as a bounded structural hint",
    );
    assert.equal(
      openDeepResearchCandidate?.workflow_boundary_shape_hint,
      "bounded_protocol",
      "Research Engine should emit the workflow-boundary shape explicitly for bounded protocol sources",
    );
    assert.equal(
      openDeepResearchCandidate?.recommended_lane_target,
      "architecture",
      "Research Engine should preclassify the bounded structural target without taking route authority away from Discovery",
    );
    assert.equal(
      openDeepResearchCandidate?.workflow_phase_scores?.planning,
      9,
      "Research Engine should score the planning phase contribution explicitly for structural workflow sources",
    );
    assert.ok(
      openDeepResearchCandidate?.structural_extraction_recommendations?.some((entry) =>
        /Extract the provider seam/i.test(entry),
      ),
      "Research Engine should emit explicit extraction recommendations instead of only saying the source is structurally useful",
    );
    assert.ok(
      openDeepResearchCandidate?.structural_avoid_recommendations?.some((entry) =>
        /LangGraph-specific orchestration assumptions/i.test(entry),
      ),
      "Research Engine should emit explicit avoid recommendations for bounded extraction work",
    );
    assert.match(
      openDeepResearchCandidate?.review_guidance_summary ?? "",
      /Extractive structural candidate/i,
      "Research Engine should emit explicit review guidance for structurally useful baseline-overlap candidates",
    );
    assert.equal(
      openDeepResearchImport.imports[0]?.discovery.discovery.routingTarget,
      "architecture",
      "open-deep-research should route through Discovery into Architecture when its structural phase/provider-seam signals are preserved",
    );
    assert.equal(
      openDeepResearchImport.imports[0]?.discovery.discovery.decisionState,
      "adopt",
      "open-deep-research should produce an adopt-ready Discovery routing decision under the structured metadata path",
    );

    const customRuntimeArtifactsRoot = path.join(directiveRoot, "runtime-host-artifacts");
    const runtimeImport = await importResearchEngineDiscoveryBundle({
      directiveRoot,
      bundlePath: path.join(bundleDir, "dw_import_bundle.json"),
      candidateIds: ["deep-researcher-runtime"],
      receivedAt: "2026-04-01T02:00:00.000Z",
      runtimeArtifactsRoot: customRuntimeArtifactsRoot,
    });
    assert.equal(runtimeImport.importedCount, 1);
    const runtimeRoutingPath = runtimeImport.imports[0]!.discovery.createdPaths.routingRecordPath;
    const runtimeRouting = readDirectiveDiscoveryRoutingArtifact({
      directiveRoot,
      routingPath: runtimeRoutingPath,
    });
    assert.equal(runtimeRouting.routeDestination, "runtime");
    assert.equal(runtimeRouting.decisionState, "adopt");
    assert.equal(runtimeRouting.routingConfidence, "high");
    assert.equal(runtimeRouting.routeConflict, false);
    assert.equal(runtimeRouting.needsHumanReview, false);
    assert.equal(
      runtimeRouting.engineRunRecordPath,
      runtimeImport.imports[0]!.discovery.engine.recordRelativePath,
      "routing record should preserve the exact Engine run record path created by front-door submission",
    );
    assert.equal(
      runtimeRouting.engineRunReportPath,
      runtimeImport.imports[0]!.discovery.engine.reportRelativePath,
      "routing record should preserve the exact Engine run report path created by front-door submission",
    );

    const runtimeEngineRunRecordPath = runtimeRouting.engineRunRecordPath;
    assert.ok(runtimeEngineRunRecordPath, "runtime routing record should include a linked Engine run record path");
    const runtimeEngineRunAbsolutePath = path.join(directiveRoot, runtimeEngineRunRecordPath);
    assert.ok(
      fs.existsSync(runtimeEngineRunAbsolutePath),
      `linked Engine run record should exist before route opening (${runtimeEngineRunRecordPath})`,
    );
    const runtimeEngineRunRecord = readJson<{ candidate?: { candidateId?: string } }>(runtimeEngineRunAbsolutePath);
    assert.equal(
      normalizeEngineCandidateId(runtimeEngineRunRecord.candidate?.candidateId ?? null),
      normalizeEngineCandidateId(runtimeRouting.candidateId),
      "linked Engine run record should belong to the routed candidate",
    );

    const runtimeLoop = await runDirectiveAutonomousLaneLoopSupervised({
      directiveRoot,
      artifactPath: runtimeRoutingPath,
    });
    assert.ok(
      runtimeLoop.actions.some((action) => action.actionKind === "discovery_route_open"),
      "autonomous loop should open the routed Discovery artifact into a Runtime follow-up stub",
    );
    assert.ok(
      runtimeLoop.actions.some((action) => action.actionKind === "runtime_follow_up_open"),
      "autonomous loop should continue from Runtime follow-up into Runtime record opening",
    );
    assert.ok(
      fs.existsSync(path.join(directiveRoot, runtimeRouting.requiredNextArtifact)),
      "required Runtime follow-up artifact should be materialized for a valid Runtime route",
    );

    const missingLinkedEngineRunImport = await importResearchEngineDiscoveryBundle({
      directiveRoot,
      bundlePath: path.join(bundleDir, "dw_import_bundle.json"),
      candidateIds: ["deep-researcher-runtime"],
      receivedAt: "2026-04-01T03:00:00.000Z",
      runtimeArtifactsRoot: customRuntimeArtifactsRoot,
    });
    const missingLinkedRoutingPath = missingLinkedEngineRunImport.imports[0]!.discovery.createdPaths.routingRecordPath;
    const missingLinkedRouting = readDirectiveDiscoveryRoutingArtifact({
      directiveRoot,
      routingPath: missingLinkedRoutingPath,
    });
    assert.ok(missingLinkedRouting.engineRunRecordPath);
    fs.rmSync(path.join(directiveRoot, missingLinkedRouting.engineRunRecordPath!), {
      force: true,
    });
    if (missingLinkedRouting.engineRunReportPath) {
      fs.rmSync(path.join(directiveRoot, missingLinkedRouting.engineRunReportPath), {
        force: true,
      });
    }
    assert.throws(
      () =>
        openDirectiveDiscoveryRoute({
          directiveRoot,
          routingPath: missingLinkedRoutingPath,
          approved: true,
          approvedBy: "research-engine-import-check",
        }),
      /linked Engine run artifact not found/i,
      "route opener must fail closed when the routing-linked Engine run artifact is missing",
    );

    for (const entry of importResult.imports) {
      assert.equal(entry.sourceType, "external-system");
      assert.equal(entry.discovery.queueEntry.operating_mode, "note");
      assert.equal(entry.discovery.queueEntry.submission_origin, "research-engine");
      assert.ok(fs.existsSync(path.join(directiveRoot, entry.discovery.createdPaths.intakeRecordPath)));
      assert.ok(fs.existsSync(path.join(directiveRoot, entry.discovery.createdPaths.triageRecordPath)));
      assert.ok(fs.existsSync(path.join(directiveRoot, entry.discovery.createdPaths.routingRecordPath)));

      const focus = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: entry.discovery.createdPaths.routingRecordPath,
      }).focus;
      assert.ok(focus?.ok, "imported discovery routing artifact must resolve through the canonical reader");
      assert.equal(focus.discovery.operatingMode, "note");
      assert.equal(focus.discovery.submissionOrigin, "research-engine");
      assert.equal(focus.discovery.sourceType, "external-system");
      assert.equal(focus.discovery.sourceReference, entry.sourceReference);
      assert.ok(
        ["strong", "review"].includes(focus.discovery.signalBand ?? ""),
        "canonical state should expose the Research Engine signal band",
      );
      assert.ok(
        typeof focus.discovery.signalTotalScore === "number",
        "canonical state should expose the signal total score",
      );
      assert.match(
        focus.discovery.signalScoreSummary ?? "",
        /Score summary:/i,
        "canonical state should expose the signal score summary",
      );
      assert.equal(focus.currentHead.artifactPath, entry.discovery.createdPaths.routingRecordPath);
    }

    const repeatedImportResult = await importResearchEngineDiscoveryBundle({
      directiveRoot,
      bundlePath: path.join(bundleDir, "dw_import_bundle.json"),
      receivedAt: "2026-04-01T00:00:00.000Z",
    });
    assert.equal(repeatedImportResult.importedCount, 2);
    assert.deepEqual(
      repeatedImportResult.imports.map((entry) => entry.importedCandidateId).sort((left, right) => left.localeCompare(right)),
      [
        "research-engine-langgraph-20260401t000000z-20260401t000000z-r2",
        "research-engine-paperqa2-20260401t000000z-20260401t000000z-r2",
      ],
      "repeated imports of the same bundle must stay explicit and collision-safe",
    );

    const queueAfterRepeat = readJson<{ entries: Array<{ candidate_id: string }> }>(
      path.join(directiveRoot, "discovery", "intake-queue.json"),
    );
    assert.deepEqual(
      queueAfterRepeat.entries.map((entry) => entry.candidate_id).sort((left, right) => left.localeCompare(right)),
      [
        "research-engine-deep-researcher-runtime-20260401t000000z-20260401t020000z",
        "research-engine-deep-researcher-runtime-20260401t000000z-20260401t030000z",
        "research-engine-langgraph-20260401t000000z-20260401t000000z",
        "research-engine-langgraph-20260401t000000z-20260401t000000z-r2",
        "research-engine-open-deep-research-20260401t000000z-20260401t010000z",
        "research-engine-paperqa2-20260401t000000z-20260401t000000z",
        "research-engine-paperqa2-20260401t000000z-20260401t000000z-r2",
      ],
    );

    writeJson(path.join(bundleDir, "dw_discovery_packet.json"), {
      ...loaded.discoveryPacket,
      mission_id: "research-engine-shadow-import-check-mismatch",
    });
    assert.throws(
      () => loadResearchEngineDiscoveryBundle(path.join(bundleDir, "dw_import_bundle.json")),
      /invalid_input: mission_id_mismatch bundle=research-engine-shadow-import-check source_intelligence_packet=research-engine-shadow-import-check dw_discovery_packet=research-engine-shadow-import-check-mismatch/,
      "mixed-mission bundles must be rejected before import",
    );

    writeResearchEngineFixture(bundleDir);
    const malformedDiscoveryPacket = readJson<Record<string, unknown>>(
      path.join(bundleDir, "dw_discovery_packet.json"),
    );
    const malformedCandidates = Array.isArray(malformedDiscoveryPacket.candidates)
      ? [...malformedDiscoveryPacket.candidates]
      : [];
    const firstCandidate = { ...(malformedCandidates[0] as Record<string, unknown>) };
    delete firstCandidate.discovery_signal_band;
    malformedCandidates[0] = firstCandidate;
    writeJson(path.join(bundleDir, "dw_discovery_packet.json"), {
      ...malformedDiscoveryPacket,
      candidates: malformedCandidates,
    });
    assert.throws(
      () => loadResearchEngineDiscoveryBundle(path.join(bundleDir, "dw_import_bundle.json")),
      /invalid_input: dw_discovery_packet\.candidates\[0\]\.discovery_signal_band is required/,
      "malformed Discovery packet candidates must fail closed during load",
    );

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          importedCount:
            importResult.importedCount
            + repeatedImportResult.importedCount
            + runtimeImport.importedCount
            + missingLinkedEngineRunImport.importedCount,
          selectedSourceCandidateIds: repeatedImportResult.selectedSourceCandidateIds,
          importedCandidateIds: queueAfterRepeat.entries.map((entry) => entry.candidate_id),
          routeTargets: importResult.imports.map((entry) => ({
            importedCandidateId: entry.importedCandidateId,
            routeTarget: entry.discovery.discovery.routingTarget,
            decisionState: entry.discovery.discovery.decisionState,
          })),
        },
        null,
        2,
      )}\n`,
    );
  });
}

await main();
