# Implementation Target: Engine Stage-Chaining Discovery Control Verification (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28`
- Candidate name: Engine Stage-Chaining Discovery Control Verification
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library verification slice.
- Objective retained: Materialize one Discovery control case inside the staged Engine verification script so shared Engine refactors prove they did not drift the Discovery lane.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `scripts/check-directive-engine-stage-chaining.ts`.
- Add one Discovery control source only.
- Do not reopen Discovery workflow mechanics, Runtime, frontend, or legacy policy work.

## inputs
- Previous DEEP implementation result: `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-implementation-result.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-engine-handoff.md`

## constraints
- Preserve the parked STANDARD ts-edge case as historical evidence only; do not mutate its current stage.
- Preserve Discovery as a front door; do not add workflow advancement or routing logic changes.
- Stay Architecture-owned only; do not reopen Runtime or frontend work from this target.
- Rollback boundary: revert the Discovery control verification slice and remove this DEEP case chain if the coverage stops being clearly bounded.

## validation approach
- `discovery_control_check_present`
- `discovery_behavior_preserved`
- `engine_boundary_preserved`
- Confirm the focused staged Engine check still passes.
- Confirm the Discovery control source still routes to Discovery and keeps the default Discovery proof and integration behavior.

## selected tactical slice
- Extend `scripts/check-directive-engine-stage-chaining.ts` with one Discovery control source.
- Assert the Discovery control case still routes to Discovery.
- Assert the Discovery control proof and integration outputs stay on the default Discovery path.

## mechanical success criteria
- The focused staged Engine check includes a Discovery control source.
- The Discovery control source proves the default Discovery proof and integration behavior stay unchanged.
- `npm run check` still passes with the widened verification.

## explicit limitations
- No Discovery workflow mechanics are changed.
- No Runtime or host behavior is opened.
- No legacy policy decision is taken in this slice.

## expected outcome
- One explicit Architecture implementation target that defines one bounded Discovery no-drift verification slice for the staged Engine path.
