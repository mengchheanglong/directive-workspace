import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { determineDiscoverySubmissionShape } from "../shared/lib/discovery-submission-router.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import {
  adaptResearchEngineCandidateToDirectiveRequest,
  allocateResearchEngineImportedCandidateId,
  importResearchEngineDiscoveryBundle,
  loadResearchEngineDiscoveryBundle,
  selectResearchEngineCandidatesForImport,
} from "../shared/lib/research-engine-discovery-import.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureParentDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
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
        uncertainty_notes: [
          "Current run is catalog-backed and should later be upgraded to live-provider evidence.",
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
      ],
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
        "research-engine-langgraph-20260401t000000z-20260401t000000z",
        "research-engine-langgraph-20260401t000000z-20260401t000000z-r2",
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
          importedCount: importResult.importedCount + repeatedImportResult.importedCount,
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
