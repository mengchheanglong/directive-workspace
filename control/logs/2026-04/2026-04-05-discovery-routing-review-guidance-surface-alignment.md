# Discovery Routing Review Guidance Surface Alignment

- Date: 2026-04-05
- Affected layer: Discovery routing detail and operator-facing host/frontend read surfaces
- Owning lane: Engine core with Discovery front-door visibility

## Slice

Surfaced canonical review guidance on Discovery routing detail by inheriting the linked Engine run guidance when available.

## Changes

- Updated [discovery/lib/discovery-route-opener.ts](/C:/Users/User/projects/directive-workspace/discovery/lib/discovery-route-opener.ts) so Discovery routing artifacts expose `reviewGuidance` from the linked Engine run.
- Updated [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts) to include `reviewGuidance` in Discovery routing detail.
- Updated [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts) and [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts) so Discovery routing detail renders:
  - review guidance summary
  - operator action
  - required checks
  - stop-line
- Extended [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts) to assert the guidance on a seeded Discovery routing record page.

## Proof path

- `npm run check:frontend-host`
- `npm run check:discovery-mission-routing`
- `npm run check:directive-engine-run-canonical-surface`
- `npm run check`

## Rollback path

Revert:

- [discovery/lib/discovery-route-opener.ts](/C:/Users/User/projects/directive-workspace/discovery/lib/discovery-route-opener.ts)
- [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts)
- [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts)
- [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts)
- [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- [control/logs/2026-04/2026-04-05-discovery-routing-review-guidance-surface-alignment.md](/C:/Users/User/projects/directive-workspace/control/logs/2026-04/2026-04-05-discovery-routing-review-guidance-surface-alignment.md)

## Stop summary

Stopped after the bounded Discovery routing guidance slice. Routing policy itself was unchanged; only read-surface visibility and proof were extended.
