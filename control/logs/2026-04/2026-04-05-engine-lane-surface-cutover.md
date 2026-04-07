# 2026-04-05 — Engine Lane Surface Cutover

## Slice

Finalize the active public, boundary, and doctrine surfaces for the already-moved Engine lane/state code.

## Why this slice first

The mechanical move had already placed lane operating code under:

- `engine/architecture/`
- `engine/runtime/`
- `engine/discovery/`
- `engine/state/`

But the package surface, host-boundary checker, standalone inventory, and active docs still described the old `shared/lib/*` lane layout. That left the repo in a half-migrated state.

This slice closes that gap without forcing a broader one-shot redesign.

## Changes

- Root package exports now expose:
  - `./engine/architecture`
  - `./engine/discovery`
  - `./engine/runtime`
  - `./engine/state`
- Root barrel now exports:
  - `discovery`
  - `architecture`
  - `runtime`
  - `state`
- `STANDALONE_SURFACE.json` now treats the moved lane/state barrels as Engine surfaces instead of legacy shared barrels.
- `scripts/check-host-adapter-boundary.ts` now allows host imports against the moved Engine lane/state paths and the residual `shared/lib/` support modules hosts still consume.
- Active doctrine/readme/contract surfaces now describe:
  - `engine/` as the executable kernel + lane + state home
  - `shared/lib/` as residual support/adapters
  - `architecture/`, `runtime/`, and `discovery/` as artifact/proof corpora rather than code homes
- Active runtime boundary inventory paths now point at the moved Engine lane modules.

## Stop-line

Stop after the active surfaces are truthful and the targeted validation passes.

Do not continue into historical artifact-record path rewrites or the remaining `shared/lib/` service/adapter re-homing in this slice.
