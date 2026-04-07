# Scientify Research Workflow Plugin Runtime Follow-up Record

- Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Candidate name: `Scientify Research Workflow Plugin`
- Follow-up date: `2026-03-27`
- Current decision state: `route_to_runtime` (human override from `hold_in_discovery`)
- Origin track: `discovery-routing-approval`
- Runtime value to operationalize: Reimplement Scientify's literature-access tool bundle (arxiv-search, arxiv-download, openalex-search, unpaywall-download) as Directive-owned callable runtime capability.
- Proposed host: `pending_host_selection`
- Proposed integration mode: reimplement
- Source-pack allowlist profile: n/a
- Allowed export surfaces:
  - bounded runtime capability
  - callable capability boundary
- Excluded baggage:
  - source-specific implementation baggage (OpenClaw plugin registration, scientify-specific hooks, cron infrastructure)
  - unadapted source terminology
- Promotion contract path: pending
- Re-entry contract path (if deferred): n/a
- Re-entry preconditions (checklist):
  - Human review confirms the bounded runtime objective.
  - Proof scope stays narrow and reversible.
- Required proof:
  - mission-fit rationale recorded
  - routing rationale recorded
  - next bounded action chosen
  - bounded runtime record opened for the approved slice
- Required gates:
  - `routing_review` (satisfied by human routing override on 2026-03-27)
  - `human_decision_required` (satisfied by this follow-up review)
- Trial scope limit (if experimenting):
  - One bounded Runtime record for the literature-access tool bundle only.
  - Do not open records for orchestrator, hooks, metabolism, or full skill set from this follow-up alone.
- Risks:
  - Host-specific baggage can leak into runtime implementation if adaptation is skipped.
  - Over-scoping: the 12-skill full pipeline is not the approved slice; only the 4-tool literature-access bundle is approved.
- Rollback: Close the Runtime record, keep the candidate at follow-up, or defer without integrating downstream work.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion
- Current status: `runtime_record_approved`

## Approved bounded Runtime slice

- Slice name: `scientify-literature-access-tool-bundle`
- Slice scope: 4 tools — arxiv-search, arxiv-download, openalex-search, unpaywall-download
- Why this slice: Each tool is a self-contained TypeScript module with explicit TypeBox schema, clean input/output contract, and no dependency on the Scientify orchestrator or plugin infrastructure. They provide direct callable literature-access capability that Directive Workspace can use for automated source discovery.
- What is excluded from this slice: research-pipeline orchestrator, all 12 skills, hooks, metabolism system, knowledge-state system, cron infrastructure, github-search tool, paper-browser tool, openreview-lookup tool
- Adaptation required: Strip OpenClaw plugin registration wrapper. Reimplement as standalone callable tools with Directive-owned contracts and error handling.
- Runtime record path: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`

Linked handoff:
- `discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`



