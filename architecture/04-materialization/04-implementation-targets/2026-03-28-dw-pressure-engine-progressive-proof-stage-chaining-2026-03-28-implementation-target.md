# Implementation Target: Engine Progressive Proof-Stage Chaining Refactor (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28`
- Candidate name: Engine Progressive Proof-Stage Chaining Refactor
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize the next progressive stage-output chaining seam in `engine/directive-engine.ts` so proof planning consumes typed extraction, adaptation, and improvement output directly.
- Materialization basis: The separate DEEP Architecture adoption boundary retained the second ts-edge DEEP slice as proof that progressive stage chaining is worthwhile, while keeping the parked STANDARD case untouched.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to the proof planning seam in `processSource()`, the lane proof interface, and the Directive Workspace lane proof builders.
- Allow one new typed planning context only where needed to make that seam real.
- Do not refactor integration planning in this slice.
- Do not reopen Runtime, frontend, or unrelated Engine redesign.

## inputs
- Previous DEEP implementation result: `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-implementation-result.md`
- Previous bounded result summary: The second DEEP slice made extraction feed adaptation and improvement consume both earlier stage outputs while proof and integration still stayed on the flat base input path.
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-bounded-result.md`
- Parked STANDARD evidence artifact: `architecture/01-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-progressive-proof-stage-chaining-2026-03-28-engine-handoff.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Preserve the prior DEEP cases as completed slices; do not use retention bookkeeping as the implementation container for this work.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code outside the bounded Engine planning seam.
- Rollback boundary: revert the proof-stage chaining slice and remove this DEEP case chain if the code change does not stay clearly bounded.

## validation approach
- `proof_stage_complete`
- `engine_boundary_preserved`
- `decision_review`
- Confirm proof planning still produces a typed `DirectiveEngineProofPlan`.
- Confirm proof planning consumes the base planning input, extraction output, adaptation output, and improvement output.
- Confirm integration planning remains unchanged.
- Confirm `npm run check` passes.

## selected tactical slice
- Add one typed extraction-and-adaptation-and-improvement-to-proof planning context for `lane.planProof(...)` and `buildDefaultProofPlan(...)`.
- Feed `extractionPlan`, `adaptationPlan`, and `improvementPlan` into proof planning from `processSource()`.
- Derive the first Architecture proof branch from the staged improvement boundary instead of recomputing that branch independently from the source text.

## mechanical success criteria
- `processSource()` no longer calls `lane.planProof(planningInput)` directly.
- The new proof stage input is typed and includes `extractionPlan`, `adaptationPlan`, and `improvementPlan`.
- The Architecture proof plan now depends on the staged improvement boundary.

## explicit limitations
- Integration planning remains on the flat base input path.
- No runtime or host integration behavior is opened.
- No generic graph runtime or broad pipeline framework is introduced.

## expected outcome
- One explicit Architecture implementation target that defines one bounded proof-stage chaining refactor slice in `engine/directive-engine.ts` without reconstructing the previous DEEP case by hand.

