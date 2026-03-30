# 2026-03-30 Source Surface Inventory Classification

Chosen task:
- add one bounded source-facing inventory/classification clarification so future growth under `sources/` is easier to reason about without changing the layout

Why it won:
- after the runtime-surface inventory, the next high-ROI structural clarification was making active raw-source intake vs deferred raw-source corpus explicit in the natural source-facing surface

Affected layer:
- source-surface structural readability

Owning lane:
- Architecture structural alignment in support of Discovery

Mission usefulness:
- keeps `sources/` clearly limited to raw source material and prevents future lane outputs from drifting back into the raw-source surface

Proof path:
- `sources/README.md`
- `npm run report:directive-workspace-state`
- `npm run check`

Rollback path:
- remove the Source Surface Inventory And Authority section from `sources/README.md`
- remove this log entry

Stop-line:
- stop once `sources/README.md` clearly classifies active intake, deferred raw-source corpus, and non-source outputs, checks pass, and no broader structural move is made

Files touched:
- `sources/README.md`
- `control/logs/2026-03/2026-03-30-source-surface-inventory-classification.md`

Verification run:
- focused grep over `sources/README.md`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:
- `sources/README.md` now distinguishes active raw-source intake, deferred raw-source corpus, source authority limits, and what must never be treated as source storage
