# Engine Low-Confidence Route Policy Alignment

- Date: 2026-04-05
- Affected layer: Engine routing and Discovery front-door routing policy
- Owning lane: Engine core with Discovery intake boundary

## Slice

Aligned low-confidence route handling so weak no-gap candidates stay in Discovery instead of inheriting early Architecture or Runtime ownership.

## Changes

- Updated [engine/routing.ts](/C:/Users/User/projects/directive-workspace/engine/routing.ts) to fall back to `discovery` when:
  - confidence is `low`
  - no open gap matched
  - no explicit ownership metadata exists
- Preserved explicit ownership handling for low-confidence-but-explicit Architecture cases by exempting:
  - `primaryAdoptionTarget`
  - `improvesDirectiveWorkspace`
  - `workflowBoundaryShape`
- Updated [discovery/lib/discovery-mission-routing.ts](/C:/Users/User/projects/directive-workspace/discovery/lib/discovery-mission-routing.ts) to keep low-confidence no-gap/no-explicit-route submissions in Discovery.
- Added focused proof cases in:
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
- [control/logs/2026-04/2026-04-05-engine-low-confidence-route-policy-alignment.md](/C:/Users/User/projects/directive-workspace/control/logs/2026-04/2026-04-05-engine-low-confidence-route-policy-alignment.md)

## Stop summary

Stopped after the bounded low-confidence route policy slice. High-confidence no-gap Architecture and Runtime behavior remains unchanged, and medium-confidence Architecture review cases still stay lane-owned with explicit review.
