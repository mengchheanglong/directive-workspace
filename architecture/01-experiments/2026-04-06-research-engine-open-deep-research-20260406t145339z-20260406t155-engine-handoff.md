# Open Deep Research Engine-Routed Architecture Experiment

Date: 2026-04-06
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `research-engine-open-deep-research-20260406t145339z-20260406t155`
- Source reference: `https://github.com/langchain-ai/open_deep_research`
- Engine run record: `runtime/standalone-host/engine-runs/2026-04-06T15-55-00-000Z-research-engine-open-deep-research-20260406t145339z-20260406t155-57812545.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-04-06T15-55-00-000Z-research-engine-open-deep-research-20260406t145339z-20260406t155-57812545.md`
- Discovery routing record: `discovery/03-routing-log/2026-04-06-research-engine-open-deep-research-20260406t145339z-20260406t155500z-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the generated adaptation and improvement plans are Engine-self-improvement oriented, so the value is primarily about improving how Directive Workspace discovers, judges, adapts, proves, or integrates future sources rather than exposing repeated host-call value.

## Objective

Materialize the adapted mechanism as engine-owned product logic only after the staged proof boundary for "improve engine self-improvement quality" remains explicit through adaptation_complete.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## Inputs

  - Breaks deep research into typed phases instead of collapsing everything into an answer loop. Imported from research-engine for Directive Workspace Discovery review only.
  - Imported source candidate open-deep-research from research-engine bundle C:/Users/User/projects/directive-workspace/discovery/research-engine/artifacts-live-test/dw_import_bundle.json. Bundle decision boundary: This bundle is import-ready for Directive Workspace Discovery review only; it must not be treated as a routing or adoption decision. Source intelligence boundary: Research Engine gathers source intelligence and scoring signals only; it does not decide what Directive Workspace Discovery should adopt or route. Discovery packet boundary: Research Engine prepares Discovery-facing candidate packets; Directive Workspace Discovery retains final route and adoption authority. Research-engine source kind: framework Discovery signal band: weak Signal score summary: Weak or noisy Discovery review signal due to baseline overlap, limited evidence quality, low relevance, or both. Score summary: total=81; relevance=8/10; evidence_quality=9/10; inspectability=9/10; subsystem_reuse=8/10; novelty=1/10. Signal total score: 81. Initial value hypothesis: Best conceptual base for Research Engine because its orchestration boundaries map cleanly to planning, discovery, compression, and reporting. Baggage signals: LangGraph-flavored orchestration assumptions | Report-centric end shape. Capability gap hint: Need reusable phase boundaries and provider seams for bounded research runs. Freshness: Latest normalized evidence captured at 2026-04-06T14:53:39+00:00. Freshest observed source update at 2026-03-29T00:00:00+00:00 (8 days old at capture; 5/5 evidence items carried source dates; signal=current). Evidence bundle refs: open-deep-research-e1, open-deep-research-e2, open-deep-research-e3, open-deep-research-e4, open-deep-research-e5. Evidence cluster summary: Collapsed 5 evidence items into 5 clusters. | No duplicate evidence clusters detected. | No contradiction flags detected across clustered evidence.. Provenance: primary via catalog:official-docs (github-repo). Uncertainty notes: Current run is catalog-backed and should later be upgraded to live-provider evidence.
  - record_shape:queue_only

## Validation gate(s)

  - `adaptation_complete`
  - `improvement_complete`
  - `engine_boundary_preserved`
  - `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Keep the result at experiment status and do not integrate it into the engine until the staged proof boundary is clearer.

## Next decision

- `needs-more-evidence`
