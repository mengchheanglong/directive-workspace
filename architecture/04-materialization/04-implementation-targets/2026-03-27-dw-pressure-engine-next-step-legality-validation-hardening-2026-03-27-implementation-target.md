# Implementation Target: Engine Next-Step Legality Validation Hardening (2026-03-27)

## target
- Candidate id: `dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27`
- Candidate name: Engine Next-Step Legality Validation Hardening
- Source adoption artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: harden Discovery-route legality validation so a concrete required downstream artifact mismatch blocks advancement instead of surfacing a falsely legal downstream next step.

## scope (bounded)
- Limit the implementation to `engine/artifact-link-validation.ts`, `shared/lib/dw-state.ts`, and `scripts/check-directive-workspace-composition.ts`.
- Only treat concrete artifact references as missing expected artifacts.
- Add one explicit mismatch guard between a concrete route-level required-next-artifact reference and the resolved downstream stub.
- Do not broaden into stale-status repair, generic broken-link scanning, Runtime, or frontend work.

## validation approach
- `legality_guard_complete`
- `discovery_route_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm descriptive route labels no longer produce false missing-expected-artifact reports.
- Confirm a staged required-next-artifact mismatch now blocks advancement.

## rollback boundary
- Revert the legality hardening code changes and remove this DEEP case chain if the slice stops being clearly bounded.

