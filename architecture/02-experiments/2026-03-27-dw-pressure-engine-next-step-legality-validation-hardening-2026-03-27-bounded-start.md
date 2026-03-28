# Engine Next-Step Legality Validation Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27
- Candidate name: Engine Next-Step Legality Validation Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that hardens Discovery-route legality validation so a concrete required downstream artifact mismatch blocks advancement instead of surfacing a falsely legal downstream next step.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Discovery route legality only.
- Distinguish descriptive `Required next artifact` labels from concrete artifact references.
- Block only concrete required-downstream mismatches.
- Do not broaden into general broken-link scanning or stale-status repair.
- Inputs:
- `shared/lib/dw-state.ts` currently resolves Discovery-route next-step truth.
- `engine/artifact-link-validation.ts` currently treats any required-next-artifact string as missing if it is not on disk.
- `scripts/check-directive-workspace-composition.ts` already proves negative-path blocking for queue mismatches and missing linked artifacts, but not for required-next-artifact mismatches.
- Expected output:
- One bounded Architecture hardening slice that makes route-level next-step legality stricter without redesigning the wider truth system.
- Validation gate(s):
- `legality_guard_complete`
- `discovery_route_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The change requires broader broken-link or stale-status handling to be useful.
- Rollback: Revert the Discovery-route legality guard changes and leave the case at start if the slice stops being clearly bounded.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-engine-handoff.md`
- Truth surface: `shared/lib/dw-state.ts`
- Integrity helper: `engine/artifact-link-validation.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `strong`
- Improvement quality: `strong`
- Meta-useful: `yes`
- Meta-usefulness category: `routing_quality`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-engine-handoff.md`
