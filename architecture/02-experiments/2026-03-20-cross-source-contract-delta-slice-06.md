# Cross-Source Contract Delta Slice 06

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Finish strict lifecycle artifact hardening by:
- backfilling historical evaluation metadata into `lifecycleArtifactVersion=1`
- enforcing strict artifacts for `evaluated|decided|integrated` rows in host gate logic

## Scope

In:
- one-time lifecycle artifact backfill script
- stricter lifecycle artifact gate policy
- `ops-stack` validation on strict-bound coverage

Out:
- runtime feature changes
- external source intake/reclassification changes
- DB schema migrations

## Dependencies

- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\analysis-evidence-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\evaluation-support-artifact.schema.json`

## Execution Steps

1. Add backfill script for `directive_evaluations.metadata_json`.
2. Generate strict artifacts for all historical evaluation rows.
3. Tighten lifecycle gate to require strict artifacts for `evaluated|decided|integrated`.
4. Re-run architecture + artifact + ops gates.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\mission-control\scripts\backfill-directive-lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-lifecycle-artifacts.ts` (strict mode)

## Commands run (ordered)

1. `npm run directive:backfill:lifecycle-artifacts` (mission-control)
2. `npm run check:directive-lifecycle-artifacts` (mission-control)
3. `npm run check:directive-artifact-contracts` (mission-control)
4. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- backfill:
  - `scanned: 21`
  - `updated: 21`
  - `alreadyStrict: 0`
- lifecycle gate:
  - `strictRequiredCapabilities: 6`
  - `strictBoundCapabilities: 6`
  - `strictMissingCapabilities: 0`
  - `failedCapabilities: 0`
- `check:ops-stack`: PASS

## Validation Gates

- `npm run check:directive-lifecycle-artifacts`
- `npm run check:directive-artifact-contracts`
- `npm run check:ops-stack`

## Rollback / No-op

- remove strict requirement clause in lifecycle gate and restore legacy fallback mode.
- keep strict artifacts in metadata as non-breaking enrichment.
- remove backfill script only if no further historical migration is expected.
