# Runtime Promotion-Readiness Artifact: mini-swe-agent Runtime Capability Pressure (2026-03-24)

## runtime capability boundary identity
- Candidate id: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
- Candidate name: `mini-swe-agent Runtime Capability Pressure`
- Runtime capability boundary path: `runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md`
- Source Runtime proof artifact: `runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md`
- Source Runtime v0 record: `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- Source Runtime follow-up record: `runtime/00-follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Promotion-readiness decision: `approved_for_non_executing_promotion_readiness`
- Opened by: `directive-lead-runtime-review`
- Opened on: `2026-03-24`
- Current status: `promotion_readiness_opened`

## bounded runtime usefulness preserved
- Runtime objective: Runtime operationalization and behavior-preserving transformation. Assess whether a minimal shell-first coding agent can become a reusable callable capability, bounded automation surface, or runtime workflow for the host with clearer reliability and lower scaffolding cost.
- Proposed host: `Directive Workspace standalone host (hosts/standalone-host/)`
- Proposed runtime surface: reimplement
- Capability form: non-executing promotion-readiness artifact
- Execution state: bounded standalone-host descriptor implementation opened, not executing, not host-integrated, not promoted

## what is now explicit
- The bounded runtime capability boundary has been explicitly reviewed as a possible future promotion candidate.
- Host selection is now explicit at the current bounded stop: `Directive Workspace standalone host (hosts/standalone-host/)` is the truthful first host for this Runtime case because the retained Runtime value is a local/shareable callable boundary for a minimal shell-first coding-agent capability rather than a frontend-first review seam.
- Required proof items remain explicit:
  - baseline artifact or metric
  - result artifact or metric
  - behavior-preserving claim
  - rollback path
- Required gates remain explicit:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- This artifact still does not approve registry acceptance, runtime execution, host integration, or promotion automation.

## callable-boundary clarification
- Callable-boundary decision: `runtime_callable_boundary_explicit`
- Linked callable stub: `runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts`
- Why this callable boundary is truthful:
  - the case objective already names reusable callable capability as the retained Runtime value
  - Runtime promotion assistance stopped only because the callable boundary was implicit
  - the callable stub remains non-executing, non-promoting, and read-only
- Focused callable checker:
  - `npm run check:directive-live-mini-swe-agent-runtime-callable`

## standalone-host pre-promotion implementation slice
- Slice decision: `standalone_host_pre_promotion_slice_explicit`
- Slice artifact: `runtime/00-follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-pre-promotion-implementation-slice-01.md`
- Opened runtime-implementation slice:
  - `runtime/00-follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01.md`
- Implementation result:
  - `runtime/00-follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01-result.md`
- Why this slice is the correct first host boundary:
  - the retained Runtime value is a local/shareable callable boundary rather than a frontend review seam
  - the standalone host already exists as Directive Workspace's bounded local/shareable Runtime host surface without Mission Control
  - the slice stays non-executing by limiting host ownership to one read-only descriptor surface for the approved callable boundary
- Runtime/Engine remain the owners of:
  - lifecycle truth
  - blocker judgment
  - callable legality
  - promotion legality
  - execution legality
  - downstream Runtime progression
- Standalone-host ownership in this slice:
  - one local/shareable descriptor surface for the live mini-swe callable boundary through the existing standalone-host CLI/read-model layer
  - visibility of candidate identity, runtime objective, execution state, blockers, linked artifacts, and approved callable boundary only
- Remaining blockers after making the host explicit:
  - none at the promotion-readiness layer once the bounded manual promotion record is linked
- Bounded conclusion: keep the case at the first manual promotion-record stop and do not open registry acceptance, host integration, runtime execution, callable rollout, or automation.

## bounded manual promotion chain
- Host-facing promotion record: `runtime/07-promotion-records/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-record.md`
- Promotion decision state: `manual_live_mini_swe_agent_standalone_promotion_record_opened`
- Why this bounded promotion step is now legal:
  - pre-host promotion-record prerequisites were explicitly proved
  - the Runtime-owned callable boundary is explicit and checked
  - the canonical promotion specification exists and is checked
  - the standalone host consumes the capability through a bounded adapter path only
- This bounded promotion step does not approve:
  - registry acceptance
  - host integration
  - runtime execution
  - promotion automation

## validation boundary
- Validate against the bounded runtime capability boundary, Runtime proof artifact, Runtime v0 record, source follow-up record, and linked Discovery routing record only.
- Validate the host choice against the standalone-host boundary only: `hosts/standalone-host/README.md` and `hosts/standalone-host/EXPANSION_DIRECTION.md` establish the standalone host as Directive Workspace's bounded local/shareable Runtime host surface without Mission Control.
- Do not infer runtime readiness, host readiness, or automatic promotion from this artifact.
- Registry acceptance remains unopened and out of scope.

## rollback boundary
- Rollback: Revert proposed host selection to `pending_host_selection`, remove the callable stub, remove the standalone-host pre-promotion slice, implementation slice, and implementation-result references, and keep the candidate at promotion-readiness until a more truthful boundary is available.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md`
- Host-facing promotion record: `runtime/07-promotion-records/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-record.md`
- Implementation-result artifact: `runtime/00-follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01-result.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- Source Runtime follow-up record: `runtime/00-follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Linked callable stub: `runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts`
