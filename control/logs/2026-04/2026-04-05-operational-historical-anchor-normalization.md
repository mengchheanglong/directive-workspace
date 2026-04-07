# 2026-04-05 Operational Historical Anchor Normalization

## Why

The lane/code migration left many historical artifacts with stale path references. The goal for this slice was not a mass historical rewrite. The goal was to identify which stale references were still operationally consumed by active code or authority surfaces and normalize only those anchors first.

## What changed

- Added `scripts/report-historical-stale-path-inventory.ts`.
- Added `npm run report:historical-stale-path-inventory`.
- Scanned the historical corpora for stale references to:
  - `shared/lib/dw-state*`
  - `shared/lib/architecture-*`
  - `shared/lib/runtime-*`
  - `shared/lib/discovery-*`
  - old `engine/architecture|runtime|discovery/*`
- Classified each stale artifact by whether it is still referenced by active consumer surfaces.
- Normalized the operationally consumed anchors only.

## Result

- Historical artifacts scanned: `992`
- Stale historical artifacts remaining: `188`
- Operationally consumed stale anchors remaining: `0`

The remaining stale references are narrative-only historical evidence. They were intentionally left in place to avoid rewriting historical records beyond what current active tooling still consumes.

## Proof

- `npm run report:historical-stale-path-inventory`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback

- Revert the inventory script and the operational-anchor normalization edits
- Remove this log entry
