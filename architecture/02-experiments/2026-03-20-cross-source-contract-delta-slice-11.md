# Cross-Source Contract Delta Slice 11

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Implement gpt-researcher planned-next Slice 2 by enforcing `CitationSetArtifact` URL validity, deterministic dedupe, and fallback synthesis behavior with a dedicated host contract gate.

## Scope

In:
- add canonical citation fallback contract and architecture policy
- enforce citation URL shape in shared schema
- harden host lifecycle artifact builder for citation URL filtering/dedupe/fallback synthesis
- add host citation contract check and wire it into `check:ops-stack`
- update adopted status for gpt-researcher planned-next closure

Out:
- runtime/callable surface expansion
- API/database schema migration
- external runtime dependency adoption

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-gpt-researcher-directive-architecture-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-stage-evidence-citation-handoff-contract.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`

## Execution Steps

1. Add citation fallback contract and architecture policy docs.
2. Tighten citation schema URL constraints (`uri` + `^https?://`).
3. Harden lifecycle artifact citation normalization:
   - URL validation (`http/https` only)
   - dedupe by normalized URL identity
   - fallback synthesis from normalized `visited_urls` when explicit citations fail
4. Add dedicated citation contract check script and bind to ops-stack.
5. Re-run directive + health + ops gates.
6. Update adopted/planned-next record and queue execution log.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\citation-set-fallback.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-citation-set-fallback-policy.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json` (updated)
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts` (updated)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-citation-contracts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-ops-stack.ts` (updated)
- `C:\Users\User\.openclaw\workspace\mission-control\package.json` (updated)

## Commands run (ordered)

1. `npm run check:directive-citation-contracts` (mission-control)
2. `npm run typecheck` (mission-control)
3. `npm run check:directive-v0` (mission-control)
4. `npm run check:directive-integration-proof` (mission-control)
5. `npm run check:directive-workspace-health` (mission-control)
6. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- `check:directive-citation-contracts`:
  - `totalChecks: 11`
  - `failedChecks: 0`
- `typecheck`: PASS
- `check:directive-v0`: PASS
- `check:directive-integration-proof`: PASS (`missingProof: 0`)
- `check:directive-workspace-health`: PASS (`reasons: []`)
- `check:ops-stack`: PASS (includes `check:directive-citation-contracts`)

## Validation Gates

- `npm run check:directive-citation-contracts`
- `npm run typecheck`
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

## Rollback / No-op

- remove citation fallback contract + policy docs.
- revert citation schema URL guards.
- revert lifecycle citation normalization/fallback changes.
- remove citation contract check and ops-stack wiring.
- keep prior lifecycle artifact contracts and template-generator slices unchanged.
