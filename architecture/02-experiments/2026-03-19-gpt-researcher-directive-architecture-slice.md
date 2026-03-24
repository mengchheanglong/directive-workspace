# gpt-researcher Directive Architecture Slice (2026-03-19)

## lane + scope lock
- Lane: `Directive Architecture (v1)` only.
- Method: static reverse-engineering only.
- Out of scope: runtime install, API/runtime integration, callable skill promotion.

## candidate pin
- Candidate path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher`
- `git rev-parse HEAD`: `7c321744ce336949949b1e95b4652e2d455a33f9`
- `git describe --tags --always --dirty`: `v3.4.3-3-g7c321744`
- `git status --porcelain`: clean (no output)

## bounded proof
- Timebox: 60 minutes.
- Success criteria:
  1. Extract evidence/citation/report contracts from source modules.
  2. Capture quality/confidence signals and partial/failure behavior.
  3. Map to Directive artifacts with required fields, validation rules, and fallback policy.

## static extraction evidence set
- Core modules analyzed:
  - `gpt_researcher/skills/researcher.py`
  - `gpt_researcher/skills/deep_research.py`
  - `gpt_researcher/skills/writer.py`
  - `gpt_researcher/actions/report_generation.py`
  - `gpt_researcher/actions/markdown_processing.py`
  - `gpt_researcher/scraper/scraper.py`
  - `backend/report_type/detailed_report/detailed_report.py`
  - `backend/server/app.py`
  - `gpt_researcher/prompts.py`

## extracted contracts (evidence/citation/report/quality/failure)

| Contract area | Extracted shape / behavior | Evidence |
|---|---|---|
| Evidence object shape (raw source unit) | Scraper emits list entries with `{url, raw_content, image_urls, title}`; entries with `raw_content is None` are dropped before returning. | `gpt_researcher/scraper/scraper.py:71-72,133-139,160-165` |
| Evidence object shape (MCP context unit) | MCP context entries normalized to `{content, url, title, query, source_type="mcp"}`. | `gpt_researcher/skills/researcher.py:419-425` |
| Citation/reference structure (URL list) | References appended as markdown section: `## References` + dedup URL bullets from `visited_urls`. | `gpt_researcher/actions/markdown_processing.py:94-109` |
| Citation/reference structure (learning map) | Deep-research learning extraction returns `citations` map keyed by learning text: `{"learning_text": "source_url"}`. | `gpt_researcher/skills/deep_research.py:167-197,355-360,397-403` |
| Report output contract (generation path) | Report generator passes `context`, `report_type`, `report_source`, `tone`, config, and optional images into `generate_report`; returns markdown string report. | `gpt_researcher/skills/writer.py:96-114`, `gpt_researcher/actions/report_generation.py:209-309` |
| Report assembly contract (detailed mode) | Final detailed report is assembled as `introduction + TOC + body + conclusion_with_references`. | `backend/report_type/detailed_report/detailed_report.py:181-186` |
| Report output metadata contract (API) | API response carries `research_information`: `{source_urls, research_costs, visited_urls, research_images}` plus `report`, `docx_path`, `pdf_path`. | `backend/server/app.py:293-305` |
| Quality/confidence fields | No explicit top-level `confidence` field for report outputs. Quality signals are implicit: source curation policy (relevance/credibility/currency/objectivity/quantitative value), similarity-threshold filtering, optional tool relevance score. | `gpt_researcher/prompts.py:315-345`, `gpt_researcher/context/compression.py:113-121`, `gpt_researcher/mcp/tool_selector.py:103-112` |
| Failure / partial-result behavior | Multiple graceful-degradation paths: intro/conclusion return `""` on exception; report generation retries alternate prompt shape; sub-query errors return `""`; web-search errors return `[]`; deep-query failures return `None` then filtered; add_references returns original report on exception. | `gpt_researcher/actions/report_generation.py:58-60,110-112,290-307`, `gpt_researcher/skills/researcher.py:357-365,569-578`, `gpt_researcher/skills/deep_research.py:289-300`, `gpt_researcher/actions/markdown_processing.py:110-112` |

## Directive artifact mapping proposal

### 1) AnalysisEvidenceArtifact
- Purpose:
  - Persist normalized evidence units used to build analysis/report context.
- Required fields:
  - `capability_id` (string)
  - `query` (string)
  - `evidence_items` (array of objects)
  - `evidence_items[].content` (string, non-empty)
  - `evidence_items[].url` (string, optional)
  - `evidence_items[].title` (string, optional)
  - `evidence_items[].source_type` (`web` | `mcp` | `local`)
  - `collection_status` (`complete` | `partial`)
  - `errors` (array of strings)
- Validation rules:
  - At least one `evidence_items[].content` entry for `complete`.
  - Dedupe by normalized `(url, title, content_hash)`.
  - Enforce per-item minimum content length guard (align with scraper's short-content drop behavior).
- Fallback policy:
  - If source retrieval fails, keep surviving entries and set `collection_status=partial`.
  - Preserve `errors[]` from failed sub-queries instead of failing the whole artifact.

### 2) CitationSetArtifact
- Purpose:
  - Persist citations/references tied to evidence and report outputs.
- Required fields:
  - `capability_id` (string)
  - `citations` (array of objects)
  - `citations[].url` (string)
  - `citations[].label` (string)
  - `citations[].origin` (`visited_url` | `learning_map`)
  - `reference_section_markdown` (string)
  - `coverage_status` (`full` | `partial`)
- Validation rules:
  - URL format must be parseable (`http/https` preferred).
  - Deduplicate citation URLs.
  - `reference_section_markdown` must contain `## References`.
- Fallback policy:
  - If learning->citation map is missing/noisy, synthesize from deduped `visited_urls`.
  - Mark `coverage_status=partial` when in-text mapping cannot be guaranteed.

### 3) EvaluationSupportArtifact
- Purpose:
  - Capture measurable support metadata for evaluation/proof decisions.
- Required fields:
  - `capability_id` (string)
  - `research_costs` (number >= 0)
  - `visited_urls` (array of strings)
  - `source_urls` (array of strings)
  - `quality_signals` (object)
  - `quality_signals.curation_enabled` (boolean)
  - `quality_signals.similarity_threshold` (number | string)
  - `quality_signals.relevance_score_present` (boolean)
  - `artifact_status` (`complete` | `partial`)
- Validation rules:
  - `research_costs` numeric and non-negative.
  - Arrays default to empty arrays, not null.
  - If no explicit confidence metric exists, `relevance_score_present=false` is valid.
- Fallback policy:
  - Missing metrics default to safe values (`0`/`[]`) with `artifact_status=partial`.
  - No hard failure when explicit confidence score is absent.

## excluded baggage
- Runtime install/execution path (`uvicorn`, frontend stack, API key plumbing).
- Full multi-agent/deep runtime orchestration and websocket transport mechanics.
- Retriever/provider dependency graph as runtime truth.
- Any Mission Control callable integration or API surface promotion from this slice.

## risk + rollback
- Risk:
  - Overfitting Directive artifacts to gpt-researcher-specific markdown and prompt conventions.
  - Misinterpreting implicit quality signals as hard confidence scores.
- Mitigation:
  - Keep contracts source-agnostic and treat confidence as optional unless explicitly emitted.
  - Use `partial` artifact states rather than hard-fail on noisy/missing fields.
- Rollback:
  - Delete this experiment artifact and queue update notes.
  - No runtime rollback needed (no runtime code changes).

## slice decision recommendation
- Recommended decision: `adopt_planned_next` (pattern-only).
- Why:
  - Strong reusable evidence/citation/report contract patterns.
  - Explicit graceful-degradation behavior compatible with Directive Architecture reliability goals.
  - Low integration risk when constrained to schema/contracts.
