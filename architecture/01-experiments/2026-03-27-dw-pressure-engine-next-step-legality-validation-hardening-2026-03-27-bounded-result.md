# Engine Next-Step Legality Validation Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27
- Candidate name: Engine Next-Step Legality Validation Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by directive-lead-implementer from bounded start `architecture/01-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that hardens Discovery-route legality validation so a concrete required downstream artifact mismatch blocks advancement instead of surfacing a falsely legal downstream next step.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Discovery route legality only.
- Distinguish descriptive `Required next artifact` labels from concrete artifact references.
- Block only concrete required-downstream mismatches.
- Do not broaden into general broken-link scanning or stale-status repair.
- Inputs:
- `shared/lib/dw-state.ts`
- `engine/artifact-link-validation.ts`
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One explicit Engine-quality hardening slice that catches required-next-artifact mismatches while leaving broader negative-path work for later.
- Validation gate(s):
- `legality_guard_complete`
- `discovery_route_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice cannot be made useful without redesigning other negative-path validation seams.
- Rollback: Revert the Discovery-route legality guard changes and leave the case at result if the slice does not stay clearly bounded.
- Result summary: The shared truth anchor now treats descriptive required-next-artifact labels as non-blocking metadata, but blocks Discovery-route cases when a concrete required downstream artifact disagrees with the resolved downstream stub. This prevents one class of falsely legal next-step presentation without touching broader broken-link or stale-status work.
- Evidence path:
- Primary evidence path: `shared/lib/dw-state.ts`
- Bounded start: `architecture/01-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Closeout decision

- Verdict: `adopt`
- Rationale: The legality rule is bounded, shared, and immediately useful because it blocks one concrete route-level next-step overstatement class without broadening into generic cleanup.
- Review result: `approved`
- Review score: `5`

