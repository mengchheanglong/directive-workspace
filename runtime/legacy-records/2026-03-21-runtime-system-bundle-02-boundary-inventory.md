# Runtime System Bundle 02: Boundary Inventory

Date: 2026-03-21
Owner: Directive Runtime
Status: completed
Decision state: `route_to_runtime_follow_up`
Adoption target: `Directive Runtime follow-up`

## Purpose

Inventory the current Runtime package and mirror boundary before opening broader runtime slices.

## Decision

- canonical product-owned Runtime core remains under `runtime/core/`
- canonical shared executable helpers remain under `shared/lib/`
- Mission Control keeps host-local mirrors for both sets for now
- direct package import cutover remains deferred
- host runtime surfaces stay host-only

## Why direct package cutover is deferred

- current production build path still depends on Next.js 16 Turbopack behavior
- previous direct package consumption was not stable enough for host runtime
- the safest current rule is:
  - Directive Workspace owns the code canonically
  - Mission Control mirrors and consumes it as the active host

## Keep / Move / Defer

| Area | Current owner | Decision | Notes |
|---|---|---|---|
| `runtime/core/*.ts` | Directive Workspace | move_done | canonical Runtime core is already product-owned |
| `shared/lib/*.ts` | Directive Workspace | move_done | canonical cross-track helpers are already product-owned |
| `mission-control/src/lib/directive-workspace/*.ts` | Mission Control | keep_mirror | mirrors stay until direct package import is stable |
| `runtime/package.json` export widening | Directive Workspace | defer | only `.` and `./core/v0` stay exported for now |
| `mission-control/src/server/services/*` | Mission Control | keep_host_only | host orchestration/runtime adapters remain host-owned |
| `mission-control/src/server/repositories/*` | Mission Control | keep_host_only | host persistence stays out of Runtime product code |
| `mission-control/src/app/api/directive-workspace` | Mission Control | keep_host_only | host API surface |
| `mission-control/src/app/dashboard/directive-workspace` | Mission Control | keep_host_only | host UI surface |

## Canonical inventory

Source of truth:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\BOUNDARY_INVENTORY.json`

The inventory now explicitly tracks:
- active Runtime core mirrors
- active shared-lib mirrors
- current package exports
- deferred package export/cutover targets
- host-only surfaces that should not be moved into Runtime product code

## Operational consequence

- no new runtime slice should widen package exports by assumption
- no host service should become product-owned without being added to the boundary inventory first
- mirror drift and inventory drift are both now host-checked

## Next active work

Runtime System Bundle 03: source-pack catalog and activation cleanup
