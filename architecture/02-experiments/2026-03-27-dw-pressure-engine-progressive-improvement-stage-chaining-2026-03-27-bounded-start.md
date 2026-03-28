# Engine Progressive Improvement-Stage Chaining Refactor Bounded Architecture Start

- Candidate id: dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27
- Candidate name: Engine Progressive Improvement-Stage Chaining Refactor
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes improvement planning consume typed extraction and adaptation output inside `processSource()`, without refactoring proof or integration planning.
- Bounded scope:
- Keep this at one Architecture experiment slice.
- Restrict the code change to the improvement planning seam in `engine/directive-engine.ts`.
- Introduce one typed improvement-stage input only where needed.
- Do not refactor proof planning or integration planning in this opener.
- Do not reopen Runtime, frontend, or host integration.
- Inputs:
- Prior DEEP evidence from `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-result.md` showing extraction now feeds adaptation directly while improvement still stays on the flat base input path.
- Existing Engine code in `engine/directive-engine.ts` where `buildImprovementPlan(...)` still receives only `planningInput`.
- Existing extraction and adaptation outputs already available inside `processSource()`.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the new DEEP opener from scratch.
- Validation gate(s):
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No bounded Engine-owned improvement-stage chaining target becomes clearer than the already-landed extraction -> adaptation slice.
- Rollback: Revert the bounded improvement-stage chaining slice and leave the case at start if the refactor stops being clearly bounded.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-engine-handoff.md`
- Prior implementation result: `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-result.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-engine-handoff.md`
