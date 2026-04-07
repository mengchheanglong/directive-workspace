# mini-swe-agent Runtime Capability Pressure Runtime Follow-up Record

- Candidate id: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
- Candidate name: `mini-swe-agent Runtime Capability Pressure`
- Follow-up date: `2026-03-24`
- Current decision state: `route_to_runtime_follow_up`
- Origin track: `discovery-engine-handoff`
- Runtime value to operationalize: Runtime operationalization and behavior-preserving transformation. Assess whether a minimal shell-first coding agent can become a reusable callable capability, bounded automation surface, or runtime workflow for the host with clearer reliability and lower scaffolding cost.
- Proposed host: `Directive Workspace standalone host (hosts/standalone-host/)`
- Proposed integration mode: reimplement
- Source-pack allowlist profile: n/a
- Allowed export surfaces:
  - bounded runtime capability
  - host adapter surface
- Excluded baggage:
  - source-specific implementation baggage
  - host-local assumptions from the original source
- Promotion contract path: pending
- Re-entry contract path (if deferred): n/a
- Re-entry preconditions (checklist):
  - Human review confirms the bounded runtime objective.
  - Proof scope stays narrow and reversible.
- Required proof:
  - baseline artifact or metric
  - result artifact or metric
  - behavior-preserving claim
  - rollback path
- Required gates:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- Trial scope limit (if experimenting):
  - Keep this as a follow-up stub only.
  - Do not execute runtime integration from this record alone.
- Risks:
  - Human review still required.
  - Host-specific baggage can leak into runtime implementation if adaptation is skipped.
- Rollback: Revert to the baseline implementation and keep the candidate in follow-up status until proof is stronger.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: Review on next active Directive Workspace operating pass.
- Current status: `pending_review`

Linked handoff:
- `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`


