# 2026-04-02 - Operational Architecture Self-Improvement Loop

## Slice

- CLAUDE roadmap slices: `era_d_d2_operational_improvement_proposal`, `era_d_d3_real_self_improvement_loop`
- Owning lane: `Architecture`
- Result: one runtime-execution failure signal now travels through the normal Discovery-to-Architecture chain to a bounded result, adopted planned-next artifact, implementation target, and implementation result

## What changed

- Closed the NOTE-mode Architecture handoff for `dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02` into:
  - `architecture/02-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-bounded-result.md`
  - `architecture/02-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-bounded-result-adoption-decision.json`
- Adopted that bounded result into:
  - `architecture/03-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next.md`
  - `architecture/03-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next-adoption-decision.json`
- Materialized the adopted self-improvement through:
  - `architecture/04-implementation-targets/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-implementation-target.md`
  - `architecture/05-implementation-results/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-implementation-result.md`
- Corrected the shared operational-candidate read surface in `shared/lib/operational-architecture-improvement-candidates.ts` so it now resolves the live Architecture current stage/head from the canonical workspace-state resolver.

## Resulting truth

- Real runtime execution evidence now produces one real Architecture-lane self-improvement case through the normal chain.
- The self-improvement is measurable in existing product behavior:
  - `report:operational-architecture-improvement-candidates` now resolves the case as `architecture_materialized`
  - the same report now surfaces `currentStage = architecture.implementation_result.success`
  - the canonical state resolver now resolves the routing record current head to the implementation result
- The retained product value stays bounded:
  - one shared-lib/report/check surface around `shared/lib/operational-architecture-improvement-candidates.ts`
  - no Runtime reopening
  - no host expansion
  - no automation

## Proof path

- `npm run report:operational-architecture-improvement-candidates`
- `node --experimental-strip-types scripts/check-operational-architecture-improvement-candidates.ts`
- `npm run report:directive-workspace-state -- discovery/routing-log/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-routing-record.md`

## Rollback

Revert:

- `shared/lib/operational-architecture-improvement-candidates.ts`
- `architecture/02-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-bounded-result.md`
- `architecture/02-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-bounded-result-adoption-decision.json`
- `architecture/03-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next.md`
- `architecture/03-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next-adoption-decision.json`
- `architecture/04-implementation-targets/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-implementation-target.md`
- `architecture/05-implementation-results/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-implementation-result.md`
- this log

## Stop-line

Stop once one operational-evidence Architecture case is materially visible through the normal chain to implementation result and the existing report/check/state surfaces can all see that same live state without custom interpretation.
