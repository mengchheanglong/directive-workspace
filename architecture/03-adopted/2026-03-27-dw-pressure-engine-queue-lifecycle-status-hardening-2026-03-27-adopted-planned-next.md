# Adopted / Planned-Next: Engine Queue Lifecycle Status Hardening (2026-03-27)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-engine-handoff.md`
- Host read-model: `hosts/web-host/data.ts`
- Queue surface: `frontend/src/app.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`

## adopted value
- Objective retained: Stop broken queue entries from advertising clean `completed` lifecycle status when canonical truth cannot resolve their recorded completion artifact.
- Result summary retained: Broken completed queue entries now surface as explicitly inconsistent completion in the queue read-model while healthy routed entries stay unchanged.
- Closeout rationale retained: This slice removes one real stale lifecycle overstatement without broadening into queue lifecycle sync or generic stale-status repair.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact retains the bounded queue lifecycle-status result in product-owned Architecture form so later hardening work can continue from an explicit stale completed-status slice instead of reconstructing the evidence.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Continue from queue lifecycle hardening only.
- Pick one later seam such as routed-status mismatch detection or queue lifecycle sync validation.
- Leave Runtime reopening, broader stale-status cleanup, and frontend redesign untouched.

## risk + rollback
- Rollback: Revert the queue lifecycle-status read-model change, the queue card warning, and delete this DEEP case artifact chain if the slice proves too noisy or too broad.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- `dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27` is now retained under `architecture/03-adopted/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-adopted-planned-next.md` with paired decision artifact `architecture/03-adopted/2026-03-27-dw-pressure-engine-queue-lifecycle-status-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
