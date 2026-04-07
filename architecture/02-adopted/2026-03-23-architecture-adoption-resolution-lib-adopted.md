# Architecture Adoption Resolution Lib Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes`
- Decision: `adopted`
- Status: `product_materialized`

## Problem

Directive Workspace had an executable review lane, but the Decide step was still weakly operationalized.

That meant Architecture could review an evaluated slice, yet still leave adoption judgment implicit across:
- readiness gates
- artifact-type selection
- Runtime threshold logic
- completion-status classification

## Adopted result

Added canonical product-owned code:
- `shared/lib/architecture-adoption-resolution.ts`

Added bounded host mirror:
- `mission-control/src/lib/directive-workspace/architecture-adoption-resolution.ts`

Bound the Decide step to an executable checker:
- `mission-control/scripts/check-directive-architecture-adoption-resolution.ts`

The new resolver:
1. consumes the executable Architecture review resolution when available
2. checks adoption readiness against the canonical contract
3. resolves artifact type from the selection matrix
4. decides `adopt`, `stay_experimental`, or `hand_off_to_runtime`
5. returns completion status, required gaps, and Runtime handoff requirement in product-owned form

## Why this improves the system

This makes Architecture better at its job because the Decide step is no longer just:
- a contract
- a schema
- a reviewer judgment

It is now executable product logic that composes the review lane and the adoption lane into one canonical system path.

## Rollback

If this Decide-step resolver proves unhelpful:
- remove `shared/lib/architecture-adoption-resolution.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-adoption-resolution.ts`
- remove `mission-control/scripts/check-directive-architecture-adoption-resolution.ts`
- revert the inventory, workflow, README, and changelog updates tied to this slice
