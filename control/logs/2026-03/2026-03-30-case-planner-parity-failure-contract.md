# Loop-Run Template

## Batched loop run 2026-03-30-3 - case planner parity failure contract

Affected layer:
- Engine proof/evaluator contract around mirrored case-planning parity

Owning lane:
- Architecture

Mission usefulness:
- give `check:case-planner-parity` one honest machine-readable failure surface through checker-local mirrored snapshot control instead of authoritative state mutation

Proof path:
- keep the checker bounded to the existing golden mirrored planner set
- add a checker-local in-memory snapshot probe that only skews the one bounded retention recommendation case from `recommend_task` to `stop`
- refactor `scripts/check-case-planner-parity.ts` to emit stable success/failure JSON
- declare the bounded failure probe in `scripts/checker-definition-pilot.json`
- rerun the targeted checker, direct probe, pilot validator, workspace-state report, and full `npm run check`

Rollback path:
- remove the snapshot probe and structured-failure return path from `scripts/check-case-planner-parity.ts`
- remove the `case_planner_parity.failureExpectation` block from `scripts/checker-definition-pilot.json`

Verified micro-fixes:
- `scripts/check-case-planner-parity.ts`: replaced assertion-only flow with a validator that returns stable JSON success/failure payloads.
- `scripts/check-case-planner-parity.ts`: added a bounded `--probe=recommend_task_stop_skew` path that overrides only the in-memory mirrored snapshot for the retention recommendation control case.
- `scripts/checker-definition-pilot.json`: declared the new bounded failure expectation for `case_planner_parity`, including exact machine-readable failure facts for the first stable violation.

Verification run:
- `npm run check:case-planner-parity`
- `node --experimental-strip-types ./scripts/check-case-planner-parity.ts --probe=recommend_task_stop_skew`
- `npm run check:checker-definition-pilot`
- `npm run report:directive-workspace-state`
- `npm run check`

Stop summary:
- The checker now has one honest failure-contract seam that stays local to mirrored planner input and does not mutate authoritative case snapshots, event logs, or stored repo fixtures.
- The pilot remains bounded to its existing 3 approved members.
- Stop at this verified boundary; broader planner hardening would be a new slice.
