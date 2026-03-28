# Adopted / Planned-Next: Engine Next-Step Legality Validation Hardening (2026-03-27)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-engine-handoff.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`

## adopted value
- Objective retained: Open one bounded DEEP Architecture slice that hardens Discovery-route legality validation so a concrete required downstream artifact mismatch blocks advancement instead of surfacing a falsely legal downstream next step.
- Result summary retained: The shared truth anchor now treats descriptive required-next-artifact labels as non-blocking metadata, but blocks Discovery-route cases when a concrete required downstream artifact disagrees with the resolved downstream stub.
- Closeout rationale retained: This slice adds one immediately useful legality guard without broadening into the rest of broken-link or stale-status hardening.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact retains the bounded legality-validation result in product-owned Architecture form so later whole-product hardening can continue from an explicit shared Engine-quality slice instead of reconstructing the route-level reasoning.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Continue from Discovery-route legality only.
- Pick one later hardening seam such as stale-status detection or broader broken-link classification.
- Leave Runtime, frontend, and automation boundaries untouched.

## risk + rollback
- Rollback: Revert the legality hardening code changes and delete this DEEP case artifact chain if the route-level rule proves too narrow or too noisy.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- `dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27` is now retained under `architecture/03-adopted/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-adopted-planned-next.md` with paired decision artifact `architecture/03-adopted/2026-03-27-dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
