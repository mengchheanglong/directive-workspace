# 2026-04-03 - DW web-host checker helper deduplication

## Summary

- added `scripts/directive-dw-web-host-check-helpers.ts` as the shared helper surface for the bounded Directive Workspace web-host follow-up checker family
- migrated the `check-directive-*-dw-web-host-seam-review-compile-contract.ts` family onto the shared focus/report/read/assert helper surface
- migrated the `check-directive-*-dw-web-host-promotion-input-package.ts` family onto the same shared helper surface
- migrated the `check-directive-*-dw-web-host-profile-checker-decision.ts` family onto the same shared helper surface
- migrated the `check-directive-*-dw-web-host-retarget.ts` family onto the same shared Runtime state / assistance / specification helper surface

## Operator / maintainer effect

- removes repeated checker-local state resolution, runtime-promotion assistance lookup, candidate markdown listing, and artifact read scaffolding across the DW web-host checker family
- removes repeated checker-local promotion-spec read and retarget recommendation lookup across the retarget family
- keeps checker assertions and emitted result shapes unchanged
- narrows future checker-family fixes to one shared helper seam instead of many near-duplicate scripts

## Verification

- representative compile-contract, input-package, profile-checker-decision, and retarget checks passed across multiple candidate families
- `npm run check` passed after the shared-helper migration
