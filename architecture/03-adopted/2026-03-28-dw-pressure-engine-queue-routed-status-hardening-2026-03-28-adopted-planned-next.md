# Adopted / Planned-Next: Engine Queue Routed-Status Hardening (2026-03-28)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-engine-handoff.md`
- Host read-model: `hosts/web-host/data.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`

## adopted value
- Objective retained: Stop routed queue entries from advertising clean active routing once the live case head has already progressed downstream or the routed anchor is canonically broken.
- Result summary retained: Routed queue entries are now stricter in one bounded seam: progressed cases surface as `routed_progressed`, broken routed anchors surface as `routed_inconsistent`, and still-live routed stubs stay `routed`.
- Closeout rationale retained: This slice removes the main remaining queue lifecycle overstatement seam without broadening into queue lifecycle sync.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact retains the bounded routed-status result in product-owned Architecture form so later lifecycle hardening work can continue from an explicit routed-status truth slice instead of reconstructing the evidence.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Continue from queue lifecycle hardening only.
- Pick one later seam such as queue lifecycle sync validation or queue status writer enforcement.
- Leave Runtime reopening, broader stale-status cleanup, and frontend redesign untouched.

## risk + rollback
- Rollback: Revert the routed queue lifecycle-status read-model change and delete this DEEP case artifact chain if the slice proves too noisy or too broad.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- `dw-pressure-engine-queue-routed-status-hardening-2026-03-28` is now retained under `architecture/03-adopted/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-adopted-planned-next.md` with paired decision artifact `architecture/03-adopted/2026-03-28-dw-pressure-engine-queue-routed-status-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
