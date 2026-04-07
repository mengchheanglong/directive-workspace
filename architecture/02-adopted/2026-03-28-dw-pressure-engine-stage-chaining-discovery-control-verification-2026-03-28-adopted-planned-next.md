# Adopted / Planned-Next: Engine Stage-Chaining Discovery Control Verification (2026-03-28)

## decision
- Candidate id: `dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28`.
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-bounded-result.md`
- Source closeout decision artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-engine-handoff.md`
- Prior DEEP implementation result: `architecture/05-implementation-results/2026-03-28-dw-pressure-engine-stage-chaining-runtime-control-verification-2026-03-28-implementation-result.md`

## adopted value
- Objective retained: Open one bounded DEEP Architecture slice that extends the staged Engine verification with a Discovery control source, without reopening Discovery workflow mechanics or changing routing rules.
- Result summary retained: The staged Engine path now has permanent Architecture and Runtime verification, and the next bounded need is proving shared Engine refactors did not drift the Discovery lane.
- Closeout rationale retained: This separate DEEP Architecture case carries forward only the Discovery control verification seam as product-owned work.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact opens a separate DEEP Architecture container for Discovery no-drift verification so the prior staged verification case does not drift into a mixed concern bundle.
- Materialization state: adopted as planned-next, with further bounded Architecture materialization still required.

## smallest next bounded slice
- Keep scope to `scripts/check-directive-engine-stage-chaining.ts`.
- Add one Discovery control source that asserts the default Discovery proof and integration behavior remain unchanged.
- Do not reopen Runtime, frontend, or legacy policy work.

## risk + rollback
- Rollback: Delete this DEEP case artifact chain and revert the focused Discovery control verification slice if the extra coverage becomes noisy or misleading.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the prior Runtime control verification result instead.

## decision close state
- `dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28` is now retained under `architecture/02-adopted/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-adopted-planned-next.md` with paired decision artifact `architecture/02-adopted/2026-03-28-dw-pressure-engine-stage-chaining-discovery-control-verification-2026-03-28-adopted-planned-next-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

