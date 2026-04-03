# Research Engine Implement

Use this file as the repo-root entrypoint.

## Read In Order

1. [docs/research-engine-dw-alignment.md](./docs/research-engine-dw-alignment.md)
2. [docs/supporting-doctrine-discovery-research-pipeline.md](./docs/supporting-doctrine-discovery-research-pipeline.md)
3. [agent-control/implement.md](./agent-control/implement.md)
4. [agent-control/runbook/active.md](./agent-control/runbook/active.md)
5. [agent-control/runbook/current-priority.md](./agent-control/runbook/current-priority.md)

## Research Engine-Specific Constraint

Research Engine is not the Directive Engine.
It is a Discovery-owned source-intelligence capability inside Directive Workspace that should emit artifacts compatible with the canonical DW Discovery front door.

Research Engine is also not "just call Codex and hope."
Codex may be one acquisition backend, but Research Engine itself owns mission intake, planning, normalization, scoring, rejection, and DW packet export.

## Working Rule

When adopting patterns from external systems:

- preserve inspectable evidence
- preserve baggage and exclusion notes
- stop before Runtime or Architecture execution concerns
- keep the exported DW packet limited to Discovery-useful fields only

## Active Doctrine

Build Research Engine as a Discovery-aligned research pipeline:

1. mission intake
2. query planning
3. acquisition
4. evidence normalization
5. candidate grouping
6. scoring and rejection
7. DW-ready artifact export

The stable contract is:

- `mission`
- `query_plan`
- `discovery_hits`
- `evidence_bundle`
- `candidate_dossiers`
- `rejections`
- `dw_discovery_packet`
- `source_intelligence_packet`
- `dw_import_bundle`
- only `source_intelligence_packet`, `dw_discovery_packet`, and `dw_import_bundle` cross into Directive Workspace; other artifacts remain Discovery inspection support

## Current Status

Done:

- standalone Python package scaffold
- deterministic mission -> plan -> discovery -> fetch -> normalize -> score -> export flow
- catalog-backed reference run
- multi-track query planning
- acquisition interface with `catalog` and `codex-session` modes
- executable `codex-session` handoff with workspace-visible input/output files
- live-hybrid acquisition backend with real GitHub/web discovery and bounded fallback to catalog mode
- live-hybrid deep extraction for GitHub (repo metadata + README signals) and web pages (visible-text extraction)
- normalized evidence now carries trust, match, and capture metadata
- scoring now derives from normalized evidence instead of catalog score hints
- candidate dossiers and DW packets now carry freshness and provenance summaries
- scoring now applies recency decay and source-age weighting to maintenance health
- candidate dossiers now cluster evidence, collapse duplicates for scoring, and flag contradictions
- normalization now applies source-type trust policy with mission-level overrides
- mission trust preferences now support named trust-policy presets for common Discovery objectives
- missions now support named query-planning presets so track/query mix stays explicit and aligned with trust posture
- missions now support required/excluded query-track overrides on top of planning presets
- missions now support required/excluded query-type pinning inside each track
- missions now support track-level provider preferences for live-hybrid acquisition pressure
- catalog metadata snapshots now include stars/issues/release-cadence signals for deterministic maintenance evidence
- catalog-backed runs now inject deterministic repo-metadata freshness facts for source-age scoring
- live GitHub fetch now adds release/homepage freshness notes so source-age extraction is not limited to `pushed_at`
- candidate dossiers now carry derived rejection flags and reconsideration triggers
- rejections now include derived evidence flags
- provider health telemetry now exported as inspectable artifact
- thin inspection UI (`inspection.html`) now exports a browsable snapshot of run artifacts, candidates, and provider health
- dedicated `api-provider` acquisition mode now runs strict live discovery/fetch without catalog fallback
- live repo adapter coverage now includes GitLab discovery/fetch in both `live-hybrid` and `api-provider` modes
- web adapter now classifies non-repo sources (`api-doc`, `blog-post`, `forum-thread`, `news-article`) for stronger trust-policy routing
- non-repo web extraction now captures source-profile metadata (author/site/schema/published/modified) with source-type-aware confidence weighting
- non-repo web extraction now applies source-specific content shaping profiles for docs/blog/forum/news evidence slices
- live provider requests now support optional GitHub/GitLab auth tokens to reduce unauthenticated rate-limit failures
- `local-first` acquisition mode now supports offline corpus-driven discovery/fetch with bounded catalog fallback
- provider health now carries explicit reason codes and status summaries for healthy/degraded/fallback/idle reporting
- `local-first` mode now supports tuning controls (`top_k_per_query`, match-window, extension filters, strict no-fallback)
- `local-first` ranking now applies lightweight semantic relevance signals (rarity-weighted overlap, phrase/bigram alignment, and sparse-match penalty) on top of keyword overlap
- thin inspection shell now includes provider diagnostic drill-down columns (reason codes, status summaries, and notes)
- inspection shell now supports bounded client-side candidate/provider sorting and filtering controls
- local-first tokenization now includes short domain terms (`api`, `sdk`) with bounded stopword filtering for higher-signal local matching
- local-first stopword coverage validated against `.research/` corpus sample in strict offline mode (`local-corpus` only)
- local-first stopword overrides now support env-based additions via `RESEARCH_ENGINE_LOCAL_STOP_TERMS` for domain tuning without code edits
- local-first acquisition now emits lexical diagnostics (top terms + suggested stop terms) in acquisition notes and provider-health notes
- CLI now surfaces local-first stopword suggestions directly (`Suggested RESEARCH_ENGINE_LOCAL_STOP_TERMS: ...`) when diagnostics produce candidates
- local-first diagnostic suggestion threshold now surfaces candidates on large corpora (40% doc-frequency gate, bounded top-8)
- production-corpus local-first calibration completed for workspace corpus `.research`; applied runtime stop terms `researcher,gpt,python` for calibrated runs
- live-hybrid provider telemetry now records retries, backoff, and timeout counts per provider path
- live web extraction now captures page-level updated/published metadata when available for freshness scoring
- provider health entries now expose explicit `healthy` / `degraded` / `fallback` / `idle` status labels
- `dw_discovery_packet.json` export
- fixed-format source-intelligence packet export now emitted as `source_intelligence_packet.json` plus structured `recommendations.md`
- default novelty/baseline context now lives in package data instead of hardcoded mission-model defaults
- deterministic catalog now includes the researched comparison-anchor systems and prioritizes non-baseline matches when mission context is present
- DW-facing packet exports now carry explicit contract metadata (`packet_kind`, `contract_version`, decision boundary) and are validated before write
- importer-facing `dw_import_bundle.json` now provides a bounded DW shadow-integration manifest with artifact refs, counts, schema refs, and import notes
- smoke test for artifact emission

## Active Build Queue

Do next, in order:

1. No active required build-slice tasks remain; next work should come from a new explicitly-prioritized slice.

Defer until after that:

- broader UI redesign beyond lightweight inspection-shell polish

## Anti-Drift Checks

Stop and reassess if:

- the main output becomes prose instead of artifacts
- the source-intelligence handoff drifts away from the fixed research-packet structure
- Codex thread output is being treated as final truth
- rejection reasoning becomes implicit
- acquisition logic starts owning downstream judgment
- the DW packet starts carrying route/adoption authority hints instead of Discovery review inputs
- the system starts looking like a generic chat shell
