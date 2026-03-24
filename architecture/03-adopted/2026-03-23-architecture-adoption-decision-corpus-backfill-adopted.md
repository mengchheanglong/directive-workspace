# Architecture Adoption Decision Corpus Backfill Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Forge threshold check: `yes`
- Decision: `adopted`
- Status: `product_materialized`

## Problem

Directive Workspace had already retained six real Architecture adoption-decision artifacts, but those files were still maintained as hand-authored JSON even after the live writer existed.

That left the system only partially improved:
- the writer path was canonical
- the live Decide-step lane existed
- but the actual retained corpus still depended on manual backfill maintenance

## Adopted result

Added a canonical host backfill path:
- `mission-control/scripts/backfill-directive-architecture-adoption-decision-corpus.ts`

Added an executable checker:
- `mission-control/scripts/check-directive-architecture-adoption-decision-backfill.ts`

The bounded retained Architecture corpus is now reproducible through code for these six adopted slices:
1. `openmoss-review-feedback-lib`
2. `architecture-review-resolution-lib`
3. `architecture-adoption-resolution-lib`
4. `architecture-adoption-artifacts-lib`
5. `architecture-cycle-decision-summary-lib`
6. `scientify-literature-monitoring-forge-handoff`

## Why this improves the system

This makes Architecture better at its job because the current retained decision corpus is no longer only a manually-maintained state snapshot.

It is now:
- reproducible from the live review -> adoption -> retention lane
- checkable in temp workspaces
- easier to extend to later adopted slices without drifting back to hand-authored JSON

## Rollback

If the bounded corpus backfill path proves unhelpful:
- remove `mission-control/scripts/backfill-directive-architecture-adoption-decision-corpus.ts`
- remove `mission-control/scripts/check-directive-architecture-adoption-decision-backfill.ts`
- remove this adopted record and the companion experiment record
- revert the package and changelog updates tied to this slice
