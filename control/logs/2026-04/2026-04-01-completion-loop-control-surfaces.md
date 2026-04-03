# 2026-04-01 - Completion Loop Control Surfaces

## Why this slice was chosen

The completion loop kept stopping honestly because `road-to-completion.md` was still prose-only at the current frontier.

Repo truth already had:

- a human-readable completion anchor
- a recent pause artifact after the Scientify host-adapter slice
- intentionally closed seams recorded in `engine/workspace-truth.ts`

But it did not yet have:

- a machine-readable completion target
- a machine-readable bounded slice registry
- a canonical selector that could choose the next exact completion slice without reinterpreting the roadmap from scratch

This slice adds those control surfaces without editing `road-to-completion.md` or opening any new Runtime seam.

## What changed

- Added `control/state/completion-status.json`
  - records the current completion target, currently closed seams, and last completed slice
- Added `control/state/completion-slices.json`
  - records the bounded completion-slice registry for the current roadmap frontier
- Added `shared/lib/completion-slice-selector.ts`
  - computes the canonical next completion slice from the control state
- Added `scripts/report-next-completion-slice.ts`
  - prints the selector output for loop prompts and manual reassessment
- Added `scripts/check-completion-slice-selector.ts`
  - proves the selector is read-only and currently selects the decision slice to decide whether to open the first manual Scientify Runtime promotion seam
- Updated `control/README.md`
  - points control users to the new machine-readable state surface
- Updated `package.json`
  - exposes the new report/check and adds the selector check to the main repo check stack

## Current selector truth

The current canonical next slice is now:

- `decide_first_manual_runtime_promotion_seam`

That is deliberate.

The prior loop stopped at `a new decision is required`, but that pause was itself the next bounded frontier.
The new selector now makes that frontier explicit instead of leaving it implicit in prose.

The still-blocked slice directly behind it remains:

- `scientify_manual_runtime_promotion_chain`

and it is blocked by the still-closed seams:

- `host_facing_promotion`
- `callable_implementation`
- `host_integration`

## Proof path

- `npm run report:next-completion-slice`
  - shows the canonical selector output
- `npm run check:completion-slice-selector`
  - proves the selection is stable and read-only
- `npm run check`
  - proves the new control surface fits the existing repo truth

## Rollback

Revert:

- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- `control/state/README.md`
- `shared/lib/completion-slice-selector.ts`
- `scripts/report-next-completion-slice.ts`
- `scripts/check-completion-slice-selector.ts`
- `control/README.md`
- `package.json`

and remove this log entry.

## Stop-line

Stop after the completion frontier becomes machine-readable, one canonical selector exists, the selector is checked, and the repo stays green.
