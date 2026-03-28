# Implementation Target: Engine Progressive Stage Chaining Refactor (2026-03-27)

## target
- Candidate id: `dw-pressure-engine-progressive-stage-chaining-2026-03-27`
- Candidate name: Engine Progressive Stage Chaining Refactor
- Source adoption artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize the first progressive stage-output chaining seam in `engine/directive-engine.ts` so extraction planning produces typed output that adaptation planning consumes directly.
- Materialization basis: The separate DEEP Architecture adoption boundary retained the ts-edge pressure as a product-owned Engine refactor target without continuing the parked STANDARD case.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to the extraction -> adaptation planning seam in `processSource()`.
- Allow one new typed planning context only where needed to make that seam real.
- Do not refactor improvement, proof, or integration planning in this slice.
- Do not reopen Runtime, frontend, or unrelated Engine redesign.

## inputs
- Previous bounded result summary: The separate DEEP opener established one product-owned Engine refactor target: extraction output should feed adaptation directly while the parked ts-edge STANDARD case remains historical evidence only.
- Source bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-bounded-result.md`
- Parked STANDARD evidence artifact: `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded start artifact: `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code outside the bounded Engine planning seam.
- Rollback boundary: revert the extraction -> adaptation chaining slice and remove this DEEP case chain if the code change does not stay clearly bounded.

## validation approach
- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`
- Confirm extraction planning still produces a typed `DirectiveEngineExtractionPlan`.
- Confirm adaptation planning consumes both base planning input and extraction output.
- Confirm improvement, proof, and integration planning remain unchanged in this first slice.
- Confirm `npm run check` passes.

## selected tactical slice
- Add one typed extraction-to-adaptation planning context for `buildAdaptationPlan(...)`.
- Feed `extractionPlan` into `buildAdaptationPlan(...)` from `processSource()`.
- Derive the first Architecture adaptation branch from extracted stage/control summaries instead of recomputing that branch independently from the source text.

## mechanical success criteria
- `processSource()` no longer calls `buildAdaptationPlan(planningInput)` directly.
- The new adaptation stage input is typed and includes `extractionPlan`.
- The first Architecture adaptation branch now depends on extraction output.

## explicit limitations
- Improvement, proof, and integration planning remain on the flat base input path.
- No runtime or host integration behavior is opened.
- No generic graph runtime or broad pipeline framework is introduced.

## expected outcome
- One explicit Architecture implementation target that defines one bounded extraction-to-adaptation stage-chaining refactor slice in `engine/directive-engine.ts` without reconstructing the adoption chain by hand.
