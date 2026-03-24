# Integration/Proof Template Generator Policy (Paper2Code Slice 3)

Date: 2026-03-20
Track: Directive Architecture
Source anchor: `Paper2Code` planned-next Slice 3

## Objective

Generate minimal IntegrationContractArtifact and ProofChecklistArtifact skeletons from experiment design artifacts to standardize handoff preparation.

## Extraction Inputs

- Candidate id
- Objective summary
- Validation gates
- Required output artifacts
- Rollback plan

## Generated Outputs

- `IntegrationContractArtifact` markdown
- `ProofChecklistArtifact` markdown

## Guardrails

- no runtime-callable promotion claim in generated artifacts
- no host-specific API or DB mutation
- preserve gates from source artifact; apply baseline fallback only if source gates missing
- generated files remain editable drafts (`status: draft-generated`)

## Enforcement Surface

- generator script:
  - `C:\Users\User\.openclaw\workspace\mission-control\scripts\generate-directive-integration-artifacts.ts`
- host check:
  - `npm run check:directive-integration-artifact-templates`
