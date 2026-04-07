# Mission Control Host Notes

Mission Control is the current host for Directive Workspace runtime behavior.
Directive Workspace remains the standalone product.

Mission Control owns:
- runtime code for current Directive APIs and services
- runtime database tables
- verification gates
- operator UI and dashboard integration
- thin host adapters over canonical Directive Workspace assets

Mission Control does not own:
- Directive Workspace product doctrine
- the canonical definition of Discovery, Runtime, and Architecture
- product-level handoff contracts
- the identity of Directive Workspace as a standalone product

Current boundary:
- Runtime runtime behavior is hosted here
- Directive Workspace product ownership now lives in the Directive Workspace product root; the current incubation-path example is `C:\Users\User\.openclaw\workspace\directive-workspace`
- the canonical Runtime core lives under `runtime/core/`
- canonical cross-track shared helpers live under `shared/lib/`
- Runtime records and promotion lifecycle live under `runtime/`
- Mission Control keeps host-local mirrors under `src/lib/directive-workspace/`
- `npm run check:directive-runtime-sync` enforces that the mirror stays aligned
- `npm run check:directive-shared-lib-sync` enforces that shared helper mirrors stay aligned
- `npm run check:directive-runtime-boundary-inventory` enforces that the current mirror/package inventory matches the real host/product boundary
- `npm run check:directive-source-pack-catalog` enforces that source-pack classification, readiness, and runtime activation stay aligned
- `npm run check:directive-host-integration-boundary` enforces that Mission Control remains an adapter host over product-owned Directive Workspace assets

Current host status:
- standalone Directive Workspace migration is complete enough for normal operation
- Mission Control remains the first and only active Runtime runtime host
- Mission Control is still only a host, not the product definition
- Directive Workspace now has its own minimal standalone frontend under `frontend/` with a thin host under `hosts/web-host/`; Mission Control should be treated as an integration host, not the canonical product frontend
- Mission Control now has a small Engine-native producer/consumer path:
  - current adjacent workspace example dashboard surface: `C:\Users\User\.openclaw\workspace\mission-control\src\app\dashboard\directive-workspace\EngineRunsOverviewPanel.tsx`
  - current adjacent workspace example detail surface: `C:\Users\User\.openclaw\workspace\mission-control\src\app\dashboard\directive-workspace\engine-runs\[runId]\page.tsx`
  - current adjacent workspace example read adapter: `C:\Users\User\.openclaw\workspace\mission-control\src\server\services\directive-engine-run-read-service.ts`
  - current adjacent workspace example Discovery submission producer: `C:\Users\User\.openclaw\workspace\mission-control\src\server\services\directive-discovery-submission-service.ts`
  - artifact root consumed: `runtime/standalone-host/engine-runs/`
  - read mode: consume persisted `DirectiveEngineRunRecord` JSON and paired Markdown run reports directly
  - write mode: the existing Discovery submission path can optionally invoke the Engine, persist the same run-record/report artifact pair, materialize Discovery intake/triage/routing records, and create one lane-native handoff stub before advancing the queue to `routed`
  - Architecture start mode: Mission Control can now open one bounded Architecture experiment record directly from a routed `architecture/01-experiments/*-engine-handoff.md` stub without re-reading the Engine run by hand
  - boundary: Engine-native host consumption and production only; no remap into the legacy directive-capability CRUD model
- host verification remains the source of runtime truth:
  - `npm run typecheck`
  - `npm run build`
  - `npm run check:ops-stack`

Current mirror set:
- `v0.ts`
- `decision-policy.ts`
- `decision-contract.ts`
- `workflow-contract.ts`
- `presentation-contract.ts`
- `proof-contract.ts`
- `capability-patch-contract.ts`

Current shared-lib mirror set:
- `structured-output-fallback.ts`
- `lifecycle-artifacts.ts`
- `integration-artifact-generator.ts`

Boundary source of truth:
- `runtime/meta/BOUNDARY_INVENTORY.json`
- `runtime/source-packs/CATALOG.json`
- `shared/contracts/host-integration-boundary.md`

## OpenClaw Integration

- Contract: `shared/contracts/openclaw-to-discovery.md`
- Current external OpenClaw example root helper: `C:\Users\User\.openclaw\scripts\submit-openclaw-discovery-candidate.ps1`
- Host checker: `npm run check:openclaw-discovery-submission`
- Current external OpenClaw example bounded signal helper: `C:\Users\User\.openclaw\scripts\submit-openclaw-runtime-verification-signal.ps1`
- Signal helper checker: `npm run check:openclaw-runtime-verification-signal`
- Current external OpenClaw example maintenance/watchdog helper: `C:\Users\User\.openclaw\scripts\submit-openclaw-maintenance-watchdog-signal.ps1`
- Maintenance/watchdog checker: `npm run check:openclaw-maintenance-watchdog-signal`
- Current status: bounded root-helper submission into the primary Discovery queue is active and exercised
- OpenClaw submits pending candidates to Discovery intake queue only
- OpenClaw does not bypass Discovery to reach Runtime or Architecture directly
- Active bounded upstream signal lanes: direct root submission, stale runtime verification freshness, maintenance/watchdog degraded-state signaling
- Future webhook, Telegram, or gateway submission lanes remain deferred until explicitly opened as separate slices

