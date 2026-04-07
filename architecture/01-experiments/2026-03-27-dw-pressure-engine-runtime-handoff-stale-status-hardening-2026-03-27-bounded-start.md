# Engine Runtime Handoff Stale-Status Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27
- Candidate name: Engine Runtime Handoff Stale-Status Hardening
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/01-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that stops the Runtime handoff list from advertising historical follow-up artifacts as live pending-review work once canonical truth shows the case head moved downstream.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Runtime follow-up stub classification inside the host read-model.
- Use the canonical resolver to distinguish live pending-review heads from historical follow-up artifacts that already progressed downstream.
- Preserve the real pending OpenMOSS follow-up as a live pending-review stub.
- Do not broaden into queue lifecycle sync, Runtime detail-page status normalization, generic stale-status repair, or frontend redesign.
- Inputs:
- `hosts/web-host/data.ts` currently assigns Runtime handoff-stub status from filenames alone.
- `shared/lib/dw-state.ts` already resolves the live `currentStage` and `currentHead` needed for honest classification.
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One bounded Architecture hardening slice that downgrades historical Runtime follow-up stubs from `pending_review` to an explicit progressed-downstream status with a warning, while preserving real pending-review stubs.
- Validation gate(s):
- `runtime_handoff_stale_status_guard_complete`
- `runtime_handoff_list_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice requires broader queue sync or detail-page status normalization to be useful.
- Rollback: Revert the Runtime handoff stub classification change and leave the case at start if the slice stops being clearly bounded.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-engine-handoff.md`
- Host read-model: `hosts/web-host/data.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Historical follow-up example: `runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- Live pending example: `runtime/00-follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/01-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `strong`
- Improvement quality: `strong`
- Meta-useful: `yes`
- Meta-usefulness category: `evaluation_quality`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/01-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-engine-handoff.md`

