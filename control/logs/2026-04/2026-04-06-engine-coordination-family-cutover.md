# 2026-04-06 - Engine coordination family cutover

## Affected layer

- `engine/coordination/`

## Owning lane

- Engine core

## Mission usefulness

Move completion selection and read-only lifecycle coordination into a truthful Engine-owned home so cross-lane coordination is no longer presented as residual `shared/lib` support.

## Changes

- Moved the coordination family from `shared/lib/` into `engine/coordination/`:
  - `bounded-persistent-coordination.ts`
  - `completion-slice-selector.ts`
  - `read-only-lifecycle-coordination.ts`
- Added grouped Engine coordination surfaces:
  - `engine/coordination/index.ts`
  - `engine/coordination/README.md`
- Updated script and Runtime consumers to import from `engine/coordination/`.
- Updated active control state references to use:
  - `engine/coordination/read-only-lifecycle-coordination.ts`
  - `engine/coordination/bounded-persistent-coordination.ts`

## Proof path

- `npm run check:completion-slice-selector`
- `npm run check:bounded-persistent-coordination`
- `npm run check:read-only-lifecycle-coordination`
- `npm run check:runtime-loop-control`
- `npm run check`

## Rollback path

- Move the three coordination files back to `shared/lib/`
- Revert the import rewrites and control-state path updates

## Stop summary

Coordination ownership is now explicit: completion selection and read-only lifecycle coordination live under Engine, not under the residual shared support layer.
