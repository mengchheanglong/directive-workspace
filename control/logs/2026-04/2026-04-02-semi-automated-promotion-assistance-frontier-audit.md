# 2026-04-02 - Semi-Automated Promotion Assistance Frontier Audit

## Slice

- Frontier audit target: `semi_automated_promotion_assistance`
- Owning lane: `Architecture`
- Result: the blocked frontier was under-decomposed, not purely blocked

## Why the frontier was under-decomposed

The registry already treated `semi_automated_promotion_assistance` as blocked by:

- `automatic_downstream_advancement`

That block is still real for any implementation slice that reduces manual promotion effort.

But repo truth already supports one finer-grained pre-seam decision before that blocked implementation:

- whether recommendation-first promotion assistance can open as a read-only boundary
- without automatic workflow advancement
- without bypassing approval gates

That decision is narrower than the blocked implementation slice and does not itself require the closed automation seam to open.

## What changed

The completion registry now inserts one pre-seam decision slice before the blocked implementation slice:

1. `decide_recommendation_first_promotion_assistance_boundary`

The blocked implementation slice now depends on that decision instead of depending directly on `repeatable_runtime_promotions`.

## Current selector truth

The canonical next completion slice is now:

- `decide_recommendation_first_promotion_assistance_boundary`

The blocked frontier directly behind it remains:

- `semi_automated_promotion_assistance`

and it is still blocked by:

- `automatic_downstream_advancement`

## Proof path

- `npm run report:next-completion-slice`
- `npm run check:completion-slice-selector`
- `npm run check`

## Rollback

Revert:

- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- `scripts/check-completion-slice-selector.ts`
- this log

## Stop-line

Stop once the selector surfaces one exact recommendation-boundary decision slice ahead of the still-blocked assistance implementation seam.
