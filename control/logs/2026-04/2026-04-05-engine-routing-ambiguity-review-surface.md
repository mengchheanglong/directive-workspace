# 2026-04-05 Engine Routing Ambiguity Review Surface

- Affected layer: `engine/` routing assessment and report surfaces.
- Owning lane: Engine core.
- Mission usefulness: expose when keyword, metadata, and gap-alignment winners disagree so the Engine can preserve human-review pressure instead of silently flattening ambiguous route signals.
- Proof path:
  - `npm run check:directive-engine-stage-chaining`
  - `npm run check:frontend-host`
  - `npm run check:directive-workspace-composition`
  - `npm run check`
- Rollback path: revert the routing assessment shape additions, report rendering additions, checker probe, and this log.

## Changes

- Added `ambiguitySummary` to `DirectiveEngineRoutingAssessment` so route-selection disagreement is represented in stable machine-readable form.
- Added `ambiguitySignals` to the structured routing explanation breakdown.
- Marked Engine `routeConflict` when keyword/metadata/gap winner families materially disagree with the final recommended lane.
- Forced human review when that disagreement remains materially present, even if the Engine can still select a lane winner.
- Added a stage-chaining probe that proves an Architecture recommendation can still carry explicit ambiguity review when runtime-looking keywords and Architecture-driving metadata disagree.
- Updated standalone and Discovery run reports to render the ambiguity explanation surface.

## Stop Summary

- This is a bounded reporting/trust slice only.
- It does not redesign routing weights or add a broader adjudication framework.
