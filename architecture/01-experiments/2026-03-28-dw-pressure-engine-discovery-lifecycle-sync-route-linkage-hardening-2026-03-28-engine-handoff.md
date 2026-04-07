# Engine Discovery Lifecycle Sync Route-Linkage Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28`
- Source reference: `shared/lib/discovery-intake-lifecycle-sync.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Primary truth surface: `shared/lib/discovery-intake-lifecycle-sync.ts`
- Canonical queue contract: `shared/contracts/discovery-intake-queue.md`
- Queue schema: `shared/schemas/discovery-intake-queue-entry.schema.json`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Concrete routed route used for validation: `discovery/03-routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the queue read model now flags routed-progressed and routed-inconsistent entries, but the lifecycle sync writer can still accept a concrete routed downstream stub that is missing or conflicts with the routing record. One bounded source-side legality rule would stop that mismatch before queue mutation.

## Objective

Open one bounded DEEP Architecture slice that hardens Discovery lifecycle sync so routed queue linkage must match the routing record and point at a real concrete downstream stub when one is supplied.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to routed lifecycle sync validation only.
- Require concrete routed `result_record_path` values to exist.
- Require routed queue linkage to match the routing record's declared required next artifact when that artifact is a real directive-workspace path.
- Do not broaden into completed-phase validation, queue lifecycle sync redesign, generic stale-status repair, or broken-link scanning.

## Inputs

- `shared/lib/discovery-intake-lifecycle-sync.ts` currently validates file paths but does not verify routed queue linkage against the routing record's declared next artifact.
- `shared/lib/discovery-routing-record-writer.ts` defines the canonical `Route destination` and `Required next artifact` fields.
- `scripts/check-directive-workspace-composition.ts` already exercises negative-path routing mismatch detection after the fact, but not writer-side rejection before queue mutation.

## Validation gate(s)

- `routed_lifecycle_sync_linkage_guard_complete`
- `routed_lifecycle_sync_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the routed lifecycle sync validation change, revert the composition checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
