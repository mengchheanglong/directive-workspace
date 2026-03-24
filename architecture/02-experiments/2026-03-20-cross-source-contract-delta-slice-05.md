# Cross-Source Contract Delta Slice 05

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Bind the stage/evidence/citation schema set to lifecycle write/read behavior:
- write path: evaluation metadata gets strict lifecycle artifacts (`v1`)
- read path: host gate validates strict artifacts with explicit legacy fallback

## Scope

In:
- lifecycle artifact builder/validator contract in host lib
- evaluation-write binding for lifecycle artifact metadata
- lifecycle artifact health gate

Out:
- runtime-callable expansion
- forced migration of legacy historical records
- DB schema changes

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\analysis-evidence-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\evaluation-support-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-artifact-contracts.ts`

## Execution Steps

1. Add lifecycle artifact contract utilities in host lib.
2. Bind evaluation write path to store:
   - `lifecycleArtifactVersion: 1`
   - `lifecycleArtifacts` bundle.
3. Add read gate for evaluated/decided/integrated rows:
   - strict check when `lifecycleArtifactVersion=1`
   - legacy evidence fallback for pre-existing records.
4. Wire lifecycle gate into `check:ops-stack`.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-lifecycle-artifacts.ts`

## Commands run (ordered)

1. `npm run check:directive-lifecycle-artifacts` (mission-control)
2. `npm run check:directive-artifact-contracts` (mission-control)
3. `npm run check:ops-stack` (mission-control)

## Validation Gates

- `npm run check:directive-lifecycle-artifacts`
- `npm run check:directive-artifact-contracts`
- `npm run check:ops-stack`

## Rollback / No-op

- remove `lifecycle-artifacts.ts` and evaluation-write metadata binding.
- remove `check-directive-lifecycle-artifacts.ts` and script wiring.
- keep Slice 03/04 schema and contract artifacts unchanged.
