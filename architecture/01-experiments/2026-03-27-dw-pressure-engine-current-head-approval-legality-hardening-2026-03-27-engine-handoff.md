# Engine Current-Head Approval Legality Hardening Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27`
- Source reference: `scripts/report-directive-workspace-state.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Primary truth surface: `engine/approval-boundary.ts`
- Canonical resolver: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Concrete pressure example: `runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Concrete stale approval surface: `hosts/web-host/data.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: live Runtime detail surfaces and downstream openers can still trust artifact-local status fields after the case head already moved on, so one shared current-head legality guard would make next-step presentation and approval boundaries more truthful.

## Objective

Open one bounded DEEP Architecture slice that requires live current-head alignment before a Runtime artifact can advertise or authorize the next downstream opening.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Runtime downstream approval surfaces and downstream openers.
- Require the artifact being opened from to still be the live current head.
- Preserve legitimate pending-review pending-proof openings when the artifact is still the live head.
- Do not broaden into queue stale-status repair, generic broken-link scanning, or frontend redesign.

## Inputs

- `engine/approval-boundary.ts` already resolves clean integrity for opening, but it does not yet require the artifact to remain the live current head.
- `hosts/web-host/data.ts` currently forwards Runtime `approvalAllowed` from artifact-local status only.
- The March 25 mini-swe Runtime chain is now at promotion-readiness, but its historical follow-up, record, proof, and capability-boundary surfaces still advertise approval locally.

## Validation gate(s)

- `current_head_legality_guard_complete`
- `runtime_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the current-head legality guard changes in `engine/approval-boundary.ts`, the Runtime openers, `hosts/web-host/data.ts`, and `scripts/check-directive-workspace-composition.ts`, then delete this DEEP case chain.

## Next decision

- `adopt`
