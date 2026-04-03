# Implementation Target: Engine Stale Current-Head Architecture Downstream Legality Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Architecture Downstream Legality Hardening
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned stale current-head legality downgrade for downstream Architecture artifacts.
- Objective retained: replace stale artifact-local next-step wording with an explicit currentHead redirect once Architecture currentHead has advanced past the inspected downstream artifact.

## scope (bounded)
- Limit the implementation to `shared/lib/dw-state/shared.ts` and `scripts/check-directive-workspace-composition.ts`.
- Downgrade artifact-local next-step wording only for `architecture_adoption`, `architecture_implementation_target`, `architecture_implementation_result`, and `architecture_retained` when `currentHead` already points elsewhere.
- Keep case-level `nextLegalStep` unchanged.
- Do not broaden into handoff, bounded-start, post-consumption evaluation, generic stale-status cleanup, broken-link scanning, or queue redesign.

## validation approach
- `stale_architecture_downstream_next_steps_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm stale Architecture adoption, implementation-target, implementation-result, and retained focuses now point to `currentHead`.
- Confirm the live case-level `nextLegalStep` remains unchanged.
- Confirm `npm run check` passes.

## rollback boundary
- Revert the stale-current-head downgrade and composition assertions, then remove this DEEP case chain if later truth work needs a different artifact-local wording policy.
