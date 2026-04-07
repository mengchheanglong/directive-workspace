# 2026-04-05 Engine Routing Structured Explanation Surface

## Why

Routing had become more accurate, but the read surface still relied mostly on free-text rationale. Operators and checks could not cleanly separate keyword, metadata, and gap-alignment contributions.

## What changed

- Added stable structured routing explanation data to `DirectiveEngineRoutingAssessment`:
  - `keywordLaneScores`
  - `metadataLaneScores`
  - `gapLaneScores`
  - `explanationBreakdown.keywordSignals`
  - `explanationBreakdown.metadataSignals`
  - `explanationBreakdown.gapAlignmentSignals`
- Updated Engine routing to populate those explanation surfaces alongside the existing free-text rationale.
- Added a `Routing Explanation Breakdown` section to Engine run markdown reports in:
  - `discovery/lib/discovery-front-door.ts`
  - `hosts/standalone-host/runtime.ts`
- Extended `check-directive-engine-stage-chaining` to assert the new structured explanation surface for metadata-, gap-, and keyword-driven cases.

## Proof

- `npm run check:directive-engine-stage-chaining`
- `npm run check`

## Rollback

- Revert the routing assessment shape change
- Revert the report-surface additions
- Revert the new checker assertions
- Remove this log entry
