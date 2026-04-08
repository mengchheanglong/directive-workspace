# Completion Control State

This folder holds machine-readable control surfaces for bounded loop runs.

Current files:

- `completion-status.json` - current completion target, closed seams, and last completed slice
- `completion-slices.json` - bounded completion-slice registry used by the canonical selector
- `coordination-ledger.json` - bounded persistent coordination ledger for cross-session staleness, cadence drift, and case-diff signals
- `operator-simplicity-migration-status.json` - current operator-simplicity migration target and last completed slice
- `operator-simplicity-migration-slices.json` - bounded operator-simplicity migration registry used by the migration selector

Rules:

- these files are canonical machine-readable control truth
- update them only when repo truth materially changes
- do not treat them as seam-opening authority ahead of proof

Authority split:

- `control/state/` = control truth
- `engine/workspace-truth.ts` = product truth summary
- `state/` = case/event persistence
- `control/logs/` = historical logs, not current authority

Primary consumer:

- `scripts/report-next-completion-slice.ts`
- `scripts/check-completion-slice-selector.ts`
