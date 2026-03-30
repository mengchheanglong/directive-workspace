# 2026-03-30 Repo Scalability Folder-Structure Planning

Chosen task:
- produce one bounded Architecture planning artifact that identifies the next safe structural step for repo scalability and folder-structure evolution

Why it won:
- the baseline contract and high-authority wording alignment were already in place, so the next high-ROI move was to turn current repo shape into one explicit planning decision instead of starting a broad restructure

Affected layer:
- Architecture structural planning

Owning lane:
- Architecture

Mission usefulness:
- reduces future folder drift by naming the strongest current topology friction and isolating one safe next structural slice

Proof path:
- `architecture/02-experiments/2026-03-30-dw-pressure-repo-scalability-folder-structure-planning.md`
- `npm run report:directive-workspace-state`
- `npm run check`

Rollback path:
- remove the planning artifact
- remove this log entry

Stop-line:
- stop once the planning artifact exists, the next safe structural slice is explicit, checks pass, and no structural move has been performed yet

Files touched:
- `architecture/02-experiments/2026-03-30-dw-pressure-repo-scalability-folder-structure-planning.md`
- `control/logs/2026-03/2026-03-30-repo-scalability-folder-structure-planning.md`

Verification run:
- `npm run report:directive-workspace-state`
- `npm run check`

Result:
- the repo now has one bounded planning artifact that separates product surfaces, shared Engine surfaces, lane corpora, runtime assets, and historical/archive surfaces, and it identifies the hidden `.venv-*` trees inside `architecture/02-experiments/` as the dominant next structural friction
