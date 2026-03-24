# gh-aw Contract Closure Slice 12

Date: 2026-03-21
Candidate id: `gh-aw`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Materialize gh-aw planned-next closure by adding lane split contract coverage and compile-contract artifact template enforcement.

## Scope

In:
- add automation lane split contract in shared contracts
- add architecture policy for lane split enforcement
- add promotion contract/template fields for `compile_contract_artifact` and lane split metadata
- add dedicated host checker and wire into `check:ops-stack`
- update adopted status with completion note

Out:
- runtime/callable framework import
- API/database contract changes
- host runtime execution flow change

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\automation-lane-split.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-gh-aw-lane-split-contract-policy.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\promotion-contract.md` (updated)
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\promotion-record.md` (updated)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-gh-aw-contracts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-ops-stack.ts` (updated)
- `C:\Users\User\.openclaw\workspace\mission-control\package.json` (updated)

## Commands run (ordered)

1. `npm run check:directive-gh-aw-contracts` (mission-control)
2. `npm run check:directive-architecture-contracts` (mission-control)
3. `npm run check:directive-v0` (mission-control)
4. `npm run check:directive-workspace-health` (mission-control)
5. `npm run check:ops-stack` (mission-control)
6. `npm run directive:sync:reports` (mission-control)

## Raw outputs (key excerpts)

- `check:directive-gh-aw-contracts`: PASS (`totalChecks: 8`, `failedChecks: 0`)
- `check:directive-architecture-contracts`: PASS
- `check:directive-v0`: PASS
- `check:directive-workspace-health`: PASS
- `directive:sync:reports`: PASS (`dayKey: 2026-03-21`, `artifactCount: 7`, `reportId: 27401ae6-6243-4ae4-bf48-97bb776ea225`)
- `check:ops-stack`: FAIL (non-slice blockers):
  - `check:repo-sources-health`
  - `check:workspace-health-nightly`
  - `check:nightly-ops`
  - `check:ops-health`

## PASS/FAIL per gate

- `npm run check:directive-gh-aw-contracts` -> PASS
- `npm run check:directive-architecture-contracts` -> PASS
- `npm run check:directive-v0` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:directive-workspace-report-sync` -> PASS
- `npm run check:ops-stack` -> FAIL (pre-existing nightly/repo-source health checks outside this slice scope)

## Validation Gates

- `npm run check:directive-gh-aw-contracts`
- `npm run check:directive-architecture-contracts`
- `npm run check:directive-v0`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack` (observed fail on pre-existing non-slice checks)

## Rollback / No-op

- remove lane split contract and policy docs
- revert promotion contract/template field additions
- remove `check:directive-gh-aw-contracts` and ops-stack wiring
- restore gh-aw adopted note to planned-next
