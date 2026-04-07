# Adopted: Autoresearch Results Logging Protocol (2026-03-26)

## decision
- Final status: `adopted`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_materialized`.

## evidence basis
- Bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`
- Source closeout decision artifact: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T01-56-37-903Z-dw-pressure-results-logging-contract-quality-2026-03-26-30fa43d7.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T01-56-37-903Z-dw-pressure-results-logging-contract-quality-2026-03-26-30fa43d7.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-routing-record.md`

## adopted value
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Result summary retained: Bounded Architecture slice turned closeout result evidence from prose inference into an explicit contract field by adding primaryEvidencePath to the bounded closeout input, bounded-result artifact, and paired decision JSON, with result-evidence readers preferring that field over heuristic path scraping. Proof used node --experimental-strip-types ./scripts/check-architecture-composition.ts plus structural inspection of shared/lib/architecture-bounded-closeout.ts, shared/lib/architecture-adoption-artifacts.ts, and the results-logging source contract.
- Closeout rationale retained: The mechanism passed review, met adoption readiness, and remains valuable as Directive-owned Architecture output.
- Next bounded decision: `adopt`

## adopted boundary
- This artifact retains the bounded result in product-owned Architecture form so the next slice can start without reconstructing the prior Engine/handoff/start/result chain by hand.
- Materialization state: adopted as current-scope Architecture output

## smallest next bounded slice
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## risk + rollback
- Rollback: Keep the result at experiment status and do not integrate it into the engine until the adaptation boundary is clearer.
- If this adoption boundary proves unhelpful, delete this adopted artifact and its paired decision artifact, then continue from the source bounded result instead.

## decision close state
- dw-pressure-results-logging-contract-quality-2026-03-26 is now retained under `architecture/02-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md` with paired decision artifact `architecture/02-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `schema`
- Status class: `product_materialized`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

