# Adopted / Planned-Next: Legacy Runtime Handoff Focus Compatibility (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should support direct read-only focus on the two known historical Runtime handoff artifacts because they are already part of product history and already surfaced by the workbench.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Keep the handoffs read-only and historical.
- Do not map legacy Runtime records, legacy Runtime follow-up execution chains, or execution-era promotion semantics.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28`
- Source handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-implementation-target.md`
