# Adopted / Planned-Next: Legacy Runtime Validation-Note Focus Compatibility (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should support direct read-only focus on the historical Runtime validation note pair because those records are already part of product history and still surface as unsupported Runtime paths.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and focused repo checks.
- Keep the validation notes historical and read-only.
- Do not infer live proof, host, or runtime continuation linkage in this slice.
- Do not normalize broader status-digest, rehearsal, or decision-note families in this slice.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28`
- Source handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-implementation-target.md`
