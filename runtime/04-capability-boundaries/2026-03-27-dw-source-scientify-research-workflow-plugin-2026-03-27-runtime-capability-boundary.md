# Runtime V0 Runtime Capability Boundary: Scientify Literature-Access Tool Bundle (2026-03-27)

## bounded runtime usefulness being converted
- Convert the approved Runtime proof scope into one bounded runtime capability boundary for Directive Workspace runtime-usefulness conversion.
- Keep the boundary constrained to the approved runtime objective and proposed runtime surface only.
- Do not widen into runtime execution, host integration, callable implementation, orchestration, or promotion.

## reusable capability shape
- Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Candidate name: `Scientify Literature-Access Tool Bundle`
- Capability form: bounded runtime capability boundary
- Runtime objective: Reimplement Scientify's 4 literature-access tools (arxiv-search, arxiv-download, openalex-search, unpaywall-download) as Directive-owned callable runtime capability for automated literature discovery and retrieval.
- Proposed host: `pending_host_selection`
- Proposed runtime surface: reimplement
- Execution state: implemented as Directive-owned modules, not executing, not host-integrated, not promoted

## source inputs
- Runtime proof artifact: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Callable stub: `runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts`
- Runtime objective: Reimplement Scientify's 4 literature-access tools (arxiv-search, arxiv-download, openalex-search, unpaywall-download) as Directive-owned callable runtime capability for automated literature discovery and retrieval.
- Proposed host: `pending_host_selection`
- Proposed runtime surface: reimplement

## capability boundary
- Preserve the approved runtime objective only.
- Preserve the bounded proof items:
  - mission-fit rationale recorded
  - routing rationale recorded
  - next bounded action chosen
  - bounded runtime record opened for the approved slice
- Preserve the required gates:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- Do not add runtime triggers, host adapters, scheduling, background work, or callable implementation.
- Do not claim promotion readiness, runtime execution, or host integration from this artifact.

## callable capability surface

### implemented modules
| Tool | Module path | Public function | Input type | Result type |
|------|-----------|----------------|-----------|------------|
| arxiv-search | `runtime/capabilities/literature-access/arxiv-search.ts` | `arxivSearch(input)` | `ArxivSearchInput` | `Promise<ArxivSearchResult>` |
| arxiv-download | `runtime/capabilities/literature-access/arxiv-download.ts` | `arxivDownload(input)` | `ArxivDownloadInput` | `Promise<ArxivDownloadResult>` |
| openalex-search | `runtime/capabilities/literature-access/openalex-search.ts` | `openalexSearch(input)` | `OpenAlexSearchInput` | `Promise<OpenAlexSearchResult>` |
| unpaywall-download | `runtime/capabilities/literature-access/unpaywall-download.ts` | `unpaywallDownload(input)` | `UnpaywallDownloadInput` | `Promise<UnpaywallDownloadResult>` |

- Barrel export: `runtime/capabilities/literature-access/index.ts`
- All 4 functions and their types are exported from the barrel

### accepted proof-backed behavior claims
- arxiv-search: same arXiv API query construction, same XML parsing, same paper object shape, same 300-char abstract truncation, same sort fallback to relevance
- arxiv-download: same source→PDF fallback chain, same 3s rate limit, same directory/file structure, system tar extraction instead of npm tar package
- openalex-search: same OpenAlex API query construction, same polite-pool email, same inverted-index abstract reconstruction, same 429 handling
- unpaywall-download: same DOI lookup→PDF download chain, same OA/non-OA classification, same 100ms rate limit, same filename sanitization

Note: exact byte-identical API responses are not claimed. The claims are about request shape, output shape, and discipline.

### accepted metric improvements over source
- No dependency on `@sinclair/typebox`
- No dependency on OpenClaw plugin registration (`api.registerTool()`)
- No dependency on `tar` npm package (uses system tar)
- Directive-owned error contract (`{ ok: true/false }`) instead of pi-ai `Result` wrapper
- Standalone callable functions instead of tool-factory pattern
- User-Agent updated to `directive-workspace/1.0`

### excluded from this boundary
- Research-pipeline orchestrator and all 12 Scientify skills
- Hooks (cron-skill-inject, inject-skill, research-mode, scientify-cron-autofill, scientify-signature)
- Metabolism and metabolism-init systems
- Knowledge-state system
- github-search, paper-browser, openreview-lookup, scientify-cron, scientify-literature-state, workspace tools
- Runtime execution or host integration
- Promotion or callable activation

## proof and promotion boundary
- Current Runtime proof status: `proof_scope_opened`
- Boundary opening decision: `approved_for_bounded_runtime_capability_boundary`
- Opened by: `directive-lead-implementer`
- Opened on: `2026-03-27`
- Host-facing promotion remains out of scope and unopened.

## rollback boundary
- Rollback: Revert to the baseline implementation and keep the candidate in follow-up status until proof is stronger.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md`
- Proof artifact: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- Runtime record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Callable stub: `runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts`
