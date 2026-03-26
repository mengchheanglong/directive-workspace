# Forge Source Packs

This directory is the product-owned home for Forge runtime source packs.

Purpose:
- hold extracted runtime-capable source packs after they are cut over from temporary upstream sources
- give Mission Control a stable Forge-owned root to prefer before any legacy fallback
- separate product-owned callable assets from retired `agent-lab` staging material

What belongs here:
- curated source packs ready for Forge runtime follow-up
- extracted skill-pack assets promoted into Directive Workspace ownership
- pack-specific manifests or support files needed by the Forge host contract

What does not belong here:
- raw upstream repo clones
- Architecture experiments or reference-pattern notes
- Discovery intake/triage artifacts
- host-only runtime data, reports, or snapshots
- generated dependency trees such as `node_modules/`
- host build caches such as `.next/`, `.turbo/`, `.cache/`, `htmlcov/`, or `.nyc_output/`

Current status:
- this root is now the canonical source-pack destination
- pack classification is defined in `CATALOG.json`
- import-lane eligibility is defined in `../IMPORT_SOURCE_POLICY.json`
- live-runtime lifecycle accounting is defined in `../LIVE_RUNTIME_ACCOUNTING.json`
- Mission Control runtime activation must follow the catalog, not folder presence alone

Activation rule:
- `SOURCE_PACK_READY.md` means the pack is cutover-complete
- a pack is runtime-live only when:
  - it contains `SOURCE_PACK_READY.md`
  - and `CATALOG.json` classifies it as `live_runtime`
- `follow_up_only` and `reference_only` packs must not be treated as runtime truth even if the ready marker exists
- Mission Control runtime resolvers must reject packs that fail either the ready-marker rule or the catalog-classification rule

Classification rule:
- `live_runtime`
  - currently active callable/runtime surface
- `follow_up_only`
  - cutover-complete and retained for future Forge runtime work
- `reference_only`
  - retained as reference, sample, or asset only

Hygiene rule:
- source packs must stay curated and reproducible
- generated dependency trees must not be retained under `forge/source-packs/`
- bounded build output is allowed only when a current manual follow-up lane explicitly depends on it and the pack record explains how to regenerate it from source

Allowlist rule:
- source-pack promotion and export must follow `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\source-pack-curation-allowlist.md`
- if a retained value does not fit an allowed export surface, keep it reference-only or drop it

Import rule:
- `IMPORT_SOURCE_POLICY.json` decides which source packs are:
  - `default_import`
  - `explicit_import_only`
  - `blocked`
- default import behavior must not surface follow-up-only or reference-only packs unless the policy explicitly allows that import mode
