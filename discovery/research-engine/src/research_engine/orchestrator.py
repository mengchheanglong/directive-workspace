from __future__ import annotations

from pathlib import Path

from research_engine.acquisition import get_acquisition_provider
from research_engine.export import build_dw_packet, write_artifacts
from research_engine.models import ResearchMission, ResearchRecord
from research_engine.normalize import (
    build_candidate_shells,
    build_source_type_trust_policy,
    normalize_evidence,
)
from research_engine.planning import build_search_plan
from research_engine.score import score_candidates


def run_mission(
    mission: ResearchMission,
    output_dir: Path | None = None,
    acquisition_mode: str = "catalog",
) -> ResearchRecord:
    plan = build_search_plan(mission)
    plan.selected_acquisition_mode = acquisition_mode
    provider = get_acquisition_provider(acquisition_mode)
    acquisition = provider.acquire(plan, mission, output_dir=output_dir)
    trust_policy = build_source_type_trust_policy(mission)
    source_documents = acquisition.source_documents
    evidence_bundle = normalize_evidence(source_documents, trust_policy=trust_policy)
    candidate_shells = build_candidate_shells(evidence_bundle)
    candidates, rejections = score_candidates(candidate_shells, evidence_bundle, mission)
    dw_packet = build_dw_packet(mission, candidates, rejections, evidence_bundle)
    record = ResearchRecord(
        mission=mission,
        plan=plan,
        trust_policy=trust_policy,
        acquisition_notes=acquisition.notes,
        provider_health=acquisition.provider_health,
        discovery_hits=acquisition.discovery_hits,
        source_documents=acquisition.source_documents,
        evidence_bundle=evidence_bundle,
        candidates=candidates,
        rejections=rejections,
        dw_discovery_packet=dw_packet,
    )
    if output_dir is not None:
        write_artifacts(output_dir, record)
    return record
