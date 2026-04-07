# 2026-04-05 Queue Review-Pressure Summary Surface Alignment

## Affected layer

- Discovery queue and overview host/frontend read surfaces

## Owning lane

- Engine core with Discovery front-door visibility

## Mission usefulness

- Make review pressure visible before drill-down into an Engine run or Discovery routing record.
- Keep queue and Discovery overview pages honest about review load without introducing a second routing-policy layer.

## Slice

- derived a bounded `review_pressure` summary on queue entries in [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts) from the linked Discovery routing artifact
- widened [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts) so queue entries carry the same summary into the UI
- updated [frontend/src/components/lane-sections.ts](/C:/Users/User/projects/directive-workspace/frontend/src/components/lane-sections.ts) so:
  - queue cards show review-pressure summary, confidence, conflict, and review flags
  - queue cards show the operator action and stop-line from the existing guidance
  - the Discovery lane overview shows review-pressure and conflicted-route counts before drill-down
- extended [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts) to prove the new Discovery overview and queue visibility

## Proof path

- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback path

- revert [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts)
- revert [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts)
- revert [frontend/src/components/lane-sections.ts](/C:/Users/User/projects/directive-workspace/frontend/src/components/lane-sections.ts)
- revert [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- delete this log

## Stop summary

- stopped after the bounded queue/overview visibility slice
- did not change routing policy, review policy, or downstream lane behavior
