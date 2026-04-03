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
- canonical path/storage compatibility layers where stable logical artifact paths must survive structural cleanup

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
- `shared/lib/dw-state.ts`
- `shared/lib/directive-workspace-artifact-storage.ts`
- `shared/lib/architecture-deep-tail-stage-map.ts`
- `shared/lib/architecture-deep-tail-artifact-helpers.ts`
- `shared/lib/runtime-follow-up-navigation.ts`
- `shared/lib/runtime-promotion-assistance.ts`
- `shared/lib/structured-output-fallback.ts`
- `shared/lib/lifecycle-artifacts.ts`
- `shared/lib/integration-artifact-generator.ts`

Host note:
- hosts may keep temporary host-local mirrors of `shared/lib/` files
- canonical ownership remains in Directive Workspace
- mirror drift must be prevented by host sync checks

Current emphasis:
- one shared vocabulary across Discovery, Runtime, Architecture, and hosts
- one canonical state read surface
- one canonical artifact path/storage compatibility layer where filesystem layout changed but logical links must stay stable
- one canonical set of host-agnostic navigation/report builders for active operator surfaces

This folder should not contain:
- host runtime code
- track-specific experiment records
- host-specific deployment details
