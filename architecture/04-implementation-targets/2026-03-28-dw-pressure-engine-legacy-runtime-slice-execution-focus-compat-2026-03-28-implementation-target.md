# Implementation Target: Legacy Runtime Slice Execution Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Slice Execution Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical runtime-slice execution family without opening proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the execution artifacts as read-only historical Runtime state.
- Support the historical `runtime/records/*-runtime-slice-01-execution.md` family only.
- Do not map proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics.

## inputs
- Legacy Runtime slice execution: `runtime/records/2026-03-21-agent-orchestrator-cli-runtime-slice-01-execution.md`
- Legacy Runtime slice execution: `runtime/records/2026-03-21-puppeteer-runtime-slice-01-execution.md`
- Legacy Runtime slice execution: `runtime/records/2026-03-21-skills-manager-runtime-slice-01-execution.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the execution artifacts as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not map proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics in this slice.
- Rollback boundary: revert the legacy Runtime slice-execution compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_slice_execution_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves representative historical runtime-slice executions cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime slice-execution handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for representative historical Runtime slice-execution artifacts.

## mechanical success criteria
- The canonical report no longer throws on representative `*-runtime-slice-01-execution.md` artifacts.
- `npm run check` still passes.
- The composition check covers the new read-only execution-family path.

## explicit limitations
- No proof-checklist mapping is attempted.
- No transformation-proof, promotion, registry, or callable continuation mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical runtime-slice execution family.
