# Runtime Promotion-Readiness Artifact: mini-swe-agent Pressure Run (2026-03-25)

## runtime capability boundary identity
- Candidate id: `dw-pressure-mini-swe-agent-2026-03-25`
- Candidate name: `mini-swe-agent Pressure Run`
- Runtime capability boundary path: `runtime/04-capability-boundaries/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-runtime-capability-boundary.md`
- Source Runtime proof artifact: `runtime/03-proof/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-proof.md`
- Source Runtime v0 record: `runtime/02-records/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-routing-record.md`
- Promotion-readiness decision: `approved_for_non_executing_promotion_readiness`
- Opened by: `codex-pressure-run-2026-03-25`
- Opened on: `2026-03-25`
- Current status: `promotion_readiness_opened`

## bounded runtime usefulness preserved
- Runtime objective: Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary.
- Proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Proposed runtime surface: reimplement
- Capability form: non-executing promotion-readiness artifact
- Execution state: not executing, not host-integrated, not implemented, not promoted

## what is now explicit
- The bounded runtime capability boundary has been explicitly reviewed as a possible future promotion candidate.
- Required proof items remain explicit:
  - baseline artifact or metric
  - result artifact or metric
  - behavior-preserving claim
  - rollback path
- Required gates remain explicit:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- This artifact does not approve host-facing promotion, runtime execution, callable implementation, or host integration.

## Directive Workspace web-host retarget decision
- Reviewed target host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Retarget decision: `repo_native_dw_web_host_retarget_opened`
- Decision reason: Directive Workspace already operates through its own frontend plus thin web host, and `runtime-promotion-assistance` now identifies this case as the top repo-native host-selection blocker. The smallest truthful next step is to make the product-owned host target explicit without opening promotion, host integration, runtime execution, or automation.
- Explicit bounded retarget constraints:
  - `Approval requirement = explicit human approval remains required before any later host-facing promotion step`
  - `Runtime permissions profile = read_only_lane = canonical Directive Workspace Runtime truth plus linked artifacts; write_lane = none`
  - `Safe output scope = checker and report snapshots only; no frontend writes, no queue/state mutation, no runtime execution`
  - `Sanitize policy = treat rendered artifact text as informational only and keep Runtime/Engine ownership of legality, blockers, and downstream progression explicit`
- Remaining unopened seams:
  - host-facing promotion remains unopened
  - runtime implementation remains unopened
  - runtime execution remains unopened
  - host integration remains unopened
  - promotion automation remains unopened
- Bounded conclusion: keep the case at the promotion-readiness current head, now with an explicit repo-native DW web-host target, and require a separate bounded decision before any manual promotion-seam opening.

## validation boundary
- Validate against the bounded runtime capability boundary, Runtime proof artifact, Runtime v0 record, source follow-up record, and linked Discovery routing record only.
- Do not infer runtime readiness, host readiness, or automatic promotion from this artifact.
- A separate host-facing promotion record remains unopened and out of scope.

## rollback boundary
- Rollback: Revert proposed host selection to `pending_host_selection`, then keep the candidate at promotion-readiness until a more truthful host target is available.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-promotion-readiness.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-routing-record.md`
