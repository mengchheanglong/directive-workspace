# Engine Current-Head Approval Legality Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27
- Candidate name: Engine Current-Head Approval Legality Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that requires live current-head alignment before a Runtime artifact can advertise or authorize the next downstream opening.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Runtime downstream approval surfaces and downstream openers.
- Require the opening artifact to remain the live current head.
- Preserve legitimate pending-review pending-proof openings when the artifact is still the live head.
- Do not broaden into queue stale-status repair, generic broken-link scanning, or frontend redesign.
- Inputs:
- `engine/approval-boundary.ts` already enforces explicit approval and integrity, but not current-head alignment.
- `hosts/web-host/data.ts` currently forwards Runtime approval affordances from artifact-local status alone.
- `shared/lib/runtime-follow-up-opener.ts`
- `shared/lib/runtime-record-proof-opener.ts`
- `shared/lib/runtime-proof-runtime-capability-boundary-opener.ts`
- `shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts`
- Expected output:
- One bounded Architecture hardening slice that blocks stale Runtime approval affordances and stale downstream openings once the live current head has moved deeper.
- Validation gate(s):
- `current_head_legality_guard_complete`
- `runtime_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice needs broader stale-status repair outside Runtime approval legality to be useful.
- Rollback: Revert the current-head legality guard changes and leave the case at start if the slice stops being clearly bounded.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-engine-handoff.md`
- Approval boundary: `engine/approval-boundary.ts`
- Runtime approval surface: `hosts/web-host/data.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Historical follow-up example: `runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `strong`
- Improvement quality: `strong`
- Meta-useful: `yes`
- Meta-usefulness category: `evaluation_quality`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-engine-handoff.md`

