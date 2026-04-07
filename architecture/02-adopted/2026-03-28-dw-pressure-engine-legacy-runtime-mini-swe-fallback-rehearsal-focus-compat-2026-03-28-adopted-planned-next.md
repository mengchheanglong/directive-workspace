# Adopted / Planned-Next: Legacy Runtime Mini-SWE Fallback Rehearsal Focus Compatibility (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## why it is retained
- The canonical state resolver should support direct read-only focus on the historical mini-swe fallback rehearsal because it is already stable product history and can reuse the existing legacy Runtime slice-execution contract.

## bounded implementation next
- Restrict the implementation to `shared/lib/dw-state.ts` and focused repo checks.
- Reuse the existing legacy Runtime slice-execution reader.
- Keep the note historical and read-only.
- Do not infer a linked proof artifact when no truthful proof path exists.
- Do not infer live Runtime continuation, promotion, or host execution surfaces.

## source continuity
- Candidate id: `dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28`
- Source handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-engine-handoff.md`
- Source bounded start: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-start.md`
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-result.md`
- Source adoption decision: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-result-adoption-decision.json`

## runtime threshold
- Would this still be valuable without opening a runtime surface? `yes`

## next artifact
- `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-implementation-target.md`

