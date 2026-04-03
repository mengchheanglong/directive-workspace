# 2026-04-03 - Runtime follow-up canonical operator surface

## Summary

- added `shared/lib/runtime-follow-up-navigation.ts` as the shared builder for a canonical `runtime/follow-up` operator navigation report
- added `scripts/report-runtime-follow-up-navigation.ts` and the `npm run report:runtime-follow-up-navigation` entry point
- updated `operator-start.md`, `runtime/README.md`, and `runtime/follow-up/README.md` to point operators to the report instead of raw folder browsing
- clarified `runtime/follow-up` into active follow-up records, support references, and archive
- tightened NOTE-mode guidance so the normal daily stop remains the active follow-up record unless deeper work adds concrete product value

## Operator effect

- operators now have one canonical entry surface for `runtime/follow-up` instead of relying on folder recency
- active cases whose current head is still the follow-up record are separated from deeper support bundles and historical archive entries
- daily Runtime navigation is lighter because NOTE-mode defaults are stated directly at the entry surfaces

## Verification

- `npm run report:runtime-follow-up-navigation` passed
- `npm run check:control-authority` passed
- `npm run check:directive-workspace-composition` passed
- `npm run check` passed
