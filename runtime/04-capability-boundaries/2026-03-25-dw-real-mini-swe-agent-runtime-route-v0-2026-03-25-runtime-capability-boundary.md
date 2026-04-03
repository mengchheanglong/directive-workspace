# Runtime V0 Runtime Capability Boundary: mini-swe-agent Runtime Route Proof (2026-03-25)

## bounded runtime usefulness being converted
- Convert the approved Runtime proof scope into one bounded runtime capability boundary for Directive Workspace runtime-usefulness conversion.
- Keep the boundary constrained to the approved runtime objective and proposed runtime surface only.
- Do not widen into runtime execution, host integration, callable implementation, orchestration, or promotion.

## reusable capability shape
- Candidate id: `dw-real-mini-swe-agent-runtime-route-v0-2026-03-25`
- Candidate name: `mini-swe-agent Runtime Route Proof`
- Capability form: bounded runtime capability boundary
- Runtime objective: Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary.
- Proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Proposed runtime surface: reimplement
- Execution state: not executing, not host-integrated, not implemented, not promoted

## source inputs
- Runtime proof artifact: `runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Runtime objective: Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary.
- Proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Proposed runtime surface: reimplement

## capability boundary
- Preserve the approved runtime objective only.
- Preserve the bounded proof items:
  - baseline artifact or metric
  - result artifact or metric
  - behavior-preserving claim
  - rollback path
- Preserve the required gates:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- Do not add runtime triggers, host adapters, scheduling, background work, or callable implementation.
- Do not claim promotion readiness, runtime execution, or host integration from this artifact.

## proof and promotion boundary
- Current Runtime proof status: `proof_scope_opened`
- Boundary opening decision: `approved_for_bounded_runtime_capability_boundary`
- Opened by: `codex-runtime-boundary-open-proof`
- Opened on: `2026-03-25`
- Host-facing promotion remains out of scope and unopened.

## rollback boundary
- Rollback: Revert proposed host selection to `pending_host_selection`, remove the bounded manual promotion record and linked DW web-host prep bundle references, then keep the candidate at promotion-readiness until a more truthful host target is available.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md`
- Proof artifact: `runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md`
- Runtime record: `runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
