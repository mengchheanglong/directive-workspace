# Architecture Cycle Decision Summary Lib Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes`
- Decision: `adopted`
- Status: `product_materialized`

## Problem

Directive Workspace could now generate machine-readable adoption decisions, but the cycle-evaluation lane still mostly re-derived decision composition from prose.

That weakened the payoff of the new adoption artifact builder:
- the Decide step was executable
- the artifact was machine-readable
- but the self-improvement lane still depended on manual interpretation

## Adopted result

Added canonical product-owned code:
- `shared/lib/architecture-cycle-decision-summary.ts`

Added bounded host mirror:
- `mission-control/src/lib/directive-workspace/architecture-cycle-decision-summary.ts`

Bound the cycle-decision lane to an executable checker:
- `mission-control/scripts/check-directive-architecture-cycle-decision-summary.ts`

Updated the Architecture cycle-evaluation template and workflow so generated adoption artifacts are now an explicit cycle input when available.

The new helper summarizes:
1. verdict composition
2. usefulness-level composition
3. artifact-type composition
4. completion-status composition
5. Runtime handoff demand
6. meta self-improvement category coverage

## Why this improves the system

This makes Architecture better at its job because one of its core self-improvement lanes now consumes executable decision outputs instead of only prose adopted records.

That reduces interpretation drift and makes cycle evaluation more comparable across waves.

## Rollback

If this cycle-decision summary helper proves unhelpful:
- remove `shared/lib/architecture-cycle-decision-summary.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-cycle-decision-summary.ts`
- remove `mission-control/scripts/check-directive-architecture-cycle-decision-summary.ts`
- revert the workflow, template, inventory, and changelog updates tied to this slice
