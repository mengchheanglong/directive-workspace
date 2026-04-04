# 2026-04-04 - DW web-host sync checker registry consolidation

- Scope: Opportunity 1 of the bounded optimization frontier.
- Change: moved the six standard DW web-host sync-stage checker families (`retarget`, `seam-review-compile-contract`, `promotion-input-package`, `profile-checker-decision`) onto shared registry-driven runners in `scripts/directive-dw-web-host-check-helpers.ts`.
- Compatibility: kept all existing per-case script entrypoints and `package.json` command names stable by replacing the duplicated script bodies with thin wrappers.
- Intentional non-scope: left the special `directive-pressure-mini-swe-dw-web-host-retarget` script and the async `runtime-implementation-slice` / `runtime-promotion` families unchanged because they follow different execution patterns.
- Proof:
  - representative sync-stage checks passed across multiple cases
  - `npm run check` passed after the consolidation
- Rollback: restore the prior per-case checker bodies and remove the shared registry runners.
