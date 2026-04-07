# Engine Runtime Handoff Stale-Status Hardening Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27`
- Source reference: `hosts/web-host/data.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Primary truth surface: `hosts/web-host/data.ts`
- Canonical resolver: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Concrete stale handoff example: `runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Concrete live handoff example: `runtime/00-follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the frontend handoff list still labels historical Runtime follow-up artifacts as `pending_review` from filenames alone, even when the live current head already advanced downstream, so one bounded stale-status rule would make the operator-facing worklist more truthful.

## Objective

Open one bounded DEEP Architecture slice that stops the Runtime handoff list from advertising historical follow-up artifacts as live pending-review work once canonical truth shows the case head moved downstream.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Runtime follow-up stub classification inside the host read-model.
- Use the canonical resolver to distinguish `pending_review` current heads from historical follow-up artifacts that already progressed downstream.
- Preserve the real pending OpenMOSS follow-up as a live pending-review stub.
- Do not broaden into queue lifecycle sync, Runtime detail-page status normalization, generic stale-status repair, or frontend redesign.

## Inputs

- `hosts/web-host/data.ts` currently derives Runtime follow-up stubs from filenames and assigns `pending_review` without consulting live case truth.
- `shared/lib/dw-state.ts` already resolves the live `currentStage` and `currentHead` needed to classify those stubs honestly.
- The March 25 mini-swe Runtime follow-up is historical, but the handoff list still presents it as a pending-review stub.

## Validation gate(s)

- `runtime_handoff_stale_status_guard_complete`
- `runtime_handoff_list_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the Runtime handoff stub classification change in `hosts/web-host/data.ts`, revert the composition checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
