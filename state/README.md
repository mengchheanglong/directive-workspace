# Directive Workspace State

This folder holds case/event persistence surfaces.

It is:
- active persisted state
- lower-level than `engine/workspace-truth.ts`
- separate from `control/state/`

It is not:
- the product truth summary
- historical logging
- scratch space

Authority split:

- `engine/workspace-truth.ts` = product truth summary
- `control/state/` = machine-readable control truth
- `state/` = case/event persistence
- `control/logs/` = historical logs

Rule:

If you need to understand current product capability or legal next seams, start with `engine/workspace-truth.ts`, not this folder.
