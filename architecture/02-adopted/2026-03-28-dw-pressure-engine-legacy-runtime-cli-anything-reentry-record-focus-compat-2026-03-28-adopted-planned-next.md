# Adopted / Planned-Next: Legacy Runtime CLI-Anything Re-entry Record Focus Compatibility (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should support direct read-only focus on the historical CLI-Anything re-entry preconditions note because it already matches the legacy Runtime record contract except for filename shape.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and focused repo checks.
- Reuse the existing legacy Runtime record reader.
- Keep the note historical and read-only.
- Preserve explicit follow-up linkage and proposed host exactly as recorded.
- Do not infer live Runtime v0 continuation, promotion, registry, or execution.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28`
- Source handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-implementation-target.md`

