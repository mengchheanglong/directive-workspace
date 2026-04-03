# 2026-04-03 - Safe dead-surface cleanup

## Summary

- removed `architecture/deep-tail-structural-audit.md` after the deep-tail collapse completed and the audit became reference-free historical scaffolding
- removed ignored local virtualenv scratch under `scratch/venvs/`

## Why this was safe

- `architecture/deep-tail-structural-audit.md` had no remaining repo-local references and its conclusions were already superseded by:
  - `control/logs/2026-04/2026-04-03-architecture-deep-tail-physical-collapse.md`
  - `architecture/README.md`
- `scratch/venvs/` is explicitly local, ignored, rebuildable scratch and not part of product truth

## Verification

- `npm run check:control-authority` passed
- `npm run check:directive-workspace-composition` passed
- `npm run check` passed
