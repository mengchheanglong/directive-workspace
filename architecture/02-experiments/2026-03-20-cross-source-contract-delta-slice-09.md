# Cross-Source Contract Delta Slice 09

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Implement Paper2Code planned-next Slice 2 by introducing a deterministic typed structured-output fallback parser policy and enforcing it with a dedicated host check.

## Scope

In:
- add shared structured-output fallback contract
- add architecture reference policy for parser fallback order and guardrails
- implement typed fallback parser module in host directive library
- bind parser fallback to lifecycle artifact normalization
- add host gate for parser policy and behavior
- wire gate into `check:ops-stack`

Out:
- runtime feature expansion
- API/DB schema migration
- external runtime stack adoption

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-paper2code-directive-architecture-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\analysis-evidence-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\evaluation-support-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`

## Execution Steps

1. Define fallback contract and parser policy docs.
2. Implement deterministic fallback parser (`strict -> fenced -> extracted -> trailing-comma -> list fallback`).
3. Bind fallback parser to lifecycle artifact normalization for list/object fields.
4. Add parser behavior check script and include in ops-stack.
5. Re-run directive + type + ops gates.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\structured-output-fallback.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-structured-output-fallback-parser-policy.md`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\structured-output-fallback.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-structured-output-fallback.ts`

## Commands run (ordered)

1. `npm run check:directive-structured-output-fallback` (mission-control)
2. `npm run typecheck` (mission-control)
3. `npm run check:directive-v0` (mission-control)
4. `npm run check:directive-integration-proof` (mission-control)
5. `npm run check:directive-workspace-health` (mission-control)
6. `npm run check:directive-promotion-quality-contracts` (mission-control)
7. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- `check:directive-structured-output-fallback`:
  - `failedDocChecks: 0`
  - `failedParserChecks: 0`
- `typecheck`: PASS
- `check:directive-v0`: PASS
- `check:directive-integration-proof`: PASS (`missingProof: 0`)
- `check:directive-workspace-health`: PASS (`reasons: []`)
- `check:directive-promotion-quality-contracts`: PASS (`failedPromotionRecords: 0`)
- `check:ops-stack`: PASS (includes `check:directive-structured-output-fallback`)

## Validation Gates

- `npm run check:directive-structured-output-fallback`
- `npm run typecheck`
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:directive-promotion-quality-contracts`
- `npm run check:ops-stack`

## Rollback / No-op

- remove fallback parser module and restore strict-only normalization path.
- remove structured output fallback contracts/policy docs.
- remove parser check script and ops-stack wiring.
- keep prior lifecycle schema and quality-gate slices unchanged.
