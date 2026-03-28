# Engine Queue Routed-Status Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-queue-routed-status-hardening-2026-03-28
- Candidate name: Engine Queue Routed-Status Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by directive-lead-implementer from bounded start `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that stops routed queue entries from advertising clean active routing once the live case head has already progressed downstream or the routed anchor is canonically broken.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to queue entries whose raw queue status is `routed`.
- Preserve raw queue status as stored evidence, but surface explicit derived states for routed entries that have already progressed or become inconsistent.
- Preserve still-live routed entries whose recorded downstream stub remains the live current head.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.
- Inputs:
- `hosts/web-host/data.ts`
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- Expected output:
- One explicit Engine-quality hardening slice that stops routed queue entries from looking like clean active-routing state when canonical truth already says otherwise.
- Validation gate(s):
- `queue_routed_status_guard_complete`
- `queue_routed_status_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the DEEP handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The slice cannot be made useful without broader queue lifecycle sync or generic stale-status repair.
- Rollback: Revert the routed queue lifecycle-status read-model change and leave the case at result if the slice does not stay clearly bounded.
- Result summary: Routed queue entries are now more truthful in one bounded seam: cases whose live head already progressed downstream surface as `routed_progressed`, broken routed anchors surface as `routed_inconsistent`, and still-live routed stubs remain `routed`.
- Evidence path:
- Primary evidence path: `hosts/web-host/data.ts`
- Bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-engine-handoff.md`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Progressed routed Architecture example: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Progressed routed Runtime example: `discovery/routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Broken routed example: `discovery/routing-log/2026-03-24-dw-live-gpt-researcher-engine-pressure-2026-03-24-routing-record.md`
- Still-live routed control: `runtime/follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md`
- Closeout decision artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Closeout decision

- Verdict: `adopt`
- Rationale: The rule is bounded, operator-visible, and directly useful because it closes the main remaining queue lifecycle overstatement seam without broadening into queue lifecycle sync.
- Review result: `approved`
- Review score: `5`
