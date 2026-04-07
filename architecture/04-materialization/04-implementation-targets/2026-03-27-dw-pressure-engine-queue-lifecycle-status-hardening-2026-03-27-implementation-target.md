# Implementation Target: Engine Queue Lifecycle Status Hardening (2026-03-27)

## target
- Candidate id: `dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27`
- Candidate name: Engine Queue Lifecycle Status Hardening
- Source adoption artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned queue lifecycle-status hardening slice.
- Objective retained: stop broken queue entries from advertising clean `completed` lifecycle status when canonical truth cannot resolve their recorded completion artifact.

## scope (bounded)
- Limit the implementation to `hosts/web-host/data.ts`, `frontend/src/app.ts`, and `scripts/check-directive-workspace-composition.ts`.
- Add one derived queue lifecycle-status rule for broken completed entries.
- Preserve the raw stored queue status as evidence while surfacing a stale-completion warning.
- Keep healthy routed entries unchanged.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.

## validation approach
- `queue_lifecycle_status_guard_complete`
- `queue_completed_status_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm broken completed queue entries expose `status_effective = completed_inconsistent`.
- Confirm broken completed queue entries explain the stale completion state.
- Confirm healthy routed queue entries remain unchanged.
- Confirm `npm run check` passes.

## rollback boundary
- Revert the queue lifecycle-status read-model change, the queue card warning, and remove this DEEP case chain if the slice stops being clearly bounded.

