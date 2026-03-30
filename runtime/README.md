# Directive Runtime

Directive Runtime is the bounded runtime operationalization and behavior-preserving transformation lane of Directive Workspace.

Runtime turns accepted patterns into bounded, measurable, callable, runtime-capable autonomous loops. It supports two first-class lanes:
1. **Runtime operationalization** - new capability adoption through promotion contract, proof, and host integration
2. **Behavior-preserving transformation** - same capability, better implementation (speed, cost, reliability, maintainability) with dimensional evaluator proof

Each Runtime item should aim for: clear objective, clear metric, clear evaluator, defined boundary, rollback path, proof of usefulness, and replaceable integration shape.

It owns:
- Runtime follow-up records
- Runtime execution records (including transformation records with dimensional evaluators)
- promotion records with quality gates
- runtime adoption tracking
- registry state
- explicit Runtime lane modules
- Architecture-to-Runtime handoff records
- source-pack curation and activation

It does not own:
- host runtime code, database schema, or API routes (that is Mission Control)
- reusable operating-code extraction (that is Architecture)
- intake, triage, or routing (that is Discovery)

Current host:
- `Mission Control`

Current compatibility note:
- the canonical Runtime core has been extracted into `core/v0.ts`
- canonical Runtime decision policy now lives in `core/decision-policy.ts`
- canonical Runtime decision contract now lives in `core/decision-contract.ts`
- canonical Runtime workflow contract now lives in `core/workflow-contract.ts`
- canonical Runtime presentation contract now lives in `core/presentation-contract.ts`
- canonical Runtime proof contract now lives in `core/proof-contract.ts`
- canonical Runtime capability patch contract now lives in `core/capability-patch-contract.ts`
- Mission Control still keeps a host-local mirror of that file because Next.js 16 Turbopack did not resolve the standalone Runtime package reliably in production builds
- host import cutover is deferred until package consumption is stable
- the current canonical keep/move/defer inventory lives in `BOUNDARY_INVENTORY.json`
- the current live-runtime accounting truth lives in `LIVE_RUNTIME_ACCOUNTING.json`

Current state:
- Runtime belongs to Directive Workspace structurally and doctrinally
- Runtime runtime is still hosted in Mission Control
- the standalone reference host can now execute the full bounded local Runtime artifact lifecycle (follow-up, record, proof, transformation proof, transformation record, promotion, registry, overview) for shareable GitHub/local usage without claiming broad runtime parity
- the current runtime-lane boundary is intentional: explicit Runtime lane modules remain here while host-bound API/database/runtime logic stays in Mission Control
- Waves 01-04 are complete; `scientify-literature-monitoring` is now opened as one bounded Architecture-to-Runtime follow-up candidate with an active live-fetch proof slice completed, but no host promotion or registry acceptance is open yet
- Behavior-preserving transformation lane is proven with dimensional evaluator proof (backend test boilerplate consolidation, 2026-03-22)
- Deferred Runtime candidates stay out of active execution unless their re-entry conditions are met

Folders:
- `core/` - explicit Runtime lane modules and contracts
- `follow-up/` - post-routing operational records and cutover docs
- `handoff/` - Architecture-to-Runtime cross-track handoff records
- `records/` - execution records, proof artifacts, and transformation records
- `promotion-records/` - promotion proposals with gates and evidence
- `registry/` - accepted runtime state entries
- `source-packs/` - curated runtime asset packs (catalog + import policy)

## Runtime Surface Inventory And Authority

Inside `runtime/`, treat surfaces as follows:

- `follow-up/`, `handoff/`, `02-records/`, `03-proof/`, `04-capability-boundaries/`, and `05-promotion-readiness/`
  - Runtime lane workflow and record corpus surfaces for the bounded Runtime chain
  - authoritative only through their linked lane-record relationships and the canonical shared readers/checks
  - not shared product logic

- `records/`, `promotion-records/`, and `registry/`
  - Runtime lane record surfaces for execution history, promotion proposals, and accepted runtime state tracking
  - lane-local record authority, not shared Engine authority
  - not raw sources and not runtime assets

- `source-packs/`
  - runtime assets surface
  - not a runtime records surface
  - not shared product logic
  - activation still depends on catalog and readiness rules, not folder presence alone

- `standalone-host/`
  - runtime host-facing/generated reference surface for the standalone local host
  - contains local host support files and generated run-output artifacts
  - not the shared product kernel

- `standalone-host/engine-runs/`
  - generated run-output and evidence surface
  - useful for inspection, proof, and replay context
  - not canonical runtime authority by itself
  - does not replace linked lane records, inventories, or shared truth readers

- `core/`, `capabilities/`, and runtime root package/export files
  - explicit Runtime lane-local implementation and export surfaces
  - not the shared Engine kernel
  - shared cross-lane semantics still belong in `engine/` or `shared/`, not here

- `BOUNDARY_INVENTORY.json`, `IMPORT_SOURCE_POLICY.json`, `LIVE_RUNTIME_ACCOUNTING.json`, and `PROMOTION_PROFILES.json`
  - runtime control and inventory surfaces
  - authoritative for the bounded policy/accounting questions they explicitly name
  - not substitutes for lane records or shared product doctrine

Authority rule:
- use canonical shared contracts, readers, reports, and linked Runtime records to determine live Runtime truth
- do not treat generated host output, asset volume, or folder presence alone as sufficient Runtime authority

Rule:
- Runtime belongs to Directive Workspace as a track
- Mission Control currently hosts Runtime runtime behavior
- runtime source-pack resolution must require `SOURCE_PACK_READY.md`; catalog/listing paths do not imply activation
- package/import cutover decisions must be recorded in `BOUNDARY_INVENTORY.json` before mirrors or exports change
- promotion-profile family, proof shape, and primary host checker truth must be recorded in `PROMOTION_PROFILES.json`
- import-pack default/explicit/blocked behavior must be recorded in `IMPORT_SOURCE_POLICY.json`
- every `live_runtime` pack must have explicit lifecycle accounting in `LIVE_RUNTIME_ACCOUNTING.json`

Operational loop:
1. Receive a Runtime-targeted candidate through Discovery routing or Architecture handoff.
2. Default fast path:
   - create one follow-up record in `follow-up/`
   - stop there if the candidate is not yet being proposed to a host
3. Track the active Runtime execution slice in `records/` only when real runtime work starts.
4. Create a promotion record in `promotion-records/` only once host integration is actually being proposed.
5. Record accepted runtime state in `registry/` only after host acceptance.

Decision rule:
- Runtime does not absorb external tools blindly.
- Runtime operationalizes useful callable value through bounded runtime follow-up, evidence, gates, and rollback.
- Runtime also supports behavior-preserving transformation (same capability, better implementation) as a first-class lane with dimensional evaluators.
- A candidate is not `runtime-callable` until the promotion record exists, required host gates pass, and proof is linked.
- Use the smallest artifact set that still preserves proof and rollback clarity.

Required artifacts by stage:
- `follow-up/`: why this callable path exists
- `records/`: what runtime slice is being executed now
- `promotion-records/`: what is being proposed to the host and under what gates
- `registry/`: what runtime state is currently accepted

Canonical references:
- `knowledge/workflow.md`
- `shared/templates/runtime-follow-up-record.md`
- `shared/templates/runtime-record.md`
- `shared/templates/promotion-record.md`
- `shared/templates/registry-entry.md`
- `shared/templates/integration-contract-artifact.md`
- `shared/templates/proof-checklist-artifact.md`
- `shared/contracts/discovery-to-runtime.md`
- `shared/contracts/architecture-to-runtime.md`
- `shared/contracts/runtime-to-host.md`
- `shared/contracts/runtime-external-run-envelope.md`
- `runtime/PROMOTION_PROFILES.json`
- `shared/contracts/promotion-quality-gate.md`
- `shared/contracts/structured-output-fallback.md`
- `shared/contracts/integration-proof-template-generator.md`
