# 2026-04-03 - Architecture deep-tail path helper deduplication

## Summary

- added `shared/lib/architecture-deep-tail-artifact-helpers.ts` as the shared helper surface for Architecture deep-tail root normalization, in-repo relative-path resolution, stage-to-stage artifact path derivation, and safe deep-tail artifact reads
- migrated the deep-tail modules to the shared helper surface:
  - `shared/lib/architecture-implementation-target.ts`
  - `shared/lib/architecture-implementation-result.ts`
  - `shared/lib/architecture-retention.ts`
  - `shared/lib/architecture-integration-record.ts`
  - `shared/lib/architecture-consumption-record.ts`
  - `shared/lib/architecture-post-consumption-evaluation.ts`
- kept the legacy consumption filename transform explicit (`-integration-record.md` -> `-consumption.md`) so the helper does not silently change existing artifact naming

## Maintainability effect

- removes repeated low-level path validation and default-root boilerplate across the deep-tail lifecycle modules
- centralizes the stage-to-stage file derivation logic for the bounded Architecture deep-materialization chain
- centralizes the "read this deep-tail artifact from logical path while honoring physical storage" behavior behind one helper seam

## Verification

- `npm run check:architecture-materialization-due-check` passed
- `npm run check:directive-workspace-composition` passed
- `npm run check` passed
