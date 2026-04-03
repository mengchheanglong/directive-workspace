# Implementation Target: Engine Queue Routed-Status Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-queue-routed-status-hardening-2026-03-28`
- Candidate name: Engine Queue Routed-Status Hardening
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned queue routed-status hardening slice.
- Objective retained: stop routed queue entries from advertising clean active routing once the live case head has already progressed downstream or the routed anchor is canonically broken.

## scope (bounded)
- Limit the implementation to `hosts/web-host/data.ts` and `scripts/check-directive-workspace-composition.ts`.
- Add one derived routed queue-status rule driven by canonical current-head truth.
- Preserve raw stored queue status as evidence while surfacing routed-progressed and routed-inconsistent warnings.
- Preserve still-live routed entries unchanged.
- Do not broaden into queue lifecycle sync, generic stale-status repair, broken-link scanning, or frontend redesign.

## validation approach
- `queue_routed_status_guard_complete`
- `queue_routed_status_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm progressed routed Architecture entries expose `status_effective = routed_progressed`.
- Confirm progressed routed Runtime entries expose `status_effective = routed_progressed`.
- Confirm broken routed entries expose `status_effective = routed_inconsistent`.
- Confirm still-live routed entries remain `routed`.
- Confirm `npm run check` passes.

## rollback boundary
- Revert the routed queue lifecycle-status read-model change and remove this DEEP case chain if the slice stops being clearly bounded.
