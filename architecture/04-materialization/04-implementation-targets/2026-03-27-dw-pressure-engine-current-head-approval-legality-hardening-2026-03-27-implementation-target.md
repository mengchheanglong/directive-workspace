# Implementation Target: Engine Current-Head Approval Legality Hardening (2026-03-27)

## target
- Candidate id: `dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27`
- Candidate name: Engine Current-Head Approval Legality Hardening
- Source adoption artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: require live current-head alignment before a Runtime artifact can advertise or authorize the next downstream opening.

## scope (bounded)
- Limit the implementation to `engine/approval-boundary.ts`, the Runtime openers, `hosts/web-host/data.ts`, and `scripts/check-directive-workspace-composition.ts`.
- Add one shared current-head legality rule for downstream Runtime openings.
- Apply the rule to Runtime follow-up, record, proof, and capability-boundary approval surfaces/openers only.
- Do not broaden into queue stale-status repair, generic broken-link scanning, Runtime reopening, or frontend redesign.

## validation approach
- `current_head_legality_guard_complete`
- `runtime_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm historical Runtime detail pages stop advertising approval once the case head moved on.
- Confirm historical Runtime openers now fail clearly when the live current head moved downstream.
- Confirm still-pending Runtime follow-up detail pages still advertise approval.

## rollback boundary
- Revert the current-head legality guard code changes and remove this DEEP case chain if the slice stops being clearly bounded.

