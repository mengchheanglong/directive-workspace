# Engine Current-Head Approval Legality Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27
- Candidate name: Engine Current-Head Approval Legality Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by directive-lead-implementer from bounded start `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that requires live current-head alignment before a Runtime artifact can advertise or authorize the next downstream opening.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Runtime downstream approval surfaces and downstream openers.
- Require the opening artifact to remain the live current head.
- Preserve legitimate pending-review pending-proof openings when the artifact is still the live head.
- Do not broaden into queue stale-status repair, generic broken-link scanning, or frontend redesign.
- Inputs:
- `engine/approval-boundary.ts`
- `hosts/web-host/data.ts`
- `shared/lib/runtime-follow-up-opener.ts`
- `shared/lib/runtime-record-proof-opener.ts`
- `shared/lib/runtime-proof-runtime-capability-boundary-opener.ts`
- `shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts`
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One explicit Engine-quality hardening slice that stops stale Runtime approval surfaces from advertising downstream openings and stops stale Runtime openers from authorizing them.
- Validation gate(s):
- `current_head_legality_guard_complete`
- `runtime_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice cannot be made useful without broader queue or generic stale-status repair.
- Rollback: Revert the current-head legality guard changes and leave the case at result if the slice does not stay clearly bounded.
- Result summary: Runtime approval legality is now stricter in one bounded seam: host detail surfaces no longer advertise stale downstream approvals after the live case head has moved forward, and downstream openers now reject stale historical artifacts even when their local status text still looks eligible.
- Evidence path:
- Primary evidence path: `engine/approval-boundary.ts`
- Bounded start: `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-engine-handoff.md`
- Runtime approval surface: `hosts/web-host/data.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Historical Runtime proof chain: `runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Closeout decision

- Verdict: `adopt`
- Rationale: The rule is bounded, shared, and immediately useful because it removes one real stale-status overstatement from both user-visible approval surfaces and the approval boundary itself without broadening into generic stale-status cleanup.
- Review result: `approved`
- Review score: `5`

