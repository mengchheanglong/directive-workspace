# Adopted / Planned-Next: Engine Runtime Handoff Stale-Status Hardening (2026-03-27)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-engine-handoff.md`
- Host read-model: `hosts/web-host/data.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`

## adopted value
- Objective retained: Stop the Runtime handoff list from advertising historical follow-up artifacts as live pending-review work once canonical truth shows the case head moved downstream.
- Result summary retained: Runtime handoff stubs are now stricter in one bounded seam: historical follow-up artifacts no longer look like pending-review work, while genuine pending heads remain pending-review stubs.
- Closeout rationale retained: This slice removes one user-visible stale-status overstatement without broadening into queue lifecycle sync or frontend redesign.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact retains the bounded stale-status result in product-owned Architecture form so later hardening work can continue from an explicit Runtime handoff-list truth slice instead of reconstructing the evidence.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Continue from stale-status hardening only.
- Pick one later seam such as queue lifecycle-status mismatch detection or Runtime detail-page status normalization.
- Leave Runtime reopening, frontend redesign, and automation boundaries untouched.

## risk + rollback
- Rollback: Revert the Runtime handoff stub classification change and delete this DEEP case artifact chain if the slice proves too narrow or too noisy.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- `dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27` is now retained under `architecture/03-adopted/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-adopted-planned-next.md` with paired decision artifact `architecture/03-adopted/2026-03-27-dw-pressure-engine-runtime-handoff-stale-status-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
