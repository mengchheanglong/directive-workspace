# 2026-04-06 - Architecture support family cutover

## Affected layer

- `architecture/lib/`

## Owning lane

- Architecture lane

## Mission usefulness

Move Architecture-owned review feedback and Architecture self-improvement/report surfaces out of residual `shared/lib/` so Architecture operating support is visibly lane-owned.

## Changes

- Moved these files from `shared/lib/` to `architecture/lib/`:
  - `lifecycle-review-feedback.ts`
  - `operational-architecture-improvement-candidates.ts`
  - `operator-simplicity-loop-control.ts`
- Updated Architecture lane consumers, script/report surfaces, and active case state to use the new canonical paths.
- Updated the active Runtime boundary inventory entry for lifecycle review feedback to the new Architecture-owned path.

## Proof path

- `npm run check:operational-architecture-improvement-candidates`
- `npm run check:operator-simplicity-loop-control`
- `npm run check:runtime-cycle-evidence-feedback`
- `npm run check`

## Rollback path

- Move the three files back into `shared/lib/`
- Revert the import rewrites, state reference update, inventory update, and this log

## Stop summary

Architecture support ownership is now explicit: review feedback, operational Architecture candidate generation, and operator-simplicity loop control live with the Architecture lane rather than the residual shared support layer.
