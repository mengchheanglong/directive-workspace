# Implementation Target: Engine Progressive Integration-Stage Chaining Refactor (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28`
- Candidate name: Engine Progressive Integration-Stage Chaining Refactor
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize the next progressive stage-output chaining seam in `engine/directive-engine.ts` so integration planning consumes typed extraction, adaptation, improvement, and proof output directly.
- Materialization basis: The separate DEEP Architecture adoption boundary retained the third ts-edge DEEP slice as proof that progressive stage chaining is worthwhile, while keeping the parked STANDARD case untouched.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to the integration planning seam in `processSource()`, the lane integration interface, and the Directive Workspace lane integration builder.
- Allow one new typed planning context only where needed to make that seam real.
- Do not reopen Runtime, frontend, or host integration.

## inputs
- Previous DEEP implementation result: `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-implementation-result.md`
- Previous bounded result summary: The third DEEP slice made extraction feed adaptation, improvement consume both earlier outputs, and proof consume all earlier stage outputs while integration still stayed on the flat base input path.
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-bounded-result.md`
- Parked STANDARD evidence artifact: `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-engine-handoff.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Preserve the prior DEEP cases as completed slices; do not use retention bookkeeping as the implementation container for this work.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code outside the bounded Engine planning seam.
- Rollback boundary: revert the integration-stage chaining slice and remove this DEEP case chain if the code change does not stay clearly bounded.

## validation approach
- `integration_stage_complete`
- `engine_boundary_preserved`
- `decision_review`
- Confirm integration planning still produces a typed `DirectiveEngineIntegrationProposal`.
- Confirm integration planning consumes the base planning input, extraction output, adaptation output, improvement output, and proof output.
- Confirm `npm run check` passes.

## selected tactical slice
- Add one typed extraction-and-adaptation-and-improvement-and-proof-to-integration planning context for `buildIntegrationProposal(...)` and lane integration overrides.
- Feed `extractionPlan`, `adaptationPlan`, `improvementPlan`, and `proofPlan` into integration planning from `processSource()`.
- Derive the first Architecture integration branch from the staged proof boundary instead of recomputing that branch independently from the source text.

## mechanical success criteria
- `processSource()` no longer calls `buildIntegrationProposal(planningInput)` directly.
- The new integration stage input is typed and includes `extractionPlan`, `adaptationPlan`, `improvementPlan`, and `proofPlan`.
- The Architecture integration proposal now depends on the staged proof boundary.

## explicit limitations
- No runtime or host integration behavior is opened.
- No generic graph runtime or broad pipeline framework is introduced.

## expected outcome
- One explicit Architecture implementation target that defines one bounded integration-stage chaining refactor slice in `engine/directive-engine.ts` without reconstructing the previous DEEP case by hand.

