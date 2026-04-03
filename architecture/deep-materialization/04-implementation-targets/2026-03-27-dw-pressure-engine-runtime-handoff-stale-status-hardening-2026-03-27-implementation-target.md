# Implementation Target: Engine Runtime Handoff Stale-Status Hardening (2026-03-27)

## target
- Candidate id: `dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27`
- Candidate name: Engine Runtime Handoff Stale-Status Hardening
- Source adoption artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned host read-model implementation slice.
- Objective retained: stop the Runtime handoff list from advertising historical follow-up artifacts as live pending-review work once canonical truth shows the case head moved downstream.

## scope (bounded)
- Limit the implementation to `hosts/web-host/data.ts` and `scripts/check-directive-workspace-composition.ts`.
- Add one resolver-backed Runtime follow-up stub classification rule.
- Preserve real pending-review follow-up stubs.
- Do not broaden into queue lifecycle sync, Runtime detail-page status normalization, generic stale-status repair, or frontend redesign.

## validation approach
- `runtime_handoff_stale_status_guard_complete`
- `runtime_handoff_list_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm historical Runtime follow-up stubs no longer report `pending_review`.
- Confirm the live pending OpenMOSS follow-up stub still reports `pending_review`.
- Confirm `npm run check` passes.

## rollback boundary
- Revert the Runtime handoff stub classification change and remove this DEEP case chain if the slice stops being clearly bounded.
