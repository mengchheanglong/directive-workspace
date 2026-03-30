# Directive Runtime Source Packs

Per `shared/contracts/directive-workspace-repo-baseline.md`, this directory is a runtime assets surface inside Directive Workspace.

It is not:
- a runtime records surface
- a shared product-logic surface
- a Discovery or Architecture corpus surface

Purpose:
- hold curated runtime-pack assets after bounded cutover from upstream sources
- keep reusable runtime-pack assets distinct from runtime records, host data, and shared Engine logic
- provide a canonical asset root whose activation still depends on explicit catalog and readiness rules rather than folder presence alone

What belongs here:
- curated source packs retained as runtime assets
- extracted runtime-capable assets promoted into Directive Workspace ownership
- pack-specific manifests or support files needed to classify, regenerate, or follow up on a retained runtime asset

What does not belong here:
- raw upstream repo clones
- Discovery intake, triage, routing, or monitor artifacts
- Architecture experiments, notes, or reference-pattern artifacts
- runtime follow-up, proof, capability-boundary, or promotion-readiness records
- shared product logic, contracts, schemas, or templates
- host-only runtime data, reports, or snapshots
- generated dependency trees such as `node_modules/`
- host build caches such as `.next/`, `.turbo/`, `.cache/`, `htmlcov/`, or `.nyc_output/`

Current status:
- this root is the canonical runtime asset destination for source packs
- pack classification is defined in `CATALOG.json`
- import-lane eligibility is defined in `../IMPORT_SOURCE_POLICY.json`
- live-runtime lifecycle accounting is defined in `../LIVE_RUNTIME_ACCOUNTING.json`
- runtime activation must follow catalog and readiness rules, not folder presence alone

Activation rule:
- `SOURCE_PACK_READY.md` means the pack is cutover-complete
- a pack is runtime-live only when:
  - it contains `SOURCE_PACK_READY.md`
  - and `CATALOG.json` classifies it as `live_runtime`
- `follow_up_only` and `reference_only` packs must not be treated as runtime truth even if the ready marker exists
- runtime resolvers must reject packs that fail either the ready-marker rule or the catalog-classification rule

Classification rule:
- `live_runtime`
  - currently active runtime asset surface
- `follow_up_only`
  - cutover-complete asset retained for future bounded Runtime work
- `reference_only`
  - retained as reference, sample, or asset only

Hygiene rule:
- source packs must stay curated and reproducible
- generated dependency trees must not be retained under `runtime/source-packs/`
- bounded build output is allowed only when a current manual Runtime follow-up lane explicitly depends on it and the pack record explains how to regenerate it from source

Allowlist rule:
- source-pack promotion and export must follow `shared/contracts/source-pack-curation-allowlist.md`
- if a retained value does not fit an allowed export surface, keep it reference-only or drop it

Import rule:
- `IMPORT_SOURCE_POLICY.json` decides which source packs are:
  - `default_import`
  - `explicit_import_only`
  - `blocked`
- default import behavior must not surface follow-up-only or reference-only packs unless the policy explicitly allows that import mode
