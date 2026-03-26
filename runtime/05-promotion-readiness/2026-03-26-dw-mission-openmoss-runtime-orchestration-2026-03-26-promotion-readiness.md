# Runtime Promotion-Readiness Artifact: OpenMOSS Runtime Orchestration Surface (2026-03-26)

## runtime capability boundary identity
- Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
- Candidate name: `OpenMOSS Runtime Orchestration Surface`
- Runtime capability boundary path: `runtime/04-capability-boundaries/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-capability-boundary.md`
- Source Runtime proof artifact: `runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md`
- Source Runtime v0 record: `runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-routing-record.md`
- Promotion-readiness decision: `approved_for_non_executing_promotion_readiness`
- Opened by: `directive-lead-implementer`
- Opened on: `2026-03-26`
- Current status: `promotion_readiness_opened`

## bounded runtime usefulness preserved
- Runtime objective: Open a bounded Runtime follow-up and only involve host code through the engine adapter boundary.
- Proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Proposed runtime surface: reimplement
- Capability form: non-executing promotion-readiness artifact
- Execution state: not executing, not host-integrated, not implemented, not promoted

## what is now explicit
- The bounded runtime capability boundary has been explicitly reviewed as a possible future promotion candidate.
- Host selection is now explicit at the current bounded stop: `Directive Workspace web host (frontend/ + hosts/web-host/)` is the truthful target host for this current product-facing Runtime seam because Directive Workspace is its own application and already operates through its own frontend plus thin web host, while Mission Control remains outside the active frontend boundary for this step.
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

## host-facing promotion review decision
- Reviewed target host: `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Reviewed decision: `host_facing_promotion_remains_unopened`
- Decision reason: Runtime doctrine creates a promotion record only when host activation or host-owned integration is actually being proposed. That threshold is not met yet for OpenMOSS.
- Evidence already satisfied:
  - the non-executing Runtime record, proof artifact, capability boundary, and promotion-readiness artifact all resolve cleanly
  - the target host is now explicit: `Directive Workspace web host (frontend/ + hosts/web-host/)`
  - the candidate remains bounded and non-executing
- Remaining blockers:
  - `runtime_implementation_unopened`
  - `host_facing_promotion_unopened`
- Missing host-facing promotion inputs:
  - concrete host-owned implementation slice
  - compile contract artifact or equivalent host-owned integration artifact
  - runtime permissions profile for the proposed host-facing slice
  - safe output scope for a host-facing promotion contract
  - quality gate profile and primary host checker selection for a real promotion record
- Bounded conclusion: keep the case at `promotion_readiness_opened`, with `Directive Workspace web host (frontend/ + hosts/web-host/)` recorded as the proposed host, and do not open a host-facing promotion record yet.

## Directive Workspace frontend seam decision
- Reviewed frontend surface: `Directive Workspace frontend app (frontend/) + thin web host (hosts/web-host/)`
- Frontend capability decision: `bounded_dw_frontend_operator_seam_review`
- Why this seam is truthful now:
  - Directive Workspace is its own application and already has a product-owned lightweight frontend surface.
  - The Runtime case already exposes stable non-executing state through linked artifacts and the shared state resolver.
  - The existing Directive Workspace frontend/web-host already supports Runtime artifact navigation and bounded action opening on earlier Runtime stages without moving ownership out of Runtime/Engine.
  - At the current OpenMOSS stage, the truthful product capability is operator-facing seam review: inspect the current Runtime head, see blockers and next-step truth, and navigate the linked Runtime chain without implying downstream seams are open.
- Runtime ownership remains:
  - Runtime follow-up, record, proof, runtime capability boundary, and promotion-readiness artifacts
  - blocker judgment and next-step discipline
  - any future host-facing promotion, implementation, or execution work
- Directive Workspace frontend exposes:
  - candidate identity and runtime objective
  - proposed runtime surface
  - execution state
  - proposed host as reported state, not as the frontend host
  - promotion-readiness blockers
  - linked Runtime artifact paths and current next-legal-step wording
- Smallest truthful frontend capability:
  - one OpenMOSS operator-facing Runtime seam review surface in the Directive Workspace frontend/web-host pair
  - this surface may include status display, blocker display, linked artifact navigation, and explicit decision-support wording around why host-facing promotion remains unopened
  - this surface must not expose execution controls or pretend a later Runtime seam is already approved
- Out of scope from this seam:
  - runtime execution controls
  - host integration rollout
  - callable implementation buildout
  - Mission Control dashboard or frontend work
  - automatic advancement from frontend inspection into downstream Runtime stages

## validation boundary
- Validate against the bounded runtime capability boundary, Runtime proof artifact, Runtime v0 record, source follow-up record, and linked Discovery routing record only.
- Validate the host choice against the current product/frontend boundary only: Directive Workspace is its own application, and its frontend plus thin web host are the active product surface for this phase.
- Validate the frontend seam against the existing Directive Workspace frontend/web-host boundary only; do not treat Mission Control as the active frontend surface for this step.
- Do not infer runtime readiness, host readiness, or automatic promotion from this artifact.
- A separate host-facing promotion record remains unopened and out of scope.

## rollback boundary
- Rollback: Revert proposed host selection to `pending_host_selection`, then keep the candidate at promotion-readiness until a more truthful host target is available.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-routing-record.md`
