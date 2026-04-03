from __future__ import annotations

import json
from html import escape
from pathlib import Path
import re

from research_engine.catalog import get_catalog_entry
from research_engine.contracts import (
    validate_dw_discovery_packet,
    validate_dw_import_bundle,
    validate_source_intelligence_packet,
)
from research_engine.models import (
    CandidateDossier,
    DW_DISCOVERY_PACKET_CONTRACT_VERSION,
    DW_DISCOVERY_PACKET_KIND,
    DW_IMPORT_BUNDLE_CONTRACT_VERSION,
    DW_IMPORT_BUNDLE_KIND,
    SOURCE_INTELLIGENCE_PACKET_CONTRACT_VERSION,
    SOURCE_INTELLIGENCE_PACKET_KIND,
    DwCandidatePacket,
    DwDiscoveryPacket,
    EvidenceItem,
    RejectionRecord,
    ResearchMission,
    ResearchRecord,
    to_jsonable,
    utc_now_iso,
)
from research_engine.normalize import derive_evidence_clusters, summarize_candidate_freshness


def _normalize_label(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def _candidate_link(candidate: CandidateDossier) -> str:
    return candidate.source_refs[0] if candidate.source_refs else ""


def _materialize_rejection_candidate(
    rejection: RejectionRecord,
    evidence_bundle: list[EvidenceItem],
) -> CandidateDossier:
    try:
        entry = get_catalog_entry(rejection.candidate_id)
    except KeyError:
        entry = None
    rejection_evidence = [item for item in evidence_bundle if item.candidate_id == rejection.candidate_id]
    source_refs = sorted({item.source_url for item in rejection_evidence})
    title = rejection_evidence[0].title if rejection_evidence else rejection.candidate_id
    summary = rejection_evidence[0].excerpt if rejection_evidence else "Rejected candidate from live discovery."
    (
        evidence_cluster_count,
        duplicate_evidence_count,
        contradiction_flags,
        evidence_cluster_summary,
    ) = derive_evidence_clusters(rejection.candidate_id, rejection_evidence)
    (
        freshness_signal,
        freshest_source_updated_at,
        freshest_source_age_days,
        freshness_summary,
    ) = summarize_candidate_freshness(rejection_evidence)
    return CandidateDossier(
        candidate_id=entry.candidate_id if entry else rejection.candidate_id,
        name=entry.name if entry else title,
        candidate_type=entry.candidate_type if entry else "system",
        source_refs=[entry.repository_url] if entry else source_refs,
        summary=entry.summary if entry else summary,
        problem_solved=entry.problem_solved if entry else "Rejected during evidence-backed scoring.",
        value_hypothesis=entry.value_hypothesis if entry else "Requires stronger evidence before adoption.",
        baggage_signals=entry.baggage_signals if entry else ["Rejected candidate"],
        adoption_target_hint=entry.adoption_target_hint if entry else "defer",
        usefulness_level_hint=entry.usefulness_level_hint if entry else "meta",
        capability_gap_hint=entry.capability_gap_hint if entry else "Insufficient evidence quality.",
        evidence_ids=rejection.evidence_ids,
        evidence_cluster_count=evidence_cluster_count,
        duplicate_evidence_count=duplicate_evidence_count,
        contradiction_flags=contradiction_flags,
        evidence_cluster_summary=evidence_cluster_summary,
        provenance_summary=(
            sorted(
                {
                    f"{item.trust_signal} via {item.matched_via} ({item.source_type})"
                    for item in rejection_evidence
                }
            )
            or ["Rejection packet has no attached evidence provenance."]
        ),
        freshness_summary=freshness_summary,
        freshness_signal=freshness_signal,
        freshest_source_updated_at=freshest_source_updated_at,
        freshest_source_age_days=freshest_source_age_days,
        rejection_flags=list(rejection.derived_flags),
        reconsideration_triggers=[rejection.reconsider_if],
        scorecard=None,
    )


def _candidate_status_map(record: ResearchRecord) -> dict[str, dict[str, object]]:
    status_map: dict[str, dict[str, object]] = {}
    for candidate in record.candidates:
        status_map[candidate.candidate_id] = {
            "candidate": candidate,
            "status": "accepted",
            "status_reason": "",
        }
    for rejection in record.rejections:
        candidate = _materialize_rejection_candidate(rejection, record.evidence_bundle)
        status_map[candidate.candidate_id] = {
            "candidate": candidate,
            "status": "rejected",
            "status_reason": rejection.reason,
        }
    return status_map


def _known_context_for_candidate(candidate: CandidateDossier, mission: ResearchMission) -> tuple[str, str, str]:
    normalized_values = {
        _normalize_label(candidate.candidate_id),
        _normalize_label(candidate.name),
    }
    baseline = {_normalize_label(value) for value in mission.known_baseline_names}
    anchors = {_normalize_label(value) for value in mission.known_candidate_anchor_names}
    if normalized_values & baseline:
        return (
            "baseline",
            "Direct overlap with the known baseline set.",
            "Not novel relative to the known baseline.",
        )
    if normalized_values & anchors:
        return (
            "anchor",
            "Already-known comparison anchor beyond the core baseline.",
            "Novelty is limited in this run because the candidate is already in the known comparison set.",
        )
    return (
        "new",
        "No explicit identity overlap with the known baseline or comparison-anchor sets.",
        "Appears novel within the current mission context, subject to capability-overlap review.",
    )


def _candidate_strengths(candidate: CandidateDossier) -> list[str]:
    strengths: list[str] = []
    breakdown = candidate.scorecard.breakdown if candidate.scorecard else {}
    if breakdown.get("mission_fit", 0) >= 14:
        strengths.append("High mission-fit signal against the current research objective.")
    if breakdown.get("evidence_density", 0) >= 9:
        strengths.append("Evidence spans multiple normalized clusters instead of a single isolated claim.")
    if breakdown.get("implementation_leverage", 0) >= 12:
        strengths.append("Evidence includes architecture/workflow/integration details, not just surface-level summaries.")
    if breakdown.get("maintenance_health", 0) >= 7:
        strengths.append("Freshness and maintenance signals remain supportive.")
    if breakdown.get("composability", 0) >= 10:
        strengths.append("Candidate appears relatively composable as a bounded subsystem reference.")
    if not strengths:
        strengths.append("Inspectable artifact coverage exists, but the positive signal is limited.")
    return strengths


def _candidate_weaknesses(candidate: CandidateDossier, known_state: str) -> list[str]:
    weaknesses: list[str] = []
    weaknesses.extend(candidate.baggage_signals[:2])
    if candidate.rejection_flags:
        weaknesses.append(f"Derived evidence flags: {', '.join(candidate.rejection_flags)}.")
    if candidate.contradiction_flags:
        weaknesses.append(f"Contradiction flags: {', '.join(candidate.contradiction_flags)}.")
    if known_state == "baseline":
        weaknesses.append("Novelty is limited because this candidate is already in the baseline set.")
    if not weaknesses:
        weaknesses.append("No major weakness was extracted beyond bounded evidence coverage.")
    return weaknesses


def _candidate_uncertainties(candidate: CandidateDossier, status_reason: str) -> list[str]:
    notes: list[str] = []
    if candidate.freshest_source_age_days is None:
        notes.append("Source-age extraction was incomplete; freshness remains partially uncertain.")
    if not any("primary" in summary for summary in candidate.provenance_summary):
        notes.append("Primary-source evidence is limited or absent in the current bundle.")
    if not candidate.scorecard:
        notes.append("Candidate does not carry a full scorecard in the exported dossier.")
    if candidate.reconsideration_triggers:
        notes.append(f"Reconsideration triggers: {'; '.join(candidate.reconsideration_triggers)}.")
    if status_reason:
        notes.append(f"Current run status reason: {status_reason}")
    if not notes:
        notes.append("No major unresolved uncertainty was extracted beyond normal evidence interpretation risk.")
    return notes


def _signal_score_explanations(
    candidate: CandidateDossier,
    mission: ResearchMission,
) -> dict[str, tuple[int, str]]:
    breakdown = candidate.scorecard.breakdown if candidate.scorecard else {}
    known_state, _, novelty_note = _known_context_for_candidate(candidate, mission)

    relevance = round(
        min(
            10.0,
            (breakdown.get("mission_fit", 0) / 20 * 4)
            + (breakdown.get("implementation_leverage", 0) / 18 * 3)
            + (breakdown.get("evidence_density", 0) / 15 * 3),
        )
    )
    relevance = max(1, relevance)

    novelty = 7
    if known_state == "baseline":
        novelty = 1
    elif known_state == "anchor":
        novelty = 4
    elif candidate.usefulness_level_hint in {"direct", "structural"}:
        novelty += 1
    novelty = max(1, min(10, novelty))

    trust_values = {summary.split(" via ", 1)[0] for summary in candidate.provenance_summary}
    evidence_quality = 3
    evidence_quality += min(3, candidate.evidence_cluster_count)
    evidence_quality += 2 if "primary" in trust_values else 0
    evidence_quality += 1 if candidate.freshness_signal in {"current", "recent"} else 0
    evidence_quality -= min(2, len(candidate.contradiction_flags))
    evidence_quality = max(1, min(10, evidence_quality))

    inspectability = 3
    inspectability += min(2, len(candidate.provenance_summary))
    inspectability += min(2, candidate.evidence_cluster_count)
    inspectability += 1 if candidate.freshest_source_updated_at else 0
    inspectability += 1 if _candidate_link(candidate) else 0
    inspectability += 1 if candidate.scorecard and candidate.scorecard.rationale else 0
    inspectability = max(1, min(10, inspectability))

    subsystem_reuse = round(
        min(
            10.0,
            (breakdown.get("implementation_leverage", 0) / 18 * 4)
            + (breakdown.get("composability", 0) / 12 * 3)
            + (breakdown.get("self_hostability", 0) / 12 * 2)
            + (1 if breakdown.get("baggage_penalty", 0) >= -2 else 0),
        )
    )
    subsystem_reuse = max(1, subsystem_reuse)

    return {
        "relevance_score": (
            relevance,
            "Derived from mission fit, evidence density, and architecture/workflow signal coverage.",
        ),
        "novelty_score": (
            novelty,
            novelty_note,
        ),
        "evidence_quality_score": (
            evidence_quality,
            "Derived from evidence clusters, trust signals, freshness extraction, and contradiction risk.",
        ),
        "inspectability_score": (
            inspectability,
            "Derived from provenance visibility, evidence clustering, source links, and rationale visibility.",
        ),
        "subsystem_reuse_score": (
            subsystem_reuse,
            "Derived from implementation leverage, composability, self-hostability, and bounded baggage.",
        ),
    }


def _discovery_signal_profile(
    candidate: CandidateDossier,
    mission: ResearchMission,
    *,
    status: str,
    status_reason: str,
) -> tuple[str, int | None, str]:
    scores = _signal_score_explanations(candidate, mission)
    total_score = candidate.scorecard.total if candidate.scorecard else None
    relevance_score = scores["relevance_score"][0]
    novelty_score = scores["novelty_score"][0]
    evidence_quality_score = scores["evidence_quality_score"][0]
    inspectability_score = scores["inspectability_score"][0]
    subsystem_reuse_score = scores["subsystem_reuse_score"][0]
    known_state, _, _ = _known_context_for_candidate(candidate, mission)

    score_summary = (
        f"total={total_score if total_score is not None else 'n/a'}; "
        f"relevance={relevance_score}/10; "
        f"evidence_quality={evidence_quality_score}/10; "
        f"inspectability={inspectability_score}/10; "
        f"subsystem_reuse={subsystem_reuse_score}/10; "
        f"novelty={novelty_score}/10."
    )

    if status == "rejected":
        return (
            "hold_or_reject",
            total_score,
            f"Held or rejected for Discovery review: {status_reason or 'bounded rejection or hold recorded by Research Engine.'} Score summary: {score_summary}",
        )

    if (
        known_state != "baseline"
        and novelty_score >= 4
        and relevance_score >= 8
        and evidence_quality_score >= 7
        and subsystem_reuse_score >= 7
    ):
        return (
            "strong",
            total_score,
            f"Strong Discovery review signal from Research Engine scoring. Score summary: {score_summary}",
        )

    if (
        known_state == "baseline"
        or relevance_score <= 6
        or evidence_quality_score <= 5
    ):
        return (
            "weak",
            total_score,
            f"Weak or noisy Discovery review signal due to baseline overlap, limited evidence quality, low relevance, or both. Score summary: {score_summary}",
        )

    return (
        "review",
        total_score,
        f"Mixed Discovery review signal; candidate may still be useful, but novelty, evidence strength, or bounded reuse remains inconclusive. Score summary: {score_summary}",
    )


def build_source_intelligence_packet(record: ResearchRecord) -> dict[str, object]:
    status_map = _candidate_status_map(record)
    ordered_profiles = sorted(
        status_map.values(),
        key=lambda item: (
            0 if item["status"] == "accepted" else 1,
            -(
                item["candidate"].scorecard.total
                if item["candidate"].scorecard
                else 0
            ),
            item["candidate"].candidate_id,
        ),
    )

    candidate_intelligence: list[dict[str, object]] = []
    signal_scoring: list[dict[str, object]] = []
    strong_signals: list[dict[str, str]] = []
    weak_signals: list[dict[str, str]] = []
    rejected_candidates: list[dict[str, str]] = []
    novelty_notes: list[str] = []
    open_uncertainties: list[str] = []

    for profile in ordered_profiles:
        candidate = profile["candidate"]
        status = profile["status"]
        status_reason = str(profile["status_reason"])
        known_state, overlap_note, novelty_note = _known_context_for_candidate(candidate, record.mission)
        novelty_notes.append(f"{candidate.name}: {novelty_note}")
        uncertainties = _candidate_uncertainties(candidate, status_reason)
        open_uncertainties.extend(uncertainties)
        evidence_summary = (
            f"{candidate.evidence_cluster_count} evidence clusters; "
            f"freshness={candidate.freshness_signal}; "
            f"provenance={'; '.join(candidate.provenance_summary[:2]) or 'none'}."
        )
        candidate_intelligence.append(
            {
                "name": candidate.name,
                "link": _candidate_link(candidate),
                "type": candidate.candidate_type,
                "capability_contribution": candidate.problem_solved,
                "evidence_summary": evidence_summary,
                "strengths": _candidate_strengths(candidate),
                "weaknesses": _candidate_weaknesses(candidate, known_state),
                "overlap_with_baseline": overlap_note,
                "novelty_notes": novelty_note,
                "uncertainty_notes": uncertainties,
            }
        )
        scores = _signal_score_explanations(candidate, record.mission)
        signal_scoring.append(
            {
                "name": candidate.name,
                "link": _candidate_link(candidate),
                **{
                    key: {"score": value[0], "explanation": value[1]}
                    for key, value in scores.items()
                },
            }
        )
        if (
            known_state != "baseline"
            and status != "rejected"
            and scores["novelty_score"][0] >= 4
            and (
            scores["relevance_score"][0] >= 8
            and scores["evidence_quality_score"][0] >= 7
            and scores["subsystem_reuse_score"][0] >= 7
            )
        ):
            strong_signals.append(
                {
                    "name": candidate.name,
                    "link": _candidate_link(candidate),
                    "why": (
                        "Strong signal for further Discovery review because the current run shows "
                        "high relevance, solid evidence quality, and bounded subsystem-reuse potential."
                    ),
                }
            )
        if status == "rejected":
            rejected_candidates.append(
                {
                    "name": candidate.name,
                    "link": _candidate_link(candidate),
                    "why": status_reason or "Rejected during evidence-backed scoring.",
                }
            )
        if (
            status == "rejected"
            or known_state == "baseline"
            or scores["relevance_score"][0] <= 6
            or scores["evidence_quality_score"][0] <= 5
        ):
            weak_signals.append(
                {
                    "name": candidate.name,
                    "link": _candidate_link(candidate),
                    "why": status_reason
                    or (
                        "Signal remains weak, noisy, or non-novel in this run due to baseline overlap, "
                        "limited evidence quality, low relevance, or both."
                    ),
                }
            )

    deduped_open_uncertainties = list(dict.fromkeys(open_uncertainties))
    evidence_gaps = deduped_open_uncertainties[:8]
    recommended_queries = list(dict.fromkeys(query.text for query in record.plan.queries))[:6]

    return {
        "packet_kind": SOURCE_INTELLIGENCE_PACKET_KIND,
        "contract_version": SOURCE_INTELLIGENCE_PACKET_CONTRACT_VERSION,
        "mission_id": record.mission.mission_id,
        "generated_at": record.generated_at,
        "decision_boundary": (
            "Research Engine gathers source intelligence and scoring signals only; "
            "it does not decide what Directive Workspace Discovery should adopt or route."
        ),
        "research_frame": {
            "capability_under_investigation": record.mission.subsystem_gap,
            "evaluation_criteria": [
                "Inspectable subsystem contribution for source-finding, evidence assembly, ranking, or research artifacts.",
                "Evidence-backed source profile rather than hype or thin wrapper behavior.",
                "Clear overlap/novelty signal relative to the known baseline and comparison anchors.",
                "Reusable or analyzable boundaries visible through artifacts, docs, or normalized evidence.",
            ],
            "rejection_criteria": [
                "Another deep-research clone with little subsystem novelty.",
                "Thin search-wrapper behavior with weak artifact or evidence structure.",
                *record.mission.exclusion_rules,
            ],
            "novelty_criteria": [
                "Adds stronger evidence ranking or metadata/trust handling than the baseline.",
                "Adds clearer acquisition-vs-synthesis separation, inspectability, or durability.",
                "Adds richer post-acquisition evidence memory or retrieval modes.",
            ],
            "what_counts_as_a_strong_signal": (
                "A strong signal is evidence-backed, inspectable, materially relevant to the mission, "
                "and not merely a reworded version of the known baseline."
            ),
        },
        "baseline_context": {
            "known_baseline": list(record.mission.known_baseline_names),
            "already_known_candidate_set": list(record.mission.known_candidate_anchor_names),
        },
        "candidate_intelligence": candidate_intelligence,
        "signal_scoring": signal_scoring,
        "strong_signals": strong_signals,
        "weak_signals": weak_signals,
        "open_uncertainties": deduped_open_uncertainties[:10],
        "machine_friendly_research_packet": {
            "strong_signals": strong_signals,
            "weak_signals": weak_signals,
            "rejected_candidates": rejected_candidates,
            "novelty_notes": list(dict.fromkeys(novelty_notes))[:10],
            "evidence_gaps": evidence_gaps,
            "recommended_followup_queries": recommended_queries,
        },
    }


def render_inspection_html(record: ResearchRecord) -> str:
    top_candidates = sorted(
        record.candidates,
        key=lambda candidate: candidate.scorecard.total if candidate.scorecard else 0,
        reverse=True,
    )
    top_candidates_rows = []
    for candidate in top_candidates:
        score = candidate.scorecard.total if candidate.scorecard else 0
        source = candidate.source_refs[0] if candidate.source_refs else "-"
        flags = ", ".join(candidate.rejection_flags) or "none"
        search_blob = " ".join(
            value.lower()
            for value in (
                candidate.name,
                candidate.candidate_id,
                source,
                candidate.freshness_signal,
                flags,
            )
        )
        top_candidates_rows.append(
            "<tr "
            f"data-search='{escape(search_blob)}' "
            f"data-name='{escape(candidate.name.lower())}' "
            f"data-score='{score}' "
            f"data-freshness='{escape(candidate.freshness_signal.lower())}'>"
            f"<td>{escape(candidate.name)}</td>"
            f"<td>{escape(candidate.candidate_id)}</td>"
            f"<td>{score}</td>"
            f"<td>{escape(candidate.freshness_signal)}</td>"
            f"<td>{escape(source)}</td>"
            f"<td>{escape(flags)}</td>"
            "</tr>"
        )

    rejection_rows = []
    for rejection in record.rejections:
        rejection_rows.append(
            "<tr>"
            f"<td>{escape(rejection.candidate_id)}</td>"
            f"<td>{escape(rejection.reason)}</td>"
            f"<td>{escape(', '.join(rejection.derived_flags) or 'none')}</td>"
            f"<td>{escape(rejection.reconsider_if)}</td>"
            "</tr>"
        )

    provider_rows = []
    for provider in record.provider_health:
        provider_notes = "; ".join(provider.notes) if provider.notes else "none"
        reason_codes = ", ".join(provider.reason_codes) or "none"
        summary_text = provider.status_summary or "none"
        search_blob = " ".join(
            value.lower()
            for value in (
                provider.provider,
                provider.status,
                reason_codes,
                summary_text,
                provider_notes,
            )
        )
        provider_rows.append(
            "<tr "
            f"data-search='{escape(search_blob)}' "
            f"data-provider='{escape(provider.provider.lower())}' "
            f"data-status='{escape(provider.status.lower())}' "
            f"data-hits='{provider.discovery_hits}' "
            f"data-retries='{provider.retry_attempts}' "
            f"data-timeouts='{provider.timeout_count}'>"
            f"<td>{escape(provider.provider)}</td>"
            f"<td>{escape(provider.status)}</td>"
            f"<td>{provider.discovery_queries}</td>"
            f"<td>{provider.discovery_hits}</td>"
            f"<td>{provider.fetch_successes}/{provider.fetch_attempts}</td>"
            f"<td>{provider.retry_attempts}</td>"
            f"<td>{provider.timeout_count}</td>"
            f"<td>{escape(reason_codes)}</td>"
            f"<td>{escape(summary_text)}<br><span class='cell-muted'>{escape(provider_notes)}</span></td>"
            "</tr>"
        )

    summary = {
        "Candidates": len(record.candidates),
        "Rejections": len(record.rejections),
        "Evidence items": len(record.evidence_bundle),
        "Discovery hits": len(record.discovery_hits),
        "Acquisition mode": record.plan.selected_acquisition_mode,
    }
    summary_cards = "".join(
        (
            "<article class='card'>"
            f"<h3>{escape(label)}</h3>"
            f"<p>{escape(str(value))}</p>"
            "</article>"
        )
        for label, value in summary.items()
    )

    query_rows = "".join(
        "<tr>"
        f"<td>{escape(query.query_id)}</td>"
        f"<td>{escape(query.track_id)}</td>"
        f"<td>{escape(query.query_type)}</td>"
        f"<td>{escape(query.text)}</td>"
        "</tr>"
        for query in record.plan.queries
    )

    return (
        "<!doctype html>\n"
        "<html lang='en'>\n"
        "<head>\n"
        "  <meta charset='utf-8' />\n"
        "  <meta name='viewport' content='width=device-width, initial-scale=1' />\n"
        "  <title>Research Engine Inspection</title>\n"
        "  <style>\n"
        "    :root {\n"
        "      --bg: #f4f7f8;\n"
        "      --surface: #ffffff;\n"
        "      --border: #d7e0e5;\n"
        "      --text: #132733;\n"
        "      --muted: #4f6b7a;\n"
        "      --accent: #0c8a6b;\n"
        "    }\n"
        "    * { box-sizing: border-box; }\n"
        "    body {\n"
        "      margin: 0;\n"
        "      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n"
        "      color: var(--text);\n"
        "      background:\n"
        "        radial-gradient(circle at top right, #d6f0e5 0%, rgba(214, 240, 229, 0) 48%),\n"
        "        var(--bg);\n"
        "      line-height: 1.4;\n"
        "    }\n"
        "    main {\n"
        "      max-width: 1100px;\n"
        "      margin: 0 auto;\n"
        "      padding: 1.5rem;\n"
        "    }\n"
        "    header {\n"
        "      background: linear-gradient(120deg, #0c8a6b, #0f4d63);\n"
        "      color: #ffffff;\n"
        "      border-radius: 12px;\n"
        "      padding: 1.2rem 1.4rem;\n"
        "      margin-bottom: 1rem;\n"
        "    }\n"
        "    h1 { margin: 0 0 0.35rem 0; font-size: 1.4rem; }\n"
        "    h2 { margin: 0 0 0.7rem 0; font-size: 1.05rem; }\n"
        "    .subtle { color: #d6f2ec; margin: 0; font-size: 0.95rem; }\n"
        "    section {\n"
        "      background: var(--surface);\n"
        "      border: 1px solid var(--border);\n"
        "      border-radius: 10px;\n"
        "      padding: 1rem;\n"
        "      margin-bottom: 1rem;\n"
        "    }\n"
        "    .cards {\n"
        "      display: grid;\n"
        "      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n"
        "      gap: 0.6rem;\n"
        "    }\n"
        "    .card {\n"
        "      border: 1px solid var(--border);\n"
        "      border-radius: 8px;\n"
        "      padding: 0.6rem 0.7rem;\n"
        "      background: #f9fcfd;\n"
        "    }\n"
        "    .card h3 { margin: 0; font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }\n"
        "    .card p { margin: 0.25rem 0 0 0; font-weight: 600; }\n"
        "    table {\n"
        "      width: 100%;\n"
        "      border-collapse: collapse;\n"
        "      font-size: 0.9rem;\n"
        "    }\n"
        "    th, td {\n"
        "      border-bottom: 1px solid var(--border);\n"
        "      text-align: left;\n"
        "      padding: 0.45rem 0.4rem;\n"
        "      vertical-align: top;\n"
        "    }\n"
        "    th { color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.03em; }\n"
        "    details { margin-top: 0.75rem; }\n"
        "    summary { cursor: pointer; color: var(--accent); font-weight: 600; }\n"
        "    pre {\n"
        "      margin: 0.5rem 0 0 0;\n"
        "      background: #0e1b22;\n"
        "      color: #d8e8f0;\n"
        "      border-radius: 8px;\n"
        "      padding: 0.75rem;\n"
        "      overflow: auto;\n"
        "      max-height: 420px;\n"
        "      font-size: 0.8rem;\n"
        "    }\n"
        "    .artifact-links a { color: var(--accent); text-decoration: none; margin-right: 0.75rem; }\n"
        "    .artifact-links a:hover { text-decoration: underline; }\n"
        "    .cell-muted { color: var(--muted); font-size: 0.8rem; }\n"
        "    .table-controls {\n"
        "      display: grid;\n"
        "      grid-template-columns: 1fr auto;\n"
        "      gap: 0.55rem;\n"
        "      margin-bottom: 0.6rem;\n"
        "      align-items: center;\n"
        "    }\n"
        "    .table-controls input,\n"
        "    .table-controls select {\n"
        "      border: 1px solid var(--border);\n"
        "      border-radius: 6px;\n"
        "      padding: 0.35rem 0.45rem;\n"
        "      font: inherit;\n"
        "      color: var(--text);\n"
        "      background: #ffffff;\n"
        "    }\n"
        "    .table-controls label {\n"
        "      font-size: 0.8rem;\n"
        "      color: var(--muted);\n"
        "      margin-right: 0.35rem;\n"
        "    }\n"
        "    @media (max-width: 760px) {\n"
        "      .table-controls { grid-template-columns: 1fr; }\n"
        "    }\n"
        "  </style>\n"
        "</head>\n"
        "<body>\n"
        "  <main>\n"
        "    <header>\n"
        "      <h1>Research Engine Inspection</h1>\n"
        f"      <p class='subtle'>Mission: {escape(record.mission.objective)}</p>\n"
        f"      <p class='subtle'>Generated at: {escape(record.generated_at)}</p>\n"
        "    </header>\n"
        "    <section>\n"
        "      <h2>Run Snapshot</h2>\n"
        f"      <div class='cards'>{summary_cards}</div>\n"
        "      <p class='artifact-links'>\n"
        "        <a href='research_record.json'>research_record.json</a>\n"
        "        <a href='query_plan.json'>query_plan.json</a>\n"
        "        <a href='provider_health.json'>provider_health.json</a>\n"
        "        <a href='evidence_bundle.jsonl'>evidence_bundle.jsonl</a>\n"
        "        <a href='candidate_dossiers.json'>candidate_dossiers.json</a>\n"
        "        <a href='rejections.json'>rejections.json</a>\n"
        "        <a href='dw_discovery_packet.json'>dw_discovery_packet.json</a>\n"
        "        <a href='source_intelligence_packet.json'>source_intelligence_packet.json</a>\n"
        "        <a href='dw_import_bundle.json'>dw_import_bundle.json</a>\n"
        "        <a href='recommendations.md'>recommendations.md</a>\n"
      "      </p>\n"
        "    </section>\n"
        "    <section>\n"
        "      <h2>Candidates</h2>\n"
        "      <div class='table-controls'>\n"
        "        <input id='candidates-filter' type='search' placeholder='Filter candidates (name, id, source, flags)' />\n"
        "        <div><label for='candidates-sort'>Sort</label><select id='candidates-sort'>"
        "<option value='score-desc'>Score (high to low)</option>"
        "<option value='score-asc'>Score (low to high)</option>"
        "<option value='name-asc'>Name (A-Z)</option>"
        "<option value='freshness-asc'>Freshness (A-Z)</option>"
        "</select></div>\n"
        "      </div>\n"
        "      <table id='candidates-table'>\n"
        "        <thead><tr><th>Name</th><th>ID</th><th>Score</th><th>Freshness</th><th>Source</th><th>Flags</th></tr></thead>\n"
        f"        <tbody>{''.join(top_candidates_rows)}</tbody>\n"
        "      </table>\n"
        "    </section>\n"
        "    <section>\n"
        "      <h2>Rejections</h2>\n"
        "      <table>\n"
        "        <thead><tr><th>Candidate</th><th>Reason</th><th>Derived flags</th><th>Reconsider if</th></tr></thead>\n"
        f"        <tbody>{''.join(rejection_rows)}</tbody>\n"
        "      </table>\n"
        "    </section>\n"
        "    <section>\n"
        "      <h2>Provider Health</h2>\n"
        "      <div class='table-controls'>\n"
        "        <input id='providers-filter' type='search' placeholder='Filter providers (provider, status, reasons, notes)' />\n"
        "        <div><label for='providers-sort'>Sort</label><select id='providers-sort'>"
        "<option value='provider-asc'>Provider (A-Z)</option>"
        "<option value='status-asc'>Status (A-Z)</option>"
        "<option value='hits-desc'>Hits (high to low)</option>"
        "<option value='retries-desc'>Retries (high to low)</option>"
        "<option value='timeouts-desc'>Timeouts (high to low)</option>"
        "</select></div>\n"
        "      </div>\n"
        "      <table id='providers-table'>\n"
        "        <thead><tr><th>Provider</th><th>Status</th><th>Queries</th><th>Hits</th><th>Fetch</th><th>Retries</th><th>Timeouts</th><th>Reasons</th><th>Summary / Notes</th></tr></thead>\n"
        f"        <tbody>{''.join(provider_rows)}</tbody>\n"
        "      </table>\n"
        "    </section>\n"
        "    <section>\n"
        "      <h2>Query Plan</h2>\n"
        "      <table>\n"
        "        <thead><tr><th>Query ID</th><th>Track</th><th>Type</th><th>Text</th></tr></thead>\n"
        f"        <tbody>{query_rows}</tbody>\n"
        "      </table>\n"
        "      <details>\n"
        "        <summary>Raw mission + plan payload</summary>\n"
        f"        <pre>{escape(json.dumps(to_jsonable({'mission': record.mission, 'plan': record.plan}), indent=2))}</pre>\n"
        "      </details>\n"
        "    </section>\n"
        "    <script>\n"
        "      const numeric = (value) => Number.parseFloat(value || '0');\n"
        "      const wireControls = ({ tableId, filterId, sortId, sortComparators }) => {\n"
        "        const table = document.getElementById(tableId);\n"
        "        const filterInput = document.getElementById(filterId);\n"
        "        const sortSelect = document.getElementById(sortId);\n"
        "        if (!table || !filterInput || !sortSelect) {\n"
        "          return;\n"
        "        }\n"
        "        const body = table.tBodies[0];\n"
        "        const rows = Array.from(body.rows);\n"
        "        const apply = () => {\n"
        "          const filterValue = filterInput.value.trim().toLowerCase();\n"
        "          const comparator = sortComparators[sortSelect.value] || null;\n"
        "          const sortedRows = comparator ? [...rows].sort(comparator) : [...rows];\n"
        "          for (const row of sortedRows) {\n"
        "            const searchValue = row.dataset.search || '';\n"
        "            row.hidden = filterValue ? !searchValue.includes(filterValue) : false;\n"
        "            body.appendChild(row);\n"
        "          }\n"
        "        };\n"
        "        filterInput.addEventListener('input', apply);\n"
        "        sortSelect.addEventListener('change', apply);\n"
        "        apply();\n"
        "      };\n"
        "      wireControls({\n"
        "        tableId: 'candidates-table',\n"
        "        filterId: 'candidates-filter',\n"
        "        sortId: 'candidates-sort',\n"
        "        sortComparators: {\n"
        "          'score-desc': (a, b) => numeric(b.dataset.score) - numeric(a.dataset.score),\n"
        "          'score-asc': (a, b) => numeric(a.dataset.score) - numeric(b.dataset.score),\n"
        "          'name-asc': (a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''),\n"
        "          'freshness-asc': (a, b) => (a.dataset.freshness || '').localeCompare(b.dataset.freshness || ''),\n"
        "        },\n"
        "      });\n"
        "      wireControls({\n"
        "        tableId: 'providers-table',\n"
        "        filterId: 'providers-filter',\n"
        "        sortId: 'providers-sort',\n"
        "        sortComparators: {\n"
        "          'provider-asc': (a, b) => (a.dataset.provider || '').localeCompare(b.dataset.provider || ''),\n"
        "          'status-asc': (a, b) => (a.dataset.status || '').localeCompare(b.dataset.status || ''),\n"
        "          'hits-desc': (a, b) => numeric(b.dataset.hits) - numeric(a.dataset.hits),\n"
        "          'retries-desc': (a, b) => numeric(b.dataset.retries) - numeric(a.dataset.retries),\n"
        "          'timeouts-desc': (a, b) => numeric(b.dataset.timeouts) - numeric(a.dataset.timeouts),\n"
        "        },\n"
        "      });\n"
        "    </script>\n"
        "  </main>\n"
        "</body>\n"
        "</html>\n"
    )


def build_dw_packet(
    mission: ResearchMission,
    candidates: list[CandidateDossier],
    rejections: list[RejectionRecord],
    evidence_bundle: list[EvidenceItem],
) -> DwDiscoveryPacket:
    evidence_ids = {item.evidence_id: item for item in evidence_bundle}

    def packet_for_candidate(
        candidate: CandidateDossier,
        *,
        hold_reasons: list[str],
        status: str,
        status_reason: str,
    ) -> DwCandidatePacket:
        first_source = candidate.source_refs[0] if candidate.source_refs else ""
        discovery_signal_band, signal_total_score, signal_score_summary = _discovery_signal_profile(
            candidate,
            mission,
            status=status,
            status_reason=status_reason,
        )
        return DwCandidatePacket(
            candidate_id=candidate.candidate_id,
            candidate_name=candidate.name,
            source_type=candidate.candidate_type,
            source_reference=first_source,
            mission_relevance=candidate.problem_solved,
            source_kind=candidate.candidate_type,
            initial_value_hypothesis=candidate.value_hypothesis,
            initial_baggage_signals=candidate.baggage_signals,
            capability_gap_hint=candidate.capability_gap_hint,
            evidence_bundle_refs=[evidence_id for evidence_id in candidate.evidence_ids if evidence_id in evidence_ids],
            evidence_cluster_summary=candidate.evidence_cluster_summary,
            contradiction_flags=candidate.contradiction_flags,
            rejection_or_hold_reasons=hold_reasons,
            provenance_summary=candidate.provenance_summary,
            discovery_signal_band=discovery_signal_band,
            signal_total_score=signal_total_score,
            signal_score_summary=signal_score_summary,
            freshness_summary=candidate.freshness_summary,
            freshness_signal=candidate.freshness_signal,
            freshest_source_updated_at=candidate.freshest_source_updated_at,
            freshest_source_age_days=candidate.freshest_source_age_days,
            uncertainty_notes=[
                "Current run is catalog-backed and should later be upgraded to live-provider evidence.",
            ],
        )

    accepted_packets = [
        packet_for_candidate(
            candidate,
            hold_reasons=[],
            status="accepted",
            status_reason="",
        )
        for candidate in candidates
    ]

    rejected_packets: list[DwCandidatePacket] = []
    for rejection in rejections:
        rejection_candidate = _materialize_rejection_candidate(rejection, evidence_bundle)
        rejected_packets.append(
            packet_for_candidate(
                rejection_candidate,
                hold_reasons=[rejection.reason],
                status="rejected",
                status_reason=rejection.reason,
            )
        )

    return DwDiscoveryPacket(
        packet_kind=DW_DISCOVERY_PACKET_KIND,
        contract_version=DW_DISCOVERY_PACKET_CONTRACT_VERSION,
        mission_id=mission.mission_id,
        generated_at=utc_now_iso(),
        decision_boundary=(
            "Research Engine prepares Discovery-facing candidate packets; "
            "Directive Workspace Discovery retains final route and adoption authority."
        ),
        candidates=accepted_packets,
        holds_and_rejections=rejected_packets,
    )


def build_dw_import_bundle(output_dir: Path, record: ResearchRecord) -> dict[str, object]:
    return {
        "packet_kind": DW_IMPORT_BUNDLE_KIND,
        "contract_version": DW_IMPORT_BUNDLE_CONTRACT_VERSION,
        "mission_id": record.mission.mission_id,
        "generated_at": record.generated_at,
        "decision_boundary": (
            "This bundle is import-ready for Directive Workspace Discovery review only; "
            "it must not be treated as a routing or adoption decision."
        ),
        "import_ready": True,
        "artifact_refs": {
            "research_record": "research_record.json",
            "query_plan": "query_plan.json",
            "provider_health": "provider_health.json",
            "discovery_hits": "discovery_hits.jsonl",
            "evidence_bundle": "evidence_bundle.jsonl",
            "candidate_dossiers": "candidate_dossiers.json",
            "rejections": "rejections.json",
            "source_intelligence_packet": "source_intelligence_packet.json",
            "dw_discovery_packet": "dw_discovery_packet.json",
            "inspection_html": "inspection.html",
            "recommendations_markdown": "recommendations.md",
        },
        "counts": {
            "candidates": len(record.candidates),
            "rejections": len(record.rejections),
            "evidence_items": len(record.evidence_bundle),
            "discovery_hits": len(record.discovery_hits),
            "provider_health_entries": len(record.provider_health),
        },
        "schema_refs": {
            "source_intelligence_packet": str(
                Path("schemas") / "source_intelligence_packet.schema.json"
            ),
            "dw_discovery_packet": str(
                Path("schemas") / "dw_discovery_packet.schema.json"
            ),
            "dw_import_bundle": str(
                Path("schemas") / "dw_import_bundle.schema.json"
            ),
        },
        "import_notes": [
            "Discovery should consume source_intelligence_packet.json for signal review and uncertainty framing.",
            "Discovery should consume dw_discovery_packet.json for candidate-level handoff fields.",
            "Discovery should consult candidate_dossiers.json and evidence_bundle.jsonl before making any route or adoption decision.",
            f"Bundle directory: {output_dir.resolve()}",
        ],
    }


def render_recommendations_markdown(record: ResearchRecord) -> str:
    packet = build_source_intelligence_packet(record)
    lines = [
        "# Research Engine Source-Intelligence Packet",
        "",
        "1. RESEARCH FRAME",
        f"- capability under investigation: {packet['research_frame']['capability_under_investigation']}",
        "- evaluation criteria:",
    ]
    for value in packet["research_frame"]["evaluation_criteria"]:
        lines.append(f"  - {value}")
    lines.append("- rejection criteria:")
    for value in packet["research_frame"]["rejection_criteria"]:
        lines.append(f"  - {value}")
    lines.append("- novelty criteria:")
    for value in packet["research_frame"]["novelty_criteria"]:
        lines.append(f"  - {value}")
    lines.append(
        f"- what counts as a strong signal: {packet['research_frame']['what_counts_as_a_strong_signal']}"
    )

    lines.extend(
        [
            "",
            "2. BASELINE CONTEXT",
            f"- known baseline: {', '.join(packet['baseline_context']['known_baseline'])}",
            (
                "- already-known candidate set: "
                f"{', '.join(packet['baseline_context']['already_known_candidate_set'])}"
            ),
            "",
            "3. CANDIDATE INTELLIGENCE",
        ]
    )
    for candidate in packet["candidate_intelligence"]:
        lines.extend(
            [
                "",
                f"### {candidate['name']}",
                f"- name: {candidate['name']}",
                f"- link: {candidate['link'] or 'none'}",
                f"- type: {candidate['type']}",
                f"- capability contribution: {candidate['capability_contribution']}",
                f"- evidence summary: {candidate['evidence_summary']}",
                f"- strengths: {'; '.join(candidate['strengths'])}",
                f"- weaknesses: {'; '.join(candidate['weaknesses'])}",
                f"- overlap with baseline: {candidate['overlap_with_baseline']}",
                f"- novelty notes: {candidate['novelty_notes']}",
                f"- uncertainty notes: {'; '.join(candidate['uncertainty_notes'])}",
            ]
        )

    lines.extend(["", "4. SIGNAL SCORING"])
    for candidate in packet["signal_scoring"]:
        lines.extend(
            [
                "",
                f"### {candidate['name']}",
                f"- relevance score: {candidate['relevance_score']['score']} ({candidate['relevance_score']['explanation']})",
                f"- novelty score: {candidate['novelty_score']['score']} ({candidate['novelty_score']['explanation']})",
                (
                    "- evidence-quality score: "
                    f"{candidate['evidence_quality_score']['score']} "
                    f"({candidate['evidence_quality_score']['explanation']})"
                ),
                (
                    "- inspectability score: "
                    f"{candidate['inspectability_score']['score']} "
                    f"({candidate['inspectability_score']['explanation']})"
                ),
                (
                    "- subsystem-reuse score: "
                    f"{candidate['subsystem_reuse_score']['score']} "
                    f"({candidate['subsystem_reuse_score']['explanation']})"
                ),
            ]
        )

    lines.extend(["", "5. STRONG SIGNALS"])
    if packet["strong_signals"]:
        for signal in packet["strong_signals"]:
            lines.append(f"- {signal['name']}: {signal['why']}")
    else:
        lines.append("- none in the current run")

    lines.extend(["", "6. WEAK / NOISY SIGNALS"])
    if packet["weak_signals"]:
        for signal in packet["weak_signals"]:
            lines.append(f"- {signal['name']}: {signal['why']}")
    else:
        lines.append("- none in the current run")

    lines.extend(["", "7. OPEN UNCERTAINTIES"])
    if packet["open_uncertainties"]:
        for note in packet["open_uncertainties"]:
            lines.append(f"- {note}")
    else:
        lines.append("- none in the current run")

    lines.extend(
        [
            "",
            "8. MACHINE-FRIENDLY RESEARCH PACKET",
            "```yaml",
            json.dumps(packet["machine_friendly_research_packet"], indent=2),
            "```",
            "",
        ]
    )
    return "\n".join(lines)


def write_artifacts(output_dir: Path, record: ResearchRecord) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    source_intelligence_packet = build_source_intelligence_packet(record)
    dw_discovery_packet_payload = to_jsonable(record.dw_discovery_packet)
    dw_import_bundle = build_dw_import_bundle(output_dir, record)
    validate_source_intelligence_packet(source_intelligence_packet)
    validate_dw_discovery_packet(dw_discovery_packet_payload)
    validate_dw_import_bundle(dw_import_bundle)

    def write_json(name: str, payload: object) -> None:
        (output_dir / name).write_text(json.dumps(to_jsonable(payload), indent=2), encoding="utf-8")

    def write_jsonl(name: str, items: list[object]) -> None:
        lines = [json.dumps(to_jsonable(item)) for item in items]
        (output_dir / name).write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")

    write_json("research_record.json", record)
    write_json("query_plan.json", record.plan)
    write_json("provider_health.json", record.provider_health)
    write_jsonl("discovery_hits.jsonl", record.discovery_hits)
    write_jsonl("evidence_bundle.jsonl", record.evidence_bundle)
    write_json("candidate_dossiers.json", record.candidates)
    write_json("rejections.json", record.rejections)
    write_json("dw_discovery_packet.json", dw_discovery_packet_payload)
    write_json("source_intelligence_packet.json", source_intelligence_packet)
    write_json("dw_import_bundle.json", dw_import_bundle)
    (output_dir / "inspection.html").write_text(
        render_inspection_html(record),
        encoding="utf-8",
    )
    (output_dir / "recommendations.md").write_text(
        render_recommendations_markdown(record),
        encoding="utf-8",
    )
