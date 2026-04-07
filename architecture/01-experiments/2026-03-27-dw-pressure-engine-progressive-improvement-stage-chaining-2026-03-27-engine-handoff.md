# Engine Progressive Improvement-Stage Chaining Refactor Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27`
- Source reference: `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-result.md`
- Prior DEEP implementation target: `architecture/04-implementation-targets/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-target.md`
- Parked STANDARD evidence: `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the first DEEP ts-edge slice proved progressive stage chaining is valuable in shared Engine code, and the next bounded seam is improvement planning consuming typed extraction and adaptation output instead of reusing only the flat base input.

## Objective

Open one bounded DEEP Architecture slice that makes improvement planning consume typed extraction and adaptation output inside `processSource()`, without refactoring proof or integration planning.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to the improvement planning seam in `engine/directive-engine.ts`.
- Introduce one typed improvement-stage input only where needed.
- Do not refactor proof planning or integration planning in this opener.
- Do not reopen Runtime, frontend, or host integration.

## Inputs

- Prior DEEP evidence from `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-result.md` showing extraction now feeds adaptation directly while improvement still stays on the flat base input path.
- Existing Engine code in `engine/directive-engine.ts` where `buildImprovementPlan(...)` still receives only `planningInput`.
- Existing extraction and adaptation outputs already available inside `processSource()`.

## Validation gate(s)

- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the bounded improvement-stage chaining slice and delete this DEEP case chain if the refactor stops being clearly bounded.

## Next decision

- `adopt`

