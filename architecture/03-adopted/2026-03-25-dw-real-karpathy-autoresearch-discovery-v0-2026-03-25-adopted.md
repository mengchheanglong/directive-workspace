# Adopted: Karpathy Autoresearch Discovery Front Door Pressure (2026-03-26)

## decision
- Final status: `adopted`.
- Lane: `Directive Architecture` only.
- Source bounded result: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-result.md`.
- Adoption approval: `directive-lead-implementer`.
- Usefulness level: `meta`.
- Completion status: `product_partial`.

## evidence basis
- Bounded result artifact: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-result.md`
- Source closeout decision artifact: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-result-adoption-decision.json`
- Bounded start artifact: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-25T01-46-08-519Z-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-120309c0.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-25T01-46-08-519Z-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-120309c0.md`
- Discovery routing record: `discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md`

## adopted value
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Result summary retained: The Karpathy autoresearch constraint-metric-iteration loop pattern was analyzed against the Engine current Architecture experiment loop. Finding: the pattern is already structurally present in the Engine. Constraints are explicit (bounded scope, failure criteria, rollback path in bounded start artifacts). Metrics exist as structural pass/fail validation gates (adaptation_complete, engine_boundary_preserved, decision_review) and closeout readiness checks. Iteration exists via continuation bounded starts and keep/reopen evaluation cycles. However, two specific gaps were identified relative to the Karpathy pattern: (1) metrics are gate-based (pass/fail) rather than quantitative/continuous — the Engine cannot currently express "how much closer did this iteration bring us" in measurable terms; (2) iteration is human-initiated rather than autonomous — the Engine does not autonomously decide when to iterate vs stop. Both gaps are intentional for the current Engine-building phase: quantitative metrics require a stable evaluation surface that does not yet exist, and autonomous iteration is explicitly in the forbidden scope expansion list (no lifecycle orchestration, no automatic workflow advancement). The bounded experiment confirms the pattern is already adapted into Engine-owned form at the structural level. No new code or mechanism is required from this experiment. The value is confirmatory: the Engine already embodies the core pattern, and the identified gaps are intentionally deferred rather than missing.
- Closeout rationale retained: The mechanism passed review, met adoption readiness, and remains valuable as Directive-owned Architecture output.
- Next bounded decision: `defer`

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
- dw-real-karpathy-autoresearch-discovery-v0-2026-03-25 is now retained under `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adopted.md` with paired decision artifact `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adoption-decision.json`.

## Lifecycle classification
- Usefulness level: `meta`
- Artifact type: `reference-pattern`
- Status class: `product_partial`
- Runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value
