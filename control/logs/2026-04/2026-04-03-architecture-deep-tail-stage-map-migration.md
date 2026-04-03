# Architecture Deep-Tail Stage Map Migration

Date: 2026-04-03
Type: structural simplification — compatibility migration slice
Lane: Architecture (Engine self-improvement)
Mode: STANDARD

## What changed

Created `shared/lib/architecture-deep-tail-stage-map.ts` — a single canonical source of truth for the 6 Architecture deep-tail stage definitions (04-implementation-targets through 09-post-consumption-evaluations).

Migrated all raw folder-name references in the following consumers:
- `shared/lib/dw-state.ts` — 13 references (6 scanner relativeDir, 6 gap patterns, 1 suffix)
- `shared/lib/architecture-materialization-due-check.ts` — 4 references
- `shared/lib/architecture-implementation-target.ts` — 2 references
- `shared/lib/architecture-implementation-result.ts` — 2 references
- `shared/lib/architecture-retention.ts` — 2 references
- `shared/lib/architecture-integration-record.ts` — 2 references
- `shared/lib/architecture-consumption-record.ts` — 2 references
- `shared/lib/architecture-post-consumption-evaluation.ts` — 2 references
- `hosts/web-host/data.ts` — 6 references
- `scripts/check-host-adapter-boundary.ts` — 1 allowlist entry added

Total: 36 raw folder-name references replaced with canonical stage map lookups.

## What did not change

- No folders were moved, deleted, or renamed
- No artifact semantics changed
- No check logic was weakened
- Frontend routes and API paths unchanged (those are view-layer concerns for a separate slice)
- Check scripts (`check-architecture-composition.ts`, `check-directive-workspace-composition.ts`) still use inline artifact path constants — these are test fixtures, not structural coupling

## Remaining raw references

Callers still encoding raw folder names:
- `scripts/check-directive-workspace-composition.ts` — test fixture path constants (not structural coupling)
- `scripts/check-architecture-composition.ts` — creates artifacts through the backing modules (already migrated)
- `hosts/web-host/server.ts` — API route dispatch (view-layer, separate slice)
- `frontend/src/app.ts` — view routing (view-layer, separate slice)
- `shared/lib/architecture-reopen-from-evaluation.ts` — uses bounded-start dir, not deep-tail

## Proof

`npm run check` — all checks pass, zero `"ok": false`.

## Rollback

Delete `shared/lib/architecture-deep-tail-stage-map.ts`, revert all imports, restore raw string literals. Zero semantic change to callers.
