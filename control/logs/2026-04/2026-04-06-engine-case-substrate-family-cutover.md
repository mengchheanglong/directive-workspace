# 2026-04-06 Engine Case Substrate Family Cutover

## Affected layer

- mirrored case records, events, snapshots, and planner substrate

## Owning lane

- Engine cross-cutting infrastructure

## Mission usefulness

- make the mirrored case substrate visibly Engine-owned instead of leaving it in the residual `shared/lib/` bucket
- keep the case/event/snapshot/planner family together where it can be understood as one cross-lane Engine service

## Slice

- moved the case substrate family from `shared/lib/` to `engine/cases/`:
  - `case-event-log.ts`
  - `case-store.ts`
  - `case-snapshot.ts`
  - `case-planner.ts`
- added `engine/cases/index.ts`
- added `engine/cases/README.md`
- updated Runtime, Discovery, Architecture, and checker imports to consume the new Engine home
- added direct package/root surfacing for `engine/cases`
- updated `engine/README.md` and `shared/lib/README.md` so case management is no longer described as residual shared support

## Proof path

- `npm run check:case-event-parity`
- `npm run check:case-snapshot-parity`
- `npm run check:case-planner-parity`
- `npm run check:note-architecture-closeout-projection-parity`
- `npm run check:runtime-proof-open-runner-kernel`
- `npm run check:runtime-follow-up-runner-kernel`
- `npm run check`

## Rollback path

- move the four case files back into `shared/lib/`
- revert the Runtime, Discovery, Architecture, checker, package, and README import/path updates
- delete `engine/cases/index.ts`
- delete `engine/cases/README.md`
- delete this log

## Stop summary

- stopped after moving one clearly Engine-owned family
- did not broaden into a larger `shared/lib/` secondary migration beyond the case substrate
