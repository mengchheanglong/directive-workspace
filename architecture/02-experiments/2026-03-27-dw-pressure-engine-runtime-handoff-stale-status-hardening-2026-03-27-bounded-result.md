# Engine Runtime Handoff Stale-Status Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27
- Candidate name: Engine Runtime Handoff Stale-Status Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by directive-lead-implementer from bounded start `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that stops the Runtime handoff list from advertising historical follow-up artifacts as live pending-review work once canonical truth shows the case head moved downstream.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Runtime follow-up stub classification inside the host read-model.
- Use the canonical resolver to distinguish live pending-review heads from historical follow-up artifacts that already progressed downstream.
- Preserve the real pending OpenMOSS follow-up as a live pending-review stub.
- Do not broaden into queue lifecycle sync, Runtime detail-page status normalization, generic stale-status repair, or frontend redesign.
- Inputs:
- `hosts/web-host/data.ts`
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One explicit Engine-quality hardening slice that stops the Runtime handoff list from presenting historical follow-up artifacts as pending-review work.
- Validation gate(s):
- `runtime_handoff_stale_status_guard_complete`
- `runtime_handoff_list_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice cannot be made useful without broader queue sync or detail-page status normalization.
- Rollback: Revert the Runtime handoff stub classification change and leave the case at result if the slice does not stay clearly bounded.
- Result summary: Runtime handoff stubs are now more truthful in one bounded seam: historical follow-up artifacts no longer present as `pending_review`, and the live pending OpenMOSS follow-up remains the only pending-review stub in that validated path.
- Evidence path:
- Primary evidence path: `hosts/web-host/data.ts`
- Bounded start: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-engine-handoff.md`
- Canonical resolver: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Historical Runtime follow-up example: `runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Live pending Runtime follow-up example: `runtime/follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md`
- Closeout decision artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Closeout decision

- Verdict: `adopt`
- Rationale: The rule is bounded, user-visible, and immediately useful because it removes one real stale-status overstatement from the handoff list without broadening into queue sync or frontend redesign.
- Review result: `approved`
- Review score: `5`
