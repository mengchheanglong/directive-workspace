# 2026-04-06 Runtime Numbered Flow Path Cutover

- affected layer: Runtime lane storage/read-write surfaces
- owning lane: Runtime
- mission usefulness: make the Runtime folder structure truthful, sequential, and clone-ready instead of partially renamed
- proof path:
  - `npm run check:autonomous-lane-loop`
  - `npm run check:runtime-loop-control`
  - `npm run check:frontend-host`
  - `npm run check`
- rollback path:
  - rename `runtime/00-follow-up` back to `runtime/follow-up`
  - rename `runtime/07-promotion-records` back to `runtime/promotion-records`
  - rename `runtime/08-registry` back to `runtime/registry`
  - rename `runtime/legacy-handoff` back to `runtime/handoff`
  - rename `runtime/legacy-records` back to `runtime/records`
  - revert the updated Runtime path constants in Engine, host, script, and Runtime writer/reader surfaces

## What changed

- kept the numbered Runtime lifecycle as the active top-level flow:
  - `00-follow-up`
  - `01-callable-integrations`
  - `02-records`
  - `03-proof`
  - `04-capability-boundaries`
  - `05-promotion-readiness`
  - `06-promotion-specifications`
  - `07-promotion-records`
  - `08-registry`
- explicitly marked compatibility/history shelves as non-flow surfaces:
  - `legacy-handoff`
  - `legacy-records`
- removed the dead empty folder:
  - `04-implementation-slices`
- cut the remaining active writer/reader constants from old physical `runtime/promotion-records` to active `runtime/07-promotion-records`

## Stop-line

- `core`, `capabilities`, `lib`, `callable-executions`, `source-packs`, and `standalone-host` remain unnumbered on purpose because they are Runtime operating/code surfaces, not lifecycle steps.
