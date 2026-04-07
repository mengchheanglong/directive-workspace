# 2026-04-05 Engine Routing Structured System-Improvement Signals

## Why

Routing still leaned too hard on keyword overlap plus a small set of booleans. The highest-value remaining ambiguity was executable sources that are really about improving Directive Workspace itself rather than becoming reusable Runtime capability.

## What changed

- Added two structured source metadata signals:
  - `improvesDirectiveWorkspace`
  - `workflowBoundaryShape`
- Propagated them through:
  - Engine source types
  - Discovery front-door submission request types
  - standalone-host submission wiring
  - discovery submission schema
- Updated Engine routing to:
  - strengthen Architecture scoring when a source explicitly improves Directive Workspace itself
  - strengthen Architecture scoring when workflow-boundary shape is explicit
  - keep Runtime skew for executable sources unless the system-improvement metadata overrides it
- Extended `check-directive-engine-stage-chaining` with an Architecture-metadata override case for an executable repo that should still route to Architecture.

## Proof

- `npm run check:directive-engine-stage-chaining`
- `npm run check`

## Rollback

- Revert the new source metadata fields
- Revert the routing updates and submission/schema propagation
- Revert the new checker case
- Remove this log entry
