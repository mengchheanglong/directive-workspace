# Deferred Decision: AutoResearchClaw Slice 9 (2026-03-19)

## decision
- **Defer**

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\AutoResearchClaw`
- Commit: `f17bf61191bc0ba4c2e4efd6ab92ee2bbafd2441`
- Describe: `v0.3.0-98-gf17bf61`

## why deferred
1. High integration complexity (23-stage runtime) exceeds current Directive bounded-slice need.
2. Core extracted value (gates, rollback guards, checkpoint policy) is already partially covered by adopted slices (`gh-aw`, `scientify`, `openmoss`).
3. Direct runtime adoption would introduce unnecessary baggage and runway risk.

## extracted value retained
- Gate-stage policy template,
- bounded PIVOT/REFINE rollback guard,
- explicit lifecycle checkpointing pattern.

## excluded as baggage
- Full autonomous paper pipeline runtime and sandbox subsystems.
- MetaClaw bridge runtime coupling.
- End-to-end paper authoring/export machinery.

## re-entry criteria
1. Directive requires a dedicated research-automation vertical beyond current framework scope, and
2. a thin extracted subset is defined with strict boundaries and no runtime stack import.

## rollback
- Delete this defer record and corresponding execution artifact if re-opened.
