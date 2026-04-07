# Implementation Target: Legacy Runtime Handoff Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28`
- Candidate name: Legacy Runtime Handoff Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the two legacy architecture-to-runtime handoff artifacts without widening old Runtime semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the handoffs as read-only historical Runtime state.
- Do not map legacy Runtime records, legacy Runtime follow-up execution chains, or execution-era promotion semantics.

## inputs
- Legacy Runtime handoff: `runtime/legacy-handoff/2026-03-22-autoresearch-architecture-to-runtime-handoff.md`
- Legacy Runtime handoff: `runtime/legacy-handoff/2026-03-23-scientify-literature-monitoring-architecture-to-runtime-handoff.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-engine-handoff.md`

## constraints
- Preserve the handoffs as historical Runtime evidence only.
- Do not open Runtime execution, promotion, or host integration.
- Rollback boundary: revert the legacy Runtime handoff compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_handoff_focus_resolves`
- `legacy_runtime_handoff_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves both legacy Runtime handoffs cleanly.
- Confirm the whole-product composition check covers the new direct focus paths.

## selected tactical slice
- Add two legacy Runtime handoff parsers and direct focus paths in `shared/lib/dw-state.ts`.
- Add focused composition assertions for the two known legacy Runtime handoff artifacts.

## mechanical success criteria
- The canonical report no longer crashes on the two `runtime/legacy-handoff/*.md` artifacts.
- The legacy Runtime handoffs resolve as read-only historical Runtime state.
- `npm run check` still passes.

## explicit limitations
- No legacy Runtime record mapping is attempted.
- No legacy Runtime follow-up execution mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the two known legacy Runtime handoffs.

