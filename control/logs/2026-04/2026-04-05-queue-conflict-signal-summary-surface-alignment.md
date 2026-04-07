# 2026-04-05 Queue Conflict-Signal Summary Surface Alignment

## Affected layer

- Discovery queue operator summaries

## Owning lane

- Engine core with Discovery front-door visibility

## Mission usefulness

- Make medium-confidence conflicted cases easier to act on from the queue itself.
- Keep operators from having to open the Engine run or routing detail just to see which signal families disagree.

## Slice

- widened [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts) so `review_pressure` carries a compact `ambiguity_summary`
- widened [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts) with the same queue summary shape
- updated [frontend/src/components/lane-sections.ts](/C:/Users/User/projects/directive-workspace/frontend/src/components/lane-sections.ts) so conflicted queue cards now render a one-line `Why conflicted` summary from the linked ambiguity signals
- extended [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts) with a seeded conflicted sample Engine run and queue assertion

## Proof path

- `npm run check:frontend-host`
- `npm run check`

## Rollback path

- revert [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts)
- revert [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts)
- revert [frontend/src/components/lane-sections.ts](/C:/Users/User/projects/directive-workspace/frontend/src/components/lane-sections.ts)
- revert [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- delete this log

## Stop summary

- stopped after the bounded queue conflict-summary slice
- did not change routing policy, lane ownership, or review policy
