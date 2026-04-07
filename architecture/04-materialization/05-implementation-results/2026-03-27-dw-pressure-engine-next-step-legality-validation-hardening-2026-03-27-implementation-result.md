# Implementation Result: Engine Next-Step Legality Validation Hardening (2026-03-27)

## target closure
- Candidate id: `dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27`
- Candidate name: Engine Next-Step Legality Validation Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-implementation-target.md`
- Source adoption artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-adopted-planned-next.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: harden Discovery-route legality validation so a concrete required downstream artifact mismatch blocks advancement instead of surfacing a falsely legal downstream next step.

## completed tactical slice
- Added `isDirectiveWorkspaceArtifactReference(...)` in `engine/artifact-link-validation.ts` so descriptive required-next-artifact labels are not treated as concrete missing artifacts.
- Hardened `resolveDiscoveryFocus(...)` in `shared/lib/dw-state.ts` so a concrete route-level required-next-artifact reference that disagrees with the resolved downstream stub records an inconsistent link and blocks advancement.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for both the legacy descriptive-label case and the staged concrete mismatch case.

## actual result summary
- Discovery-route legality reporting is now more truthful in one bounded seam: descriptive labels no longer masquerade as missing downstream artifacts, and concrete required-next-artifact mismatches now downgrade the case to blocked instead of surfacing a legal downstream next step.

## mechanical success criteria check
- Concrete required-next-artifact mismatches now resolve as blocked.
- Legacy descriptive labels no longer appear in `missingExpectedArtifacts`.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into generic broken-link scanning.
- This slice does not broaden into stale-status repair.
- Runtime, frontend, and other whole-product seams remain unchanged.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: legality_guard_complete, discovery_route_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `engine/artifact-link-validation.ts`
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the legality hardening code changes and remove this DEEP Architecture case chain if later hardening work needs a different boundary.

