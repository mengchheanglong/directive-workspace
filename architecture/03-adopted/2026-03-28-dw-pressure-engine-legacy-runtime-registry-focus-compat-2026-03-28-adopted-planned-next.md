# Adopted / Planned-Next: Legacy Runtime Registry Focus Compatibility (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should support direct read-only focus on the historical Runtime registry-entry family because those entries are already part of product history and already linked from older Runtime handoff artifacts.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and focused repo checks.
- Keep the registry entries historical and read-only.
- Do not map legacy promotion-record, proof/execution, or callable continuation semantics.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28`
- Source handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-implementation-target.md`
