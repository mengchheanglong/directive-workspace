# Implementation Target: Engine NOTE-Mode Architecture Route Stop-Line Alignment (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-note-mode-architecture-route-stop-line-alignment-2026-03-28`
- Candidate name: Engine NOTE-Mode Architecture Route Stop-Line Alignment
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-note-mode-architecture-route-stop-line-alignment-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-note-mode-architecture-route-stop-line-alignment-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-note-mode-architecture-route-stop-line-alignment-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned NOTE-mode Architecture truth-alignment slice.
- Objective retained: align NOTE-mode Architecture route and handoff truth with the real stop-line: handoff review plus one bounded result, with no bounded start required.

## scope (bounded)
- Limit the implementation to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Apply one NOTE-mode-only correction seam for Discovery-routed Architecture cases and Architecture handoff focus.
- Verify the Inspect AI, OpenEvals, and PromptWizard proof cases.
- Preserve existing STANDARD and DEEP Architecture next-step behavior.
- Do not broaden into Runtime semantics changes, generic operating-model refactoring, or frontend work.

## validation approach
- `note_architecture_handoff_prefers_result_boundary`
- `note_architecture_route_prefers_result_boundary`
- `standard_architecture_boundary_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm the Inspect AI, OpenEvals, and PromptWizard proof cases now advertise the NOTE result boundary.
- Confirm `ts-edge` still preserves STANDARD-style Architecture progression.
- Confirm full workspace checks still pass.

## rollback boundary
- Revert the NOTE-mode route/handoff wording change and corresponding composition assertions, then remove this DEEP case chain if later truth work needs a different NOTE-mode Architecture contract.

