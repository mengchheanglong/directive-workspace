# Engine Review Guidance Run Surface Alignment

- Date: 2026-04-05
- Affected layer: Engine run record/report surface and operator-facing Engine run detail
- Owning lane: Engine core

## Slice

Added a stable review-guidance surface so persisted Engine runs tell operators what to do with review-gated cases, not just why the route was chosen.

## Changes

- Added `routingAssessment.reviewGuidance` to [engine/types.ts](/C:/Users/User/projects/directive-workspace/engine/types.ts).
- Derived canonical guidance in [engine/routing.ts](/C:/Users/User/projects/directive-workspace/engine/routing.ts) for:
  - conflicted Architecture review
  - conflicted Runtime review
  - low-confidence Discovery hold
  - bounded lane review
- Updated [shared/schemas/directive-engine-run-record.schema.json](/C:/Users/User/projects/directive-workspace/shared/schemas/directive-engine-run-record.schema.json) and bumped Engine run schema version to `2`.
- Rendered a dedicated `Review Handling Guidance` section in [hosts/standalone-host/runtime.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/runtime.ts).
- Surfaced the new guidance in Engine run detail through:
  - [shared/lib/engine-run-artifacts.ts](/C:/Users/User/projects/directive-workspace/shared/lib/engine-run-artifacts.ts)
  - [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts)
  - [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts)
- Extended proof coverage in:
  - [scripts/check-directive-engine-run-canonical-surface.ts](/C:/Users/User/projects/directive-workspace/scripts/check-directive-engine-run-canonical-surface.ts)
  - [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)

## Proof path

- `npm run check:directive-engine-run-canonical-surface`
- `npm run check:frontend-host`
- `npm run check:directive-engine-stage-chaining`
- `npm run check`

## Rollback path

Revert:

- [engine/types.ts](/C:/Users/User/projects/directive-workspace/engine/types.ts)
- [engine/routing.ts](/C:/Users/User/projects/directive-workspace/engine/routing.ts)
- [shared/schemas/directive-engine-run-record.schema.json](/C:/Users/User/projects/directive-workspace/shared/schemas/directive-engine-run-record.schema.json)
- [hosts/standalone-host/runtime.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/runtime.ts)
- [shared/lib/engine-run-artifacts.ts](/C:/Users/User/projects/directive-workspace/shared/lib/engine-run-artifacts.ts)
- [frontend/src/app-types.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-types.ts)
- [frontend/src/app.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app.ts)
- [scripts/check-directive-engine-run-canonical-surface.ts](/C:/Users/User/projects/directive-workspace/scripts/check-directive-engine-run-canonical-surface.ts)
- [scripts/check-frontend-host.ts](/C:/Users/User/projects/directive-workspace/scripts/check-frontend-host.ts)
- [control/logs/2026-04/2026-04-05-engine-review-guidance-run-surface-alignment.md](/C:/Users/User/projects/directive-workspace/control/logs/2026-04/2026-04-05-engine-review-guidance-run-surface-alignment.md)

## Stop summary

Stopped after the bounded run/report guidance slice. The routing policy remains unchanged; only persisted guidance, schema versioning, and operator-facing visibility were tightened.
