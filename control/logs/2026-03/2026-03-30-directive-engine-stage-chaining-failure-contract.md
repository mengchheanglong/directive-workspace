# Loop-Run Template

## Batched loop run 2026-03-30-2 - directive engine stage chaining failure contract

Affected layer:
- Engine proof/evaluator contract inside the bounded checker-definition pilot

Owning lane:
- Architecture

Mission usefulness:
- give `check:directive-engine-stage-chaining` one honest machine-readable failure surface so the pilot can validate both success and failure facts without mutating broader Engine truth or stored replay artifacts

Proof path:
- add a checker-local negative-control probe that skews only the structural control input toward Runtime
- refactor `scripts/check-directive-engine-stage-chaining.ts` to emit stable success/failure JSON instead of assertion-only exits
- declare the bounded failure probe in `scripts/checker-definition-pilot.json`
- rerun the targeted checker, pilot validator, workspace-state report, and full `npm run check`

Rollback path:
- remove the probe-mode override and structured-failure return path from `scripts/check-directive-engine-stage-chaining.ts`
- remove the `directive_engine_stage_chaining.failureExpectation` block from `scripts/checker-definition-pilot.json`

Verified micro-fixes:
- `scripts/check-directive-engine-stage-chaining.ts`: replaced assertion-only flow with a validator that returns stable JSON success/failure payloads and supports a bounded `--probe=structural_control_runtime_skew` negative-control path.
- `scripts/check-directive-engine-stage-chaining.ts`: kept the probe local to the checker by overriding only the structural control input; stored Architecture replay fixtures remain read-only and unchanged.
- `scripts/checker-definition-pilot.json`: declared the new bounded failure expectation for `directive_engine_stage_chaining`, including exact machine-readable failure facts for the first stable violation.

Verification run:
- `npm run check:directive-engine-stage-chaining`
- `npm run check:checker-definition-pilot`
- `npm run report:directive-workspace-state`
- `npm run check`

Stop summary:
- The next-highest-ROI bounded slice succeeded without widening the pilot beyond its 3 approved members.
- `check:directive-engine-stage-chaining` now exposes one honest checker-local failure contract through a local input override rather than Engine breakage or fixture corruption.
- Stop at this verified boundary; any further pilot expansion would be a new slice.
