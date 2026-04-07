# Engine Queue Routed-Status Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-queue-routed-status-hardening-2026-03-28`
- Source reference: `hosts/web-host/data.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Primary truth surface: `hosts/web-host/data.ts`
- Canonical resolver: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Concrete progressed routed Architecture example: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Concrete progressed routed Runtime example: `discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Concrete broken routed example: `discovery/03-routing-log/2026-03-24-dw-live-gpt-researcher-engine-pressure-2026-03-24-routing-record.md`
- Concrete still-live routed control: `runtime/00-follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the queue surface still labels many cases `routed` even when canonical truth shows the live head has already advanced to bounded result, promotion-readiness, implementation-result, or a broken route anchor, so one bounded routed-status rule would make queue lifecycle truth much more reliable without redesigning queue sync.

## Objective

Open one bounded DEEP Architecture slice that stops routed queue entries from advertising clean active routing once the live case head has already progressed downstream or the routed anchor is canonically broken.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to queue entries whose raw queue status is `routed`.
- Preserve raw queue status as stored evidence, but surface explicit derived states for routed entries that have already progressed or become inconsistent.
- Preserve still-live routed entries whose recorded downstream stub remains the live current head.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.

## Inputs

- `hosts/web-host/data.ts` currently keeps raw routed queue status even when canonical truth shows the live case head moved beyond the recorded downstream stub.
- `shared/lib/dw-state.ts` already resolves `currentStage` and `currentHead` needed to distinguish still-live routed entries from progressed or broken ones.
- The queue surface already knows how to render derived lifecycle tags and warnings from the completed-status hardening slice.

## Validation gate(s)

- `queue_routed_status_guard_complete`
- `queue_routed_status_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the routed queue lifecycle-status read-model change in `hosts/web-host/data.ts`, revert the composition checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
