# Implementation Target: Engine Discovery Required-Next-Artifact Legality Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28`
- Candidate name: Engine Discovery Required-Next-Artifact Legality Hardening
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned Discovery route legality-validation slice.
- Objective retained: block approval-style next steps when a Discovery route's concrete required next artifact is missing and no downstream stub satisfies that requirement.

## scope (bounded)
- Limit the implementation to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Add one Discovery-route inconsistency rule for missing concrete required next artifacts with no downstream stub.
- Add one staged composition check that reproduces the false-legal route and proves it is now blocked.
- Do not broaden into queue lifecycle redesign, stale-status repair, generic missing-artifact blocking, or broken-link scanning.

## validation approach
- `missing_required_next_artifact_blocks_advancement`
- `legality_slice_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm the staged route now resolves as blocked when its concrete required next artifact is absent and the queue no longer carries a downstream stub.
- Confirm the bounded checker and full workspace checks still pass.

## rollback boundary
- Revert the narrow Discovery-route legality rule and corresponding composition assertions, then remove this DEEP case chain if later truth work needs a different legality boundary.

