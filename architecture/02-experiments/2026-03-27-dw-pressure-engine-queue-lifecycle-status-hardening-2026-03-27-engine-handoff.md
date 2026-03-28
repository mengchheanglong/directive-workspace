# Engine Queue Lifecycle Status Hardening Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27`
- Source reference: `hosts/web-host/data.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Primary truth surface: `hosts/web-host/data.ts`
- Canonical resolver: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Concrete stale completed example: `runtime/records/2026-03-22-context-pack-async-latency-transformation-record.md`
- Concrete broken completed monitor example: `discovery/monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the queue surface still shows raw `completed` status even when canonical truth cannot resolve the recorded result path cleanly, so one bounded lifecycle-status rule would make the operator-facing queue more truthful without redesigning queue sync.

## Objective

Open one bounded DEEP Architecture slice that stops broken queue entries from advertising clean `completed` lifecycle status when canonical truth cannot resolve their recorded completion artifact.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to queue entries whose raw queue status is `completed` while canonical resolution is broken.
- Preserve raw queue status as stored evidence, but surface an explicit derived stale-completion warning in the host/read-model.
- Keep healthy routed entries unchanged.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.

## Inputs

- `hosts/web-host/data.ts` currently forwards the raw queue `status` directly to the frontend queue surface.
- `shared/lib/dw-state.ts` already resolves whether the recorded completion artifact is broken or unsupported.
- Legacy queue entries still marked `completed` can resolve as broken because their stored result path is no longer a canonical supported artifact.

## Validation gate(s)

- `queue_lifecycle_status_guard_complete`
- `queue_completed_status_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the queue lifecycle-status read-model change in `hosts/web-host/data.ts`, revert the queue card/status presentation and composition checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
