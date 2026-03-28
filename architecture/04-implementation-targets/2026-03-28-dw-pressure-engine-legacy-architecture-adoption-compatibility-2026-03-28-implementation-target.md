# Implementation Target: Engine Legacy Architecture Adoption Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28`
- Candidate name: Engine Legacy Architecture Adoption Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-adopted-planned-next.md`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Target approval: `directive-lead-implementer`

## implementation objective
- Land one bounded shared-lib fallback so legacy adopted Architecture markdown remains resolvable as canonical current heads even without the modern adoption decision sidecar.

## implementation scope
- Update `shared/lib/architecture-result-adoption.ts`.
- Update `scripts/check-directive-workspace-composition.ts`.
- Keep queue policy, Runtime history support, and generic historical normalization out of scope.

## proof target
- All four legacy adopted artifacts resolve with `integrityState = ok`.
- All four resolve with `currentStage = architecture.adoption.adopted`.
- Each keeps only the expected implementation-target gap.
- `npm run check:directive-workspace-composition` passes.

## rollback
- Revert the legacy adoption fallback, revert the checker coverage, and remove this DEEP case chain if the slice no longer looks clearly bounded.
