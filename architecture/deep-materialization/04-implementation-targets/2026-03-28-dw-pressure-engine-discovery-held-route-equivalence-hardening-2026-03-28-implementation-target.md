# Implementation Target: Engine Discovery-Held Route Equivalence Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28`
- Candidate name: Engine Discovery-Held Route Equivalence Hardening
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-adopted-planned-next.md`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Target approval: `directive-lead-implementer`

## implementation objective
- Land one bounded shared-lib change so Discovery-held route destinations no longer resolve as false Engine/route lane mismatches.

## implementation scope
- Update `shared/lib/dw-state.ts`.
- Update `scripts/check-directive-workspace-composition.ts`.
- Keep monitor-artifact parsing, queue lifecycle rewrite, and Discovery workflow redesign out of scope.

## proof target
- The real monitor route resolves with `integrityState = ok`.
- The completed monitor queue entry no longer reports `completed_inconsistent`.
- `npm run check` passes.

## rollback
- Revert the equivalence guard, revert the checker coverage, and remove this DEEP case chain if the slice no longer looks clearly bounded.
