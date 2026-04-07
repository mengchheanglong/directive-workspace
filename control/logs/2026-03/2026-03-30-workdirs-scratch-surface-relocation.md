# 2026-03-30 Workdirs Scratch Surface Relocation

Chosen task:
- execute the first bounded repo-structure move from the scalability planning artifact by relocating hidden local virtualenv scratch out of `architecture/01-experiments/`

Why it won:
- the planning artifact identified the `.venv-*` trees as the single biggest live topology distortion, and they were confirmed as ignored local workdirs rather than authoritative product artifacts

Affected layer:
- repo topology / structural clarity

Owning lane:
- Architecture structural alignment

Mission usefulness:
- restores `architecture/01-experiments/` as a lane corpus surface instead of a local scratch dump, without changing product semantics

Proof path:
- `workdirs/README.md`
- directory relocation out of `architecture/01-experiments/`
- `npm run report:directive-workspace-state`
- `npm run check`

Rollback path:
- move the two `.venv-*` directories back into `architecture/01-experiments/`
- remove `workdirs/README.md`
- remove this log entry

Stop-line:
- stop once the repo-root scratch surface exists, the two virtualenv trees are relocated there, checks pass, and no broader restructure is attempted

Files touched:
- `workdirs/README.md`
- `control/logs/2026-03/2026-03-30-workdirs-scratch-surface-relocation.md`

Verification run:
- `npm run report:directive-workspace-state`
- `npm run check`

Result:
- local ignored virtualenv scratch no longer lives under the active Architecture experiment corpus, and the new `workdirs/` surface classifies that scratch as non-authoritative

