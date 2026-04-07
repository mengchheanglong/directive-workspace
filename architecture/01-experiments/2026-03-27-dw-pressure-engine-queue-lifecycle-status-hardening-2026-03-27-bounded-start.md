# Engine Queue Lifecycle Status Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27
- Candidate name: Engine Queue Lifecycle Status Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that stops broken queue entries from advertising clean `completed` lifecycle status when canonical truth cannot resolve their recorded completion artifact.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to queue entries whose raw queue status is `completed` while canonical resolution is broken.
- Preserve raw queue status as stored evidence, but surface an explicit derived stale-completion warning in the host/read-model.
- Keep healthy routed entries unchanged.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.
- Inputs:
- `hosts/web-host/data.ts` currently forwards raw queue `status` directly to the queue surface.
- `shared/lib/dw-state.ts` already resolves broken recorded completion artifacts.
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One bounded Architecture hardening slice that keeps raw completed queue status visible as evidence while explicitly downgrading broken completed entries to a derived inconsistent completion state with a warning.
- Validation gate(s):
- `queue_lifecycle_status_guard_complete`
- `queue_completed_status_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice requires broader queue lifecycle sync or generic stale-status repair to be useful.
- Rollback: Revert the queue lifecycle-status read-model change and leave the case at start if the slice stops being clearly bounded.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-engine-handoff.md`
- Host read-model: `hosts/web-host/data.ts`
- Queue surface: `frontend/src/app.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Legacy completed example: `runtime/legacy-records/2026-03-22-context-pack-async-latency-transformation-record.md`
- Broken completed monitor example: `discovery/04-monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `strong`
- Improvement quality: `strong`
- Meta-useful: `yes`
- Meta-usefulness category: `evaluation_quality`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-engine-handoff.md`

