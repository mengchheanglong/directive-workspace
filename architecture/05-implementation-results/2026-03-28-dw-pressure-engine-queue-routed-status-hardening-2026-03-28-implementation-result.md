# Implementation Result: Engine Queue Routed-Status Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-queue-routed-status-hardening-2026-03-28`
- Candidate name: Engine Queue Routed-Status Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: classify stale raw routed queue entries as explicitly progressed or inconsistent instead of rendering them as clean active-routing state.

## completed tactical slice
- Hardened `hosts/web-host/data.ts` so queue entries derive routed lifecycle status from canonical current-head truth.
- Routed queue entries now surface as `routed_progressed` when the live case head already moved beyond the recorded downstream stub.
- Broken routed anchors now surface as `routed_inconsistent`.
- Still-live routed stubs remain `routed`.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for progressed routed Architecture, progressed routed Runtime, broken routed, and still-live routed controls.

## actual result summary
- The queue surface is now more truthful in one bounded seam: raw routed status is preserved as evidence, but it no longer masquerades as clean active routing after the live case has already progressed or broken.

## mechanical success criteria check
- Progressed routed Architecture entries now expose `status_effective = routed_progressed`.
- Progressed routed Runtime entries now expose `status_effective = routed_progressed`.
- Broken routed entries now expose `status_effective = routed_inconsistent`.
- Still-live routed entries still expose `status_effective = routed`.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into queue lifecycle sync.
- This slice does not broaden into generic stale-status repair.
- It does not broaden into broken-link scanning or frontend redesign.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: queue_routed_status_guard_complete, queue_routed_status_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the routed queue lifecycle-status read-model change and remove this DEEP Architecture case chain if later queue lifecycle work needs a different boundary.
