# Cycle Entry

Cycle 2

Chosen task:

Extend the checker-definition pilot by exactly one parity-style checker.

Why it won:

`check:case-planner-parity` was already in the main check chain, materially different from the first two pilot entries, and cheap to verify through stable JSON proof markers without broadening the schema or opening new seams.

Affected layer:

Shared checker-definition pilot registry and validator.

Owning lane:

Architecture.

Mission usefulness:

Adds one more representative checker shape to the shared pilot so the checker-definition pattern now covers control-surface structure, Engine stage/routing behavior, and parity/planner truth.

Proof path:

Add one registry entry for `check:case-planner-parity`, keep the shared schema unchanged, update the validator's bounded registry-size expectation, then re-run the pilot and required repo truth checks.

Rollback path:

Remove the `case_planner_parity` registry entry, revert the validator count change, and delete this cycle log.

Stop-line:

Stop after exactly one parity-style checker is added and validated, with no fourth checker and no schema redesign.

Files touched:

- `scripts/checker-definition-pilot.json`
- `scripts/check-checker-definition-pilot.ts`
- `control/logs/2026-03/2026-03-30-checker-definition-pilot-parity-extension.md`

Verification run:

- `npm run check:checker-definition-pilot`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

The checker-definition pilot now covers three bounded entries, with `check:case-planner-parity` added as the sole parity-style extension. The validator still executes every declared checker and now confirms the parity script by requiring both a positive planner outcome marker and the blocked-fixture marker in real output.

Next likely move:

If the pilot continues to pay for itself, tighten the validator around explicit pilot membership metadata rather than adding a fourth checker.

Risks / notes:

- The pilot remains intentionally bounded; no general checker migration or schema generalization was opened.
- Spectral and OPA stay unchanged as reserve candidates only.
