# 2026-04-05 Engine Gap Matching Structured Alignment

## Why

Engine routing still matched open capability gaps mainly by token overlap. That left noisy repo titles too influential even when structured source signals already said the source was really about improving Directive Workspace itself.

## What changed

- Added structured gap-alignment scoring in `engine/routing.ts`.
- Gap matching now combines:
  - token overlap
  - primary adoption target alignment
  - executable-code and workflow-pattern alignment
  - explicit system-improvement alignment
  - explicit workflow-boundary-shape alignment
- Added an Engine checker case where a runtime-looking executable repo still matches the Architecture workflow-boundary gap because the structured source signals point to Engine improvement.
- Added routing rationale text when structured source signals materially strengthen the selected gap match.

## Proof

- `npm run check:directive-engine-stage-chaining`
- `npm run check`

## Rollback

- Revert the routing gap-matching changes
- Revert the new checker case
- Remove this log entry
