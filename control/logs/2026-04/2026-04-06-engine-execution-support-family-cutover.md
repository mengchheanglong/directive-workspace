# 2026-04-06 - Engine execution support family cutover

## Affected layer

- `engine/execution/`

## Owning lane

- Engine core

## Mission usefulness

Move runner state, Engine run artifact reads, and cross-run evidence aggregation into a truthful Engine execution/report home so Runtime, Discovery, hosts, and coordination all consume a canonical Engine-owned execution surface.

## Changes

- Moved the execution support family from `shared/lib/` into `engine/execution/`:
  - `directive-runner-state.ts`
  - `run-evidence-aggregation.ts`
  - `engine-run-artifacts.ts`
- Added grouped Engine execution surfaces:
  - `engine/execution/index.ts`
  - `engine/execution/README.md`
- Updated Runtime, host, Discovery, state, and checker consumers to import from `engine/execution/`.
- Updated active control state and inventories to use the canonical Engine execution paths.
- Updated the active gap registry note for run-evidence aggregation to reflect the current canonical file home.

## Proof path

- `npm run check:runtime-cycle-evidence-feedback`
- `npm run check:runtime-promotion-assistance`
- `npm run check:host-adapter-boundary`
- `npm run check:directive-engine-run-canonical-surface`
- `npm run check`

## Rollback path

- Move the three execution-support files back to `shared/lib/`
- Revert import rewrites, export updates, and active inventory path updates

## Stop summary

Engine execution/report support is now explicit: runner state, Engine run artifact reads, and evidence aggregation live in Engine rather than the residual shared support layer.
