# 2026-04-03 Operator Simplicity Loop Control

## Why this slice

- operator-simplicity cleanup had become real enough to loop, but the repo still lacked a canonical selector for the next bounded migration slice
- repeated cleanup runs were still relying on remembered context instead of machine-readable migration truth

## Bounded changes

- added `operator-simplicity-migration.md` as the human-readable migration anchor
- added machine-readable migration status and slice registry under `control/state/`
- added `report:operator-simplicity-loop-control` and `check:operator-simplicity-loop-control`
- wired the new operator-simplicity loop-control checker into `npm run check`
- updated the operator/control docs so the new loop surface is discoverable

## Proof

- the new loop-control surface selects the next bounded simplicity slice from repo-local migration truth
- current selected slice is `runtime_follow_up_archive_feasibility_audit`
- the report surface is read-only and does not mutate migration state
- full repo checks still pass

## Stop line

- stop after the migration selector, report/check surfaces, command wiring, and verification
