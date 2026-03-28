# Discovery Routing Record: ts-edge Type-Safe Graph Workflow Engine

Date: 2026-03-27

- Candidate id: dw-source-ts-edge-2026-03-27
- Candidate name: ts-edge Type-Safe Graph Workflow Engine
- Routing date: 2026-03-27
- Source type: github-repo
- Decision state: adopt
- Adoption target: engine-owned pipeline orchestration pattern
- Route destination: architecture
- Usefulness level: structural
- Usefulness rationale: Structural usefulness: the candidate's retained value is an Engine-owned orchestration pattern for typed stage-to-stage chaining inside `processSource()`, not a reusable runtime capability.
- Why this route: Operator override. Engine scored runtime (19), but the primary adoption target is Engine pipeline orchestration - improving how `processSource()` chains stage outputs. This is Architecture per doctrine: if the target is system logic, workflow, evaluation, structure, or adaptation ability, route to Architecture.
- Why not the alternatives: Runtime would be correct if the goal were to adopt ts-edge as a callable runtime tool. The real goal is to extract the typed-graph-with-chaining pattern to fix the Engine's flat `planningInput` problem. That is structural usefulness, not direct runtime capability.
- Handoff contract used: n/a
- Receiving track owner: architecture
- Required next artifact: architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md
- Re-entry/Promotion trigger conditions: adaptation_complete, engine_boundary_preserved, decision_review
- Review cadence: before any DEEP Engine implementation or adoption
- Linked intake record: discovery/intake/2026-03-27-dw-source-ts-edge-2026-03-27-intake.md
- Linked triage record: discovery/triage/2026-03-27-dw-source-ts-edge-2026-03-27-triage.md
