# 2026-04-02 - Runtime Promotion Assistance Park-Decision Alignment

## Slice

- Owning lane: `Architecture`
- Surface: `runtime-promotion-assistance`
- Result: the recommendation-first Runtime assistance surface now respects the explicit park decision for `dw-pressure-mini-swe-agent-2026-03-25`

## Why this slice was next

- The blocked completion frontier is now intentionally paused by operator choice.
- Fresh repo truth still showed `runtime-promotion-assistance` recommending `dw-pressure-mini-swe-agent-2026-03-25` as the top next Runtime move.
- Current repo truth already contains a bounded park decision for that exact case:
  - `control/logs/2026-04/2026-04-02-pressure-mini-swe-dw-web-host-manual-promotion-park-decision.md`
- That made the assistance surface overstated: it was recommending a case the repo had already said not to continue without new repo truth.

## What changed

- Runtime promotion assistance now reads explicit Runtime park decisions from bounded control logs.
- A parked case no longer remains the top actionable recommendation just because its pre-host prerequisites are otherwise satisfied.
- The assistance report still stays:
  - recommendation-first
  - read-only
  - non-advancing
  - non-automating

## Resulting truth

- `dw-pressure-mini-swe-agent-2026-03-25` remains visible in the recommendation list, but is no longer actionable.
- The assistance surface now points to the next still-actionable Runtime case instead of overruling the park decision by momentum.
- Read-only lifecycle coordination now consumes the updated assistance truth automatically through its upstream signal.

## Proof path

- `npm run report:runtime-promotion-assistance`
- `npm run check:runtime-promotion-assistance`
- `npm run check:directive-pressure-mini-swe-dw-web-host-retarget`
- `npm run check:read-only-lifecycle-coordination`
- `npm run check`

## Rollback

Revert:

- `shared/lib/runtime-promotion-assistance.ts`
- `scripts/check-runtime-promotion-assistance.ts`
- `scripts/check-directive-pressure-mini-swe-dw-web-host-retarget.ts`
- `scripts/check-read-only-lifecycle-coordination.ts`
- this log

## Stop-line

Stop once the assistance surface respects the existing park decision and the next actionable Runtime recommendation is truthful again.
