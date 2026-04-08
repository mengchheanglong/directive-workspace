# Research Engine

Research Engine is a Discovery-owned Python package inside Directive Workspace.

It is responsible for bounded source intelligence:

- finding candidate external systems and sources
- gathering inspectable evidence
- normalizing and scoring that evidence
- exporting Discovery-facing packets for the canonical Directive Workspace front door

Research Engine stops at Discovery handoff. It does not decide Runtime or Architecture adoption, replace Directive Workspace routing judgment, or execute imported Runtime capabilities.

## Quick Start

Read:

1. [`README.md`](./README.md)
2. [`docs/research-engine-dw-alignment.md`](./docs/research-engine-dw-alignment.md)
3. [`docs/supporting-doctrine-discovery-research-pipeline.md`](./docs/supporting-doctrine-discovery-research-pipeline.md)

Run package-local tests:

```powershell
$env:PYTHONPATH = "src"
python -m unittest discover -s tests
```

Run a standard bounded pass:

```powershell
$env:PYTHONPATH = "src"
python -m research_engine --output-dir artifacts --acquisition-mode catalog
```

Run repo-root integration checks only when you need to validate Directive Workspace consumption:

```powershell
npm run check
```

## Package Layout

- [`docs/`](./docs/) - design notes and alignment documents
- [`schemas/`](./schemas/) - exported packet and manifest contracts
- [`src/research_engine/`](./src/research_engine/) - package implementation
- [`tests/`](./tests/) - package-local unit and smoke coverage
- [`.env.example`](./.env.example) - optional provider environment template

## Acquisition Modes

- `catalog` - deterministic reference run from the packaged source pool
- `live-hybrid` - bounded live acquisition with catalog fallback
- `api-provider` - bounded live acquisition without catalog fallback
- `local-first` - offline local corpus acquisition with bounded fallback behavior
- `codex-session` - two-step bounded session handoff using workspace-visible input/output files

## Artifacts

A run writes artifact-first outputs such as:

- `research_record.json`
- `query_plan.json`
- `provider_health.json`
- `discovery_hits.jsonl`
- `evidence_bundle.jsonl`
- `candidate_dossiers.json`
- `rejections.json`
- `dw_discovery_packet.json`
- `source_intelligence_packet.json`
- `dw_import_bundle.json`
- `inspection.html`
- `recommendations.md`

Directive Workspace consumes the Discovery handoff surfaces:

- `dw_discovery_packet.json`
- `source_intelligence_packet.json`
- `dw_import_bundle.json`

The remaining artifacts are inspection support for Discovery review.

## Environment

For live-provider runs, copy `.env.example` to `.env` and set only the providers you want to enable. The CLI auto-loads `discovery/research-engine/.env` when run from this package directory.

Optional live-provider variables:

- `RESEARCH_ENGINE_GITHUB_TOKEN` or `GITHUB_TOKEN`
- `RESEARCH_ENGINE_GITLAB_TOKEN` or `GITLAB_TOKEN`
- `RESEARCH_ENGINE_TAVILY_API_KEY` or `TAVILY_API_KEY`
- `RESEARCH_ENGINE_EXA_API_KEY` or `EXA_API_KEY`
- `RESEARCH_ENGINE_FIRECRAWL_API_KEY` or `FIRECRAWL_API_KEY`

Optional local-first variables:

- `RESEARCH_ENGINE_LOCAL_CORPUS_DIR`
- `RESEARCH_ENGINE_LOCAL_TOP_K_PER_QUERY`
- `RESEARCH_ENGINE_LOCAL_MAX_MATCH_CHARS`
- `RESEARCH_ENGINE_LOCAL_EXTENSIONS`
- `RESEARCH_ENGINE_LOCAL_STOP_TERMS`
- `RESEARCH_ENGINE_LOCAL_STRICT_NO_FALLBACK`

## Boundaries

Research Engine is:

- Discovery-owned
- artifact-first
- bounded and inspectable
- focused on source intelligence and Discovery handoff quality

Research Engine is not:

- a general chat agent
- a Runtime execution surface
- an Architecture decision authority
- a replacement for the canonical Directive Workspace front door
