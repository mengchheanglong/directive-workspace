# 2026-04-04 Tier 3 Check Batch Parallelization

## Scope

Bounded Tier 3 infrastructure slice:
- replace the monolithic `npm run check` `&&` chain with an explicit batch registry and runner
- keep checker coverage unchanged
- add grouped operator entrypoints for the main foundation and runtime verification families
- avoid broader host/data/runtime redesign in the same run

## Completed

- Added a shared check batch registry in `scripts/check-batches.ts`.
- Added a shared batch runner in `scripts/run-check-batches.ts`.
- Updated `package.json` so:
  - `npm run check` now executes the `main` batch set
  - `npm run check:foundation-batch` executes the frontend plus foundation checks
  - `npm run check:runtime-batch` executes the runtime/ops checks

## Proof

Passed:
- `npm run check:foundation-batch`
- `npm run check:runtime-batch`
- `npm run check`

The main `check` surface now resolves through three explicit phases:
- `frontend`
- `foundation`
- `runtime-and-ops`

## Stop Summary

This completes the highest-ROI bounded Tier 3 verification-orchestration slice.

The remaining Tier 3 frontier is no longer check-chain mechanics. It is broader decomposition work such as:
- `hosts/web-host/data.ts` domain splitting
- larger check-definition topology redesign

Those should be handled as separate design slices rather than folded into this batch-runner change.
