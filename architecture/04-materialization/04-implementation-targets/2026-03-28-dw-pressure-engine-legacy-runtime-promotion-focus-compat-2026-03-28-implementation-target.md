# Implementation Target: Legacy Runtime Promotion Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Promotion Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime promotion-record family without opening registry, callable continuation, or execution semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the promotion records as read-only historical Runtime state.
- Do not map legacy registry, proof/execution, or callable continuation semantics.

## inputs
- Legacy Runtime promotion record: `runtime/07-promotion-records/2026-03-20-agentics-promotion-record.md`
- Legacy Runtime promotion record: `runtime/07-promotion-records/2026-03-21-promptfoo-promotion-record.md`
- Legacy Runtime promotion record: `runtime/07-promotion-records/2026-03-22-v0-normalizer-transformation-promotion-record.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the promotion records as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not map legacy registry, proof/execution, or callable continuation semantics in this slice.
- Rollback boundary: revert the legacy Runtime promotion compatibility slice and remove this DEEP case chain if direct focus starts overstating callable Runtime continuation.

## validation approach
- `legacy_runtime_promotion_focus_resolves`
- `legacy_runtime_promotion_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves representative historical Runtime promotion records cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime promotion-record handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for representative historical Runtime promotion records.

## mechanical success criteria
- The canonical report no longer throws on representative `*-promotion-record.md` artifacts.
- The historical Runtime promotion records resolve as read-only Runtime state.
- `npm run check` still passes.

## explicit limitations
- No legacy registry mapping is attempted.
- No legacy proof/execution mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime promotion-record family.

