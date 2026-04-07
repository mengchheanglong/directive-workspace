# 2026-04-06 Pressure frontier residual tail closeout

## Affected layer

- live pressure-case stop-line control

## Owning lane

- Architecture lane
- Runtime lane

## Mission usefulness

Record the truthful stop-line for the last low-ROI `dw-pressure-*` tail instead of reopening cases whose current live boundaries already say to stay parked.

## Residual tail

- Architecture:
  - `dw-pressure-karpathy-autoresearch-2026-03-25`
  - `dw-pressure-rag-architecture-2026-03-25`
- Runtime:
  - `dw-pressure-mini-swe-agent-2026-03-25`

## Repo truth

- `dw-pressure-karpathy-autoresearch-2026-03-25` resolves at:
  - `architecture.bounded_result.stay_experimental`
  - next legal step: explicitly continue the experimental Architecture slice or stop without auto-advancing
- `dw-pressure-rag-architecture-2026-03-25` resolves at:
  - `architecture.bounded_result.stay_experimental`
  - next legal step: explicitly continue the experimental Architecture slice or stop without auto-advancing
- read-only lifecycle coordination still groups both cases inside:
  - `architecture_experimental_parked`
  - recommended focus: keep experimental Architecture cases grouped as parked until new bounded pressure appears
- `dw-pressure-mini-swe-agent-2026-03-25` already resolves at:
  - `runtime.promotion_readiness.opened`
  - next legal step: no automatic Runtime step is open
- runtime promotion assistance already treats that Runtime case as explicitly parked by repo truth at:
  - `control/logs/2026-04/2026-04-02-pressure-mini-swe-dw-web-host-manual-promotion-park-decision.md`

## Decision

- Keep the two remaining Architecture pressure cases parked at their current experimental boundary.
- Keep the remaining Runtime pressure case parked at its current promotion-readiness boundary.
- Do not create new defer/reject artifacts or promotion records in this slice.

## Why this is the truthful stop-line

- the canonical resolver does not treat `architecture/03-deferred-or-rejected/` as the live downstream head for these experimental cases, so manufacturing new deferred records here would add narrative without improving current-state truth
- the Architecture cluster already has an explicit keep-parked decision and the two remaining cases still match that cluster logic
- the Runtime case already has a park-decision artifact that active promotion-assistance logic reads directly
- no current checker, report, implementation target, or host pressure makes one of these three cases the mandatory next move

## Reopen trigger

Reopen one of these cases only if new repo truth creates a singular bounded reason, such as:

- a new checker or proof dependency that can only be satisfied by that exact case
- a new implementation target that names that exact case as required input
- a repo-truth change that invalidates the current parked reasoning
- direct operator pressure for that exact mechanism that is not shared by the rest of the parked set

## Proof path

- `npm run report:directive-workspace-state -- architecture/01-experiments/2026-03-25-dw-pressure-karpathy-autoresearch-2026-03-25-bounded-result.md`
- `npm run report:directive-workspace-state -- architecture/01-experiments/2026-03-25-dw-pressure-rag-architecture-2026-03-25-bounded-result.md`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-promotion-readiness.md`
- `npm run report:runtime-promotion-assistance`
- `npm run report:read-only-lifecycle-coordination`
- `npm run check:read-only-lifecycle-coordination`
- `npm run check:runtime-promotion-assistance`
- `npm run check`

## Rollback path

- delete this log only

## Stop summary

- the adopt-ready pressure set has already been materialized
- the proof-boundary continuation set has already had one more explicit bounded slice
- the residual low-ROI tail is now explicitly closed as parked under current repo truth
- do not continue this tail again without new repo truth

