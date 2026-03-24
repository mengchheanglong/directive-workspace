# Cross-Source Contract Delta Slice 08

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Forge promotion contract enforcement
Status: executed

## Objective

Materialize the Scientify-derived promotion quality-gate pattern into enforceable contracts and host checks.

## Scope

In:
- add canonical promotion quality-gate contract (`promotion_quality_gate/v1`)
- add quality-gate fields to promotion record template
- enforce quality fields in promotion records and linked proof artifacts
- wire new check into `check:ops-stack`

Out:
- runtime behavior changes
- host DB/API migrations
- new candidate intake/reclassification

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-scientify-slice-6-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\promotion-contract.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\promotion-records\2026-03-20-autoresearch-promotion-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\promotion-records\2026-03-20-agentics-promotion-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\promotion-records\2026-03-20-mini-swe-agent-promotion-record.md`

## Execution Steps

1. Create contract spec for `promotion_quality_gate/v1` with deterministic thresholds and result logic.
2. Extend promotion template and active promotion/proof artifacts with required quality fields.
3. Add host enforcement script for promotion-quality contracts.
4. Wire the script into package scripts and `check:ops-stack`.
5. Re-run type and directive/ops gates.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\promotion-quality-gate.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-promotion-quality-gate-contract.md`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-promotion-quality-contracts.ts`

## Commands run (ordered)

1. `npm run check:directive-promotion-quality-contracts` (mission-control)
2. `npm run typecheck` (mission-control)
3. `npm run check:directive-v0` (mission-control)
4. `npm run check:directive-integration-proof` (mission-control)
5. `npm run check:directive-workspace-health` (mission-control)
6. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- `check:directive-promotion-quality-contracts`:
  - `totalPromotionRecords: 3`
  - `failedPromotionRecords: 0`
  - `failedContractChecks: 0`
  - `passResults: 3`
- `typecheck`: PASS
- `check:directive-v0`: PASS
- `check:directive-integration-proof`: PASS (`missingProof: 0`)
- `check:directive-workspace-health`: PASS (`reasons: []`)
- `check:ops-stack`: PASS (all listed checks green, includes new promotion quality check)

## Validation Gates

- `npm run check:directive-promotion-quality-contracts`
- `npm run typecheck`
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

## Rollback / No-op

- remove promotion quality contract/template fields and script wiring.
- remove `check:directive-promotion-quality-contracts` from package and `check:ops-stack`.
- revert quality snapshot sections in promotion/proof artifacts.
- keep prior Architecture contract and schema slices unchanged.
