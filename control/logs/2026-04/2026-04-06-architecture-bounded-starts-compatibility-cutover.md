# 2026-04-06 Architecture Bounded-Starts Compatibility Cutover

## Slice

- Affected layer: Architecture artifact tree and reopened-slice compatibility
- Owning lane: Architecture
- Mission usefulness: remove the last active `architecture/01-bounded-starts/` dependency so the cloned system uses one experiment home only

## Changes

- Moved the remaining reopened March 24 Architecture chain from `architecture/01-bounded-starts/` into `architecture/01-experiments/`.
- Retargeted reopen logic in [architecture/lib/architecture-reopen-from-evaluation.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-reopen-from-evaluation.ts) so reopened bounded starts now open directly under `architecture/01-experiments/`.
- Removed `architecture/01-bounded-starts/` compatibility from:
  - [architecture/lib/architecture-closeout.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-closeout.ts)
  - [architecture/lib/architecture-bounded-closeout.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-bounded-closeout.ts)
  - [engine/state/index.ts](/C:/Users/User/projects/directive-workspace/engine/state/index.ts)
  - [hosts/web-host/data.ts](/C:/Users/User/projects/directive-workspace/hosts/web-host/data.ts)
  - [frontend/src/app-utils.ts](/C:/Users/User/projects/directive-workspace/frontend/src/app-utils.ts)
  - [scripts/check-architecture-composition.ts](/C:/Users/User/projects/directive-workspace/scripts/check-architecture-composition.ts)
- Deleted the `architecture/01-bounded-starts/` folder.

## Proof Path

- `npm run check:architecture-composition`
- `npm run check:directive-workspace-composition`
- `npm run check:frontend-host`

## Rollback Path

- restore the moved reopened artifacts to `architecture/01-bounded-starts/`
- revert the code and documentation files touched in this slice
- restore the deleted folder from git history if needed

## Stop Line

- `architecture/05-reference-patterns/` was intentionally not touched in this slice
- removing that surface still requires a separate contract/reference cutover pass

