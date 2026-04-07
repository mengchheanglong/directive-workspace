# ts-edge Type-Safe Graph Workflow Engine Bounded Architecture Start

- Candidate id: dw-source-ts-edge-2026-03-27
- Candidate name: ts-edge Type-Safe Graph Workflow Engine
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-frontend-operator from routed handoff `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md`

- Objective: Decide whether ts-edge's typed graph chaining pattern should become a later DEEP Engine refactor target for `processSource()`, without implementing it in this STANDARD slice.
- Bounded scope:
- Keep this at one Architecture experiment slice.
- Preserve human review before any DEEP Engine implementation is opened.
- Do not materialize Engine code changes from this STANDARD slice alone.
- Inputs:
- Lightweight TypeScript graph-based workflow engine with compile-time type-safe node chaining. Directly addresses the Engine pipeline gap where planning stages receive the same flat input instead of chaining outputs. The typed-graph pattern (addNode/edge/compile/run) maps to the Engine processSource stages with output-to-input type enforcement between connected nodes.
- TypeScript-native, MIT license, zero runtime deps (only ts-safe). ~8 core source files. Builder pattern: createGraph().addNode().edge().compile().run(). Supports branching, parallel execution, merge nodes, middleware, streaming, state management. The extracted value is the typed-graph-with-chaining pattern for Engine stage orchestration, not the library as a dependency.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `bounded_architecture_scope`
- `engine_orchestration_target`
- `no_deep_implementation_in_standard`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before any DEEP upgrade.
- Failure criteria: No truthful Engine-owned DEEP refactor target becomes clearer than the existing structural note.
- Rollback: Keep the case parked at bounded-result and do not open DEEP implementation until an explicit later decision upgrades it.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `needs-more-evidence`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `structural`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `no`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md`

