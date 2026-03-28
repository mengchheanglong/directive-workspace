# Engine Discovery Lifecycle Sync Route-Linkage Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28
- Candidate name: Engine Discovery Lifecycle Sync Route-Linkage Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-review from routed handoff `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that hardens Discovery lifecycle sync so routed queue linkage must match the routing record and point at a real concrete downstream stub when one is supplied.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to routed lifecycle sync validation only.
- Require concrete routed `result_record_path` values to exist.
- Require routed queue linkage to match the routing record's declared required next artifact when that artifact is a real directive-workspace path.
- Do not broaden into completed-phase validation, queue lifecycle sync redesign, generic stale-status repair, or broken-link scanning.
- Inputs:
- `shared/lib/discovery-intake-lifecycle-sync.ts` currently validates file paths but does not verify routed queue linkage against the routing record's declared next artifact.
- `shared/lib/discovery-routing-record-writer.ts` defines the canonical `Route destination` and `Required next artifact` fields.
- `scripts/check-directive-workspace-composition.ts` already exercises negative-path routing mismatch detection after the fact, but not writer-side rejection before queue mutation.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `routed_lifecycle_sync_linkage_guard_complete`
- `routed_lifecycle_sync_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Revert the routed lifecycle sync validation change, revert the composition checker coverage, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-engine-handoff.md`
