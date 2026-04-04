# Knowledge Surface Consolidation

Date: 2026-04-04

## Slice

Consolidated the active knowledge surface so operators and agents no longer treat overlapping `knowledge/*.md` planning/doctrine documents as peer authority with `CLAUDE.md`.

## Changes

- added `knowledge/README.md` as the canonical index for supporting and historical `knowledge/` documents
- updated active entry surfaces to point at:
  - `CLAUDE.md`
  - `control/runbook/current-priority.md`
  - `knowledge/README.md`
- removed active-surface references to `knowledge/doctrine.md`, `knowledge/workflow.md`, and `knowledge/execution-plan.md` from:
  - `README.md`
  - `CONTRIBUTING.md`
  - `operator-start.md`
  - `runtime/README.md`
  - `discovery/README.md`
  - `architecture/README.md`
- marked these `knowledge/` documents as historical/reference only:
  - `doctrine.md`
  - `workflow.md`
  - `operating-model-v2.md`
  - `operating-model-simplification-plan.md`
  - `delivery-plan.md`
  - `execution-plan.md`
  - `project-plan.md`

## Repo Truth

- active doctrine remains `CLAUDE.md`
- active mission/run priority remains `control/runbook/current-priority.md`
- `knowledge/` now reads as supporting reference/history rather than a competing doctrine stack

## Verification

- `npm run check:control-authority`
- `npm run check:directive-workspace-composition`
