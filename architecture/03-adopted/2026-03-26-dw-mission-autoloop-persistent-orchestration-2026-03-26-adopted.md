# Adopted: Autoloop Persistent Orchestration Pattern (2026-03-26)

## decision
- Final status: `adopted`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T02-43-01-938Z-dw-mission-autoloop-persistent-orchestration-2026-03-26-313acff0.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T02-43-01-938Z-dw-mission-autoloop-persistent-orchestration-2026-03-26-313acff0.md`
- Discovery routing record: `discovery/routing-log/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-routing-record.md`

## adopted value
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Result summary retained: Retained a reusable Architecture pattern for persistent self-improvement: scheduled due checks, explicit target/evaluation definitions, one-iteration ratchet behavior, repo-backed state, and living experiment history. This bounded slice keeps the GitHub-specific automation shell out of scope and preserves only the Engine-owned orchestration discipline that can guide future persistent workspace loops. Proof used source inspection plus the linked Engine routing, handoff, and bounded-start artifacts to confirm the retained pattern stays valuable without runtime execution.
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
- dw-mission-autoloop-persistent-orchestration-2026-03-26 is now retained under `architecture/03-adopted/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-adopted.md` with paired decision artifact `architecture/03-adopted/2026-03-26-dw-mission-autoloop-persistent-orchestration-2026-03-26-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `reference-pattern`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
