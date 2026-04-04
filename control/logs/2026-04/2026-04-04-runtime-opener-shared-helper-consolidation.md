# 2026-04-04 Runtime opener shared-helper consolidation

## why
- Opportunity 5 in the current optimization frontier still carried repeated low-level Runtime opener logic for routing backfill reads, path normalization, utf8/json reads, and optional bullet extraction.
- The goal of this slice was to centralize that repeated opener plumbing without changing approval, sequencing, idempotence, or mirrored-state behavior.

## completed
- Added `shared/lib/runtime-opener-shared.ts` as the shared low-level helper surface for Runtime opener modules.
- Migrated `shared/lib/runtime-follow-up-opener.ts` onto the shared opener helper surface.
- Migrated `shared/lib/runtime-record-proof-opener.ts` onto the shared opener helper surface.
- Migrated `shared/lib/runtime-proof-runtime-capability-boundary-opener.ts` onto the shared opener helper surface.
- Migrated `shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts` onto the shared opener helper surface.
- Folded the last repeated routing-backfill wrapper layer into the shared helper via a decision-state-aware compatibility entry point.

## proof
- `npm run check:directive-workspace-composition`
- `npm run check:runtime-loop-control`
- `npm run check:host-adapter-boundary`
- `npm run check`

## result
- Runtime opener modules now share the same low-level backfill/read/path helper surface.
- Runtime opener semantics remained unchanged under the composition and full-check suites.
