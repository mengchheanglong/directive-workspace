# Implementation Target: Engine Stage-Chaining Runtime Control Verification (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28`
- Candidate name: Engine Stage-Chaining Runtime Control Verification
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library verification slice.
- Objective retained: Materialize one Runtime control case inside the staged Engine verification script so shared Engine refactors prove they did not drift the Runtime lane.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `scripts/check-directive-engine-stage-chaining.ts`.
- Add one Runtime control source only.
- Do not reopen Runtime, frontend, or legacy Runtime policy work.

## inputs
- Previous DEEP implementation result: `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-progressive-stage-chaining-verification-2026-03-28-implementation-result.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-engine-handoff.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Preserve Runtime as parked work; do not open promotion, execution, or host integration.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Rollback boundary: revert the Runtime control verification slice and remove this DEEP case chain if the coverage stops being clearly bounded.

## validation approach
- `runtime_control_check_present`
- `runtime_behavior_preserved`
- `engine_boundary_preserved`
- Confirm the focused staged Engine check still passes.
- Confirm the Runtime control source routes to Runtime and keeps the default Runtime proof and integration behavior.

## selected tactical slice
- Extend `scripts/check-directive-engine-stage-chaining.ts` with one Runtime control source.
- Assert the Runtime control case still routes to Runtime.
- Assert the Runtime control proof and integration outputs stay on the default Runtime path.

## mechanical success criteria
- The focused staged Engine check includes a Runtime control source.
- The Runtime control source proves the default Runtime proof and integration behavior stay unchanged.
- `npm run check` still passes with the widened verification.

## explicit limitations
- No Runtime or host behavior is opened.
- No legacy Runtime policy decision is taken in this slice.

## expected outcome
- One explicit Architecture implementation target that defines one bounded Runtime no-drift verification slice for the staged Engine path.

