# Operator Start

Use this file as the shortest path to current repo truth and active work surfaces.

## Read order

1. `CLAUDE.md`
2. `AGENTS.md`
3. `control/runbook/active.md`
4. `control/runbook/current-priority.md`

## Canonical truth surfaces

- `engine/workspace-truth.ts`
  Product-level truth summary: what Directive Workspace has proven, what remains intentionally minimal, and which seams are still closed.
- `control/state/`
  Machine-readable control surfaces for completion state and bounded persistent coordination.
- `shared/lib/dw-state.ts`
  Canonical read surface for current case and workflow state.
- `state/`
  Case/event persistence, not historical commentary.

## Doctrine vs source input

- `knowledge/`
  Directive-owned doctrine, workflow, mission, and operating policy.
  Use this when you need product interpretation or operating rules.
- `sources/`
  Raw upstream source material and source notes.
  Use this when you need the original input surface, not Directive-owned workflow or doctrine.

## Active work surfaces

- `control/runbook/active.md`
  Active execution rules.
- `control/runbook/current-priority.md`
  Current mission focus.
- `control/policies/`
  Stop-lines, continuation rules, and logging rules.

## History vs active

- `control/logs/`
  Historical run logs only. Use them for audit/history, not as current authority.
- `runtime/follow-up/`
  Mixed Runtime case-local support corpus: follow-up records, preparation bundles, and bounded proof bundles.
  Do not use folder recency here as the live continuation rule; use `npm run report:runtime-follow-up-navigation` as the canonical operator entry surface, then resolve exact case-head truth through `shared/lib/dw-state.ts` or `npm run report:directive-workspace-state`.
- `architecture/`, `runtime/`, `discovery/`
  Lane-owned operating artifacts.
- `architecture/deep-materialization/`
  Physical storage for DEEP-only Architecture materialization artifacts.
  Logical artifact paths for `architecture/04-...` through `architecture/09-...` remain stable, but this storage root is not the normal daily navigation surface.

## Navigation shortcuts

- Need current whole-product truth:
  `npm run report:directive-workspace-state`
- Need active Runtime queue truth:
  `npm run report:runtime-loop-control`
  `npm run report:runtime-promotion-assistance`
- Need Runtime follow-up navigation truth:
  `npm run report:runtime-follow-up-navigation`
- Need lifecycle pressure:
  `npm run report:read-only-lifecycle-coordination`
- Need completion selector truth:
  inspect `control/state/completion-status.json`
  inspect `control/state/completion-slices.json`

## Non-authoritative surfaces

- `scratch/`
  Local rebuildable scratch only.
- `control/logs/`
  Audit trail, not live truth.

## Rule

If two surfaces seem to disagree:
- prefer `CLAUDE.md`
- then `AGENTS.md`
- then `engine/workspace-truth.ts`
- then shared/control read surfaces
- treat historical logs as evidence, not authority
