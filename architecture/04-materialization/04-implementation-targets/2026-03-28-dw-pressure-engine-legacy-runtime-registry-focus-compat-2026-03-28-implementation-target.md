# Implementation Target: Legacy Runtime Registry Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Registry Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime registry-entry family without opening promotion, callable continuation, or execution semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the registry entries as read-only historical Runtime state.
- Do not map legacy promotion-record, proof/execution, or callable continuation semantics.

## inputs
- Legacy Runtime registry entry: `runtime/08-registry/2026-03-20-agentics-registry-entry.md`
- Legacy Runtime registry entry: `runtime/08-registry/2026-03-21-promptfoo-registry-entry.md`
- Legacy Runtime registry entry: `runtime/08-registry/2026-03-22-v0-normalizer-transformation-registry-entry.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the registry entries as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion, or host integration.
- Do not map legacy promotion-record, proof/execution, or callable continuation semantics in this slice.
- Rollback boundary: revert the legacy Runtime registry compatibility slice and remove this DEEP case chain if direct focus starts overstating callable Runtime continuation.

## validation approach
- `legacy_runtime_registry_focus_resolves`
- `legacy_runtime_registry_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves representative historical Runtime registry entries cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime registry-entry handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for representative historical Runtime registry entries.

## mechanical success criteria
- The canonical report no longer throws on representative `*-registry-entry.md` artifacts.
- The historical Runtime registry entries resolve as read-only Runtime state.
- `npm run check` still passes.

## explicit limitations
- No promotion-record mapping is attempted.
- No legacy proof/execution mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime registry-entry family.

