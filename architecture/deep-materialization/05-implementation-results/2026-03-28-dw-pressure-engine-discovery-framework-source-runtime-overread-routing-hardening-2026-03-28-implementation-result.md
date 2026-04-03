# Implementation Result: Engine Discovery Framework-Source Runtime Overread Routing Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28`
- Candidate name: Engine Discovery Framework-Source Runtime Overread Routing Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: correct Runtime overread for framework/tooling repos whose retained value is explicit Engine-facing pattern extraction rather than source adoption.

## completed tactical slice
- Hardened `engine/routing.ts` with one explicit pattern-extraction signal for sources that say the value should be retained without adopting the source itself as runtime capability or dependency.
- Applied one bounded Architecture tilt for Runtime-looking repo sources only when Engine-improvement signal is present and Runtime transformation signal is absent.
- Added focused proof-case coverage in `scripts/check-directive-engine-stage-chaining.ts` that replays Inspect AI and ts-edge to Architecture while preserving the existing Runtime control case.

## actual result summary
- Discovery routing is now stricter in one bounded class: framework/tooling repos no longer overread as Runtime when the source text explicitly frames the retained value as Engine-facing pattern extraction rather than direct runtime adoption.

## mechanical success criteria check
- Inspect AI now replays to `architecture`.
- ts-edge now replays to `architecture`.
- The Runtime control source still replays to `runtime`.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not redesign all routing heuristics.
- It does not change Discovery intake policy, Runtime reopening policy, or frontend behavior.
- It does not solve every future operator override pattern.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: framework_pattern_extraction_prefers_architecture, runtime_control_case_preserved, routing_slice_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `engine/routing.ts`
- `engine/types.ts`
- `scripts/check-directive-engine-stage-chaining.ts`
- `npm run check:directive-engine-stage-chaining`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-28-dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28-implementation-result.md`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the narrow routing signal in `engine/routing.ts`, revert the focused Engine-stage proof-case coverage, and remove this DEEP case chain if later truth work needs a different framework-source routing boundary.
