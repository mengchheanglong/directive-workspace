# Runtime Follow-up History Vs Active Boundary

- Date: 2026-04-02
- Slice type: history-vs-active boundary clarification
- Scope: `operator-start.md`, `runtime/00-follow-up/README.md`

## Why this slice

`runtime/00-follow-up/` now contains both active follow-up records and later support bundles from bounded Runtime promotion work. Operators could misread folder recency there as workflow authority.

That is not safe repo truth:
- the canonical current live artifact comes from the shared resolver
- multiple one-case checkers still reference specific `runtime/00-follow-up/` support bundles directly
- a first archive move is therefore not yet a safe bounded cleanup slice

## What changed

- clarified that `runtime/00-follow-up/` is a mixed Runtime support corpus, not the canonical current-head selector
- pointed operators back to `shared/lib/dw-state.ts` and `npm run report:directive-workspace-state` for live continuation truth
- recorded that archive moves remain deferred until direct checker references are reduced in a future bounded slice

## Stop-line

Operator navigation is simpler without changing Runtime workflow truth, file references, or active seams.
