# Deferred Decision: openhands Slice 11 (2026-03-19)

## decision
- **Defer**

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\OpenHands`
- Commit: `28ecf0640425a4e27e1fde7d6b7b863a3e70de51`
- Describe: `0.22.0-3016-g28ecf0640`

## why deferred
1. High overlap with current active execution lanes (Codex + adopted mini-swe-agent patterns).
2. Product/platform breadth is large relative to incremental framework ROI for current Directive phase.
3. Direct adoption would introduce runtime/platform baggage outside architecture-lab’s extracted-pattern objective.

## extracted value retained
- Surface separation model (SDK/CLI/GUI/Cloud/Enterprise),
- runtime boundary configuration toggles,
- extension/microagent toggle governance pattern.

## excluded as baggage
- Full OpenHands runtime and deployment stack.
- Enterprise feature plane and hosting model.
- Runtime replacement of mission-control execution surfaces.

## re-entry criteria
1. A concrete, unresolved integration gap appears in current execution lanes, and
2. a narrow extracted subset from OpenHands is identified that directly addresses that gap with low migration risk.

## rollback
- Delete this defer record and corresponding execution artifact if re-opened.
