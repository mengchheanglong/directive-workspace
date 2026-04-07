# Implementation Target: Legacy Runtime Transformation Label-Link Normalization (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28`
- Candidate name: Legacy Runtime Transformation Label-Link Normalization
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-normalization slice.
- Objective retained: Normalize descriptive non-artifact baseline/result labels in historical Runtime transformation records without opening runtime-slice execution, checklist, registry, promotion, or callable continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the transformation artifacts as read-only historical Runtime state.
- Normalize only descriptive baseline/result labels that are not real Directive Workspace artifact references.
- Do not map runtime-slice proof/execution, proof-checklist, registry, promotion, or callable continuation semantics.

## inputs
- Legacy Runtime transformation record: `runtime/legacy-records/2026-03-22-remaining-backend-test-boilerplate-transformation-record.md`
- Legacy Runtime transformation record: `runtime/legacy-records/2026-03-22-automation-test-boilerplate-transformation-record.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-engine-handoff.md`

## constraints
- Preserve the transformation artifacts as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not map runtime-slice proof/execution, proof-checklist, registry, promotion, or callable continuation semantics in this slice.
- Rollback boundary: revert the label-link normalization slice and remove this DEEP case chain if direct focus starts hiding real artifact-link failures.

## validation approach
- `legacy_runtime_transformation_label_notes_normalized`
- `legacy_runtime_transformation_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the remaining label-style historical transformation records cleanly.
- Confirm the whole-product composition check covers the new normalization path.

## selected tactical slice
- Normalize descriptive non-artifact transformation baseline/result labels inside `shared/lib/dw-state.ts`.
- Add focused composition assertions for the remaining label-style historical transformation records.

## mechanical success criteria
- The canonical report no longer marks the two remaining label-style `*-transformation-record.md` artifacts broken.
- Descriptive baseline/result labels normalize to note fields rather than broken linked artifact paths.
- The historical Runtime transformation artifacts remain read-only Runtime state.
- `npm run check` still passes.

## explicit limitations
- No runtime-slice proof/execution mapping is attempted.
- No proof-checklist mapping is attempted.
- No registry, promotion, or callable continuation mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-normalization slice for the remaining label-style Runtime transformation records.

