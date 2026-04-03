# Implementation Target: Legacy Runtime CLI-Anything Re-entry Record Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime CLI-Anything Re-entry Record Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical CLI-Anything re-entry preconditions note without opening Runtime continuation, promotion, registry, or execution semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the note as read-only historical Runtime state.
- Support only `runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md`.
- Reuse the existing legacy Runtime record reader instead of inventing a new note family.
- Preserve explicit follow-up linkage and proposed host exactly as recorded.
- Treat external `Origin path` as non-product evidence instead of required in-workspace linkage.
- Do not infer live Runtime v0 continuation, promotion, registry, or execution in this slice.

## inputs
- Historical CLI-Anything re-entry preconditions note: `runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the note as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Preserve explicit follow-up linkage and proposed host exactly as recorded.
- Treat external `Origin path` as non-product evidence instead of required in-workspace linkage.
- Do not infer live Runtime v0 continuation, promotion, registry, or execution in this slice.
- Rollback boundary: revert the narrow legacy Runtime record path-recognition widening and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_cli_anything_reentry_record_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical CLI-Anything re-entry note cleanly.
- Confirm the whole-product composition check covers the new read-only record path.

## selected tactical slice
- Widen legacy Runtime record path recognition in `shared/lib/dw-state.ts` for the CLI-Anything re-entry note.
- Add focused composition assertions for the historical note.

## mechanical success criteria
- The canonical report no longer throws on the historical CLI-Anything re-entry note.
- `npm run check` still passes.
- The composition check covers the new read-only record path.

## explicit limitations
- No live Runtime continuation, promotion, registry, or execution linkage is inferred.
- No fallback-rehearsal or daily-status normalization is attempted.
- No new legacy Runtime note family is introduced.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical CLI-Anything re-entry preconditions note.
