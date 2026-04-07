# 2026-04-06 Legacy Architecture Folder Prune Slice

## Slice

- Affected layer: Architecture artifact tree cleanup
- Owning lane: Architecture
- Mission usefulness: remove dead local-Architecture intake surfaces so the cloned system starts from the real front door and a smaller active tree

## Removed

- `architecture/00-intake/`
- `architecture/01-triage/`

These folders were removed because Discovery is already the only front door and no live code/check surface required these Architecture-local intake/triage folders to exist.

## Updated

- [CLAUDE.md](/C:/Users/User/projects/directive-workspace/CLAUDE.md)
- [architecture/README.md](/C:/Users/User/projects/directive-workspace/architecture/README.md)

Both now reflect that:
- Architecture-local intake/triage were intentionally removed
- `architecture/01-bounded-starts/` remains only as a compatibility surface for reopened historical chains

## Explicit Stop Line

The following were intentionally not deleted in this slice:

- `architecture/01-bounded-starts/`
- `architecture/05-reference-patterns/`

They still have live dependency pressure from code, checks, and historical lifecycle chains. Deleting them now would require a slower rewrite pass instead of a fast prune.

## Proof Path

- `npm run check:directive-workspace-composition`
- `npm run check:control-authority`

## Rollback Path

- restore the removed folders from git history if needed
- revert [CLAUDE.md](/C:/Users/User/projects/directive-workspace/CLAUDE.md)
- revert [architecture/README.md](/C:/Users/User/projects/directive-workspace/architecture/README.md)
