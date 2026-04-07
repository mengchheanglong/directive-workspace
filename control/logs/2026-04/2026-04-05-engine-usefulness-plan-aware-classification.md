# 2026-04-05 Engine Usefulness Plan-Aware Classification

## Why

Engine usefulness was still being classified before extraction, adaptation, and improvement plans existed. That made usefulness lean too hard on lane choice and source metadata instead of the Engine's own generated plan truth.

## What changed

- Added a usefulness-planning input shape that includes:
  - planning input
  - extraction plan
  - adaptation plan
  - improvement plan
- Moved usefulness classification in `engine/directive-engine.ts` so it now runs after extraction, adaptation, and improvement planning.
- Updated `engine/usefulness.ts` so:
  - Runtime direct usefulness can be justified from generated Runtime adaptation/improvement plans
  - Architecture meta usefulness can be justified from generated Engine-self-improvement plans
- Extended `check-directive-engine-stage-chaining` to require plan-aware usefulness rationale text for both Runtime and Architecture control cases.

## Proof

- `npm run check:directive-engine-stage-chaining`
- `npm run check`

## Rollback

- Revert the Engine usefulness/lane type changes
- Revert the checker expectation updates
- Remove this log entry
