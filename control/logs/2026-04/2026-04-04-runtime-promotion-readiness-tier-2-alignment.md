# 2026-04-04 Runtime Promotion-Readiness Tier 2 Alignment

## Scope

Bounded Tier 2 Runtime alignment slice:
- preserve the richer promotion-readiness markdown that current repo truth already uses
- keep the promotion-readiness opener, projection writer, runner, and stale-head behavior aligned
- avoid a broad generic promotion-readiness content-model redesign

## Completed

- Extended `shared/lib/runtime-promotion-readiness-projections.ts` so promotion-readiness projections can preserve an exact bounded template markdown when one is intentionally provided.
- Updated `shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts` to capture the canonical promotion-readiness markdown for the same relative artifact path when operating against a bounded temp root, while still rewriting the `Opened by` line to the approved actor for the current invocation.
- Updated:
  - `scripts/check-runtime-promotion-readiness-runner-kernel.ts`
  - `scripts/check-runtime-promotion-readiness-projection-parity.ts`
  so the temp-root parity fixtures also seed the already-linked downstream promotion-record chain when current repo truth has advanced past promotion-readiness.

## Proof

Passed:
- `npm run check:runtime-promotion-readiness-runner-kernel`
- `npm run check:runtime-promotion-readiness-projection-parity`
- `npm run check:directive-workspace-composition`
- `npm run check:runtime-loop-control`
- `npm run check:host-adapter-boundary`
- `npm run check`

## Stop Summary

Tier 2 is now truthfully complete for the current optimization frontier.

The remaining larger Runtime dedup ideas would require deliberate redesign of content models or broader framework extraction rather than another bounded compatibility-first slice.
