# Implementation Target: Legacy Runtime Sample Pool Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Sample Pool Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime sample pool artifacts without opening live proof linkage, promotion, registry, or callable continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the sample pool artifacts as read-only historical Runtime state.
- Support only:
  - `runtime/records/2026-03-23-scientify-literature-monitoring-qualified-pool-sample.json`
  - `runtime/records/2026-03-23-scientify-literature-monitoring-degraded-quality-sample.json`
- Do not infer live proof, gate snapshot, or host linkage in this slice.
- Do not map promotion, registry, or callable continuation semantics.

## inputs
- Legacy Runtime sample qualified pool: `runtime/records/2026-03-23-scientify-literature-monitoring-qualified-pool-sample.json`
- Legacy Runtime sample degraded pool: `runtime/records/2026-03-23-scientify-literature-monitoring-degraded-quality-sample.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the sample pool artifacts as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not infer live proof, gate snapshot, or host linkage in this slice.
- Do not map promotion, registry, or callable continuation semantics.
- Rollback boundary: revert the legacy Runtime sample pool compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_sample_pool_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical sample pool artifacts cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime sample pool handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for the historical Scientify sample pool artifacts.

## mechanical success criteria
- The canonical report no longer throws on the two historical Runtime sample pool artifacts.
- `npm run check` still passes.
- The composition check covers the new read-only sample pool paths.

## explicit limitations
- No live proof, gate snapshot, or host linkage is inferred.
- No promotion, registry, or callable continuation mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime sample pool artifacts.
