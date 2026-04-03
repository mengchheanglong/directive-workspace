# Next Checker Family Grouping Audit

- Date: 2026-04-03
- Slice type: checker-family audit
- Scope: `scripts/`, `package.json`, `control/state/operator-simplicity-migration-*.json`

## Why this slice

After the first grouped family and first archive move, the canonical selector advanced to `next_checker_family_grouping_audit`.

The goal was to replace a generic "audit another family first" block with one exact next candidate backed by repo-local reference proof.

## What the audit proved

- the `openclaw` checker trio is the lowest-risk next family:
  - `check-openclaw-discovery-submission-adapter.ts`
  - `check-openclaw-maintenance-watchdog-signal-adapter.ts`
  - `check-openclaw-runtime-verification-signal-adapter.ts`
- exact path references for that trio are limited to `package.json`
- the family does not rely on sibling script paths
- the trio is semantically coherent: three Discovery-facing adapter checks for the same OpenClaw signal boundary

## Registry outcome

- marked `next_checker_family_grouping_audit` completed
- reopened `next_checker_family_grouping_move`
- narrowed the next move to the `openclaw` trio only

## Stop-line

The next family move is now exact and bounded; broader checker reshuffles remain out of scope.
