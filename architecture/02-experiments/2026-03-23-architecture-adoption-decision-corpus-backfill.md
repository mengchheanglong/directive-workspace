# Architecture Adoption Decision Corpus Backfill

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Forge threshold check: `yes` - this improves retained Architecture decision-state maintenance without requiring a runtime surface

## Why this slice exists

Directive Workspace had:
- a retained six-slice Architecture adoption-decision corpus
- a live writer that could resolve review plus adoption and retain the decision artifact

But the real corpus still depended on hand-authored JSON files already sitting in `architecture/03-adopted/`.

That meant the system had a live lane in theory, but its current retained corpus was not yet generated through that lane.

## Experiment move

Add a canonical host backfill path:
- `mission-control/scripts/backfill-directive-architecture-adoption-decision-corpus.ts`

Add an executable proof:
- `mission-control/scripts/check-directive-architecture-adoption-decision-backfill.ts`

Use the live writer on the current bounded retained corpus:
1. `openmoss-review-feedback-lib`
2. `architecture-review-resolution-lib`
3. `architecture-adoption-resolution-lib`
4. `architecture-adoption-artifacts-lib`
5. `architecture-cycle-decision-summary-lib`
6. `scientify-literature-monitoring-forge-handoff`

## Expected result

The retained Architecture decision corpus should be reproducible from code:
- same six adjacent `*-adoption-decision.json` artifacts
- same cycle-summary composition
- no dependence on hand-authored JSON maintenance for the bounded selected corpus
