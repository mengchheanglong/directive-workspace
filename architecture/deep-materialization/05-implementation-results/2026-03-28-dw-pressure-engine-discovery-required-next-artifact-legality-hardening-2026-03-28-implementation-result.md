# Implementation Result: Engine Discovery Required-Next-Artifact Legality Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28`
- Candidate name: Engine Discovery Required-Next-Artifact Legality Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: block Discovery route advancement when a concrete required next artifact is missing and no downstream stub satisfies the claimed next step.

## completed tactical slice
- Hardened `shared/lib/dw-state.ts` so Discovery route resolution records an inconsistency when a concrete required next artifact is missing and no downstream stub resolves.
- Added staged composition coverage in `scripts/check-directive-workspace-composition.ts` for the missing-required-next-artifact legality case.

## actual result summary
- Discovery routing is now stricter in one bounded legality seam: a route no longer stays integrity-ok and approval-ready when its concrete required next artifact is absent and unsatisfied by any downstream stub.

## mechanical success criteria check
- The staged Discovery route now resolves as blocked when the concrete required next artifact is missing and the queue carries no downstream stub.
- The legality slice stayed bounded to Discovery route validation only.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into generic missing-artifact blocking.
- This slice does not broaden into broken-link scanning or stale-status repair.
- It does not redesign queue lifecycle or Runtime/Architecture continuation behavior.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: missing_required_next_artifact_blocks_advancement, legality_slice_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run check:directive-workspace-composition`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-implementation-result.md`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the narrow Discovery-route legality rule in `shared/lib/dw-state.ts`, revert the staged composition coverage, and remove this DEEP case chain if later truth work needs a different missing-required-artifact boundary.
