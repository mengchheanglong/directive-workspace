# Adopted Planned Next: Engine Legacy Architecture Adoption Compatibility (2026-03-28)

## adoption
- Candidate id: `dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28`
- Candidate name: Engine Legacy Architecture Adoption Compatibility
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-result.md`
- Adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-result-adoption-decision.json`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status: `adopt_planned_next`

## adopted value
- Keep older adopted Architecture records usable as canonical current heads without forcing them into the modern decision-sidecar shape retroactively.

## planned next
- Materialize the bounded shared-lib fallback in `shared/lib/architecture-result-adoption.ts`.
- Add composition coverage proving the four legacy adopted records resolve cleanly.
- Stop after verification.

## rollback
- Revert the legacy adoption fallback, revert the checker coverage, and remove this DEEP case chain if later Architecture policy rejects this compatibility contract.
