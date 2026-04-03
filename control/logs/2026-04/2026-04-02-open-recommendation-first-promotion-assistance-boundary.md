# 2026-04-02 - Open Recommendation-First Promotion Assistance Boundary

## Slice

- Completion slice: `decide_recommendation_first_promotion_assistance_boundary`
- Owning lane: `Architecture`
- Decision: open recommendation-first promotion assistance as a read-only boundary

## Repo truth used

- Repeatable manual Runtime promotion is already real across two bounded non-executing cases:
  - Scientify
  - OpenMOSS
- Runtime promotion records, promotion specifications, and host-facing review metadata are already canonical and checker-backed.
- `automatic_downstream_advancement` remains a closed seam across the product.
- Current product truth already allows recommendation/report surfaces when they do not mutate workflow state or bypass explicit approval.
- No repo surface currently requires broad host integration, runtime execution, or promotion automation to offer recommendation-only help.

## Decision

Open the boundary for recommendation-first promotion assistance.

This opening is intentionally narrow:

- read-only
- recommendation-first
- approval-preserving
- non-executing
- non-integrating
- non-automated

It authorizes the next bounded slice only:

- `semi_automated_promotion_assistance`

It does not authorize:

- automatic downstream advancement
- queue mutation as part of assistance
- registry acceptance
- host integration
- runtime execution
- promotion automation
- broader Runtime redesign

## Why opening is truthful

The earlier block was only correct for assistance that would reduce manual effort by advancing workflow automatically.

That is still closed.

But a smaller assistance surface is now supported by repo truth:

- it can summarize canonical promotion truth
- it can recommend the next manual promotion action
- it can stay read-only
- it can preserve explicit operator approval for any real advancement

So the closed automation seam does not need to open for recommendation-first assistance to begin.

## Completion-control effect

- Mark `decide_recommendation_first_promotion_assistance_boundary` completed.
- Keep the closed seam list unchanged.
- Unblock `semi_automated_promotion_assistance` as a recommendation-first, read-only implementation slice.
- The next selector result should therefore become:
  - `selectionState = "selected"`
  - `selectedSlice.sliceId = "semi_automated_promotion_assistance"`

## Proof path

- `npm run report:next-completion-slice`
- `npm run check:completion-slice-selector`
- `npm run report:directive-workspace-state`
- `npm run check`

## Rollback

Revert:

- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- `scripts/check-completion-slice-selector.ts`
- this decision log

## Stop-line

Stop after the decision is recorded, the selector advances to `semi_automated_promotion_assistance`, and the repo check surfaces remain green. Do not implement the assistance surface in this slice.
