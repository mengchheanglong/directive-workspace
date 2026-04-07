# Runtime V0 Proof Artifact: Scientify Literature-Access Tool Bundle (2026-03-27)

## runtime record identity
- Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Candidate name: `Scientify Literature-Access Tool Bundle`
- Runtime v0 record path: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source follow-up record path: `runtime/00-follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Proof opening decision: `approved_for_bounded_proof_artifact`
- Opened by: `directive-lead-implementer`
- Opened on: `2026-03-27`
- Current status: `proof_scope_opened`

## source inputs required
- Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/00-follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Runtime objective: Reimplement Scientify's 4 literature-access tools (arxiv-search, arxiv-download, openalex-search, unpaywall-download) as Directive-owned callable runtime capability for automated literature discovery and retrieval.
- Proposed host: `pending_host_selection`
- Proposed runtime surface: reimplement

## what must be proven before bounded runtime conversion
  - mission-fit rationale recorded
  - routing rationale recorded
  - next bounded action chosen
  - bounded runtime record opened for the approved slice

## expected outputs
- One bounded Runtime proof artifact that keeps the runtime-usefulness conversion scope inspectable and non-executing.
- One explicit proof boundary that preserves the approved Runtime record objective, required gates, and rollback boundary.
- No runtime execution, no host integration, no callable implementation, and no promotion record creation from this step.

## validation method
- Artifact inspection only.
- Confirm the Runtime v0 record and source follow-up record describe the same bounded runtime objective and reversible boundary.
- Confirm the required proof items and gates remain explicit and do not require hidden runtime context.
- Reject proof readiness if host integration, execution, or orchestration would need to be inferred from outside the existing Runtime artifacts.

## minimal success criteria
- The runtime objective is explicit and remains bounded to reusable runtime usefulness conversion.
- Required proof items are explicit and reviewable.
- Required gates are explicit and bounded:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- Rollback remains explicit and returns cleanly to the Runtime v0 record and follow-up record.
- Excluded baggage remains outside the proof boundary:
  - source-specific implementation baggage (OpenClaw plugin registration, scientify-specific hooks, cron infrastructure)
  - unadapted source terminology

## slice-specific proof boundary

### scope
This proof covers exactly 4 tools from the Scientify source, reimplemented as Directive-owned callable runtime capability:

| Tool | Source path | External API |
|------|-----------|-------------|
| arxiv-search | `sources/intake/scientify/src/tools/arxiv-search.ts` | `export.arxiv.org/api/query` |
| arxiv-download | `sources/intake/scientify/src/tools/arxiv-download.ts` | `arxiv.org/src/{id}`, `arxiv.org/pdf/{id}.pdf` |
| openalex-search | `sources/intake/scientify/src/tools/openalex-search.ts` | `api.openalex.org/works` |
| unpaywall-download | `sources/intake/scientify/src/tools/unpaywall-download.ts` | `api.unpaywall.org/v2/{doi}` |

### baseline behavior (from source)

**arxiv-search:**
- Input: query (required), max_results (1-50, default 10), sort_by (relevance/lastUpdatedDate/submittedDate), date_from (YYYY-MM-DD)
- Output: `{ query, total, papers: [{ title, authors, abstract (≤300 chars), arxiv_id, pdf_url, published, categories }] }`
- Error handling: network_error or api_error result; invalid sort silently defaults to relevance
- Rate limit: none (single request per call)
- Side effects: none (read-only search)

**arxiv-download:**
- Input: arxiv_ids (required string[]), output_dir (default 'papers')
- Output: `{ output_dir, total, successful, failed, downloads: [{ arxiv_id, success, format (tex|pdf), path, files, error?, fallback_reason? }] }`
- Error handling: tex source download fails → fallback to PDF; PDF fails → per-item failure
- Rate limit: 3000ms delay between requests (arXiv recommendation)
- Side effects: creates directories, writes tex/pdf files, deletes temp tar.gz after extraction
- Dependencies: `tar` npm package for archive extraction

**openalex-search:**
- Input: query (required), max_results (1-50, default 15), filter (OpenAlex syntax), sort (cited_by_count/publication_date/relevance_score)
- Output: `{ query, total_count, returned, works: [{ id, title, doi, year, date, type, authors (≤5), venue, cited_by, is_open_access, oa_url, abstract_preview (≤500 chars) }] }`
- Error handling: network_error, rate_limited (HTTP 429), or api_error result; invalid sort defaults to relevance_score
- Rate limit: polite pool via mailto parameter (research@openclaw.ai); no client-side delay; explicit 429 detection
- Side effects: none (read-only search)

**unpaywall-download:**
- Input: dois (required string[], max 20), output_dir (default 'papers')
- Output: `{ total, success, not_oa, failed, output_dir, results: [{ doi, status (success|not_oa|no_pdf_url|download_failed|api_error), message, file_path?, title? }] }`
- Error handling: per-DOI graceful skip; non-OA papers classified separately from failures; content-type validation for PDFs
- Rate limit: 100ms delay between DOI lookups
- Side effects: creates directories, writes PDF files with sanitized filenames

### result behavior (Directive-owned reimplementation must demonstrate)

For each tool, the Directive-owned reimplementation must:
1. Accept the same input parameters (schema may use Directive-owned type definitions instead of TypeBox)
2. Make equivalent API calls to the same external endpoints
3. Return equivalent output shapes (field names and types preserved)
4. Preserve error handling semantics (same error classification, same fallback chains)
5. Preserve rate-limit discipline (same or stricter delays)
6. Be callable independently without OpenClaw plugin infrastructure

### behavior-preserving claim (per tool)

| Tool | Claim |
|------|-------|
| arxiv-search | Same arXiv API query construction, same XML parsing, same paper object shape, same abstract truncation at 300 chars, same sort fallback |
| arxiv-download | Same source→PDF fallback chain, same 3s rate limit, same directory/file structure, same tar extraction logic |
| openalex-search | Same OpenAlex API query construction, same polite-pool email, same abstract reconstruction from inverted index, same 429 handling |
| unpaywall-download | Same DOI lookup→PDF download chain, same OA/non-OA classification, same 100ms rate limit, same filename sanitization |

Note: exact byte-identical API responses are not claimed. Third-party API responses may vary by time, availability, and rate-limit state. The claim is about request shape, output shape, and discipline — not about specific result content.

### metric-improvement-or-equivalent-value claim

- Equivalent value: same callable functionality without plugin overhead
- Improvements available through reimplementation:
  - No dependency on OpenClaw plugin registration (`api.registerTool()`)
  - No dependency on `@sinclair/typebox` (can use Directive-owned schema validation)
  - Directive-owned error contract instead of source-specific `Result` wrapper
  - Cleaner module boundaries (each tool is a standalone import)
  - Configurable polite-pool email (currently hardcoded to `research@openclaw.ai`)
- Not claiming: performance improvement, new features, additional API coverage

### runtime boundary review must confirm

1. Each reimplemented tool is callable independently without Scientify plugin infrastructure
2. No OpenClaw plugin registration leakage (`api.registerTool`, `api.registerCommand`, hooks)
3. No unadapted source terminology in public interface (no Chinese comments, no Scientify-specific naming)
4. Rate-limit and error discipline preserved or improved (not weakened)
5. File I/O tools (arxiv-download, unpaywall-download) respect specified output directories without side effects elsewhere
6. No dependency on excluded Scientify components (orchestrator, skills, hooks, metabolism, knowledge-state)

### excluded from this proof

- Research-pipeline orchestrator and all 12 skills
- Hooks (cron-skill-inject, inject-skill, research-mode, scientify-cron-autofill, scientify-signature)
- Metabolism and metabolism-init systems
- Knowledge-state system
- github-search, paper-browser, openreview-lookup tools
- scientify-cron, scientify-literature-state, workspace tools
- Runtime execution or host integration
- Promotion or callable activation

## proof opening boundary
- Source record status: `pending_proof_boundary`
- Next decision point from Runtime v0 record: Approve one bounded Runtime proof artifact or leave the record pending.
- This artifact opens bounded proof review only. It does not authorize execution, host integration, or promotion.

## rollback boundary
- Rollback: Revert to the baseline implementation and keep the candidate in follow-up status until proof is stronger.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Runtime proof artifact: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/00-follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
