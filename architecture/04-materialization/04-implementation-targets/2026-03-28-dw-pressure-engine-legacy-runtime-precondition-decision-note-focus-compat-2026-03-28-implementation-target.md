# Implementation Target: Legacy Runtime Precondition/Decision Note Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Precondition/Decision Note Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical agent-orchestrator precondition/decision note family without opening host promotion, registry, or live Runtime continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the note family as read-only historical Runtime state.
- Support only:
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-precondition-proof.md`
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-precondition-correction.md`
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-host-adapter-decision.md`
- Preserve truthful follow-up linkage where the notes explicitly carry it.
- Do not infer live proof, host promotion, registry, or Runtime v0 continuation in this slice.

## inputs
- Legacy Runtime precondition proof note: `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-precondition-proof.md`
- Legacy Runtime precondition correction note: `runtime/legacy-records/2026-03-21-agent-orchestrator-precondition-correction.md`
- Legacy Runtime host-adapter decision note: `runtime/legacy-records/2026-03-21-agent-orchestrator-host-adapter-decision.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the note family as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Preserve truthful follow-up linkage where the notes explicitly carry it.
- Do not infer live proof, host promotion, registry, or Runtime v0 continuation in this slice.
- Rollback boundary: revert the legacy Runtime precondition/decision-note compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_precondition_decision_note_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical agent-orchestrator precondition/decision notes cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime precondition/decision-note handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for the historical agent-orchestrator precondition/decision note family.

## mechanical success criteria
- The canonical report no longer throws on the three historical agent-orchestrator precondition/decision notes.
- `npm run check` still passes.
- The composition check covers the new read-only note paths.

## explicit limitations
- No live proof, host promotion, registry, or Runtime continuation linkage is inferred beyond explicit follow-up references.
- No broader operational-note normalization is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical agent-orchestrator precondition/decision note family.

