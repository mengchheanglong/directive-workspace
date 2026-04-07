# 2026-04-06 - Architecture top-level sequential renumbering

- affected layer: `architecture/`, active Architecture read surfaces, Architecture state/frontend checks
- owning lane: `Architecture`
- mission usefulness: restore a clean sequential active tree for clone-ready use without changing the underlying lifecycle semantics
- proof path:
  - `npm run check:architecture-composition`
  - `npm run check:architecture-materialization-due-check`
  - `npm run check:directive-workspace-composition`
  - `npm run check:frontend-host`
  - `npm run check`
- rollback path:
  - rename `architecture/01-experiments` back to `architecture/02-experiments`
  - rename `architecture/02-adopted` back to `architecture/03-adopted`
  - rename `architecture/03-deferred-or-rejected` back to `architecture/04-deferred-or-rejected`
  - rename `architecture/04-materialization` back to `architecture/materialization`
  - revert the exact path-string replacements in active code/docs/state

## Cutover map

- `architecture/02-experiments` -> `architecture/01-experiments`
- `architecture/03-adopted` -> `architecture/02-adopted`
- `architecture/04-deferred-or-rejected` -> `architecture/03-deferred-or-rejected`
- `architecture/materialization` -> `architecture/04-materialization`

## Notes

- logical deep-tail artifact paths still remain `architecture/04-implementation-targets` through `architecture/09-post-consumption-evaluations`
- active code, active doctrine, frontend/host readers, and case-state mirrors now point at the renumbered top-level tree
- historical notes may still mention the previous folder names where they are only narrative evidence
