# Runtime V0 Proof Artifact: mini-swe-agent Runtime Capability Pressure (2026-03-24)

## runtime record identity
- Candidate id: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
- Candidate name: `mini-swe-agent Runtime Capability Pressure`
- Runtime v0 record path: `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- Source follow-up record path: `runtime/follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md`
- Proof opening decision: `approved_for_bounded_proof_artifact`
- Opened by: `directive-lead-runtime-review`
- Opened on: `2026-03-24`
- Current status: `proof_scope_opened`

## source inputs required
- Runtime v0 record: `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Runtime objective: Runtime operationalization and behavior-preserving transformation. Assess whether a minimal shell-first coding agent can become a reusable callable capability, bounded automation surface, or runtime workflow for the host with clearer reliability and lower scaffolding cost.
- Proposed host: `Directive Workspace standalone host (hosts/standalone-host/)`
- Proposed runtime surface: reimplement

## what must be proven before bounded runtime conversion
  - baseline artifact or metric
  - result artifact or metric
  - behavior-preserving claim
  - rollback path

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
  - source-specific implementation baggage
  - host-local assumptions from the original source

## proof opening boundary
- Source record status: `pending_proof_boundary`
- Next decision point from Runtime v0 record: Approve one bounded Runtime proof artifact or leave the record pending.
- This artifact opens bounded proof review only. It does not authorize execution, host integration, or promotion.

## rollback boundary
- Rollback: Revert to the baseline implementation and keep the candidate in follow-up status until proof is stronger.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: Review on next active Directive Workspace operating pass.

## artifact linkage
- Runtime proof artifact: `runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
