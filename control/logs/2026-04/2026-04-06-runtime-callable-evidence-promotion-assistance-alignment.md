# 2026-04-06 Runtime Callable-Evidence Promotion-Assistance Alignment

## Affected layer

- Runtime promotion-assistance reporting

## Owning lane

- Runtime lane with Engine-facing read/report truth

## Mission usefulness

- Make promotion-readiness recommendations expose existing callable execution proof where repo truth already provides it.
- Preserve recommendation-first, read-only assistance behavior without changing promotion policy or workflow advancement.

## Slice

- added callable-execution evidence summary to the promotion-assistance report
- attached per-recommendation callable evidence for exact candidate matches:
  - matched capability id
  - execution counts
  - success vs non-success counts
  - latest execution time
  - tool list
- extended the promotion-assistance checker to prove both report-level evidence aggregation and recommendation-level evidence attachment

## Proof path

- `npm run check:runtime-promotion-assistance`
- `npm run check:runtime-loop-control`
- `npm run check`

## Rollback path

- revert `runtime/lib/runtime-promotion-assistance.ts`
- revert `scripts/check-runtime-promotion-assistance.ts`
- delete this log

## Stop summary

- stopped after aligning Runtime promotion-assistance reporting with existing callable execution evidence
- did not change recommendation ranking, promotion readiness policy, or workflow mutation behavior
