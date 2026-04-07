# Cross-Source Contract Delta Slice 10

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks
Status: executed

## Objective

Implement Paper2Code planned-next Slice 3 by generating minimal `IntegrationContractArtifact` + `ProofChecklistArtifact` skeletons from experiment design artifacts and enforcing template/generator consistency with host checks.

## Scope

In:
- add canonical shared templates for integration contract and proof checklist artifacts
- add shared generator contract and architecture policy reference
- implement generator library + CLI script
- generate one concrete artifact pair from a real experiment slice
- add host check for templates + generator behavior and wire it into ops-stack

Out:
- runtime/callable behavior changes
- API/database schema migration
- external runtime dependency adoption

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-paper2code-directive-architecture-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-20-cross-source-contract-delta-slice-09.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\structured-output-fallback.md`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`

## Execution Steps

1. Add canonical templates:
   - `integration-contract-artifact.md`
   - `proof-checklist-artifact.md`
2. Add generator contract/policy docs.
3. Implement extraction/generation library and CLI script.
4. Generate one concrete artifact pair from Slice 09 as proof.
5. Add host check for template and generator behavior.
6. Wire check into `check:ops-stack`.
7. Re-run directive + type + ops gates.

## Required Output Artifacts

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\integration-contract-artifact.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\proof-checklist-artifact.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\integration-proof-template-generator.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-integration-proof-template-generator-policy.md`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\integration-artifact-generator.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\generate-directive-integration-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-integration-artifact-templates.ts`
- Generated sample outputs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-dw-cross-source-wave-01-integration-contract-artifact.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-dw-cross-source-wave-01-proof-checklist-artifact.md`

## Commands run (ordered)

1. `npm run directive:generate:integration-artifacts -- --experiment-path "C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-20-cross-source-contract-delta-slice-09.md" --output-dir "C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns" --adoption-target "Directive Architecture" --integration-mode adapt --owner operator --write` (mission-control)
2. `npm run check:directive-integration-artifact-templates` (mission-control)
3. `npm run typecheck` (mission-control)
4. `npm run check:directive-v0` (mission-control)
5. `npm run check:directive-integration-proof` (mission-control)
6. `npm run check:directive-workspace-health` (mission-control)
7. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- generator extraction:
  - `candidateId: dw-cross-source-wave-01`
  - `validationGates` included `check:directive-v0` and `check:ops-stack`
  - generated pair written under `architecture/05-reference-patterns/`
- `check:directive-integration-artifact-templates`:
  - `totalChecks: 9`
  - `failedChecks: 0`
- `typecheck`: PASS
- `check:directive-v0`: PASS
- `check:directive-integration-proof`: PASS (`missingProof: 0`)
- `check:directive-workspace-health`: PASS (`reasons: []`)
- `check:ops-stack`: PASS (includes `check:directive-integration-artifact-templates`)

## Validation Gates

- `npm run check:directive-integration-artifact-templates`
- `npm run typecheck`
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

## Rollback / No-op

- remove integration/proof template files and generator contract/policy docs.
- remove generator/check scripts and ops-stack wiring.
- remove generated sample artifacts.
- keep prior architecture contract slices unchanged.
