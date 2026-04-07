# Architecture Adoption Decision Writer Lib Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes`
- Decision: `adopted`
- Status: `product_materialized`

## Problem

Directive Workspace had a machine-readable Architecture adoption artifact builder, but retained adoption-decision JSON files still depended on manual backfill work.

That left the Decide-step system incomplete:
- review resolution was executable
- adoption resolution was executable
- adoption artifacts were executable
- cycle evaluation could consume them
- but no canonical emission path persisted them beside adopted records

## Adopted result

Added canonical product-owned code:
- `shared/lib/architecture-adoption-decision-writer.ts`

Added bounded host mirror:
- `mission-control/src/lib/directive-workspace/architecture-adoption-decision-writer.ts`

Added host writer entrypoint:
- `mission-control/scripts/write-directive-architecture-adoption-decision.ts`

Added executable checker:
- `mission-control/scripts/check-directive-architecture-adoption-decision-writer.ts`

The retained emission path now:
1. derives a default output path from the adopted record in `architecture/02-adopted/`
2. resolves review and adoption canonically when raw review checks are provided
3. builds the canonical `architecture-adoption-decision` artifact
4. writes the JSON artifact beside the adopted record by default

## Why this improves the system

This makes Architecture better at its job because retained Decide-step output is now part of the normal system path instead of a manual follow-up habit.

That reduces drift between:
- adopted prose records
- machine-readable adoption decisions
- cycle-evaluation input
- corpus-governance input
- live review/adoption resolution and retained decision state

## Rollback

If the retained emission path proves noisy or premature:
- remove `shared/lib/architecture-adoption-decision-writer.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-adoption-decision-writer.ts`
- remove `mission-control/scripts/write-directive-architecture-adoption-decision.ts`
- remove `mission-control/scripts/check-directive-architecture-adoption-decision-writer.ts`
- revert the workflow, inventory, package, and changelog updates tied to this slice

