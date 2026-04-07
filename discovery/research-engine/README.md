# Research Engine

Research Engine is a product-owned Discovery capability inside Directive Workspace.

Its role is to:

- discover relevant external systems and sources
- gather and normalize evidence
- score and rank candidates
- emit inspectable research artifacts
- produce Discovery-only packets for the canonical Directive Workspace front door

This repo currently uses a vendored workspace control surface from [agent-control](./agent-control/README.md) for bounded loops, stop-lines, and handoff discipline.

The current implementation slice is a bounded Python package that emits artifact-first research outputs and a Discovery-owned handoff packet from a bounded reference catalog.

## Start Here

1. Read [implement.md](./implement.md).
2. Read [docs/research-engine-dw-alignment.md](./docs/research-engine-dw-alignment.md).
3. Read [docs/supporting-doctrine-discovery-research-pipeline.md](./docs/supporting-doctrine-discovery-research-pipeline.md).
4. Read [agent-control/implement.md](./agent-control/implement.md).
5. Run `npm run check` from the repo root to validate the adopted agent-control surface.
6. Run `python -m research_engine --output-dir artifacts --acquisition-mode catalog` with `PYTHONPATH=src` to execute the current Research Engine slice.
7. Optional live pass: run `python -m research_engine --output-dir artifacts-live --acquisition-mode live-hybrid`.
8. Optional strict live pass: run `python -m research_engine --output-dir artifacts-api --acquisition-mode api-provider`.
9. Optional offline pass: run `python -m research_engine --output-dir artifacts-local --acquisition-mode local-first`.
10. For live provider setup, copy `.env.example` to `.env` and fill the provider keys you want to enable locally. The CLI now auto-loads `discovery/research-engine/.env` when you run from that package directory.

## Workspace Layout

- [docs/](./docs/) - Research Engine design and project-specific planning
- [agent-control/](./agent-control/) - vendored workflow control surface
- [.research/](./.research/) - optional local-only upstream inspection area (ignored; usually absent in clean clones)
- [src/research_engine/](./src/research_engine/) - current Research Engine package
- [tests/](./tests/) - smoke tests for the first runnable slice

## Current Direction

Research Engine should remain:

- Discovery-owned inside Directive Workspace
- evidence-oriented, not answer-oriented
- bounded and inspectable
- limited to source intelligence, triage support, and Discovery handoff quality

## Run

```powershell
$env:PYTHONPATH = "src"
python -m research_engine --output-dir artifacts --acquisition-mode catalog
```

Current artifacts:

- `artifacts/research_record.json`
- `artifacts/query_plan.json`
- `artifacts/provider_health.json`
- `artifacts/discovery_hits.jsonl`
- `artifacts/evidence_bundle.jsonl`
- `artifacts/candidate_dossiers.json`
- `artifacts/rejections.json`
- `artifacts/dw_discovery_packet.json`
- `artifacts/source_intelligence_packet.json`
- `artifacts/dw_import_bundle.json`
- `artifacts/inspection.html`
- `artifacts/recommendations.md`

Default source-intelligence context now lives in [src/research_engine/default_source_intelligence_context.json](./src/research_engine/default_source_intelligence_context.json) instead of being hardcoded in the mission model. Custom mission files can supply `known_baseline_names` and `known_candidate_anchor_names` explicitly; if they omit them, custom runs stay context-neutral.
Integration-facing schemas now live under [schemas/](./schemas/), and `dw_import_bundle.json` is the importer-facing manifest for the canonical DW Discovery seam. Directive Workspace only consumes `source_intelligence_packet.json`, `dw_discovery_packet.json`, and the two corresponding manifest refs; the remaining artifacts stay as inspection support for Discovery review.
`dw_discovery_packet.json` now also carries bounded structural hints such as explicit workflow phase labels, phase-aware workflow scores, provider-seam summaries, workflow-boundary shape hints, lane-target recommendations, extraction/avoid recommendations, and review-guidance summaries so Discovery can preserve Architecture-relevant research structure without granting Research Engine route authority or flattening structurally useful baseline-overlap sources into weak/noisy only.
`source_intelligence_packet.json` now mirrors that with machine-friendly `lane_target_signals`, `structural_recommendations`, `review_guidance`, and `review_queue` arrays so the product can consume extract-only recommendations and bounded review-priority ordering instead of only generic strong/weak rankings.

Live acquisition example:

```powershell
$env:PYTHONPATH = "src"
python -m research_engine --output-dir artifacts-live --acquisition-mode live-hybrid
```

`live-hybrid` currently uses GitHub and GitLab repository search plus deeper repo extraction (metadata + maintenance signals), optional Tavily / Exa / Firecrawl live discovery backends when their API keys are present, bounded follow-through into up to three authoritative docs/reference/quickstart pages when repo/homepage/docs signals are present, and lightweight web search plus visible-text extraction, including DuckDuckGo abstract/results capture and repo-url follow-through when web hits point to GitHub/GitLab repositories. Tavily and Exa are used as bounded optional discovery adapters ahead of generic web search, Firecrawl is available both as a bounded optional discovery adapter and as the preferred scrape backend for live web-page fetch/extraction when its key is present, and all three remain provider-health-visible rather than silently changing Discovery authority. For non-repo web pages, extraction now also performs bounded same-host authoritative follow-through before shaping facts: up to two linked docs/reference/quickstart pages for `api-doc`/`product-doc` sources and up to one linked abstract/html/supplementary page for `academic-paper` sources (PDF links are intentionally skipped to avoid binary fetch noise), without recursive crawling or cross-host widening. Before web fetch, candidate selection now applies bounded mission-fit/authority ranking, duplicate-noise reduction, and source-type diversity preservation across repo pages, docs/API docs, academic pages, blogs, forums, and news. After first-pass normalization, the orchestrator can run one bounded evidence-gap follow-up acquisition pass (max three follow-up queries, max six follow-up hits) to target missing primary-source, technical, maintenance/freshness, or comparative evidence classes; same-source duplicates in follow-up are quality-ranked so later stronger evidence can replace weaker earlier variants. It will fall back to catalog mode when live discovery/fetch returns no usable evidence.
Live and local acquisition now also tag each extracted fact with bounded extraction fidelity (`direct`, `derived`, or `fallback`). Normalization and scoring penalize fallback-majority evidence so generic snippets and summary-only extraction no longer look like first-class source proof.

Optional provider auth environment variables for live modes:

- `RESEARCH_ENGINE_GITHUB_TOKEN` (fallback: `GITHUB_TOKEN`)
- `RESEARCH_ENGINE_GITLAB_TOKEN` (fallback: `GITLAB_TOKEN`)
- `RESEARCH_ENGINE_TAVILY_API_KEY` (fallback: `TAVILY_API_KEY`) for bounded Tavily search discovery
- `RESEARCH_ENGINE_EXA_API_KEY` (fallback: `EXA_API_KEY`) for bounded Exa search discovery
- `RESEARCH_ENGINE_FIRECRAWL_API_KEY` (fallback: `FIRECRAWL_API_KEY`) for bounded Firecrawl search/scrape

Offline local corpus environment variable:

- `RESEARCH_ENGINE_LOCAL_CORPUS_DIR` (default: `<output-dir>/local-first/corpus`, else `.research/local-corpus` when no output directory is supplied)
- `RESEARCH_ENGINE_LOCAL_TOP_K_PER_QUERY` (default: `2`)
- `RESEARCH_ENGINE_LOCAL_MAX_MATCH_CHARS` (default: `3000`, clamp `400..20000`)
- `RESEARCH_ENGINE_LOCAL_EXTENSIONS` (default: `.md,.txt,.rst,.json,.yaml,.yml`)
- `RESEARCH_ENGINE_LOCAL_STOP_TERMS` (optional comma-separated stopword additions, merged with built-in defaults)
- `RESEARCH_ENGINE_LOCAL_STRICT_NO_FALLBACK` (`true/false`, default: fallback enabled)

Strict API-provider example:

```powershell
$env:PYTHONPATH = "src"
python -m research_engine --output-dir artifacts-api --acquisition-mode api-provider
```

`api-provider` uses the same live GitHub/GitLab/web acquisition path as `live-hybrid`, but does not fall back to the deterministic catalog path when live discovery or fetch returns no usable evidence.

Local-first acquisition example:

```powershell
$env:PYTHONPATH = "src"
$env:RESEARCH_ENGINE_LOCAL_CORPUS_DIR = "C:\\path\\to\\local-corpus"
python -m research_engine --output-dir artifacts-local --acquisition-mode local-first
```

`local-first` scans local corpus files (`.md`, `.txt`, `.rst`, `.json`, `.yaml`, `.yml`) and builds discovery/fetch artifacts from offline sources, then falls back to catalog mode only when no local files or query matches are available. Local ranking blends keyword overlap with lightweight semantic signals (rarity-weighted overlap, phrase/bigram alignment, and sparse-match penalties) to improve top-k result quality without requiring embeddings. Local tokenization now keeps short domain terms such as `api` and `sdk` while filtering common low-signal stopwords, and emits lexical diagnostics (top terms + suggested stop terms) in acquisition/provider notes to support corpus calibration.
When `local-first` diagnostics include suggested stop terms, CLI output prints a ready-to-copy `Suggested RESEARCH_ENGINE_LOCAL_STOP_TERMS:` line.

Missions now carry both a query-planning preset and a trust-policy preset, using the same bounded preset family (`balanced-discovery`, `official-first`, `implementation-scout`, `landscape-survey`) so search posture and trust posture can stay aligned while remaining explicit in `query_plan.json` and the exported source-intelligence packet. Query planning now also adds up to two bounded mission-diversified query variants when query budget allows, appending objective-specific terms without changing required-track/query-type safeguards or routing authority. Known baseline/comparison context is loaded by default from the package data file for the stock mission and can be overridden or omitted per custom mission. Catalog-backed runs now inject richer deterministic repo snapshots (stars, forks, open issues, last push, latest release, and release cadence) so maintenance evidence and freshness scoring stay inspectable even in deterministic mode, and the deterministic source pool now includes the previously researched comparison-anchor systems (`STORM`, `PaperQA2`, `Fathom-DeepResearch`, `GraphRAG`, `LangGraph`, and related signals) instead of only the original baseline projects. Catalog discovery also prioritizes non-baseline and comparison-anchor matches ahead of baseline overlap when mission context is present, so fixed-format packets are less likely to recycle baseline systems as top signals. Live GitHub/GitLab fetch continues adding release and maintenance freshness notes when available. Acquisition modes now include `catalog`, `codex-session`, `local-first`, `live-hybrid` (with catalog fallback), and strict `api-provider` (no catalog fallback). Live provider requests optionally use GitHub/GitLab tokens when present. Live web documents now classify into source types such as `api-doc`, `blog-post`, `forum-thread`, and `news-article`, capture source-profile metadata (author/site/schema and published/modified hints), and apply source-specific shaping profiles so architecture/workflow/integration excerpts stay more relevant to each source category. Normalization still applies a source-type trust policy (`primary` / `secondary` / `tertiary`), candidate dossiers include derived rejection flags with reconsideration triggers, `provider_health.json` now includes explicit `reason_codes` and `status_summary` fields for degraded/fallback diagnosis, `source_intelligence_packet.json` exports a machine-readable handoff packet, and `recommendations.md` now renders the same packet in a fixed sectioned source-intelligence format instead of freeform summary prose.
`dw_discovery_packet.json`, `source_intelligence_packet.json`, and `dw_import_bundle.json` now carry explicit `packet_kind`, `contract_version`, and decision-boundary metadata, and artifact emission validates those contracts before writing files so DW-facing handoff drift fails fast.
The inspection shell also includes bounded client-side controls for filtering and sorting candidate/provider/review-queue tables, plus explicit open-uncertainty rendering sourced from the same packet used by `recommendations.md`.

## Codex Session

`codex-session` is now a bounded two-step handoff mode:

```powershell
$env:PYTHONPATH = "src"
python -m research_engine --output-dir artifacts-session --acquisition-mode codex-session
```

The first run prepares:

- `artifacts-session/codex-session/input/mission.json`
- `artifacts-session/codex-session/input/query_plan.json`
- `artifacts-session/codex-session/input/instructions.md`
- `artifacts-session/codex-session/output/discovery_hits.jsonl`
- `artifacts-session/codex-session/output/source_documents.jsonl`

Fill the two output files with bounded acquisition results, then rerun the same command.
Research Engine will resume normalization, scoring, rejection, and DW packet export from those files.
