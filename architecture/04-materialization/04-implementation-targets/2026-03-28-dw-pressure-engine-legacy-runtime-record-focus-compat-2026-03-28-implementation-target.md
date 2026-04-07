# Implementation Target: Legacy Runtime Record Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Record Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the stable historical Runtime record family without opening proof, promotion, registry, or execution semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the records as read-only historical Runtime state.
- Do not map legacy proof, promotion, registry, or execution semantics.

## inputs
- Legacy Runtime record: `runtime/legacy-records/2026-03-19-agentics-runtime-record.md`
- Legacy Runtime record: `runtime/legacy-records/2026-03-21-promptfoo-runtime-record.md`
- Legacy Runtime record: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-record.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the records as historical Runtime evidence only.
- Do not open Runtime execution, promotion, or host integration.
- Do not map legacy proof, promotion, registry, or execution semantics in this slice.
- Rollback boundary: revert the legacy Runtime record compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_record_focus_resolves`
- `legacy_runtime_record_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves representative historical Runtime records cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime record handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for representative historical Runtime records.

## mechanical success criteria
- The canonical report no longer throws on representative `*-runtime-record.md` artifacts.
- The historical Runtime records resolve as read-only Runtime state.
- `npm run check` still passes.

## explicit limitations
- No legacy proof mapping is attempted.
- No legacy promotion or registry mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the stable historical Runtime record family.

