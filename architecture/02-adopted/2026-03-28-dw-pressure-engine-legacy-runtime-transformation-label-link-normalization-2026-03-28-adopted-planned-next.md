# Adopted / Planned-Next: Legacy Runtime Transformation Label-Link Normalization (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should treat descriptive baseline/result labels inside historical Runtime transformation records as notes, because those records are already part of product history and should not fail direct inspection just because they describe internal sections instead of linked artifacts.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and focused repo checks.
- Keep the transformation artifacts historical and read-only.
- Do not map runtime-slice proof/execution, proof-checklist, registry, promotion, or callable continuation semantics.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28`
- Source handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-implementation-target.md`

