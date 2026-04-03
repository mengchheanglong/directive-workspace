# Implementation Target: Engine Progressive Improvement-Stage Chaining Refactor (2026-03-27)

## target
- Candidate id: `dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27`
- Candidate name: Engine Progressive Improvement-Stage Chaining Refactor
- Source adoption artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize the next progressive stage-output chaining seam in `engine/directive-engine.ts` so improvement planning consumes typed extraction and adaptation output directly.
- Materialization basis: The separate DEEP Architecture adoption boundary retained the first ts-edge DEEP slice as proof that progressive stage chaining is worthwhile, while keeping the parked STANDARD case untouched.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to the improvement planning seam in `processSource()`.
- Allow one new typed planning context only where needed to make that seam real.
- Do not refactor proof or integration planning in this slice.
- Do not reopen Runtime, frontend, or unrelated Engine redesign.

## inputs
- Previous DEEP implementation result: `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-result.md`
- Previous bounded result summary: The first DEEP slice made extraction feed adaptation directly while leaving improvement, proof, and integration on the flat base input path.
- Source bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-bounded-result.md`
- Parked STANDARD evidence artifact: `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-engine-handoff.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Preserve the prior DEEP case as a completed slice; do not use retention bookkeeping as the implementation container for this work.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code outside the bounded Engine planning seam.
- Rollback boundary: revert the improvement-stage chaining slice and remove this DEEP case chain if the code change does not stay clearly bounded.

## validation approach
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`
- Confirm improvement planning still produces a typed `DirectiveEngineImprovementPlan`.
- Confirm improvement planning consumes the base planning input, extraction output, and adaptation output.
- Confirm proof and integration planning remain unchanged.
- Confirm `npm run check` passes.

## selected tactical slice
- Add one typed extraction-and-adaptation-to-improvement planning context for `buildImprovementPlan(...)`.
- Feed `extractionPlan` and `adaptationPlan` into `buildImprovementPlan(...)` from `processSource()`.
- Derive the first Architecture improvement branches from extracted stage/control summaries plus adaptation boundary wording instead of recomputing those branches independently from the source text.

## mechanical success criteria
- `processSource()` no longer calls `buildImprovementPlan(planningInput)` directly.
- The new improvement stage input is typed and includes `extractionPlan` and `adaptationPlan`.
- The first Architecture improvement branch now depends on adaptation output and extraction output.

## explicit limitations
- Proof and integration planning remain on the flat base input path.
- No runtime or host integration behavior is opened.
- No generic graph runtime or broad pipeline framework is introduced.

## expected outcome
- One explicit Architecture implementation target that defines one bounded improvement-stage chaining refactor slice in `engine/directive-engine.ts` without reconstructing the previous DEEP case by hand.
