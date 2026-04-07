# Architecture Adoption Artifacts Lib Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes`
- Decision: `adopted`
- Status: `product_materialized`

## Problem

Directive Workspace had:
- a contract for Architecture adoption
- a schema for machine-readable adoption decisions
- an executable resolver for Decide-step judgment

But it still did not have canonical code that could emit the actual schema-shaped adoption artifact.

That left the Decide step half-operationalized: the judgment was executable, but the artifact remained mostly prose-bound.

## Adopted result

Added canonical product-owned code:
- `shared/lib/architecture-adoption-artifacts.ts`

Added bounded host mirror:
- `mission-control/src/lib/directive-workspace/architecture-adoption-artifacts.ts`

Bound the artifact lane to an executable checker:
- `mission-control/scripts/check-directive-architecture-adoption-artifacts.ts`

The new helper:
1. composes `architecture-adoption-resolution.ts`
2. emits the canonical `architecture-adoption-decision.schema.json` shape
3. records stay-experimental reasons, Runtime handoff details, and meta self-improvement evidence in one generated object
4. keeps the Decide step host-neutral and machine-readable

## Why this improves the system

This makes Architecture better at its job because the Decide step is no longer split between:
- executable judgment
- schema intent
- prose artifact writing

The system can now resolve and materialize Architecture adoption through one canonical product-owned code path.

## Rollback

If this artifact builder proves unhelpful:
- remove `shared/lib/architecture-adoption-artifacts.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-adoption-artifacts.ts`
- remove `mission-control/scripts/check-directive-architecture-adoption-artifacts.ts`
- revert the inventory, workflow, README, and changelog updates tied to this slice
