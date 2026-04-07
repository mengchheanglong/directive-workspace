# Implementation Target: Legacy Runtime Active Follow-Up Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28`
- Candidate name: Legacy Runtime Active Follow-Up Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus and workbench detail support for the structured historical Scientify Runtime follow-up without weakening deferred legacy follow-up gates.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts`, `hosts/web-host/data.ts`, `scripts/check-directive-workspace-composition.ts`, and `scripts/check-frontend-host.ts`.
- Preserve the follow-up as read-only historical Runtime state.
- Preserve deferred legacy follow-up requirements.
- Do not map legacy Runtime records, legacy Runtime execution history, or execution-era promotion semantics.

## inputs
- Legacy Runtime follow-up: `runtime/00-follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`

## constraints
- Preserve the follow-up as historical Runtime evidence only.
- Do not open Runtime execution, promotion, or host integration.
- Preserve the requirement that deferred legacy follow-ups carry a real re-entry contract.
- Rollback boundary: revert the legacy Runtime active follow-up compatibility slice and remove this DEEP case chain if direct focus or workbench detail starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_active_follow_up_focus_resolves`
- `legacy_runtime_active_follow_up_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the structured historical Runtime follow-up cleanly.
- Confirm the workbench handoff detail and snapshot surfaces read the artifact without invalid state.
- Confirm the whole-product composition check and frontend host check cover the new compatibility path.

## selected tactical slice
- Add active-bounded legacy Runtime follow-up handling in `shared/lib/dw-state.ts`.
- Mirror that bounded compatibility in `hosts/web-host/data.ts`.
- Add focused composition and workbench host assertions for the structured historical Runtime follow-up.

## mechanical success criteria
- The canonical report no longer marks the structured historical Runtime follow-up as broken.
- The workbench follow-up detail no longer rejects the structured historical Runtime follow-up.
- Deferred legacy follow-up requirements remain enforced.
- `npm run check` still passes.

## explicit limitations
- No legacy Runtime record mapping is attempted.
- No legacy Runtime execution mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the structured historical Scientify Runtime follow-up.

