# 2026-04-05 Engine Architecture Record-Shape Policy Alignment

## Affected layer

- Engine routing policy

## Owning lane

- Engine core with Architecture-boundary pressure

## Mission usefulness

- Keep strong Architecture routes truthful when no open gap matches.
- Avoid flattening high-confidence Engine-improvement candidates into queue-only backlog handling.

## Slice

- extended `deriveRecommendedRecordShape(...)` so high-confidence, non-conflicted Architecture routes can still return `split_case` without an open gap when structured Architecture signals are explicit
- aligned `needsHumanReview` so no-gap Architecture cases are not forced into extra-review mode when they already resolved to `split_case`
- extended the stage-chaining checker to prove the corrected no-gap Architecture boundary behavior

## Proof path

- `npm run check:directive-engine-stage-chaining`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback path

- revert `engine/routing.ts`
- revert `scripts/check-directive-engine-stage-chaining.ts`

## Stop summary

- stopped after the bounded record-shape policy alignment slice
- did not broaden into decision-state redesign or lane workflow restructuring
