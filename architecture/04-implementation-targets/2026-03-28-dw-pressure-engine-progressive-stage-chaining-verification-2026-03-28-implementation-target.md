# Implementation Target: Engine Progressive Stage-Chaining Verification (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28`
- Candidate name: Engine Progressive Stage-Chaining Verification
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library verification slice.
- Objective retained: Materialize one focused check that permanently verifies the progressive extraction -> adaptation -> improvement -> proof -> integration path through `DirectiveEngine.processSource()`.
- Materialization basis: The separate DEEP Architecture adoption boundary retained the four ts-edge DEEP slices as proof that the staged path is valuable enough for permanent repo verification.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to one focused check script and `package.json` check wiring.
- Use one staged structural source fixture inside the check.
- Do not reopen Runtime, frontend, or legacy Runtime policy work.

## inputs
- Previous DEEP implementation result: `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-progressive-integration-stage-chaining-2026-03-28-implementation-result.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-engine-handoff.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Preserve the prior DEEP slices as completed implementation work; do not use retention bookkeeping as the verification container.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Rollback boundary: revert the focused verification slice and remove this DEEP case chain if the check becomes noisy or untruthful.

## validation approach
- `stage_chaining_check_present`
- `workspace_check_wired`
- `engine_boundary_preserved`
- Confirm the focused check script passes.
- Confirm `npm run check` includes the new focused check.

## selected tactical slice
- Add one focused `scripts/check-directive-engine-stage-chaining.ts` script that exercises the staged Engine path through `DirectiveEngine.processSource()`.
- Wire the focused check into `npm run check`.
- Keep proof and integration semantics under structural inspection only; do not broaden into Runtime or host behavior.

## mechanical success criteria
- A focused staged Engine check exists under `scripts/`.
- The check verifies extraction, adaptation, improvement, proof, and integration continuity on one staged structural source.
- `npm run check` includes the new focused staged Engine verification.

## explicit limitations
- No Runtime or host behavior is opened.
- No policy decision about legacy Runtime history is taken in this slice.

## expected outcome
- One explicit Architecture implementation target that defines one bounded permanent verification slice for the progressive staged Engine path.
