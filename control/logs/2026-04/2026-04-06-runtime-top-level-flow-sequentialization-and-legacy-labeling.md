# Runtime Top-Level Flow Sequentialization And Legacy Labeling

Date: 2026-04-06

Affected layer: Runtime storage and read surfaces
Owning lane: Runtime
Mission usefulness: make the Runtime top level readable by separating the real numbered lane flow from code, host, execution, and legacy compatibility surfaces
Proof path: `npm run check:runtime-loop-control`, `npm run check:frontend-host`, `npm run check:directive-workspace-composition`, `npm run check`
Rollback path: rename the Runtime folders back to their previous names and revert the path updates

## What changed

- Renumbered the active Runtime flow into a clearer contiguous chain:
  - `runtime/follow-up` -> `runtime/00-follow-up`
  - `runtime/promotion-records` -> `runtime/07-promotion-records`
  - `runtime/registry` -> `runtime/08-registry`
- Labeled legacy compatibility corpora explicitly:
  - `runtime/handoff` -> `runtime/legacy-handoff`
  - `runtime/records` -> `runtime/legacy-records`
- Updated active code, state, host reads, checks, docs, and artifact links to use the new Runtime paths.

## Cleanup boundary

This is a structural cleanup, not a Runtime redesign.

The real Runtime flow is now visibly:
- `00-follow-up`
- `01-callable-integrations`
- `02-records`
- `03-proof`
- `04-capability-boundaries`
- `05-promotion-readiness`
- `06-promotion-specifications`
- `07-promotion-records`
- `08-registry`

The remaining unnumbered folders are intentionally side surfaces:
- code
- execution evidence
- host support
- source packs
- legacy compatibility
