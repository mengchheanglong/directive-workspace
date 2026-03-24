# Directive Forge

Directive Forge is the bounded runtime operationalization and behavior-preserving transformation lane of Directive Workspace.

Forge turns accepted patterns into bounded, measurable, callable, runtime-capable autonomous loops. It supports two first-class lanes:
1. **Runtime operationalization** — new capability adoption through promotion contract, proof, and host integration
2. **Behavior-preserving transformation** — same capability, better implementation (speed, cost, reliability, maintainability) with dimensional evaluator proof

Each Forge item should aim for: clear objective, clear metric, clear evaluator, defined boundary, rollback path, proof of usefulness, and replaceable integration shape.

It owns:
- Forge follow-up records
- Forge execution records (including transformation records with dimensional evaluators)
- promotion records with quality gates
- runtime adoption tracking
- registry state
- host-agnostic Forge core modules
- Architecture-to-Forge handoff records
- source-pack curation and activation

It does not own:
- host runtime code, database schema, or API routes (that is Mission Control)
- reusable operating-code extraction (that is Architecture)
- intake, triage, or routing (that is Discovery)

Current host:
- `Mission Control`

Current compatibility note:
- the canonical Forge core has been extracted into `core/v0.ts`
- canonical Forge decision policy now lives in `core/decision-policy.ts`
- canonical Forge decision contract now lives in `core/decision-contract.ts`
- canonical Forge workflow contract now lives in `core/workflow-contract.ts`
- canonical Forge presentation contract now lives in `core/presentation-contract.ts`
- canonical Forge proof contract now lives in `core/proof-contract.ts`
- canonical Forge capability patch contract now lives in `core/capability-patch-contract.ts`
- Mission Control still keeps a host-local mirror of that file because Next.js 16 Turbopack did not resolve the standalone Forge package reliably in production builds
- host import cutover is deferred until package consumption is stable
- the current canonical keep/move/defer inventory lives in `BOUNDARY_INVENTORY.json`
- the current live-runtime accounting truth lives in `LIVE_RUNTIME_ACCOUNTING.json`

Current state:
- Forge belongs to Directive Workspace structurally and doctrinally
- Forge runtime is still hosted in Mission Control
- the standalone reference host can now execute the full bounded local Forge artifact lifecycle (follow-up, record, proof, transformation proof, transformation record, promotion, registry, overview) for shareable GitHub/local usage without claiming broad runtime parity
- the current extraction boundary is intentional: pure host-agnostic logic is canonical here, host-bound API/database/runtime logic stays in Mission Control
- Waves 01-04 are complete; `scientify-literature-monitoring` is now opened as one bounded Architecture-to-Forge follow-up candidate with an active live-fetch proof slice completed, but no host promotion or registry acceptance is open yet
- Behavior-preserving transformation lane is proven with dimensional evaluator proof (backend test boilerplate consolidation, 2026-03-22)
- Deferred Forge candidates stay out of active execution unless their re-entry conditions are met

Folders:
- `core/` — host-agnostic product-owned contracts and logic
- `follow-up/` — post-routing operational records and cutover docs
- `handoff/` — Architecture-to-Forge cross-track handoff records
- `records/` — execution records, proof artifacts, and transformation records
- `promotion-records/` — promotion proposals with gates and evidence
- `registry/` — accepted runtime state entries
- `source-packs/` — curated external source packages (catalog + import policy)

Rule:
- Forge belongs to Directive Workspace as a track
- Mission Control currently hosts Forge runtime behavior
- runtime source-pack resolution must require `SOURCE_PACK_READY.md`; catalog/listing paths do not imply activation
- package/import cutover decisions must be recorded in `BOUNDARY_INVENTORY.json` before mirrors or exports change
- promotion-profile family, proof shape, and primary host checker truth must be recorded in `PROMOTION_PROFILES.json`
- import-pack default/explicit/blocked behavior must be recorded in `IMPORT_SOURCE_POLICY.json`
- every `live_runtime` pack must have explicit lifecycle accounting in `LIVE_RUNTIME_ACCOUNTING.json`

Operational loop:
1. Receive a Forge-targeted candidate through Discovery routing or Architecture handoff.
2. Default fast path:
   - create one follow-up record in `follow-up/`
   - stop there if the candidate is not yet being proposed to a host
3. Track the active Forge execution slice in `records/` only when real runtime work starts.
4. Create a promotion record in `promotion-records/` only once host integration is actually being proposed.
5. Record accepted runtime state in `registry/` only after host acceptance.

Decision rule:
- Forge does not absorb external tools blindly.
- Forge operationalizes useful callable value through bounded runtime follow-up, evidence, gates, and rollback.
- Forge also supports behavior-preserving transformation (same capability, better implementation) as a first-class lane with dimensional evaluators.
- A candidate is not `runtime-callable` until the promotion record exists, required host gates pass, and proof is linked.
- Use the smallest artifact set that still preserves proof and rollback clarity.

Required artifacts by stage:
- `follow-up/`: why this callable path exists
- `records/`: what runtime slice is being executed now
- `promotion-records/`: what is being proposed to the host and under what gates
- `registry/`: what runtime state is currently accepted

Canonical references:
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\workflow.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\forge-follow-up-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\forge-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\promotion-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\registry-entry.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\integration-contract-artifact.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\proof-checklist-artifact.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\discovery-to-forge.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\architecture-to-forge.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\forge-to-host.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\forge-external-run-envelope.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\PROMOTION_PROFILES.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\promotion-quality-gate.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\structured-output-fallback.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\integration-proof-template-generator.md`
