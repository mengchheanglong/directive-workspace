# Cross-Source Contract Delta Slice 04

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Materialize canonical schema artifacts for stage/evidence/citation support contracts and enforce them with a dedicated architecture schema gate.

## Scope

In:
- create canonical schema artifacts in `shared/schemas`
- add host-side architecture schema check in Mission Control
- wire schema check into `check:ops-stack`

Out:
- direct runtime binding to host lifecycle records
- DB migrations
- callable/runtime behavior changes

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-stage-evidence-citation-handoff-contract.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\README.md`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-artifact-contracts.ts`

## Execution Steps

1. Add canonical schemas:
   - `analysis-evidence-artifact.schema.json`
   - `citation-set-artifact.schema.json`
   - `evaluation-support-artifact.schema.json`
2. Update schema README to mark these files as architecture contract truth.
3. Add `check:directive-architecture-schemas` host gate and include it in `check:ops-stack`.
4. Validate all gates and record the bundle.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\analysis-evidence-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\evaluation-support-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-architecture-schemas.ts`

## Commands run (ordered)

1. `npm run check:directive-architecture-schemas` (mission-control)
2. `npm run check:directive-artifact-contracts` (mission-control)
3. `npm run check:ops-stack` (mission-control)

## Validation Gates

- `npm run check:directive-architecture-schemas`
- `npm run check:directive-artifact-contracts`
- `npm run check:ops-stack`

## Rollback / No-op

- remove new schema files and restore `shared/schemas/README.md`.
- remove `check-directive-architecture-schemas.ts` and script wiring.
- keep prior contract artifacts and bundle logs unchanged.
