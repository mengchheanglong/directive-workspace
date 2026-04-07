# Adopted / Planned-Next: Engine Progressive Stage Chaining Refactor (2026-03-27)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-bounded-result.md`
- Source closeout decision artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/01-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`

## adopted value
- Objective retained: Open one bounded DEEP Architecture slice that replaces flat independent stage planning with progressive typed stage-output chaining in `processSource()`, starting with extraction -> adaptation only.
- Result summary retained: The parked STANDARD ts-edge slice established the real Engine pressure: `processSource()` still feeds one flat `planningInput` into extraction, adaptation, improvement, proof, and integration planning. This DEEP case keeps only the first refactor seam by making extraction produce typed output that adaptation must consume directly, without rewriting the rest of the planning pipeline.
- Closeout rationale retained: The STANDARD source case stays parked. This separate DEEP Architecture case carries forward the verified Engine refactor target as product-owned work instead of auto-continuing the original source-driven chain.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact opens a separate DEEP Architecture container for Engine planning-pipeline refactor work so the parked `dw-source-ts-edge-2026-03-27` STANDARD case does not get implicitly resumed.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Keep scope to `engine/directive-engine.ts` and the extraction -> adaptation planning seam.
- Make adaptation consume both the base planning input and the typed extraction plan.
- Leave improvement, proof, and integration planning on the current flat input path for this first DEEP slice.
- Do not reopen Runtime, frontend, or unrelated Engine redesign.

## risk + rollback
- Rollback: Delete this DEEP case artifact chain and revert the bounded Engine code slice if the extraction -> adaptation seam proves noisier than the value it adds.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- dw-pressure-engine-progressive-stage-chaining-2026-03-27 is now retained under `architecture/02-adopted/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-adopted-planned-next.md` with paired decision artifact `architecture/02-adopted/2026-03-27-dw-pressure-engine-progressive-stage-chaining-2026-03-27-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

