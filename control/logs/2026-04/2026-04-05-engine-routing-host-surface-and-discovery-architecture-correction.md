# 2026-04-05 Engine Routing Host Surface And Discovery-Architecture Correction

- Affected layer: Engine routing plus host/frontend read surfaces.
- Owning lane: Engine core.
- Mission usefulness: make ambiguity visible in operator-facing run/routing details, and reduce Discovery overread for structural sources that are really Engine workflow logic.
- Proof path:
  - `npm run check:directive-engine-stage-chaining`
  - `npm run check:frontend-host`
  - `npm run check:directive-workspace-composition`
  - `npm run check`
- Rollback path: revert the routing correction, host/frontend detail exposure changes, checker additions, and this log.

## Changes

- Extended engine-run storage/detail typing so host-facing readers can see routing confidence, route conflict, human-review state, and ambiguity summary.
- Extended Discovery routing detail to expose the linked Engine run's routing confidence and ambiguity summary where available.
- Updated the frontend Engine run detail and Discovery routing detail pages to show:
  - routing confidence
  - route conflict
  - needs human review
  - ambiguity summary
- Added a structural-source correction in Engine routing so Discovery vocabulary like intake/routing/review does not overread a workflow writeup that is actually describing Engine workflow logic.
- Added a stage-chaining probe proving that a discovery-looking workflow writeup now routes confidently to Architecture, with an explicit rationale line for the correction.

## Stop Summary

- This is still a bounded routing-quality slice.
- It does not redesign record-shape policy or broader lane adjudication.
