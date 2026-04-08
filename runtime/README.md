# Directive Runtime

Runtime is the bounded runtime operationalization and behavior-preserving transformation lane of Directive Workspace.

It turns extracted value into reusable callable capabilities with bounded proof, rollback, and host integration.

It owns:
- callable capabilities (`capabilities/`)
- Runtime core contracts (`core/`)
- Runtime-wide metadata and policy catalogs (`meta/`)
- follow-up records (`00-follow-up/`)
- callable integration records (`01-callable-integrations/`)
- execution records (`02-records/` through `06-promotion-specifications/`)
- promotion records (`07-promotion-records/`)
- registry state (`08-registry/`)
- callable execution surface and evidence (`callable-executions/`)

It does not own:
- host runtime code or APIs (that is the host)
- reusable operating-code extraction (that is Architecture)
- intake, triage, or routing (that is Discovery)

## Default operational loop

1. Receive a Runtime candidate through Discovery routing or Architecture handoff.
2. Create one follow-up record in `00-follow-up/`.
3. If the case is exploratory or lacks delivery pressure, park it there.
4. Open `01-callable-integrations/` only when the case is becoming a real callable capability surface.
5. Continue deeper only when real delivery work starts:
   - `02-records/` for execution records
   - `03-proof/` for proof artifacts
   - `04-capability-boundaries/` for capability boundary definitions
   - `05-promotion-readiness/` for promotion readiness
   - `06-promotion-specifications/` for generated promotion specs
   - `07-promotion-records/` for explicit manual promotion records
6. Record accepted capability state in `08-registry/` only after host acceptance.

Use the smallest artifact set that preserves proof and rollback clarity.
There is no separate Runtime `implementation-slices/` stage; implementation-specific work either stays inside the active bounded chain or remains host-local.

## Callable capabilities

Real executing Directive-owned capabilities live in `capabilities/`:
- `capabilities/literature-access/` - Scientify literature-access tool bundle
- `capabilities/code-normalizer/` - behavior-preserving code normalizer

These are invoked through the shared callable contract (`core/callable-contract.ts`) and executor surfaces.

## Structure Rule

The numbered Runtime folders are the bounded lane flow:
- `00-follow-up/`
- `01-callable-integrations/`
- `02-records/`
- `03-proof/`
- `04-capability-boundaries/`
- `05-promotion-readiness/`
- `06-promotion-specifications/`
- `07-promotion-records/`
- `08-registry/`

The unnumbered folders are side surfaces:
- `core/`, `capabilities/`, `lib/` - operating code
- `meta/` - Runtime-owned inventories, policy catalogs, and accounting surfaces
- `callable-executions/`, `standalone-host/`, `source-packs/` - execution, host, and retained asset surfaces
- `legacy-handoff/`, `legacy-records/` - compatibility/history only

## Key folders

- `core/` - Runtime lane contracts and shared callable contract
- `capabilities/` - Directive-owned callable capability implementations
- `meta/` - Runtime-owned inventories, accounting, and policy catalogs
- `00-follow-up/` - post-routing follow-up records (park here by default)
- `01-callable-integrations/` - callable-integration artifacts when a case becomes a real callable capability surface
- `callable-executions/` - execution records and evidence from callable runs
- `02-records/` through `08-registry/` - bounded Runtime chain stages after the opener surfaces
- `standalone-host/` - standalone reference host support
- `legacy-handoff/` - old Runtime handoff compatibility surface, not the active default path
- `legacy-records/` - old capability-record compatibility corpus, not the active default path

## Current head resolution

Do not use folder recency to determine the current head for a case.
Use the canonical shared resolver:
- `engine/state/index.ts`
- `npm run report:directive-workspace-state`

For daily operator navigation inside `runtime/00-follow-up/`, use:
- `npm run report:runtime-follow-up-navigation`

That report is the canonical active/support/archive entry surface for Runtime follow-up work. In NOTE-mode Runtime work, the normal stop is still the follow-up record unless a later stage adds concrete new product value.

## Canonical references

- `../CLAUDE.md`
- `../control/runbook/current-priority.md`
- `../knowledge/README.md`
- `core/callable-contract.ts`
- `shared/contracts/runtime-to-host.md`
- `shared/contracts/discovery-to-runtime.md`
- `shared/contracts/architecture-to-runtime.md`
