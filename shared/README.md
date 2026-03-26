# Shared Surface

`shared/` contains the canonical cross-track artifacts for Directive Workspace.

It exists so Discovery, Runtime, Architecture, and hosts do not invent their own incompatible vocabulary.

This folder should contain:
- status definitions
- decision-state definitions
- adoption-target definitions
- cross-track contracts
- shared schemas
- shared host-agnostic libraries
- reusable templates

Current reusable templates include:
- Discovery fast-path record
- Discovery intake, triage, routing, and holding-state templates
- Runtime follow-up, execution, promotion, and registry templates
- IntegrationContractArtifact and ProofChecklistArtifact templates
- shared decision and experiment templates

OpenClaw note:
- OpenClaw-native rescue templates live under `C:\Users\User\.openclaw\workspace\openclaw\templates\`
- Directive Workspace may reference those templates when needed, but does not own them

Current cross-track contracts include:
- promotion-quality gate contract
- structured-output fallback contract
- integration/proof template-generator contract
- citation-set fallback contract

Current shared libraries include:
- `shared/lib/structured-output-fallback.ts`
- `shared/lib/lifecycle-artifacts.ts`
- `shared/lib/integration-artifact-generator.ts`

Host note:
- Mission Control may keep temporary host-local mirrors of `shared/lib/` files
- canonical ownership remains in Directive Workspace
- mirror drift must be prevented by host sync checks

This folder should not contain:
- host runtime code
- track-specific experiment records
- host-specific deployment details
