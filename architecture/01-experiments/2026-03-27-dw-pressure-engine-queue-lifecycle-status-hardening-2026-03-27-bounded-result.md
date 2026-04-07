# Engine Queue Lifecycle Status Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27
- Candidate name: Engine Queue Lifecycle Status Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by directive-lead-implementer from bounded start `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that stops broken queue entries from advertising clean `completed` lifecycle status when canonical truth cannot resolve their recorded completion artifact.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to queue entries whose raw queue status is `completed` while canonical resolution is broken.
- Preserve raw queue status as stored evidence, but surface an explicit derived stale-completion warning in the host/read-model.
- Keep healthy routed entries unchanged.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.
- Inputs:
- `hosts/web-host/data.ts`
- `frontend/src/app.ts`
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One explicit Engine-quality hardening slice that stops broken completed queue entries from presenting as cleanly completed work in the queue surface.
- Validation gate(s):
- `queue_lifecycle_status_guard_complete`
- `queue_completed_status_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice cannot be made useful without broader queue lifecycle sync or generic stale-status repair.
- Rollback: Revert the queue lifecycle-status read-model change and leave the case at result if the slice does not stay clearly bounded.
- Result summary: Broken completed queue entries now surface as explicitly inconsistent completion in the queue read-model while preserving the raw stored queue status and leaving healthy routed entries untouched.
- Evidence path:
- Primary evidence path: `hosts/web-host/data.ts`
- Queue surface: `frontend/src/app.ts`
- Bounded start: `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-engine-handoff.md`
- Canonical resolver: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Legacy completed example: `runtime/legacy-records/2026-03-22-context-pack-async-latency-transformation-record.md`
- Broken completed monitor example: `discovery/04-monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Closeout decision

- Verdict: `adopt`
- Rationale: The rule is bounded, operator-visible, and immediately useful because it stops broken completed queue entries from looking like clean completion without broadening into queue lifecycle sync.
- Review result: `approved`
- Review score: `5`

