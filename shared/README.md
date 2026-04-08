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

Important structural note:
- lane operating code and canonical state no longer live under `shared/lib/`
- the main executable groupings are now:
  - `architecture/lib/` for Architecture lane operating code
  - `runtime/lib/` for Runtime lane operating code
  - `discovery/lib/` for Discovery lane operating code
  - `engine/state/` for canonical state resolution
- `shared/lib/` remains for residual cross-cutting support, artifact/storage helpers, and host-agnostic adapters

The lane artifact folders under `architecture/`, `runtime/`, and `discovery/` are the proof and record surfaces, not the only place lane ownership lives.

Current reusable templates include:
- Discovery fast-path record
- Discovery intake, triage, routing, and holding-state templates
- Runtime follow-up, execution, promotion, and registry templates
- IntegrationContractArtifact and ProofChecklistArtifact templates
- shared decision and experiment templates

External-host note:
- host-specific rescue, recovery, and orchestration templates should live with the owning host
- Directive Workspace may reference external host templates when needed, but does not own them

Current cross-track contracts include:
- promotion-quality gate contract
- structured-output fallback contract
- integration/proof template-generator contract
- citation-set fallback contract

Current shared libraries include:
- `engine/state/index.ts`
- `shared/lib/directive-workspace-artifact-storage.ts`
- `architecture/lib/architecture-deep-tail-stage-map.ts`
- `architecture/lib/architecture-deep-tail-artifact-helpers.ts`
- `runtime/lib/runtime-follow-up-navigation.ts`
- `runtime/lib/runtime-promotion-assistance.ts`
- `shared/lib/structured-output-fallback.ts`
- `shared/lib/lifecycle-artifacts.ts`
- `shared/lib/integration-artifact-generator.ts`
- `shared/lib/literature-monitoring-artifacts.ts`

Current residual `shared/lib/` truth:
- only artifact/storage compatibility and small host-agnostic support helpers remain there
- lane-owned Architecture support has moved to `architecture/lib/`
- cross-lane Engine state, case, coordination, and execution support have moved to `engine/`

Host note:
- hosts may keep temporary host-local mirrors of Engine lane/state files and residual `shared/lib/` support files
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
