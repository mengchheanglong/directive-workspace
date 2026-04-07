# Adopted: Autoresearch Ship Workflow (2026-04-06)

## decision
- Final status: `adopted`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result.md`.
- Adoption approval: `codex`.
- Usefulness level: `meta`.
- Completion status: `product_materialized`.

## evidence basis
- Bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result.md`
- Source closeout decision artifact: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T00-30-00-000Z-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-836105c3.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T00-30-00-000Z-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-836105c3.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-routing-record.md`

## adopted value
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Result summary retained: Updated engine/directive-engine.ts so structural protocols with explicit checklist, dry-run, verification, rollback, approval, and logging boundaries now resolve as bounded control/evidence discipline instead of falling back to generic Architecture prose or inheriting loop framing from incidental prep-loop support. Proof method: reran DirectiveEngine.processSource on the same Autoresearch Ship Workflow source and confirmed that missionFitSummary, primaryAdoptionQuestion, extractionPlan, adaptationPlan, and improvementPlan now surface bounded control/evidence signals while avoiding loop-language claims, then ran npm.cmd run check. This keeps domain-specific shipping execution behavior out of scope while materializing one Engine-owned adaptation improvement.
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
- dw-pressure-autoresearch-ship-control-boundary-2026-03-26 is now retained under `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adopted.md` with paired decision artifact `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status class: `product_materialized`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

