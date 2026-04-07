# mini-swe-agent Runtime Route Proof Runtime Follow-up Record

- Candidate id: `dw-real-mini-swe-agent-runtime-route-v0-2026-03-25`
- Candidate name: `mini-swe-agent Runtime Route Proof`
- Follow-up date: `2026-03-25`
- Current decision state: `route_to_runtime_follow_up`
- Origin track: `discovery-routing-approval`
- Runtime value to operationalize: Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary.
- Proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Proposed integration mode: reimplement
- Source-pack allowlist profile: n/a
- Allowed export surfaces:
  - bounded runtime capability
  - callable capability boundary
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
- Rollback: Revert proposed host selection to `pending_host_selection`, remove the bounded manual promotion record and linked DW web-host prep bundle references, then keep the candidate at promotion-readiness until a more truthful host target is available.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion
- Current status: `pending_review`

Linked handoff:
- `discovery/03-routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`


