# Engine Conflicted Route Shape Policy Alignment

- Date: 2026-04-05
- Affected layer: Engine routing action policy and Discovery mission-routing shape policy
- Owning lane: Engine core with Discovery front-door boundary

## Slice

Aligned medium-confidence conflicted routing so the action policy matches the review policy.

## Changes

- Updated [engine/routing.ts](/C:/Users/User/projects/directive-workspace/engine/routing.ts):
  - conflicted Architecture routes now recommend `split_case`
  - conflicted Runtime routes now recommend `queue_only`
- Updated [discovery/lib/discovery-mission-routing.ts](/C:/Users/User/projects/directive-workspace/discovery/lib/discovery-mission-routing.ts):
  - conflicted Architecture routes now recommend `split_case`
  - conflicted Runtime routes now recommend `queue_only`
  - explicit shape hints and `fast_path` payloads no longer override route-conflict handling
- Extended proof coverage in:
  - [scripts/check-directive-engine-stage-chaining.ts](/C:/Users/User/projects/directive-workspace/scripts/check-directive-engine-stage-chaining.ts)
  - [scripts/check-discovery-mission-routing.ts](/C:/Users/User/projects/directive-workspace/scripts/check-discovery-mission-routing.ts)

## Proof path

- `npm run check:directive-engine-stage-chaining`
- `npm run check:discovery-mission-routing`
- `npm run check:frontend-host`
- `npm run check`

## Rollback path

Revert:

- [engine/routing.ts](/C:/Users/User/projects/directive-workspace/engine/routing.ts)
- [discovery/lib/discovery-mission-routing.ts](/C:/Users/User/projects/directive-workspace/discovery/lib/discovery-mission-routing.ts)
- [scripts/check-directive-engine-stage-chaining.ts](/C:/Users/User/projects/directive-workspace/scripts/check-directive-engine-stage-chaining.ts)
- [scripts/check-discovery-mission-routing.ts](/C:/Users/User/projects/directive-workspace/scripts/check-discovery-mission-routing.ts)
- [control/logs/2026-04/2026-04-05-engine-conflicted-route-shape-policy-alignment.md](/C:/Users/User/projects/directive-workspace/control/logs/2026-04/2026-04-05-engine-conflicted-route-shape-policy-alignment.md)

## Stop summary

Stopped after the bounded conflicted-route shape policy slice. High-confidence no-gap routing, explicit low-confidence Discovery fallback, and Architecture-with-review ownership for explicit system-improvement sources remain unchanged.
