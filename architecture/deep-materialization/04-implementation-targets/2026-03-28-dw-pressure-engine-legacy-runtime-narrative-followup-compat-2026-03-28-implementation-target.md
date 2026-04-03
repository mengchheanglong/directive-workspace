# Implementation Target: Legacy Runtime Narrative Followup Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28`
- Candidate name: Legacy Runtime Narrative Followup Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus and workbench detail support for the remaining narrative historical Runtime follow-up family without opening Runtime execution or promotion semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts`, `hosts/web-host/data.ts`, `scripts/check-directive-workspace-composition.ts`, and `scripts/check-frontend-host.ts`.
- Preserve the three follow-ups as read-only historical Runtime state.
- Do not map legacy Runtime records, legacy Runtime execution history, or execution-era promotion semantics.

## inputs
- Legacy Runtime follow-up: `runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md`
- Legacy Runtime follow-up: `runtime/follow-up/2026-03-20-promptfoo-runtime-followup.md`
- Legacy Runtime follow-up: `runtime/follow-up/2026-03-20-puppeteer-browser-runtime-followup.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the follow-ups as historical Runtime evidence only.
- Do not open Runtime execution, promotion, or host integration.
- Do not map legacy Runtime records or registry semantics in this slice.
- Rollback boundary: revert the legacy narrative Runtime follow-up compatibility slice and remove this DEEP case chain if direct focus or workbench detail starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_narrative_follow_up_focus_resolves`
- `legacy_runtime_narrative_follow_up_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the three narrative historical Runtime follow-ups cleanly.
- Confirm the workbench handoff detail and snapshot surfaces read the three artifacts without invalid state.
- Confirm the whole-product composition check and frontend host check cover the new compatibility family.

## selected tactical slice
- Add narrative legacy Runtime follow-up handling in `shared/lib/dw-state.ts`.
- Mirror that bounded compatibility in `hosts/web-host/data.ts`.
- Add focused composition and workbench host assertions for the three remaining narrative historical Runtime follow-up artifacts.

## mechanical success criteria
- The canonical report no longer crashes on the remaining `*-runtime-followup.md` artifacts.
- The workbench follow-up detail no longer rejects the remaining narrative historical Runtime follow-ups.
- `npm run check` still passes.

## explicit limitations
- No legacy Runtime record mapping is attempted.
- No legacy Runtime execution mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the remaining narrative historical Runtime follow-up family.
