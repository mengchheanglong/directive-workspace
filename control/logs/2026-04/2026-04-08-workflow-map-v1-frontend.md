# 2026-04-08 - Workflow Map v1 Frontend Surface

## Bounded Slice

- Affected layer: frontend operator surface over Engine coordination state
- Owning lane: Engine coordination with Discovery, Architecture, and Runtime read surfaces
- Mission usefulness: make the source-to-usefulness flow visible without adding mutation or automation
- Proof path: frontend build, frontend host browser check, Directive Workspace composition check, full workspace check
- Rollback path: revert the `/workflow-map` route, frontend row rendering/styles, frontend host check assertions, README wording, and this log
- Stop-line: read-only workflow visibility only; no route resolution, host selection, registry write, adapter execution, or automation policy change

## Change

Added a compact `/workflow-map` frontend page that reads live snapshot and operator decision inbox data, then groups rows across:

- Research Engine / Engine Runs
- Discovery
- Architecture
- Runtime
- Registry / Host

Rows stay compact by default and expose artifact, next-step, and decision-gate detail only when expanded.

## Guardrails

- No new backend mutation route was added.
- No operator inbox decision is resolved from this page.
- No Runtime host adapter or registry operation is run from this page.
- Empty groups remain visible as zero-count phase sections instead of forcing fake rows.
