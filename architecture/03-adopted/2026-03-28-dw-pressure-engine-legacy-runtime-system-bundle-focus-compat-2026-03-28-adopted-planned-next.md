# Adopted / Planned-Next: Legacy Runtime System-Bundle Focus Compatibility (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should support direct read-only focus on the historical Runtime system-bundle notes because those records are already part of product history and still surface as unsupported Runtime paths.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and focused repo checks.
- Keep the system-bundle notes historical and read-only.
- Do not infer live proof, host, registry, or promotion linkage in this slice.
- Do not map Mission Control mirrors or host-owned surfaces into active Runtime v0 continuation.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28`
- Source handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-implementation-target.md`
