# Implementation Target: Engine Discovery Framework-Source Runtime Overread Routing Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28`
- Candidate name: Engine Discovery Framework-Source Runtime Overread Routing Hardening
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned Engine routing-quality slice.
- Objective retained: correct Runtime overread for framework/tooling repos whose retained value is explicit Engine-facing pattern extraction rather than source adoption.

## scope (bounded)
- Limit the implementation to `engine/routing.ts`, `engine/types.ts`, and `scripts/check-directive-engine-stage-chaining.ts`.
- Add one explicit pattern-extraction signal and one bounded Architecture tilt for the proved misrouting class only.
- Replay Inspect AI and ts-edge through the current Engine as proof cases.
- Preserve the existing Runtime control case.
- Do not broaden into generic usefulness redesign, Discovery front-door rewrites, or Runtime lane redesign.

## validation approach
- `framework_pattern_extraction_prefers_architecture`
- `runtime_control_case_preserved`
- `routing_slice_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm the Inspect AI and ts-edge proof cases now replay to Architecture.
- Confirm the Runtime control case still replays to Runtime.
- Confirm full workspace checks still pass.

## rollback boundary
- Revert the narrow routing signal and corresponding Engine-stage assertions, then remove this DEEP case chain if later truth work needs a different routing boundary.

