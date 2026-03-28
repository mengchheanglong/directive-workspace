# Engine Progressive Stage Chaining Refactor Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-progressive-stage-chaining-2026-03-27`
- Source reference: `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the parked STANDARD ts-edge result surfaced a reusable Engine refactor target, and this separate DEEP Architecture case materializes that target as bounded Engine planning-pipeline code change.

## Objective

Open one bounded DEEP Architecture slice that makes extraction planning feed typed output into adaptation planning inside `processSource()`, without rewriting the whole Engine pipeline.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the first code change to extraction -> adaptation chaining in `engine/directive-engine.ts`.
- Do not refactor improvement, proof, or integration planning in this opener.
- Do not reopen Runtime, frontend, or host integration.

## Inputs

- Parked STANDARD evidence from `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md` showing that `processSource()` still reuses one flat `planningInput` across multiple planning stages.
- Existing Engine code in `engine/directive-engine.ts` where extraction, adaptation, improvement, proof, and integration planning are built independently from the same base input.

## Validation gate(s)

- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the bounded extraction -> adaptation chaining slice and delete this DEEP case chain if the refactor stops being clearly bounded.

## Next decision

- `adopt`
