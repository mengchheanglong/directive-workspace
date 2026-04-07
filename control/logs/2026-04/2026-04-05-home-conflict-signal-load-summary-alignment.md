# 2026-04-05 Home Conflict-Signal Load Summary Alignment

## Affected layer

- Engine home review-load overview

## Owning lane

- Engine core with Discovery-facing operator visibility

## Mission usefulness

- Make the home page show not only how much review load exists, but which signal families are driving current route conflicts.
- Keep top-level operator awareness aligned with the queue conflict summaries without forcing drill-down.

## Slice

- updated [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts) to aggregate conflicting signal families from queue-entry review-pressure summaries
- rendered the top conflicting signal families in the home `Current review load` panel
- extended [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts) to prove the home page now shows the conflict-signal load summary

## Proof path

- `npm run check:frontend-host`
- `npm run check`

## Rollback path

- revert [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts)
- revert [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- delete this log

## Stop summary

- stopped after the bounded home conflict-load visibility slice
- did not change routing policy, queue state, or host data shape
