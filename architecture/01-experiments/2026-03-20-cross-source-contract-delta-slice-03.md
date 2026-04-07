# Cross-Source Contract Delta Slice 03

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Enforce stage/evidence/citation contract quality at artifact level by validating live integrated registry records against real proof artifacts on disk.

## Scope

In:
- validate merged contract anchors (`Paper2Code`, `gpt-researcher`, merged handoff contract)
- validate integrated lifecycle records contain proof metadata + evidence summary + active integration
- validate proof artifact files exist and follow expected shape

Out:
- runtime feature expansion
- DB schema migration
- new callable capability promotion

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-stage-evidence-citation-handoff-contract.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-paper2code-directive-architecture-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-gpt-researcher-directive-architecture-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-workspace-health.ts`

## Execution Steps

1. Add a new Mission Control gate script for artifact-level directive contract checks.
2. Wire the gate into package scripts and `check:ops-stack`.
3. Validate gate output against live integrated capabilities and proof artifacts.
4. Record execution and bundle routing evidence.

## Required Output Artifact

- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-artifact-contracts.ts`

## Commands run (ordered)

1. `npm run check:directive-artifact-contracts` (mission-control)
2. `npm run check:ops-stack` (mission-control)

## Validation Gates

- `npm run check:directive-artifact-contracts`
- `npm run check:ops-stack`

## Rollback / No-op

- remove the artifact-level check script and script wiring (`package.json`, `check-ops-stack.ts`).
- keep existing contract docs and prior architecture slices unchanged.
