# Architecture Cycle Decision Summary Lib

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes` - this improves Architecture cycle evaluation without needing a runtime surface

## Why this slice exists

Directive Workspace now has a machine-readable adoption artifact builder, but Architecture cycle evaluation still depended on:
- prose adopted records
- manual count extraction
- repeated interpretation of verdict/usefulness/handoff state

That meant the system generated decision artifacts but did not yet consume them in one of its core self-improvement lanes.

## Experiment move

Materialize a canonical shared lib:
- `shared/lib/architecture-cycle-decision-summary.ts`

Mirror it in Mission Control:
- `mission-control/src/lib/directive-workspace/architecture-cycle-decision-summary.ts`

Bind it to an executable Architecture checker:
- `mission-control/scripts/check-directive-architecture-cycle-decision-summary.ts`

Update the cycle-evaluation template so decision-artifact metrics are explicit inputs instead of implied prose interpretation.

## Expected result

Architecture cycle evaluation should be able to summarize:
- adoption verdict distribution
- artifact-type distribution
- completion-status distribution
- Runtime handoff demand
- meta self-improvement category coverage

from generated adoption artifacts directly.
