# 2026-04-02 Scratch Surface Rename And Roadmap Cleanup

## Why this slice

- the repo-root local scratch surface was still named `workdirs/`, which was less readable than the actual intent
- `roadmap-to-claude-completion.md` had become obsolete after CLAUDE completion truth moved into canonical control and engine surfaces
- this cleanup stays below any Engine, Runtime, Discovery, or Architecture seam opening

## Bounded changes

- renamed the repo-root local scratch surface from `workdirs/` to `scratch/`
- rewrote the scratch ownership note at `scratch/README.md`
- updated the active folder-structure planning artifact to describe the renamed scratch surface consistently
- removed `roadmap-to-claude-completion.md`

## Proof

- the renamed scratch surface remains explicitly non-authoritative and outside product truth
- no active package, control-state, or engine-truth surface depends on `roadmap-to-claude-completion.md`
- this slice changes naming and cleanup only; it does not change workflow truth

## Stop line

- stop after the scratch rename, ownership note, roadmap removal, and verification
