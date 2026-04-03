from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import unittest
from unittest import mock
from pathlib import Path

from research_engine.acquisition import LiveHybridAcquisitionProvider, get_acquisition_provider
from research_engine.cli import _extract_local_stop_term_suggestion
from research_engine.contracts import (
    validate_dw_discovery_packet,
    validate_dw_import_bundle,
    validate_source_intelligence_packet,
)
from research_engine.fetch import fetch_documents
from research_engine.live_extract import extract_visible_text
from research_engine.models import (
    DiscoveryHit,
    MissionConstraints,
    ResearchMission,
    SearchPlan,
    SearchQuery,
    SearchTrack,
    SourceDocument,
    SourceFact,
    TrustPreferences,
)
from research_engine.normalize import (
    build_candidate_shells,
    build_source_type_trust_policy,
    normalize_evidence,
)
from research_engine.planning import build_search_plan
from research_engine.score import score_candidates


ROOT = Path(__file__).resolve().parents[1]


class _FakeResponse:
    def __init__(self, payload: bytes) -> None:
        self._payload = payload

    def __enter__(self) -> "_FakeResponse":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        return None

    def read(self) -> bytes:
        return self._payload


class ResearchEngineRunTest(unittest.TestCase):
    def test_cli_writes_expected_artifacts(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        output_dir = temp_root / "test-artifacts"
        shutil.rmtree(output_dir, ignore_errors=True)
        env = os.environ.copy()
        env["PYTHONPATH"] = str(ROOT / "src")
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "research_engine",
                "--output-dir",
                str(output_dir),
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
            env=env,
            check=False,
        )

        self.assertEqual(result.returncode, 0, msg=result.stderr)
        expected_files = {
            "research_record.json",
            "query_plan.json",
            "provider_health.json",
            "discovery_hits.jsonl",
            "evidence_bundle.jsonl",
            "candidate_dossiers.json",
            "rejections.json",
            "dw_discovery_packet.json",
            "source_intelligence_packet.json",
            "dw_import_bundle.json",
            "inspection.html",
            "recommendations.md",
        }
        self.assertEqual(expected_files, {path.name for path in output_dir.iterdir()})

        query_plan = json.loads((output_dir / "query_plan.json").read_text(encoding="utf-8"))
        self.assertEqual(query_plan["planning_preset"], "balanced-discovery")
        self.assertEqual(query_plan["required_track_ids"], [])
        self.assertEqual(query_plan["excluded_track_ids"], [])
        self.assertEqual(query_plan["required_query_types_by_track"], {})
        self.assertEqual(query_plan["excluded_query_types_by_track"], {})
        self.assertIn("track_provider_preferences", query_plan)
        self.assertEqual(query_plan["selected_acquisition_mode"], "catalog")
        self.assertGreaterEqual(len(query_plan["tracks"]), 4)
        research_record = json.loads((output_dir / "research_record.json").read_text(encoding="utf-8"))
        self.assertIn("acquisition_notes", research_record)
        self.assertGreaterEqual(len(research_record["acquisition_notes"]), 1)
        self.assertIn("trust_policy", research_record)
        self.assertIn("provider_health", research_record)
        self.assertGreaterEqual(len(research_record["provider_health"]), 1)
        self.assertEqual(research_record["mission"]["planning_preset"], "balanced-discovery")
        self.assertEqual(research_record["mission"]["required_track_ids"], [])
        self.assertEqual(research_record["mission"]["excluded_track_ids"], [])
        self.assertEqual(research_record["mission"]["required_query_types_by_track"], {})
        self.assertEqual(research_record["mission"]["excluded_query_types_by_track"], {})
        self.assertEqual(research_record["mission"]["track_provider_preferences"], {})
        self.assertEqual(
            research_record["mission"]["trust_preferences"]["policy_preset"],
            "balanced-discovery",
        )
        self.assertIn("known_baseline_names", research_record["mission"])
        self.assertIn("known_candidate_anchor_names", research_record["mission"])

        dossiers = json.loads((output_dir / "candidate_dossiers.json").read_text(encoding="utf-8"))
        dossier_ids = {dossier["candidate_id"] for dossier in dossiers}
        self.assertIn("paperqa2", dossier_ids)
        self.assertIn("storm", dossier_ids)
        first_dossier = dossiers[0]
        self.assertIn("provenance_summary", first_dossier)
        self.assertIn("freshness_summary", first_dossier)
        self.assertNotEqual(first_dossier["freshness_signal"], "unknown")
        self.assertIn("freshest_source_updated_at", first_dossier)
        self.assertIn("freshest_source_age_days", first_dossier)
        self.assertIn("evidence_cluster_count", first_dossier)
        self.assertIn("duplicate_evidence_count", first_dossier)
        self.assertIn("contradiction_flags", first_dossier)
        self.assertIn("evidence_cluster_summary", first_dossier)
        self.assertIn("rejection_flags", first_dossier)
        self.assertIn("reconsideration_triggers", first_dossier)

        discovery_hits = (output_dir / "discovery_hits.jsonl").read_text(encoding="utf-8").strip().splitlines()
        first_hit = json.loads(discovery_hits[0])
        self.assertIn("track_id", first_hit)
        self.assertIn("matched_terms", first_hit)

        evidence_lines = (output_dir / "evidence_bundle.jsonl").read_text(encoding="utf-8").strip().splitlines()
        first_evidence = json.loads(evidence_lines[0])
        self.assertIn("captured_at", first_evidence)
        self.assertIn("matched_via", first_evidence)
        self.assertIn("trust_signal", first_evidence)
        self.assertIn("source_updated_at", first_evidence)
        self.assertIn("source_age_days", first_evidence)
        self.assertIn("freshness_signal", first_evidence)
        self.assertIn("cluster_id", first_evidence)
        self.assertIn("duplicate_evidence_ids", first_evidence)
        self.assertIn("contradiction_evidence_ids", first_evidence)

        provider_health = json.loads((output_dir / "provider_health.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(provider_health), 1)
        self.assertIn("provider", provider_health[0])
        self.assertIn("status", provider_health[0])
        self.assertIn("fetch_successes", provider_health[0])
        self.assertIn("request_attempts", provider_health[0])
        self.assertIn("retry_attempts", provider_health[0])
        self.assertIn("timeout_count", provider_health[0])
        self.assertIn("total_backoff_seconds", provider_health[0])
        self.assertIn("reason_codes", provider_health[0])
        self.assertIn("status_summary", provider_health[0])

        rejections = json.loads((output_dir / "rejections.json").read_text(encoding="utf-8"))
        self.assertEqual(rejections[0]["candidate_id"], "vane")
        self.assertIn("derived_flags", rejections[0])

        dw_packet = json.loads((output_dir / "dw_discovery_packet.json").read_text(encoding="utf-8"))
        validate_dw_discovery_packet(dw_packet)
        self.assertEqual(dw_packet["packet_kind"], "research_engine.dw_discovery_packet")
        self.assertEqual(dw_packet["contract_version"], 1)
        self.assertIn("Discovery", dw_packet["decision_boundary"])
        self.assertIn("provenance_summary", dw_packet["candidates"][0])
        self.assertIn("freshness_summary", dw_packet["candidates"][0])
        self.assertIn("freshness_signal", dw_packet["candidates"][0])
        self.assertIn("freshest_source_updated_at", dw_packet["candidates"][0])
        self.assertIn("freshest_source_age_days", dw_packet["candidates"][0])
        self.assertIn("source_kind", dw_packet["candidates"][0])
        self.assertIn("initial_baggage_signals", dw_packet["candidates"][0])
        self.assertIn("capability_gap_hint", dw_packet["candidates"][0])
        self.assertIn("evidence_cluster_summary", dw_packet["candidates"][0])
        self.assertIn("contradiction_flags", dw_packet["candidates"][0])
        self.assertIn("discovery_signal_band", dw_packet["candidates"][0])
        self.assertIn("signal_total_score", dw_packet["candidates"][0])
        self.assertIn("signal_score_summary", dw_packet["candidates"][0])
        self.assertEqual(dw_packet["candidates"][0]["discovery_signal_band"], "strong")
        self.assertIsInstance(dw_packet["candidates"][0]["signal_total_score"], int)
        self.assertIn("Score summary:", dw_packet["candidates"][0]["signal_score_summary"])
        self.assertNotIn("adoption_target_hint", dw_packet["candidates"][0])
        self.assertNotIn("usefulness_level_hint", dw_packet["candidates"][0])
        self.assertNotIn("routing_considerations", dw_packet["candidates"][0])
        self.assertEqual(
            dw_packet["holds_and_rejections"][0]["discovery_signal_band"],
            "hold_or_reject",
        )

        source_intelligence_packet = json.loads(
            (output_dir / "source_intelligence_packet.json").read_text(encoding="utf-8")
        )
        validate_source_intelligence_packet(source_intelligence_packet)
        self.assertEqual(
            source_intelligence_packet["packet_kind"],
            "research_engine.source_intelligence_packet",
        )
        self.assertEqual(source_intelligence_packet["contract_version"], 1)
        self.assertIn("does not decide", source_intelligence_packet["decision_boundary"].lower())
        self.assertIn("research_frame", source_intelligence_packet)
        self.assertIn("baseline_context", source_intelligence_packet)
        self.assertIn("candidate_intelligence", source_intelligence_packet)
        self.assertIn("signal_scoring", source_intelligence_packet)
        self.assertIn("strong_signals", source_intelligence_packet)
        self.assertIn("weak_signals", source_intelligence_packet)
        self.assertIn("open_uncertainties", source_intelligence_packet)
        self.assertIn("machine_friendly_research_packet", source_intelligence_packet)
        self.assertEqual(
            source_intelligence_packet["baseline_context"]["known_baseline"][0],
            "Vane",
        )
        strong_signal_names = {item["name"] for item in source_intelligence_packet["strong_signals"]}
        weak_signal_names = {item["name"] for item in source_intelligence_packet["weak_signals"]}
        self.assertIn("PaperQA2", strong_signal_names)
        self.assertIn("STORM / Co-STORM", strong_signal_names)
        self.assertIn("Vane", weak_signal_names)

        import_bundle = json.loads((output_dir / "dw_import_bundle.json").read_text(encoding="utf-8"))
        validate_dw_import_bundle(import_bundle)
        self.assertEqual(import_bundle["packet_kind"], "research_engine.dw_import_bundle")
        self.assertTrue(import_bundle["import_ready"])
        self.assertIn("source_intelligence_packet", import_bundle["artifact_refs"])
        self.assertIn("dw_discovery_packet", import_bundle["artifact_refs"])
        self.assertIn("dw_import_bundle", import_bundle["schema_refs"])
        self.assertEqual(import_bundle["counts"]["candidates"], len(dossiers))

        recommendations = (output_dir / "recommendations.md").read_text(encoding="utf-8")
        self.assertIn("1. RESEARCH FRAME", recommendations)
        self.assertIn("2. BASELINE CONTEXT", recommendations)
        self.assertIn("3. CANDIDATE INTELLIGENCE", recommendations)
        self.assertIn("4. SIGNAL SCORING", recommendations)
        self.assertIn("5. STRONG SIGNALS", recommendations)
        self.assertIn("6. WEAK / NOISY SIGNALS", recommendations)
        self.assertIn("7. OPEN UNCERTAINTIES", recommendations)
        self.assertIn("8. MACHINE-FRIENDLY RESEARCH PACKET", recommendations)
        self.assertIn("known baseline: Vane, GPT Researcher, Open Deep Research", recommendations)
        self.assertIn("PaperQA2", recommendations)

        inspection = (output_dir / "inspection.html").read_text(encoding="utf-8")
        self.assertIn("Research Engine Inspection", inspection)
        self.assertIn("Run Snapshot", inspection)
        self.assertIn("Candidates", inspection)
        self.assertIn("Provider Health", inspection)
        self.assertIn("Summary / Notes", inspection)
        self.assertIn("paperqa2", inspection)
        self.assertIn("source_intelligence_packet.json", inspection)
        self.assertIn("dw_import_bundle.json", inspection)
        self.assertIn("candidates-filter", inspection)
        self.assertIn("providers-filter", inspection)
        self.assertIn("score-desc", inspection)

        shutil.rmtree(output_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_codex_session_prepares_and_resumes(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        output_dir = temp_root / "test-codex-session"
        shutil.rmtree(output_dir, ignore_errors=True)
        env = os.environ.copy()
        env["PYTHONPATH"] = str(ROOT / "src")

        prepare = subprocess.run(
            [
                sys.executable,
                "-m",
                "research_engine",
                "--output-dir",
                str(output_dir),
                "--acquisition-mode",
                "codex-session",
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
            env=env,
            check=False,
        )

        self.assertEqual(prepare.returncode, 2, msg=prepare.stderr)
        session_dir = output_dir / "codex-session"
        self.assertTrue((session_dir / "input" / "mission.json").exists())
        self.assertTrue((session_dir / "input" / "query_plan.json").exists())
        self.assertTrue((session_dir / "input" / "instructions.md").exists())
        self.assertTrue((session_dir / "output" / "discovery_hits.jsonl").exists())
        self.assertTrue((session_dir / "output" / "source_documents.jsonl").exists())

        discovery_payload = {
            "provider": "codex-session",
            "track_id": "github-repos",
            "query": "open source deep research workflow source discovery evidence assembly",
            "url": "https://github.com/example-org/example-live-research",
            "title": "example-org/example-live-research",
            "snippet": "Live-discovered research workflow candidate.",
            "hit_type": "repo",
            "candidate_id": "repo-example-org-example-live-research",
            "matched_terms": ["research", "workflow"],
        }
        source_payload = {
            "candidate_id": "repo-example-org-example-live-research",
            "source_url": "https://github.com/example-org/example-live-research",
            "source_type": "github-repo",
            "title": "example-org/example-live-research",
            "summary": "Live-discovered candidate with source-oriented workflow patterns.",
            "provider": "codex-session",
            "track_id": "github-repos",
            "fetched_at": "2026-03-31T12:00:00+00:00",
            "facts": [
                {
                    "fact_type": "architecture",
                    "confidence": "high",
                    "excerpt": "Uses explicit supervisor and researcher phase boundaries with typed run state.",
                    "notes": [],
                },
                {
                    "fact_type": "workflow",
                    "confidence": "medium",
                    "excerpt": "Separates search tools from orchestration so discovery providers can be swapped without rewriting the run loop.",
                    "notes": [],
                },
                {
                    "fact_type": "maintenance",
                    "confidence": "high",
                    "excerpt": "Stars=42, forks=7, open_issues=3, last_push=2026-03-29T00:00:00+00:00.",
                    "notes": [],
                },
            ],
        }
        (session_dir / "output" / "discovery_hits.jsonl").write_text(
            json.dumps(discovery_payload) + "\n",
            encoding="utf-8",
        )
        (session_dir / "output" / "source_documents.jsonl").write_text(
            json.dumps(source_payload) + "\n",
            encoding="utf-8",
        )

        resume = subprocess.run(
            [
                sys.executable,
                "-m",
                "research_engine",
                "--output-dir",
                str(output_dir),
                "--acquisition-mode",
                "codex-session",
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
            env=env,
            check=False,
        )

        self.assertEqual(resume.returncode, 0, msg=resume.stderr)
        dossiers = json.loads((output_dir / "candidate_dossiers.json").read_text(encoding="utf-8"))
        self.assertEqual(dossiers[0]["candidate_id"], "repo-example-org-example-live-research")
        self.assertGreaterEqual(dossiers[0]["scorecard"]["total"], 60)
        self.assertIn("provenance_summary", dossiers[0])
        self.assertIn("freshness_summary", dossiers[0])
        self.assertEqual(dossiers[0]["freshness_signal"], "current")
        self.assertEqual(dossiers[0]["freshest_source_age_days"], 2)
        self.assertIn("evidence_cluster_summary", dossiers[0])
        self.assertIn("rejection_flags", dossiers[0])
        self.assertIn("reconsideration_triggers", dossiers[0])

        provider_health = json.loads((output_dir / "provider_health.json").read_text(encoding="utf-8"))
        self.assertEqual(provider_health[0]["provider"], "codex-session")
        self.assertGreaterEqual(provider_health[0]["fetch_successes"], 1)

        shutil.rmtree(output_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_provider_reads_local_corpus(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-success"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        (corpus_dir / "docs" / "api").mkdir(parents=True, exist_ok=True)
        (corpus_dir / "docs" / "api" / "workflow.md").write_text(
            (
                "Architecture boundary: acquisition and scoring are separate systems.\n"
                "Quickstart workflow steps describe local evidence assembly.\n"
                "POST /v1/research/jobs endpoint uses Bearer token authentication.\n"
            ),
            encoding="utf-8",
        )

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["github", "gitlab", "web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="official-docs",
                    name="Official Docs",
                    intent="Find local documentation evidence.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="official-docs",
                    query_type="official-docs",
                    text="research workflow api endpoint acquisition scoring",
                    rationale="Bounded local-first test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {"RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir)},
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        self.assertGreaterEqual(len(result.discovery_hits), 1)
        self.assertGreaterEqual(len(result.source_documents), 1)
        self.assertEqual(result.provider_health[0].provider, "local-corpus")
        self.assertFalse(result.provider_health[0].fallback_used)
        self.assertIn("local-corpus-match", result.provider_health[0].reason_codes)
        self.assertEqual(result.source_documents[0].provider, "local-corpus")
        self.assertEqual(result.source_documents[0].source_type, "api-doc")
        self.assertTrue(
            any(
                "Local corpus source." in note
                for fact in result.source_documents[0].facts
                for note in fact.notes
            )
        )

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_provider_falls_back_to_catalog_when_corpus_empty(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-empty"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        corpus_dir.mkdir(parents=True, exist_ok=True)

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["github", "gitlab", "web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="github-repos",
                    name="GitHub Repos",
                    intent="Find candidate repositories.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="github-repos",
                    query_type="repo-search",
                    text="reusable research workflow",
                    rationale="Bounded local-first fallback test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {"RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir)},
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        self.assertGreaterEqual(len(result.discovery_hits), 1)
        self.assertGreaterEqual(len(result.source_documents), 1)
        self.assertTrue(any(health.provider == "catalog-fallback" for health in result.provider_health))
        local_health = next(health for health in result.provider_health if health.provider == "local-corpus")
        self.assertTrue(local_health.fallback_used)
        self.assertEqual(local_health.status, "fallback")
        self.assertIn("fallback-engaged", local_health.reason_codes)

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_provider_strict_no_fallback_returns_empty_results(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-strict-empty"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        corpus_dir.mkdir(parents=True, exist_ok=True)

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["github", "gitlab", "web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="official-docs",
                    name="Official Docs",
                    intent="Find local documentation evidence.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="official-docs",
                    query_type="official-docs",
                    text="research workflow docs",
                    rationale="Bounded strict local-first test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {
                "RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir),
                "RESEARCH_ENGINE_LOCAL_STRICT_NO_FALLBACK": "true",
            },
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(result.discovery_hits, [])
        self.assertEqual(result.source_documents, [])
        self.assertFalse(any(health.provider == "catalog-fallback" for health in result.provider_health))
        self.assertEqual(result.provider_health[0].status, "degraded")
        self.assertIn("strict-no-fallback", result.provider_health[0].reason_codes)

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_provider_respects_top_k_per_query(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-topk"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        (corpus_dir / "docs").mkdir(parents=True, exist_ok=True)
        (corpus_dir / "docs" / "one.md").write_text(
            "Research workflow architecture and provider integration guidance.",
            encoding="utf-8",
        )
        (corpus_dir / "docs" / "two.md").write_text(
            "Research workflow process notes with endpoint examples and adapters.",
            encoding="utf-8",
        )
        (corpus_dir / "docs" / "three.md").write_text(
            "Research workflow comparison and evidence clustering walkthrough.",
            encoding="utf-8",
        )

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"official-docs": ["web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="official-docs",
                    name="Official Docs",
                    intent="Find local documentation evidence.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="official-docs",
                    query_type="official-docs",
                    text="research workflow integration endpoint",
                    rationale="Bounded top-k local-first test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {
                "RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir),
                "RESEARCH_ENGINE_LOCAL_TOP_K_PER_QUERY": "1",
            },
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(len(result.discovery_hits), 1)
        self.assertEqual(len(result.source_documents), 1)

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_ranking_prefers_phrase_aligned_document(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-semantic-ranking"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        (corpus_dir / "docs").mkdir(parents=True, exist_ok=True)
        (corpus_dir / "docs" / "dense.md").write_text(
            (
                "Acquisition scoring boundary design keeps discovery and judgment stages explicit.\n"
                "The acquisition scoring boundary design is documented as a repeatable workflow pattern.\n"
            ),
            encoding="utf-8",
        )
        (corpus_dir / "docs" / "sparse.md").write_text(
            (
                "Acquisition notes and implementation details are listed in separate sections.\n"
                "Scoring guidance appears later, while boundary remarks and design caveats are isolated.\n"
            ),
            encoding="utf-8",
        )

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"official-docs": ["web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="official-docs",
                    name="Official Docs",
                    intent="Find local documentation evidence.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="official-docs",
                    query_type="official-docs",
                    text="acquisition scoring boundary design",
                    rationale="Bounded semantic ranking local-first test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {
                "RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir),
                "RESEARCH_ENGINE_LOCAL_TOP_K_PER_QUERY": "1",
            },
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(len(result.discovery_hits), 1)
        self.assertEqual(len(result.source_documents), 1)
        self.assertEqual(result.discovery_hits[0].candidate_id, "local-docs-dense")
        self.assertEqual(result.source_documents[0].candidate_id, "local-docs-dense")

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_ranking_includes_short_domain_terms(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-short-terms"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        (corpus_dir / "docs").mkdir(parents=True, exist_ok=True)
        (corpus_dir / "docs" / "api-sdk.md").write_text(
            (
                "API SDK integration guide for adapters and auth boundaries.\n"
                "The API SDK surface is designed for external provider hooks.\n"
            ),
            encoding="utf-8",
        )
        (corpus_dir / "docs" / "generic.md").write_text(
            (
                "Architecture workflow guide for adapters and auth details.\n"
                "This guide focuses on process explanations and broad design notes.\n"
            ),
            encoding="utf-8",
        )

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"official-docs": ["web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="official-docs",
                    name="Official Docs",
                    intent="Find local documentation evidence.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="official-docs",
                    query_type="official-docs",
                    text="api sdk adapters auth",
                    rationale="Bounded short-domain-term local-first test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {
                "RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir),
                "RESEARCH_ENGINE_LOCAL_TOP_K_PER_QUERY": "1",
            },
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(len(result.discovery_hits), 1)
        self.assertEqual(result.discovery_hits[0].candidate_id, "local-docs-api-sdk")
        self.assertIn("api", result.discovery_hits[0].matched_terms)
        self.assertIn("sdk", result.discovery_hits[0].matched_terms)

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_local_first_stopword_overrides_extend_default_stop_terms(self) -> None:
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {"RESEARCH_ENGINE_LOCAL_STOP_TERMS": "sdk,api"},
            clear=False,
        ):
            terms = provider._terms("API SDK adapters and auth guidance")

        self.assertNotIn("api", terms)
        self.assertNotIn("sdk", terms)
        self.assertNotIn("and", terms)
        self.assertIn("adapters", terms)
        self.assertIn("auth", terms)

    def test_local_first_emits_lexical_diagnostics_note(self) -> None:
        temp_root = ROOT / ".tmp"
        temp_root.mkdir(exist_ok=True)
        corpus_dir = temp_root / "local-corpus-lexical-diagnostics"
        shutil.rmtree(corpus_dir, ignore_errors=True)
        (corpus_dir / "docs").mkdir(parents=True, exist_ok=True)
        for name in ("one.md", "two.md", "three.md", "four.md"):
            (corpus_dir / "docs" / name).write_text(
                (
                    "Guide guide guide for adapters and auth integration workflows.\n"
                    "This guide focuses on integration paths and examples.\n"
                ),
                encoding="utf-8",
            )

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"official-docs": ["web"]},
            selected_acquisition_mode="local-first",
            tracks=[
                SearchTrack(
                    track_id="official-docs",
                    name="Official Docs",
                    intent="Find local documentation evidence.",
                    priority=1,
                    provider_hint="local-first",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="official-docs",
                    query_type="official-docs",
                    text="api sdk adapters auth",
                    rationale="Bounded lexical diagnostics local-first test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("local-first")

        with mock.patch.dict(
            os.environ,
            {
                "RESEARCH_ENGINE_LOCAL_CORPUS_DIR": str(corpus_dir),
                "RESEARCH_ENGINE_LOCAL_TOP_K_PER_QUERY": "1",
            },
            clear=False,
        ):
            result = provider.acquire(plan, mission)

        diagnostics_notes = [note for note in result.notes if "Local-first lexical diagnostics:" in note]
        self.assertTrue(diagnostics_notes)
        self.assertIn("suggested_stop_terms=", diagnostics_notes[0])
        self.assertIn("guide", diagnostics_notes[0].lower())
        self.assertTrue(
            any(
                "Local-first lexical diagnostics:" in note
                for health in result.provider_health
                for note in health.notes
            )
        )

        shutil.rmtree(corpus_dir, ignore_errors=True)
        shutil.rmtree(temp_root, ignore_errors=True)

    def test_cli_extracts_local_stop_term_suggestion(self) -> None:
        suggestion = _extract_local_stop_term_suggestion(
            [
                "Local-first acquisition scanning corpus directory: C:/tmp/corpus.",
                "Local-first lexical diagnostics: docs=4, unique_terms=11, top_terms=guide(12), suggested_stop_terms=guide, examples, docs.",
            ]
        )
        self.assertEqual(suggestion, "guide, examples, docs")
        self.assertIsNone(
            _extract_local_stop_term_suggestion(
                ["Local-first lexical diagnostics: docs=4, unique_terms=11, top_terms=guide(12), suggested_stop_terms=none."]
            )
        )

    def test_normalization_extracts_source_age_and_candidate_freshness(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        document = SourceDocument(
            candidate_id="repo-example-recent",
            source_url="https://github.com/example/recent",
            source_type="github-repo",
            title="example/recent",
            summary="Repository summary.",
            provider="github-live",
            track_id="github-repos",
            fetched_at="2026-04-01T00:00:00+00:00",
            facts=[
                SourceFact(
                    fact_type="architecture",
                    confidence="high",
                    excerpt="Uses explicit phase boundaries for discovery and synthesis.",
                    notes=[],
                ),
                SourceFact(
                    fact_type="workflow",
                    confidence="medium",
                    excerpt="Separates acquisition from scoring so providers remain replaceable.",
                    notes=[],
                ),
                SourceFact(
                    fact_type="integration",
                    confidence="medium",
                    excerpt="Supports external provider adapters and inspectable artifacts.",
                    notes=[],
                ),
                SourceFact(
                    fact_type="maintenance",
                    confidence="high",
                    excerpt="Stars=12, forks=2, open_issues=1, last_push=2026-03-30T00:00:00+00:00.",
                    notes=[],
                ),
            ],
        )

        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        self.assertEqual(evidence[0].source_updated_at, "2026-03-30T00:00:00+00:00")
        self.assertEqual(evidence[0].source_age_days, 2)
        self.assertEqual(evidence[0].freshness_signal, "current")

        dossiers = build_candidate_shells(evidence)
        self.assertEqual(dossiers[0].freshness_signal, "current")
        self.assertEqual(dossiers[0].freshest_source_updated_at, "2026-03-30T00:00:00+00:00")
        self.assertEqual(dossiers[0].freshest_source_age_days, 2)
        self.assertIn("2 days old at capture", dossiers[0].freshness_summary)

    def test_catalog_fetch_emits_repo_metadata_for_freshness(self) -> None:
        hit = DiscoveryHit(
            provider="catalog",
            track_id="github-repos",
            query="open source deep research workflow source discovery evidence assembly",
            url="https://github.com/langchain-ai/open_deep_research",
            title="Open Deep Research",
            snippet="Composable research workflow framework with explicit phase separation and provider seams.",
            hit_type="repo",
            candidate_id="open-deep-research",
            matched_terms=["deep", "research", "workflow"],
        )

        document = fetch_documents([hit])[0]
        maintenance_facts = [fact for fact in document.facts if fact.fact_type == "maintenance"]
        self.assertTrue(any("stars=6500" in fact.excerpt for fact in maintenance_facts))
        self.assertTrue(any("open_issues=120" in fact.excerpt for fact in maintenance_facts))
        self.assertTrue(any("last_push=2026-03-29T00:00:00+00:00" in fact.excerpt for fact in maintenance_facts))
        self.assertTrue(
            any(
                "latest_release_published_at=2026-03-18T00:00:00+00:00"
                in fact.excerpt
                for fact in maintenance_facts
            )
        )
        self.assertTrue(any("releases_last_180d=6" in fact.excerpt for fact in maintenance_facts))
        self.assertTrue(
            any(
                "freshness and maintenance scoring" in note
                for fact in maintenance_facts
                for note in fact.notes
            )
        )

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        self.assertEqual(evidence[0].source_updated_at, "2026-03-29T00:00:00+00:00")

    def test_trust_policy_presets_apply_and_allow_mission_overrides(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            trust_preferences=TrustPreferences(
                policy_preset="official-first",
                prefer_official_docs=False,
                prefer_active_repos=False,
                source_type_overrides={"blog-post": "secondary"},
            ),
        )

        policy = build_source_type_trust_policy(mission)
        self.assertEqual(policy["github-repo"], "secondary")
        self.assertEqual(policy["gitlab-repo"], "secondary")
        self.assertEqual(policy["product-doc"], "secondary")
        self.assertEqual(policy["api-doc"], "secondary")
        self.assertEqual(policy["academic-paper"], "primary")
        self.assertEqual(policy["blog-post"], "secondary")

    def test_query_planning_presets_shape_tracks_and_queries(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            planning_preset="implementation-scout",
            constraints=MissionConstraints(max_queries=4),
        )

        plan = build_search_plan(mission)
        self.assertEqual(plan.planning_preset, "implementation-scout")
        self.assertEqual([track.track_id for track in plan.tracks[:2]], ["github-repos", "architecture-patterns"])
        self.assertEqual(len(plan.queries), 4)
        self.assertEqual(plan.queries[0].track_id, "github-repos")
        self.assertTrue(any(query.track_id == "architecture-patterns" for query in plan.queries))
        self.assertTrue(any("Planning preset: implementation-scout" == note for note in plan.planning_notes))
        self.assertFalse(any(query.track_id == "comparisons" for query in plan.queries))

    def test_query_planning_required_and_excluded_tracks_apply(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            planning_preset="official-first",
            required_track_ids=["comparisons"],
            excluded_track_ids=["api-docs"],
            constraints=MissionConstraints(max_queries=4),
        )

        plan = build_search_plan(mission)
        self.assertEqual(plan.required_track_ids, ["comparisons"])
        self.assertEqual(plan.excluded_track_ids, ["api-docs"])
        self.assertTrue(any(track.track_id == "comparisons" for track in plan.tracks))
        self.assertFalse(any(track.track_id == "api-docs" for track in plan.tracks))
        self.assertTrue(any(query.track_id == "comparisons" for query in plan.queries))
        self.assertFalse(any(query.track_id == "api-docs" for query in plan.queries))
        self.assertTrue(any("Added required track: comparisons." == note for note in plan.planning_notes))

    def test_query_planning_required_tracks_override_exclusions(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            planning_preset="balanced-discovery",
            required_track_ids=["github-repos"],
            excluded_track_ids=["github-repos"],
            constraints=MissionConstraints(max_queries=2),
        )

        plan = build_search_plan(mission)
        self.assertEqual(plan.required_track_ids, ["github-repos"])
        self.assertEqual(plan.excluded_track_ids, [])
        self.assertTrue(any(track.track_id == "github-repos" for track in plan.tracks))
        self.assertTrue(any(query.track_id == "github-repos" for query in plan.queries))
        self.assertTrue(
            any(
                "Required tracks override exclusions for: github-repos." == note
                for note in plan.planning_notes
            )
        )

    def test_query_planning_required_and_excluded_query_types_apply(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            planning_preset="balanced-discovery",
            required_query_types_by_track={"official-docs": ["official-docs"]},
            excluded_query_types_by_track={"comparisons": ["comparison"]},
            constraints=MissionConstraints(max_queries=6),
        )

        plan = build_search_plan(mission)
        self.assertEqual(
            plan.required_query_types_by_track,
            {"official-docs": ["official-docs"]},
        )
        self.assertEqual(
            plan.excluded_query_types_by_track,
            {"comparisons": ["comparison"]},
        )
        self.assertTrue(
            any(
                query.track_id == "official-docs" and query.query_type == "official-docs"
                for query in plan.queries
            )
        )
        self.assertFalse(
            any(
                query.track_id == "comparisons" and query.query_type == "comparison"
                for query in plan.queries
            )
        )

    def test_query_planning_required_query_types_override_exclusions(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            planning_preset="balanced-discovery",
            required_query_types_by_track={"github-repos": ["repo-discovery"]},
            excluded_query_types_by_track={"github-repos": ["repo-discovery"]},
            constraints=MissionConstraints(max_queries=3),
        )

        plan = build_search_plan(mission)
        self.assertEqual(
            plan.required_query_types_by_track,
            {"github-repos": ["repo-discovery"]},
        )
        self.assertEqual(plan.excluded_query_types_by_track, {})
        self.assertTrue(
            any(
                query.track_id == "github-repos" and query.query_type == "repo-discovery"
                for query in plan.queries
            )
        )
        self.assertTrue(
            any(
                "Required query types override exclusions for github-repos: repo-discovery."
                == note
                for note in plan.planning_notes
            )
        )

    def test_query_planning_track_provider_preferences_apply(self) -> None:
        mission = ResearchMission(
            objective="Find reusable research workflow systems.",
            planning_preset="official-first",
            track_provider_preferences={"official-docs": ["github"]},
            constraints=MissionConstraints(max_queries=4),
        )

        plan = build_search_plan(mission)
        self.assertEqual(
            plan.track_provider_preferences["official-docs"],
            ["github"],
        )
        self.assertEqual(
            plan.track_provider_preferences["github-repos"],
            ["github", "gitlab", "web"],
        )
        self.assertTrue(
            any(
                "Applied provider preference for official-docs: github." == note
                for note in plan.planning_notes
            )
        )

    def test_candidate_clustering_collapses_duplicates_and_flags_contradictions(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        document = SourceDocument(
            candidate_id="repo-example-clustered",
            source_url="https://github.com/example/clustered",
            source_type="github-repo",
            title="example/clustered",
            summary="Repository summary.",
            provider="github-live",
            track_id="github-repos",
            fetched_at="2026-04-01T00:00:00+00:00",
            facts=[
                SourceFact(
                    fact_type="architecture",
                    confidence="high",
                    excerpt="Uses explicit reusable phase boundaries for discovery.",
                    notes=[],
                ),
                SourceFact(
                    fact_type="architecture",
                    confidence="high",
                    excerpt="Uses explicit reusable phase boundaries for discovery.",
                    notes=[],
                ),
                SourceFact(
                    fact_type="workflow",
                    confidence="high",
                    excerpt="Provides a clean bounded workflow for evidence review.",
                    notes=[],
                ),
                SourceFact(
                    fact_type="workflow",
                    confidence="medium",
                    excerpt="Provides a weak shallow workflow that is not reusable.",
                    notes=[],
                ),
            ],
        )

        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        dossiers = build_candidate_shells(evidence)
        dossier = dossiers[0]

        self.assertEqual(dossier.evidence_cluster_count, 3)
        self.assertEqual(dossier.duplicate_evidence_count, 1)
        self.assertEqual(dossier.contradiction_flags, ["workflow-contradiction"])
        self.assertIn("contradictory-evidence", dossier.rejection_flags)
        self.assertTrue(any("duplicate architecture items" in line for line in dossier.evidence_cluster_summary))
        self.assertTrue(any("workflow contradiction" in line for line in dossier.evidence_cluster_summary))

        first_duplicate = next(item for item in evidence if item.evidence_id == "repo-example-clustered-e1")
        self.assertEqual(first_duplicate.cluster_id, "repo-example-clustered-c1")
        self.assertEqual(first_duplicate.duplicate_evidence_ids, ["repo-example-clustered-e2"])
        contradictory_item = next(item for item in evidence if item.evidence_id == "repo-example-clustered-e3")
        self.assertEqual(contradictory_item.contradiction_evidence_ids, ["repo-example-clustered-e4"])

    def test_scoring_applies_recency_decay_to_maintenance_health(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        documents = [
            SourceDocument(
                candidate_id="repo-example-recent",
                source_url="https://github.com/example/recent",
                source_type="github-repo",
                title="example/recent",
                summary="Recent repository summary.",
                provider="github-live",
                track_id="github-repos",
                fetched_at="2026-04-01T00:00:00+00:00",
                facts=[
                    SourceFact("architecture", "high", "Uses explicit phase boundaries.", []),
                    SourceFact("workflow", "high", "Separates acquisition from scoring.", []),
                    SourceFact("integration", "medium", "Supports provider adapters.", []),
                    SourceFact(
                        "maintenance",
                        "high",
                        "Stars=12, forks=2, open_issues=1, last_push=2026-03-30T00:00:00+00:00.",
                        [],
                    ),
                ],
            ),
            SourceDocument(
                candidate_id="repo-example-stale",
                source_url="https://github.com/example/stale",
                source_type="github-repo",
                title="example/stale",
                summary="Stale repository summary.",
                provider="github-live",
                track_id="github-repos",
                fetched_at="2026-04-01T00:00:00+00:00",
                facts=[
                    SourceFact("architecture", "high", "Uses explicit phase boundaries.", []),
                    SourceFact("workflow", "high", "Separates acquisition from scoring.", []),
                    SourceFact("integration", "medium", "Supports provider adapters.", []),
                    SourceFact(
                        "maintenance",
                        "high",
                        "Stars=12, forks=2, open_issues=1, last_push=2022-03-30T00:00:00+00:00.",
                        [],
                    ),
                ],
            ),
        ]

        evidence = normalize_evidence(
            documents,
            trust_policy=build_source_type_trust_policy(mission),
        )
        candidates = build_candidate_shells(evidence)
        accepted, rejected = score_candidates(candidates, evidence, mission)
        scored = {candidate.candidate_id: candidate for candidate in accepted}
        scored.update(
            {
                rejection.candidate_id: next(
                    candidate for candidate in candidates if candidate.candidate_id == rejection.candidate_id
                )
                for rejection in rejected
            }
        )

        recent = scored["repo-example-recent"]
        stale = scored["repo-example-stale"]
        self.assertGreater(
            recent.scorecard.breakdown["maintenance_health"],
            stale.scorecard.breakdown["maintenance_health"],
        )
        self.assertTrue(any("Freshness signal: current" in line for line in recent.scorecard.rationale))
        self.assertTrue(any("Freshness signal: stale" in line for line in stale.scorecard.rationale))

    def test_scoring_treats_gitlab_repo_as_self_hostable(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        document = SourceDocument(
            candidate_id="repo-example-gitlab-self-hostable",
            source_url="https://gitlab.com/example/research-engine",
            source_type="gitlab-repo",
            title="example/research-engine",
            summary="Composable GitLab workflow candidate.",
            provider="gitlab-live",
            track_id="github-repos",
            fetched_at="2026-04-01T00:00:00+00:00",
            facts=[
                SourceFact("architecture", "high", "Uses explicit phase boundaries.", []),
                SourceFact("workflow", "high", "Separates acquisition from scoring.", []),
                SourceFact("integration", "medium", "Supports provider adapters.", []),
                SourceFact(
                    "maintenance",
                    "high",
                    "Stars=12, forks=2, open_issues=1, last_push=2026-03-30T00:00:00+00:00.",
                    [],
                ),
            ],
        )

        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        candidates = build_candidate_shells(evidence)
        accepted, rejected = score_candidates(candidates, evidence, mission)
        scored = {candidate.candidate_id: candidate for candidate in accepted}
        scored.update(
            {
                rejection.candidate_id: next(
                    candidate for candidate in candidates if candidate.candidate_id == rejection.candidate_id
                )
                for rejection in rejected
            }
        )

        gitlab_candidate = scored["repo-example-gitlab-self-hostable"]
        self.assertEqual(gitlab_candidate.scorecard.breakdown["self_hostability"], 12)

    def test_scoring_uses_clusters_for_evidence_density_and_contradiction_risk(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        duplicate_document = SourceDocument(
            candidate_id="repo-example-duplicates",
            source_url="https://github.com/example/duplicates",
            source_type="github-repo",
            title="example/duplicates",
            summary="Repository summary.",
            provider="github-live",
            track_id="github-repos",
            fetched_at="2026-04-01T00:00:00+00:00",
            facts=[
                SourceFact("architecture", "high", "Uses explicit reusable phase boundaries.", []),
                SourceFact("architecture", "high", "Uses explicit reusable phase boundaries.", []),
                SourceFact("workflow", "high", "Supports bounded workflow review.", []),
                SourceFact("integration", "medium", "Supports provider adapters.", []),
            ],
        )
        contradiction_document = SourceDocument(
            candidate_id="repo-example-contradiction",
            source_url="https://github.com/example/contradiction",
            source_type="github-repo",
            title="example/contradiction",
            summary="Repository summary.",
            provider="github-live",
            track_id="github-repos",
            fetched_at="2026-04-01T00:00:00+00:00",
            facts=[
                SourceFact("architecture", "high", "Uses explicit reusable phase boundaries.", []),
                SourceFact("workflow", "high", "Supports a clean bounded workflow.", []),
                SourceFact("workflow", "medium", "Uses a weak shallow workflow that is not reusable.", []),
                SourceFact("integration", "medium", "Supports provider adapters.", []),
            ],
        )

        evidence = normalize_evidence(
            [duplicate_document, contradiction_document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        candidates = build_candidate_shells(evidence)
        accepted, rejected = score_candidates(candidates, evidence, mission)
        scored = {candidate.candidate_id: candidate for candidate in accepted}
        scored.update(
            {
                rejection.candidate_id: next(
                    candidate for candidate in candidates if candidate.candidate_id == rejection.candidate_id
                )
                for rejection in rejected
            }
        )

        duplicates = scored["repo-example-duplicates"]
        contradiction = scored["repo-example-contradiction"]
        self.assertEqual(duplicates.scorecard.breakdown["evidence_density"], 9)
        self.assertEqual(contradiction.scorecard.breakdown["evidence_density"], 12)
        self.assertLess(
            contradiction.scorecard.breakdown["evidence_risk_penalty"],
            duplicates.scorecard.breakdown["evidence_risk_penalty"],
        )
        self.assertTrue(any("Collapsed 4 evidence items into 3 clusters." in line for line in duplicates.scorecard.rationale))
        self.assertTrue(any("Contradiction flags: workflow-contradiction." in line for line in contradiction.scorecard.rationale))

    def test_live_hybrid_request_retry_telemetry_records_timeout_and_backoff(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        provider._reset_request_telemetry()

        with (
            mock.patch("research_engine.acquisition.sleep"),
            mock.patch(
                "research_engine.acquisition.urlopen",
                side_effect=[
                    TimeoutError("timed out"),
                    _FakeResponse(b'{"items": []}'),
                ],
            ),
        ):
            payload = provider._read_json(
                "https://api.github.com/search/repositories?q=research-engine",
                provider_key="github-discovery",
                github=True,
            )

        telemetry = provider._request_telemetry["github-discovery"]
        self.assertEqual(payload, {"items": []})
        self.assertEqual(telemetry.request_attempts, 2)
        self.assertEqual(telemetry.request_successes, 1)
        self.assertEqual(telemetry.retry_attempts, 1)
        self.assertEqual(telemetry.timeout_count, 1)
        self.assertEqual(telemetry.backoff_events, 1)
        self.assertAlmostEqual(telemetry.total_backoff_seconds, 0.25)
        self.assertAlmostEqual(telemetry.max_backoff_seconds, 0.25)
        self.assertTrue(any("backoff=0.25s" in note for note in telemetry.notes))

    def test_read_json_uses_github_auth_header_when_token_present(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        captured_headers: dict[str, str] = {}

        def fake_read_bytes(request):
            nonlocal captured_headers
            captured_headers = {key.lower(): value for key, value in request.header_items()}
            return b'{"items": []}'

        with (
            mock.patch.dict(os.environ, {"RESEARCH_ENGINE_GITHUB_TOKEN": "gh-test-token"}, clear=False),
            mock.patch.object(provider, "_read_bytes", side_effect=fake_read_bytes),
        ):
            payload = provider._read_json(
                "https://api.github.com/search/repositories?q=research-engine",
                provider_key="github-discovery",
                github=True,
            )

        self.assertEqual(payload, {"items": []})
        self.assertEqual(captured_headers.get("authorization"), "Bearer gh-test-token")

    def test_read_json_uses_gitlab_auth_header_when_token_present(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        captured_headers: dict[str, str] = {}

        def fake_read_bytes(request):
            nonlocal captured_headers
            captured_headers = {key.lower(): value for key, value in request.header_items()}
            return b"[]"

        with (
            mock.patch.dict(os.environ, {"RESEARCH_ENGINE_GITLAB_TOKEN": "gl-test-token"}, clear=False),
            mock.patch.object(provider, "_read_bytes", side_effect=fake_read_bytes),
        ):
            payload = provider._read_json(
                "https://gitlab.com/api/v4/projects?search=research-engine",
                provider_key="gitlab-discovery",
            )

        self.assertEqual(payload, [])
        self.assertEqual(captured_headers.get("private-token"), "gl-test-token")

    def test_live_hybrid_notes_include_detected_auth_tokens(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["github", "gitlab", "web"]},
            selected_acquisition_mode="live-hybrid",
            tracks=[
                SearchTrack(
                    track_id="github-repos",
                    name="GitHub Repos",
                    intent="Find candidate repositories.",
                    priority=1,
                    provider_hint="live-hybrid",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="github-repos",
                    query_type="repo-search",
                    text="reusable research workflow",
                    rationale="Bounded auth-note test query.",
                )
            ],
            planning_notes=[],
        )
        provider = LiveHybridAcquisitionProvider()

        with (
            mock.patch.dict(
                os.environ,
                {
                    "RESEARCH_ENGINE_GITHUB_TOKEN": "gh-test-token",
                    "RESEARCH_ENGINE_GITLAB_TOKEN": "gl-test-token",
                },
                clear=False,
            ),
            mock.patch.object(provider, "_github_hits_for_query", return_value=[]),
            mock.patch.object(provider, "_gitlab_hits_for_query", return_value=[]),
            mock.patch.object(provider, "_web_hits_for_query", return_value=[]),
        ):
            result = provider.acquire(plan, mission)

        self.assertTrue(any("GitHub API token detected" in note for note in result.notes))
        self.assertTrue(any("GitLab token detected" in note for note in result.notes))

    def test_live_hybrid_provider_health_reports_retry_timeout_telemetry(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["github", "web"]},
            selected_acquisition_mode="live-hybrid",
            tracks=[
                SearchTrack(
                    track_id="github-repos",
                    name="GitHub Repos",
                    intent="Find candidate repositories.",
                    priority=1,
                    provider_hint="live-hybrid",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="github-repos",
                    query_type="repo-search",
                    text="reusable research workflow",
                    rationale="Bounded live test query.",
                )
            ],
            planning_notes=[],
        )
        provider = LiveHybridAcquisitionProvider()

        with (
            mock.patch("research_engine.acquisition.sleep"),
            mock.patch(
                "research_engine.acquisition.urlopen",
                side_effect=[
                    TimeoutError("timed out"),
                    _FakeResponse(b'{"items": []}'),
                    _FakeResponse(b'{"RelatedTopics": []}'),
                ],
            ),
        ):
            result = provider.acquire(plan, mission)

        live_health = result.provider_health[0]
        github_discovery = next(
            health for health in result.provider_health if health.provider == "github-discovery"
        )
        web_discovery = next(
            health for health in result.provider_health if health.provider == "web-discovery"
        )

        self.assertTrue(live_health.fallback_used)
        self.assertEqual(live_health.retry_attempts, 1)
        self.assertEqual(live_health.timeout_count, 1)
        self.assertEqual(live_health.backoff_events, 1)
        self.assertAlmostEqual(live_health.total_backoff_seconds, 0.25)
        self.assertEqual(github_discovery.request_attempts, 2)
        self.assertEqual(github_discovery.request_successes, 1)
        self.assertEqual(github_discovery.retry_attempts, 1)
        self.assertEqual(github_discovery.timeout_count, 1)
        self.assertEqual(web_discovery.request_attempts, 1)
        self.assertGreaterEqual(len(result.discovery_hits), 1)
        self.assertEqual(live_health.status, "fallback")
        self.assertEqual(github_discovery.status, "fallback")
        self.assertEqual(web_discovery.status, "fallback")
        self.assertIn("fallback-engaged", live_health.reason_codes)
        self.assertIn("timeout", github_discovery.reason_codes)
        self.assertTrue(github_discovery.status_summary)

    def test_live_hybrid_respects_track_provider_preferences(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["web"]},
            selected_acquisition_mode="live-hybrid",
            tracks=[
                SearchTrack(
                    track_id="github-repos",
                    name="GitHub Repos",
                    intent="Find candidate repositories.",
                    priority=1,
                    provider_hint="live-hybrid",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="github-repos",
                    query_type="repo-search",
                    text="reusable research workflow",
                    rationale="Bounded live test query.",
                )
            ],
            planning_notes=[],
        )
        provider = LiveHybridAcquisitionProvider()

        with (
            mock.patch.object(provider, "_github_hits_for_query", return_value=[]) as github_query,
            mock.patch.object(provider, "_web_hits_for_query", return_value=[]) as web_query,
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(github_query.call_count, 0)
        self.assertEqual(web_query.call_count, 1)
        github_discovery = next(
            health for health in result.provider_health if health.provider == "github-discovery"
        )
        web_discovery = next(
            health for health in result.provider_health if health.provider == "web-discovery"
        )
        self.assertEqual(github_discovery.discovery_queries, 0)
        self.assertEqual(web_discovery.discovery_queries, 1)

    def test_live_hybrid_supports_gitlab_provider_preference(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["gitlab"]},
            selected_acquisition_mode="live-hybrid",
            tracks=[
                SearchTrack(
                    track_id="github-repos",
                    name="GitHub Repos",
                    intent="Find candidate repositories.",
                    priority=1,
                    provider_hint="live-hybrid",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="github-repos",
                    query_type="repo-search",
                    text="reusable research workflow",
                    rationale="Bounded live test query.",
                )
            ],
            planning_notes=[],
        )
        provider = LiveHybridAcquisitionProvider()

        with (
            mock.patch.object(provider, "_github_hits_for_query", return_value=[]) as github_query,
            mock.patch.object(provider, "_gitlab_hits_for_query", return_value=[]) as gitlab_query,
            mock.patch.object(provider, "_web_hits_for_query", return_value=[]) as web_query,
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(github_query.call_count, 0)
        self.assertEqual(gitlab_query.call_count, 1)
        self.assertEqual(web_query.call_count, 0)
        gitlab_discovery = next(
            health for health in result.provider_health if health.provider == "gitlab-discovery"
        )
        self.assertEqual(gitlab_discovery.discovery_queries, 1)
        self.assertTrue(any(health.provider == "catalog-fallback" for health in result.provider_health))

    def test_api_provider_mode_is_strict_and_does_not_fallback_to_catalog(self) -> None:
        mission = ResearchMission(objective="Find reusable research workflow systems.")
        plan = SearchPlan(
            mission_id=mission.mission_id,
            planning_preset="balanced-discovery",
            required_track_ids=[],
            excluded_track_ids=[],
            required_query_types_by_track={},
            excluded_query_types_by_track={},
            track_provider_preferences={"github-repos": ["github", "web"]},
            selected_acquisition_mode="api-provider",
            tracks=[
                SearchTrack(
                    track_id="github-repos",
                    name="GitHub Repos",
                    intent="Find candidate repositories.",
                    priority=1,
                    provider_hint="api-provider",
                )
            ],
            queries=[
                SearchQuery(
                    query_id="q1",
                    track_id="github-repos",
                    query_type="repo-search",
                    text="reusable research workflow",
                    rationale="Bounded strict-api test query.",
                )
            ],
            planning_notes=[],
        )
        provider = get_acquisition_provider("api-provider")
        self.assertEqual(provider.mode, "api-provider")

        with (
            mock.patch.object(provider, "_github_hits_for_query", return_value=[]),
            mock.patch.object(provider, "_web_hits_for_query", return_value=[]),
        ):
            result = provider.acquire(plan, mission)

        self.assertEqual(result.discovery_hits, [])
        self.assertEqual(result.source_documents, [])
        self.assertTrue(
            any("strict api-provider mode does not fallback" in note for note in result.notes)
        )
        self.assertFalse(any(health.provider == "catalog-fallback" for health in result.provider_health))
        self.assertEqual(result.provider_health[0].provider, "api-provider")
        self.assertFalse(result.provider_health[0].fallback_used)

    def test_live_gitlab_document_uses_release_timestamp_for_freshness(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        hit = DiscoveryHit(
            provider="gitlab-live",
            track_id="github-repos",
            query="reusable research workflow",
            url="https://gitlab.com/example/research-engine",
            title="example/research-engine",
            snippet="Repository candidate.",
            hit_type="repo",
            candidate_id="repo-example-gitlab-research-engine",
            matched_terms=["research", "workflow"],
        )
        project_payload = {
            "path_with_namespace": "example/research-engine",
            "description": "Composable GitLab research workflow candidate.",
            "star_count": 12,
            "forks_count": 3,
            "open_issues_count": 2,
            "last_activity_at": "2026-03-27T12:00:00Z",
            "language": "Python",
            "topics": ["research", "workflow"],
        }
        release_payload = {
            "released_at": "2026-03-29T09:30:00Z",
        }
        with mock.patch.object(provider, "_read_json", side_effect=[project_payload, release_payload]):
            document = provider._build_gitlab_document(hit)

        self.assertIsNotNone(document)
        self.assertEqual(document.source_type, "gitlab-repo")
        maintenance_facts = [fact for fact in document.facts if fact.fact_type == "maintenance"]
        self.assertEqual(len(maintenance_facts), 1)
        self.assertIn("latest_release_published_at=2026-03-29T09:30:00Z", maintenance_facts[0].notes)

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        self.assertEqual(evidence[0].source_updated_at, "2026-03-29T09:30:00+00:00")

    def test_live_web_document_extracts_source_updated_timestamp(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        hit = DiscoveryHit(
            provider="web-live",
            track_id="official-docs",
            query="research workflow docs",
            url="https://example.com/docs/research",
            title="example.com",
            snippet="Documentation page.",
            hit_type="doc",
            candidate_id="web-example-docs",
            matched_terms=["research", "workflow"],
        )
        html = """
        <html>
          <head>
            <title>Example Research Docs</title>
            <meta property="article:modified_time" content="2026-03-28T08:15:00Z" />
          </head>
          <body>
            <main>
              <p>Architecture overview for a bounded research workflow.</p>
              <p>Integration guide for provider adapters and evidence review.</p>
            </main>
          </body>
        </html>
        """
        with mock.patch.object(provider, "_read_text", return_value=html):
            document = provider._build_web_document(hit)

        self.assertIsNotNone(document)
        maintenance_facts = [fact for fact in document.facts if fact.fact_type == "maintenance"]
        self.assertEqual(len(maintenance_facts), 1)
        self.assertIn("2026-03-28T08:15:00+00:00", maintenance_facts[0].excerpt)

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        self.assertEqual(evidence[0].source_updated_at, "2026-03-28T08:15:00+00:00")

    def test_live_web_document_classifies_api_doc_source_type(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        hit = DiscoveryHit(
            provider="web-live",
            track_id="api-docs",
            query="research workflow api docs",
            url="https://example.com/docs/api/reference",
            title="Example API Reference",
            snippet="API documentation page.",
            hit_type="doc",
            candidate_id="web-example-api-docs",
            matched_terms=["api", "workflow"],
        )
        html = """
        <html>
          <head><title>Example API Reference</title></head>
          <body>
            <main>
              <p>API reference overview for the research workflow service.</p>
              <p>Quickstart guide covers setup steps before making requests.</p>
              <p>POST /v1/research/jobs requires Bearer token authentication and returns JSON response payloads.</p>
            </main>
          </body>
        </html>
        """
        with mock.patch.object(provider, "_read_text", return_value=html):
            document = provider._build_web_document(hit)

        self.assertIsNotNone(document)
        self.assertEqual(document.source_type, "api-doc")
        signal_facts = [fact for fact in document.facts if fact.fact_type == "signal"]
        workflow_facts = [fact for fact in document.facts if fact.fact_type == "workflow"]
        integration_facts = [fact for fact in document.facts if fact.fact_type == "integration"]
        self.assertTrue(any("Extraction profile: api-doc-shaping" in note for note in signal_facts[0].notes))
        self.assertIn("Quickstart guide", workflow_facts[0].excerpt)
        self.assertIn("POST /v1/research/jobs", integration_facts[0].excerpt)
        self.assertEqual(integration_facts[0].confidence, "high")

    def test_live_web_document_classifies_forum_source_type(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        hit = DiscoveryHit(
            provider="web-live",
            track_id="comparisons",
            query="research workflow discussion",
            url="https://news.ycombinator.com/item?id=123456",
            title="Show HN: Research workflow project",
            snippet="Forum discussion thread.",
            hit_type="doc",
            candidate_id="web-example-forum-thread",
            matched_terms=["research", "workflow"],
        )
        html = """
        <html>
          <head><title>Show HN: Research workflow project</title></head>
          <body>
            <main>
              <p>Community discussion about tradeoffs and reliability problems across providers.</p>
              <p>We run a three-step workflow: gather sources, cluster evidence, and score candidates.</p>
            </main>
          </body>
        </html>
        """
        with mock.patch.object(provider, "_read_text", return_value=html):
            document = provider._build_web_document(hit)

        self.assertIsNotNone(document)
        self.assertEqual(document.source_type, "forum-thread")
        signal_facts = [fact for fact in document.facts if fact.fact_type == "signal"]
        workflow_facts = [fact for fact in document.facts if fact.fact_type == "workflow"]
        integration_facts = [fact for fact in document.facts if fact.fact_type == "integration"]
        self.assertTrue(any("Extraction profile: forum-shaping" in note for note in signal_facts[0].notes))
        self.assertIn("three-step workflow", workflow_facts[0].excerpt)
        self.assertEqual(signal_facts[0].confidence, "low")
        self.assertEqual(integration_facts[0].confidence, "low")

    def test_live_web_document_captures_jsonld_profile_metadata(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        hit = DiscoveryHit(
            provider="web-live",
            track_id="architecture-patterns",
            query="research workflow design",
            url="https://blog.example.com/posts/research-architecture",
            title="Research architecture post",
            snippet="Blog post candidate.",
            hit_type="doc",
            candidate_id="web-example-blog-jsonld",
            matched_terms=["research", "architecture"],
        )
        html = """
        <html>
          <head>
            <title>Research Architecture Post</title>
            <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": "Research Architecture Post",
                "author": { "@type": "Person", "name": "Casey Doe" },
                "publisher": { "@type": "Organization", "name": "Example Engineering Blog" },
                "datePublished": "2026-03-25T10:15:00Z",
                "dateModified": "2026-03-27T08:30:00Z"
              }
            </script>
          </head>
          <body>
            <main>
              <p>This post explains architecture boundaries for reusable research workflows.</p>
            </main>
          </body>
        </html>
        """
        with mock.patch.object(provider, "_read_text", return_value=html):
            document = provider._build_web_document(hit)

        self.assertIsNotNone(document)
        self.assertEqual(document.source_type, "blog-post")
        signal_facts = [fact for fact in document.facts if fact.fact_type == "signal"]
        architecture_facts = [fact for fact in document.facts if fact.fact_type == "architecture"]
        maintenance_facts = [fact for fact in document.facts if fact.fact_type == "maintenance"]
        self.assertTrue(any("Extraction profile: blog-shaping" in note for note in signal_facts[0].notes))
        self.assertIn("architecture boundaries", architecture_facts[0].excerpt)
        self.assertTrue(any("Author: Casey Doe" in note for note in signal_facts[0].notes))
        self.assertTrue(any("Site: Example Engineering Blog" in note for note in signal_facts[0].notes))
        self.assertTrue(any("Schema type: BlogPosting" in note for note in signal_facts[0].notes))
        self.assertTrue(any("published_at=2026-03-25T10:15:00+00:00" in note for note in maintenance_facts[0].notes))
        self.assertTrue(any("modified_at=2026-03-27T08:30:00+00:00" in note for note in maintenance_facts[0].notes))

    def test_visible_text_extractor_returns_main_text_content(self) -> None:
        html = """
        <html>
          <head><title>Example</title></head>
          <body>
            <header>Navigation</header>
            <main>
              <p>Architecture overview for a bounded research workflow.</p>
              <p>Integration guide for provider adapters.</p>
            </main>
            <script>console.log('ignore')</script>
          </body>
        </html>
        """
        extracted = extract_visible_text(html)
        self.assertIn("Architecture overview for a bounded research workflow.", extracted)
        self.assertIn("Integration guide for provider adapters.", extracted)
        self.assertNotIn("console.log", extracted)

    def test_live_github_document_uses_release_and_homepage_dates_for_freshness(self) -> None:
        provider = LiveHybridAcquisitionProvider()
        hit = DiscoveryHit(
            provider="github-live",
            track_id="github-repos",
            query="reusable research workflow",
            url="https://github.com/example/research-engine",
            title="example/research-engine",
            snippet="Repository candidate.",
            hit_type="repo",
            candidate_id="repo-example-research-engine",
            matched_terms=["research", "workflow"],
        )
        repo_payload = {
            "full_name": "example/research-engine",
            "description": "Composable research workflow candidate.",
            "stargazers_count": 42,
            "forks_count": 7,
            "open_issues_count": 3,
            "language": "Python",
            "pushed_at": "",
            "topics": ["research", "workflow"],
            "homepage": "https://example.com/research",
        }
        release_payload = {
            "published_at": "2026-03-28T12:00:00Z",
        }
        homepage_html = """
        <html>
          <head>
            <meta property="article:modified_time" content="2026-03-30T08:15:00Z" />
          </head>
          <body>
            <main>
              <p>Architecture overview for a bounded research workflow.</p>
            </main>
          </body>
        </html>
        """
        with (
            mock.patch.object(provider, "_read_json", side_effect=[repo_payload, release_payload]),
            mock.patch.object(
                provider,
                "_fetch_github_readme",
                return_value=(
                    "Architecture uses explicit phase boundaries.\n"
                    "Workflow keeps discovery and scoring separate.\n"
                    "Integration uses provider adapters."
                ),
            ),
            mock.patch.object(provider, "_read_text", return_value=homepage_html),
        ):
            document = provider._build_github_document(hit)

        self.assertIsNotNone(document)
        maintenance_facts = [fact for fact in document.facts if fact.fact_type == "maintenance"]
        self.assertEqual(len(maintenance_facts), 1)
        self.assertIn("latest_release_published_at=2026-03-28T12:00:00Z", maintenance_facts[0].notes)
        self.assertIn("homepage_last_updated=2026-03-30T08:15:00+00:00", maintenance_facts[0].notes)

        mission = ResearchMission(objective="Find reusable research workflow systems.")
        evidence = normalize_evidence(
            [document],
            trust_policy=build_source_type_trust_policy(mission),
        )
        self.assertEqual(evidence[0].source_updated_at, "2026-03-30T08:15:00+00:00")


if __name__ == "__main__":
    unittest.main()
