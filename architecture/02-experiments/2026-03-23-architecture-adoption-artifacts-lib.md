# Architecture Adoption Artifacts Lib

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes` - this improves Directive Workspace's Decide-step output quality without needing a runtime surface

## Why this slice exists

Directive Workspace already had:
- a machine-readable adoption schema in `shared/schemas/architecture-adoption-decision.schema.json`
- an executable Decide-step resolver in `shared/lib/architecture-adoption-resolution.ts`

But the Decide step still ended with:
- resolver output
- prose adopted records
- checker-specific expectations

instead of one canonical artifact generator that could emit the schema-shaped adoption decision directly.

## Experiment move

Materialize a canonical shared lib:
- `shared/lib/architecture-adoption-artifacts.ts`

Mirror it in Mission Control:
- `mission-control/src/lib/directive-workspace/architecture-adoption-artifacts.ts`

Bind it to an executable Architecture checker:
- `mission-control/scripts/check-directive-architecture-adoption-artifacts.ts`

## Expected result

Architecture should be able to generate a canonical adoption artifact that:
- matches `architecture-adoption-decision.schema.json`
- composes the executable adoption resolver instead of bypassing it
- preserves meta self-improvement data and Runtime handoff data in one machine-readable output
