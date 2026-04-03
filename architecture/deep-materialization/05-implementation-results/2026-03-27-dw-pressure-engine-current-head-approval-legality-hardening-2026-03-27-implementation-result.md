# Implementation Result: Engine Current-Head Approval Legality Hardening (2026-03-27)

## target closure
- Candidate id: `dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27`
- Candidate name: Engine Current-Head Approval Legality Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: require live current-head alignment before a Runtime artifact can advertise or authorize the next downstream opening.

## completed tactical slice
- Added shared current-head legality helpers in `engine/approval-boundary.ts`.
- Hardened the Runtime follow-up, record, proof, and capability-boundary openers so stale historical artifacts cannot open downstream work once the live case head moved forward.
- Hardened `hosts/web-host/data.ts` so Runtime approval affordances only remain open when the artifact is still the live current head.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for both stale historical Runtime approval surfaces and stale historical Runtime openers.

## actual result summary
- Runtime downstream approval legality is now more truthful in one bounded seam: historical artifacts with stale local status no longer look openable in host detail surfaces, and explicit opener calls now fail clearly when the live current head has already advanced.

## mechanical success criteria check
- Historical Runtime follow-up, record, proof, and capability-boundary detail surfaces no longer advertise approval after the case head moved to promotion-readiness.
- Historical Runtime follow-up, record, proof, and capability-boundary openers now fail clearly with a live-current-head legality error.
- A still-pending Runtime follow-up detail surface still advertises approval.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into queue stale-status repair.
- This slice does not broaden into generic broken-link scanning.
- It does not reopen Runtime, frontend, or automation work.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: current_head_legality_guard_complete, runtime_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `engine/approval-boundary.ts`
- `shared/lib/runtime-follow-up-opener.ts`
- `shared/lib/runtime-record-proof-opener.ts`
- `shared/lib/runtime-proof-runtime-capability-boundary-opener.ts`
- `shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts`
- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the current-head legality guard code changes and remove this DEEP Architecture case chain if later hardening work needs a different boundary.
