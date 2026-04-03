# Operator Simplicity Migration

This migration tracks bounded structural cleanup that reduces operator friction without changing product truth or opening new seams.

## Goal

Make the repo easier to operate by:
- clarifying active-vs-history boundaries
- clarifying truth-surface ownership
- grouping narrowly related checker families
- shrinking non-authoritative top-level noise
- avoiding broad structural churn

## Completion bar

The migration is complete when:
- the highest-noise active operator surfaces are clarified
- the first safe checker-family groupings are done
- the remaining archive or cleanup work is either completed or explicitly blocked by high-reference proof surfaces
- no higher-ROI bounded operator-simplicity slice remains

## Active rule

Use the machine-readable selector under `control/state/` plus:
- `npm run report:operator-simplicity-loop-control`
- `npm run check:operator-simplicity-loop-control`

Do not widen this migration into product-expansion work, workflow redesign, or high-reference folder renames without a new explicit decision.
