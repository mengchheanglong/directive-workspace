# ts-edge Type-Safe Graph Workflow Engine Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-ts-edge-2026-03-27`
- Source reference: `sources/intake/ts-edge`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Usefulness level: `structural`
- Usefulness rationale: Structural usefulness: the candidate's retained value is an Engine-owned orchestration pattern for typed stage-to-stage chaining inside `processSource()`, not a reusable runtime capability.

## Objective

Open one bounded Architecture experiment to decide whether ts-edge's typed graph chaining pattern justifies a later DEEP Engine refactor target for `processSource()`, without implementing that refactor in this STANDARD slice.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any DEEP Engine implementation is opened.
- Do not materialize Engine code changes from this STANDARD handoff alone.

## Inputs

  - Lightweight TypeScript graph-based workflow engine with compile-time type-safe node chaining. Directly addresses the Engine pipeline gap where planning stages receive the same flat input instead of chaining outputs. The typed-graph pattern (addNode/edge/compile/run) maps to the Engine processSource stages with output-to-input type enforcement between connected nodes.
  - TypeScript-native, MIT license, zero runtime deps (only ts-safe). ~8 core source files. Builder pattern: createGraph().addNode().edge().compile().run(). Supports branching, parallel execution, merge nodes, middleware, streaming, state management. The extracted value is the typed-graph-with-chaining pattern for Engine stage orchestration, not the library as a dependency.

## Validation gate(s)

  - `bounded_architecture_scope`
  - `engine_orchestration_target`
  - `no_deep_implementation_in_standard`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `structural`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Keep the case parked at bounded-result and do not open DEEP implementation until an explicit later decision upgrades it.

## Next decision

- `needs-more-evidence`
