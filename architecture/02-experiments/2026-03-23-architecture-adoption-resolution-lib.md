# Architecture Adoption Resolution Lib

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Forge threshold check: `yes` - this improves Directive Workspace's Decide-step quality without needing a runtime surface

## Why this slice exists

Directive Workspace already had:
- Architecture adoption criteria in `shared/contracts/architecture-adoption-criteria.md`
- a machine-readable adoption schema in `shared/schemas/architecture-adoption-decision.schema.json`
- an executable Architecture review lane in `shared/lib/architecture-review-resolution.ts`

But the Decide step still lacked product-owned code that could combine:
- review outcome
- readiness gates
- artifact-type selection
- Forge threshold logic

into one deterministic adoption decision.

## Experiment move

Materialize a canonical shared lib:
- `shared/lib/architecture-adoption-resolution.ts`

Mirror it in Mission Control:
- `mission-control/src/lib/directive-workspace/architecture-adoption-resolution.ts`

Bind it to an executable Architecture checker:
- `mission-control/scripts/check-directive-architecture-adoption-resolution.ts`

## Expected result

Architecture adoption becomes executable instead of remaining contract + schema + prose.

The Decide step should now be able to resolve:
- `adopt`
- `stay_experimental`
- `hand_off_to_forge`

with explicit rationale, completion status, required gaps, and Forge handoff requirement.
