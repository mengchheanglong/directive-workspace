# Implementation Target: Legacy Runtime Validation-Note Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Validation-Note Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime validation note pair without opening host, proof, or live Runtime continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the validation notes as read-only historical Runtime state.
- Support only:
  - `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation.md`
  - `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation-rerun.md`
- Do not infer live proof, host, or runtime continuation linkage in this slice.
- Do not normalize broader status-digest, rehearsal, or decision-note families.

## inputs
- Legacy Runtime validation note: `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation.md`
- Legacy Runtime validation rerun note: `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation-rerun.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the validation notes as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not infer live proof, host, or runtime continuation linkage in this slice.
- Do not normalize broader status-digest, rehearsal, or decision-note families.
- Rollback boundary: revert the legacy Runtime validation-note compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_validation_note_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical validation note pair cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime validation-note handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for the historical Runtime validation note pair.

## mechanical success criteria
- The canonical report no longer throws on the two historical Runtime validation notes.
- `npm run check` still passes.
- The composition check covers the new read-only validation note paths.

## explicit limitations
- No live proof, host, or runtime continuation linkage is inferred.
- No broader status-digest, rehearsal, or decision-note normalization is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime validation note pair.

