# Implementation Target: Legacy Runtime Mini-SWE Fallback Rehearsal Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Mini-SWE Fallback Rehearsal Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical mini-swe fallback rehearsal without opening proof inference, promotion, or live Runtime continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the note as read-only historical Runtime state.
- Support only `runtime/records/2026-03-20-mini-swe-agent-fallback-rehearsal.md`.
- Reuse the existing legacy Runtime slice-execution reader instead of inventing a new note family.
- Do not infer a linked proof artifact when no truthful proof path exists.
- Do not infer live Runtime continuation, promotion, or execution semantics in this slice.

## inputs
- Historical mini-swe fallback rehearsal note: `runtime/records/2026-03-20-mini-swe-agent-fallback-rehearsal.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the note as historical Runtime evidence only.
- Do not open Runtime execution, promotion reopening, or host integration.
- Do not infer a linked proof artifact when no truthful proof path exists.
- Do not infer live Runtime continuation, promotion, or execution semantics in this slice.
- Rollback boundary: revert the narrow legacy slice-execution path-recognition widening and remove this DEEP case chain if direct focus starts overstating proof or continuation state.

## validation approach
- `legacy_runtime_mini_swe_fallback_rehearsal_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical mini-swe fallback rehearsal cleanly.
- Confirm the whole-product composition check covers the new read-only slice-execution path.

## selected tactical slice
- Widen legacy Runtime slice-execution path recognition in `shared/lib/dw-state.ts` for the mini-swe fallback rehearsal.
- Add focused composition assertions for the historical note.

## mechanical success criteria
- The canonical report no longer throws on the historical mini-swe fallback rehearsal.
- `npm run check` still passes.
- The composition check covers the new read-only slice-execution path.

## explicit limitations
- No linked proof artifact is inferred when no truthful proof path exists.
- No daily-status digest normalization is attempted.
- No new legacy Runtime note family is introduced.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical mini-swe fallback rehearsal.
