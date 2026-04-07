# Engine Progressive Integration-Stage Chaining Refactor Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28`
- Source reference: `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-implementation-result.md`
- Prior DEEP implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-implementation-target.md`
- Parked STANDARD evidence: `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the third DEEP ts-edge slice proved progressive stage chaining is valuable in shared Engine code, and the next bounded seam is integration planning consuming typed extraction, adaptation, improvement, and proof output instead of reusing only the flat base input.

## Objective

Open one bounded DEEP Architecture slice that makes integration planning consume typed extraction, adaptation, improvement, and proof output inside `processSource()`, without reopening Runtime, frontend, or host integration.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to the integration planning seam in `engine/directive-engine.ts`, `engine/lane.ts`, and `engine/directive-workspace-lanes.ts`.
- Introduce one typed integration-stage input only where needed.
- Do not open Runtime, frontend, or host integration.

## Inputs

- Prior DEEP evidence from `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-implementation-result.md` showing integration planning still stayed on the flat base input path after proof chaining landed.
- Existing Engine code in `engine/directive-engine.ts` where `buildIntegrationProposal(...)` still received only `planningInput`.
- Existing extraction, adaptation, improvement, and proof outputs already available inside `processSource()`.

## Validation gate(s)

- `integration_stage_complete`
- `engine_boundary_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the bounded integration-stage chaining slice and delete this DEEP case chain if the refactor stops being clearly bounded.

## Next decision

- `adopt`

