# Implementation Target: Engine Stale Current-Head Runtime Approval Legality Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Runtime Approval Legality Hardening
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned stale current-head legality downgrade for Runtime approval-boundary artifacts.
- Objective retained: replace stale artifact-local approval wording with an explicit currentHead redirect once Runtime currentHead has advanced past the inspected approval boundary.

## scope (bounded)
- Limit the implementation to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Downgrade artifact-local next-step wording only for `runtime_follow_up`, `runtime_record_follow_up_review`, `runtime_proof_follow_up_review`, and `runtime_runtime_capability_boundary` when `currentHead` already points elsewhere.
- Keep case-level `nextLegalStep` unchanged.
- Do not broaden into generic stale-status cleanup, broken-link scanning, queue redesign, or non-Runtime artifact families.

## validation approach
- `stale_runtime_artifact_local_next_step_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm stale Runtime follow-up, record, proof, and capability-boundary focuses now point to `currentHead`.
- Confirm a live pending Runtime follow-up still keeps its ordinary artifact-local approval step.
- Confirm `npm run check` passes.

## rollback boundary
- Revert the stale-current-head downgrade and composition assertions, then remove this DEEP case chain if later truth work needs a different artifact-local wording policy.
