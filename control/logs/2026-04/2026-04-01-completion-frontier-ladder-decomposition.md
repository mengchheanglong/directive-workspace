# 2026-04-01 - Completion Frontier Ladder Decomposition

## Why this slice was needed

The new completion selector was working correctly, but it stopped too early because the remaining Runtime frontier was represented as one coarse blocked slice:

- `scientify_manual_runtime_promotion_chain`

That was truthful, but too coarse for repeated bounded loop runs.

Repo truth already includes:

- a bounded Scientify callable stub
- canonical promotion specifications
- a bounded standalone-host adapter reader
- existing promotion-record and registry writer families
- Runtime doctrine that still keeps host-facing promotion, callable implementation, and host integration closed

So the frontier could be decomposed further without opening those closed seams.

## What changed

The completion-slice registry now inserts three pre-seam slices before the blocked manual promotion chain:

1. `decide_pre_host_promotion_record_contract`
2. `formalize_pre_host_promotion_record_prerequisites`
3. `decide_registry_acceptance_boundary_after_manual_promotion`

These slices are deliberately bounded:

- they stay in Architecture
- they prepare promotion/registry semantics and checks
- they do not claim host-facing promotion, callable implementation, or host integration is open

Only after those are complete does the frontier return to:

- `scientify_manual_runtime_promotion_chain`

which remains blocked by the still-closed seams.

## Current selector truth

The canonical next completion slice is now:

- `decide_pre_host_promotion_record_contract`

That is the intended result. The loop can continue with pre-seam Runtime completion work instead of stopping immediately on the first blocked Runtime seam.

## Proof path

- `npm run report:next-completion-slice`
  - now returns `selectionState = "selected"` again
- `npm run check:completion-slice-selector`
  - proves the next slice is the new decision slice
- `npm run check`
  - proves the decomposed frontier still fits repo truth and existing checks

## Rollback

Revert:

- `control/state/completion-slices.json`
- `scripts/check-completion-slice-selector.ts`
- this log entry

to return to the coarser blocked frontier.

## Stop-line

Stop after the completion frontier is decomposed enough that the canonical selector can return one exact pre-seam next slice again.
