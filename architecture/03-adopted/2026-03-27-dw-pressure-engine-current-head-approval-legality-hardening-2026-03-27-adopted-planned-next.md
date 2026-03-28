# Adopted / Planned-Next: Engine Current-Head Approval Legality Hardening (2026-03-27)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-engine-handoff.md`
- Approval boundary: `engine/approval-boundary.ts`
- Runtime approval surface: `hosts/web-host/data.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`

## adopted value
- Objective retained: Open one bounded DEEP Architecture slice that requires live current-head alignment before a Runtime artifact can advertise or authorize the next downstream opening.
- Result summary retained: Runtime approval legality is now stricter in one bounded seam: stale historical Runtime artifacts stop advertising downstream approval, and stale historical openers stop authorizing downstream openings.
- Closeout rationale retained: This slice adds one immediately useful legality guard without broadening into queue stale-status repair or generic broken-link scanning.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact retains the bounded legality-hardening result in product-owned Architecture form so later negative-path hardening can continue from an explicit current-head legality slice instead of reconstructing the Runtime stale-status evidence.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Continue from stale-status hardening only.
- Pick one later seam such as queue stale-status mismatch detection or broader broken-link classification.
- Leave Runtime capability reopening, frontend redesign, and automation boundaries untouched.

## risk + rollback
- Rollback: Revert the current-head legality guard changes and delete this DEEP case artifact chain if the slice proves too narrow or too noisy.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- `dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27` is now retained under `architecture/03-adopted/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-adopted-planned-next.md` with paired decision artifact `architecture/03-adopted/2026-03-27-dw-pressure-engine-current-head-approval-legality-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
