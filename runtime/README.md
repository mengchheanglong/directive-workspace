# Directive Runtime

Runtime is the bounded runtime operationalization and behavior-preserving transformation lane of Directive Workspace.

It turns extracted value into reusable callable capabilities with bounded proof, rollback, and host integration.

It owns:
- callable capabilities (`capabilities/`)
- Runtime core contracts (`core/`)
- follow-up records (`follow-up/`)
- execution records (`02-records/` through `06-promotion-specifications/`)
- promotion records (`promotion-records/`)
- registry state (`registry/`)
- callable execution surface and evidence (`callable-executions/`)

It does not own:
- host runtime code or APIs (that is the host)
- reusable operating-code extraction (that is Architecture)
- intake, triage, or routing (that is Discovery)

## Default operational loop

1. Receive a Runtime candidate through Discovery routing or Architecture handoff.
2. Create one follow-up record in `follow-up/`.
3. If the case is exploratory or lacks delivery pressure, park it there.
4. Continue deeper only when real delivery work starts:
   - `02-records/` for execution records
   - `03-proof/` for proof artifacts
   - `04-capability-boundaries/` for capability boundary definitions
   - `05-promotion-readiness/` for promotion readiness
   - `06-promotion-specifications/` for generated promotion specs
   - `promotion-records/` for explicit manual promotion records
5. Record accepted runtime state in `registry/` only after host acceptance.

Use the smallest artifact set that preserves proof and rollback clarity.

## Callable capabilities

Real executing Directive-owned capabilities live in `capabilities/`:
- `capabilities/literature-access/` — Scientify literature-access tool bundle
- `capabilities/code-normalizer/` — behavior-preserving code normalizer

These are invoked through the shared callable contract (`core/callable-contract.ts`) and executor surfaces.

## Key folders

- `core/` — Runtime lane contracts and shared callable contract
- `capabilities/` — Directive-owned callable capability implementations
- `follow-up/` — post-routing follow-up records (park here by default)
- `callable-executions/` — execution records and evidence from callable runs
- `02-records/` through `06-promotion-specifications/` — bounded Runtime chain stages
- `promotion-records/` — manual promotion records with gates
- `registry/` — accepted runtime state
- `standalone-host/` — standalone reference host support

## Current head resolution

Do not use folder recency to determine the current head for a case.
Use the canonical shared resolver:
- `shared/lib/dw-state.ts`
- `npm run report:directive-workspace-state`

For daily operator navigation inside `runtime/follow-up/`, use:
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
