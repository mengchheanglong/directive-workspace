# 2026-04-06 - Architecture surface prune and naming cutover

- affected layer: `architecture/`, `architecture/lib/`, shared Architecture contracts/schemas
- owning lane: `Architecture`
- mission usefulness: remove dead Architecture storage from the clone-ready product tree and stop emitting stale active naming
- proof path:
  - `npm run check:architecture-materialization-due-check`
  - `npm run check:architecture-composition`
  - `npm run check:control-authority`
  - `npm run check:directive-workspace-composition`
  - `npm run check`
- rollback path:
  - restore deleted `architecture/99-archive/` from version control if historical archive access is needed
  - rename `architecture/04-materialization/` back to `architecture/deep-materialization/`
  - revert active naming patches if `engine-code` emission causes downstream incompatibility

## What changed

- deleted dead `architecture/99-archive/`
- renamed the physical DEEP storage root from `architecture/deep-materialization/` to `architecture/04-materialization/`
- updated active stage-map/linkage-index owners to the new storage root
- updated operator-facing docs to the new storage root
- switched active executable Architecture artifact naming from `shared-lib` to `engine-code`
- kept legacy `shared-lib` and `reference-pattern` acceptance for historical reads and compatibility

## Stop-line

- no historical corpus rewrite was attempted
- historical logs and older experiment artifacts may still mention deleted or legacy names
- active code, active doctrine, and current product surfaces now use the new names

