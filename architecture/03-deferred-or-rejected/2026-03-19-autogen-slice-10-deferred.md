# Deferred Decision: autogen Slice 10 (2026-03-19)

## decision
- **Defer**

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\autogen`
- Commit: `b0477309d2a0baf489aa256646e41e513ab3bfe8`
- Describe: `python-v0.7.5-6-gb0477309d`

## why deferred
1. Broad framework scope exceeds current Directive bounded integration need.
2. Extractable value is architectural (layering/event contracts), not a near-term runtime requirement.
3. Direct framework adoption would add high integration surface with limited incremental ROI right now.

## extracted value retained
- Layered core/orchestration/extension boundary model.
- Event-driven handler contract pattern.
- Tool-trust policy cue for external integration points.

## excluded as baggage
- Full AutoGen runtime and dependency ecosystem.
- Studio/Bench/GUI stack adoption.
- Cross-language runtime platform migration.

## re-entry criteria
1. Directive lifecycle engine needs explicit event-bus-driven pluginization beyond current mechanisms, and
2. a narrow extracted adaptation target is defined (no framework import).

## rollback
- Delete this defer record and corresponding execution artifact if re-opened.
