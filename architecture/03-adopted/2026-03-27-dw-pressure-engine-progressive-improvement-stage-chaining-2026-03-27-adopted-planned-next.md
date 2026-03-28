# Adopted / Planned-Next: Engine Progressive Improvement-Stage Chaining Refactor (2026-03-27)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-engine-handoff.md`
- Prior DEEP implementation result: `architecture/05-implementation-results/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-implementation-result.md`
- Parked STANDARD evidence: `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`

## adopted value
- Objective retained: Open one bounded DEEP Architecture slice that makes improvement planning consume typed extraction and adaptation output inside `processSource()`, without refactoring proof or integration planning.
- Result summary retained: The prior DEEP slice made extraction feed adaptation directly. This separate DEEP case keeps the next meaningful seam bounded by making improvement consume both extraction and adaptation outputs while leaving proof and integration untouched.
- Closeout rationale retained: The STANDARD source case stays parked and the prior DEEP case stays complete. This separate DEEP Architecture case carries forward only the next bounded Engine planning seam as product-owned work.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact opens a separate DEEP Architecture container for the next Engine planning-pipeline seam so the parked `dw-source-ts-edge-2026-03-27` STANDARD case does not get resumed and the prior DEEP case does not drift into retention bookkeeping.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Keep scope to `engine/directive-engine.ts` and the improvement planning seam.
- Make improvement consume both the base planning input and the typed extraction/adaptation plans.
- Leave proof and integration planning on the current flat input path for this slice.
- Do not reopen Runtime, frontend, or unrelated Engine redesign.

## risk + rollback
- Rollback: Delete this DEEP case artifact chain and revert the bounded Engine code slice if the improvement-stage seam proves noisier than the value it adds.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the prior DEEP implementation result instead.

## decision close state
- `dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27` is now retained under `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-adopted-planned-next.md` with paired decision artifact `architecture/03-adopted/2026-03-27-dw-pressure-engine-progressive-improvement-stage-chaining-2026-03-27-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
