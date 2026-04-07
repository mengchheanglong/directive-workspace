# 2026-04-06 Runtime Meta Surface Grouping

- affected layer: Runtime lane top-level structure
- owning lane: Runtime
- mission usefulness: make the Runtime root easier to navigate by separating lifecycle flow from capability code and metadata
- proof path:
  - `npm run check:directive-workspace-composition`
  - `npm run check:runtime-loop-control`
  - `npm run check:frontend-host`
- rollback path:
  - move `runtime/meta/*` back to `runtime/`
  - revert the updated path references and Runtime README changes

## What changed

- grouped loose Runtime metadata into `runtime/meta/`
- moved:
  - `BOUNDARY_INVENTORY.json`
  - `EXTRACTION_CANDIDATES.md`
  - `IMPORT_SOURCE_POLICY.json`
  - `LIVE_RUNTIME_ACCOUNTING.json`
  - `PROMOTION_PROFILES.json`
- updated active references to those files across Runtime, hosts, scripts, and shared contracts
- documented the grouped metadata shelf in `runtime/README.md` and `runtime/meta/README.md`

## Result

Runtime top level now reads as:
- numbered lifecycle flow
- unnumbered capability/execution code
- explicit metadata shelf
- explicit legacy compatibility shelves
