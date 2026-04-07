# 2026-04-05 Engine Runs Review-Pressure Overview Alignment

## Affected layer

- Engine runs overview operator surface

## Owning lane

- Engine core

## Mission usefulness

- Make per-run review pressure visible on the Engine runs overview page without requiring run-detail drill-down.
- Keep operator scan speed aligned with the richer review-guidance and conflict truth already present in run details.

## Slice

- updated [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts) so the Engine runs table now includes a `review pressure` column
- the new column summarizes:
  - review-guidance summary when present
  - routing confidence
  - route-conflict state
- extended [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts) to prove the new overview column on `/engine-runs`

## Proof path

- `npm run check:frontend-host`
- `npm run check`

## Rollback path

- revert [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts)
- revert [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- delete this log

## Stop summary

- stopped after the bounded Engine runs overview visibility slice
- did not change Engine run schema, routing policy, or decision policy
