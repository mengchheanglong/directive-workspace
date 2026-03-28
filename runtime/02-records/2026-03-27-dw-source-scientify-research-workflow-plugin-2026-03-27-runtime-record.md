# Runtime V0 Record: Scientify Literature-Access Tool Bundle (2026-03-27)

## follow-up review decision
- Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Slice id: `scientify-literature-access-tool-bundle`
- Candidate name: `Scientify Literature-Access Tool Bundle`
- Source follow-up record: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Review decision: `approved_for_bounded_runtime_conversion_record`
- Reviewed by: `directive-lead-implementer`
- Review date: `2026-03-27`
- Current status: `pending_proof_boundary`

## bounded runtime usefulness
- Runtime value to operationalize: Reimplement Scientify's 4 literature-access tools (arxiv-search, arxiv-download, openalex-search, unpaywall-download) as Directive-owned callable runtime capability for automated literature discovery and retrieval.
- Proposed host: `pending_host_selection`
- Proposed integration mode: reimplement
- Reusable capability target surface: `bounded runtime capability`, `callable capability boundary`
- Origin track: `discovery-routing-approval`
- Source decision state: `route_to_runtime` (human override from `hold_in_discovery`)

## slice scope

### included tools
| Tool | Source path | API surface | External dependency |
|------|-----------|-------------|---------------------|
| arxiv-search | `sources/intake/scientify/src/tools/arxiv-search.ts` | query, max_results, sort_by, date_from → paper list | arXiv API (`export.arxiv.org/api/query`) |
| arxiv-download | `sources/intake/scientify/src/tools/arxiv-download.ts` | arxiv_ids, output_dir → downloaded tex/pdf files | arXiv e-print endpoint |
| openalex-search | `sources/intake/scientify/src/tools/openalex-search.ts` | query, max_results, filter, sort → work list | OpenAlex API (`api.openalex.org/works`) |
| unpaywall-download | `sources/intake/scientify/src/tools/unpaywall-download.ts` | doi, output_dir → downloaded OA PDF | Unpaywall API |

### why this bundle
- Each tool is a self-contained TypeScript module with explicit TypeBox schema and clean input/output contract
- No dependency on Scientify orchestrator, plugin infrastructure, hooks, or knowledge-state system
- Direct runtime usefulness: callable literature-access capability for Directive Workspace automated source discovery
- Adaptation path is clear: strip OpenClaw plugin registration, reimplement as standalone callable tools with Directive-owned contracts

### excluded from this slice
- research-pipeline orchestrator and all 12 skills
- hooks (cron-skill-inject, inject-skill, research-mode, scientify-cron-autofill, scientify-signature)
- metabolism and metabolism-init systems
- knowledge-state system
- github-search, paper-browser, openreview-lookup tools (may be considered for future slices)
- scientify-cron, scientify-literature-state, workspace tools

## expected effect
- Convert the approved Runtime follow-up slice into one explicit Directive-owned runtime-capability record for the 4 literature-access tools.
- The adapted tools should be callable independently without Scientify plugin infrastructure.
- Keep the capability bounded to the literature-access tool bundle only.

## adaptation requirements
- Strip OpenClaw plugin registration wrapper (`api.registerTool()` pattern)
- Remove Scientify-specific `readStringParam`/`readNumberParam`/`readArrayParam` helpers (replace with standard input handling)
- Preserve core API interaction logic (arXiv XML parsing, OpenAlex JSON handling, rate limiting, tar extraction)
- Reimplement error handling with Directive-owned patterns
- Define Directive-owned tool contracts (input schema, output schema, error contract)
- Preserve behavior: same external API calls, same response shape, same rate-limit discipline

## proof required before any further Runtime move
- Required proof summary: baseline artifact or metric; result artifact or metric; behavior-preserving claim; rollback path
- Required proof:
  - baseline artifact or metric (source tool behavior documented from Scientify source)
  - result artifact or metric (adapted tool produces equivalent results)
  - behavior-preserving claim (same API calls, same output shape, rate limits preserved)
  - rollback path (revert to source tools or remove adapted tools without downstream impact)
- Required gates:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`

## validation boundary
- Validate against the approved Runtime follow-up record, linked Discovery routing record, and Engine evidence only.
- Do not imply runtime execution, host integration, orchestration, or background automation.
- Keep excluded baggage out of the converted capability boundary:
  - OpenClaw plugin registration infrastructure
  - Scientify-specific hooks and cron infrastructure
  - unadapted source terminology

## rollback boundary
- Rollback: Revert to the baseline implementation and keep the candidate in follow-up status until proof is stronger.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## known risks
- External API dependencies (arXiv, OpenAlex, Unpaywall) may have rate limits, downtime, or API changes.
- Host-specific baggage can leak into runtime implementation if adaptation is skipped.
- Over-scoping risk: do not expand this record to include orchestrator, skills, or hook infrastructure.

## artifact linkage
- Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Linked Engine run: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-1cc5281c.md`
- Next Runtime proof artifact if later approved: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`

## boundary
- This record does not authorize execution.
- This record does not open host integration.
- This record does not approve adaptation of the full Scientify source — only the 4 literature-access tools.
- This record only records that the follow-up has been explicitly reviewed and one bounded slice has been opened into a non-executing Runtime artifact.
