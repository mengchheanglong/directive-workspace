# Architecture Deep-Tail Full Code-Level Migration

Date: 2026-04-03
Type: structural simplification - full code-level compatibility migration
Lane: Architecture (Engine self-improvement)
Mode: STANDARD

## Summary

Completed full migration of all TypeScript code away from raw Architecture deep-tail folder-name string literals. Every caller now resolves folder paths, path prefixes, gap patterns, artifact suffixes, and API route segments through the canonical `shared/lib/architecture-deep-tail-stage-map.ts`.

## Slices completed

1. **Stage map creation** - `shared/lib/architecture-deep-tail-stage-map.ts` (previous session)
2. **dw-state.ts migration** - 13 references (previous session)
3. **materialization-due-check.ts migration** - 4 references (previous session)
4. **6 backing modules migration** - 12 references (previous session)
5. **web-host/data.ts full migration** - 14 references (path validators + helper functions)
6. **web-host/server.ts migration** - 6 API route dispatches consolidated to stage-map loop
7. **check-directive-workspace-composition.ts migration** - 13 fixture paths and gap patterns
8. **write-directive-workspace-continuation-pack.ts migration** - 1 reference
9. **Host adapter boundary update** - allowlist entry (previous session)
10. **Runtime callable-integration cleanup** - final remaining 04-07 deep-tail literal paths replaced in `runtime/01-callable-integrations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-callable-integration.ts`

## Verification

Confirmed by repo audit:
- `rg -n "architecture/04-implementation-targets|architecture/05-implementation-results|architecture/06-retained|architecture/07-integration-records|architecture/08-consumption-records|architecture/09-post-consumption-evaluations" --glob "*.ts" --glob "!shared/lib/architecture-deep-tail-stage-map.ts"` returns no matches
- `npm run check:architecture-composition` passes
- `npm run check:directive-workspace-composition` passes

`npm run check` was attempted separately during verification and timed out once at the tool boundary, so this log does not claim a freshly re-proved full-suite pass from the final cleanup micro-slice.

## Deletion readiness assessment

**BLOCKED** by artifact-level embedded path references.

178 markdown artifacts across 6 folders contain ~856 embedded cross-references using deep-tail folder paths. These are parsed at runtime by backing modules via regex extraction. Moving or deleting folders would strand these references and break state resolution.

Enabling folder deletion requires a dedicated DEEP-mode data migration case covering ~856 path rewrites across ~194 files with atomic bidirectional consistency.

## Rollback

All code changes are reversible by replacing stage-map imports with the original string literals. The stage map itself can be deleted without affecting any other module's functionality - they just go back to raw strings.
