# 2026-04-05 Home Review-Load Overview Surface Alignment

## Affected layer

- Engine home snapshot and operator-facing overview surfaces

## Owning lane

- Engine core with Discovery-facing overview visibility

## Mission usefulness

- Make review load visible on the home page before operators open Queue or Discovery.
- Keep the top-level snapshot aligned with the richer routing, ambiguity, and review-guidance truth already present in detail surfaces.

## Slice

- updated [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts) so the home overview now shows:
  - Discovery review-pressure count
  - conflicted queue-route count
  - Engine run review-guidance count
  - Engine run conflicted-route count
  - a dedicated `Current review load` summary panel
- extended [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts) to prove the new home-page overview text

## Proof path

- `npm run check:frontend-host`
- `npm run check`

## Rollback path

- revert [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts)
- revert [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- delete this log

## Stop summary

- stopped after the bounded home-overview visibility slice
- did not change routing policy, queue state, or host data shape
