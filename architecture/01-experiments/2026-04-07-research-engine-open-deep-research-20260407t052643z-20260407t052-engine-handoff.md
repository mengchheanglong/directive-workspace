# Open Deep Research Engine-Routed Architecture Experiment

Date: 2026-04-07
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `research-engine-open-deep-research-20260407t052643z-20260407t052`
- Source reference: `https://github.com/langchain-ai/open_deep_research`
- Engine run record: `runtime/standalone-host/engine-runs/2026-04-07T05-27-02-536Z-research-engine-open-deep-research-20260407t052643z-20260407t052-21c6546d.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-04-07T05-27-02-536Z-research-engine-open-deep-research-20260407t052643z-20260407t052-21c6546d.md`
- Discovery routing record: `discovery/03-routing-log/2026-04-07-research-engine-open-deep-research-20260407t052643z-20260407t052702--routing-record.md`
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
  - Imported source candidate open-deep-research from research-engine bundle C:/Users/User/AppData/Local/Temp/research-engine-live-rerun-0b4943c8-4b05-4e19-b704-786ea9bc8293/dw_import_bundle.json. Bundle decision boundary: This bundle is import-ready for Directive Workspace Discovery review only; it must not be treated as a routing or adoption decision. Source intelligence boundary: Research Engine gathers source intelligence and scoring signals only; it does not decide what Directive Workspace Discovery should adopt or route. Discovery packet boundary: Research Engine prepares Discovery-facing candidate packets; Directive Workspace Discovery retains final route and adoption authority. Research-engine source kind: framework Recommended lane target: architecture Lane target rationale: Primary value is Architecture-oriented extraction: preserve workflow/provider boundaries while keeping baseline-overlap expectations explicit. Discovery signal band: review Signal score summary: Baseline-overlap candidate still carries bounded structural extraction value. Structurally useful despite baseline overlap: preserve the bounded workflow or mechanism signal for extraction, but do not treat the source as a novel primary base. Score summary: total=74; relevance=8/10; evidence_quality=9/10; inspectability=9/10; subsystem_reuse=8/10; novelty=1/10. Signal total score: 74. Workflow phase scores: planning=9, discovery=10, acquisition=9, compression=9, reporting=7, reflection=8. Initial value hypothesis: Best conceptual base for Research Engine because its orchestration boundaries map cleanly to planning, discovery, compression, and reporting. Baggage signals: LangGraph-flavored orchestration assumptions | Report-centric end shape. Capability gap hint: Need reusable phase boundaries and provider seams for bounded research runs. Freshness: Latest normalized evidence captured at 2026-04-07T05:26:14+00:00. Freshest observed source update at 2026-04-04T00:58:28+00:00 (3 days old at capture; 6/6 evidence items carried source dates; signal=current). Evidence bundle refs: open-deep-research-e1, open-deep-research-e2, open-deep-research-e3, open-deep-research-e4, open-deep-research-e5, open-deep-research-e6. Evidence cluster summary: Collapsed 6 evidence items into 6 clusters. | No duplicate evidence clusters detected. | No contradiction flags detected across clustered evidence.. Provenance: primary via exa-live:official-docs (github-repo). Extract recommendations: Extract the explicit phase model (planning, discovery, acquisition, compression, reporting) as a Directive-owned workflow contract. | Extract the provider seam as a bounded interface between acquisition and downstream synthesis/reporting. | Extract the bounded protocol boundary so acquisition, compression, and reporting remain separable.. Avoid recommendations: Do not import LangGraph-specific orchestration assumptions wholesale. | Do not import the report-centric or answer-first end shape wholesale. | Do not treat the source as a novel primary base without stronger live evidence.. Review guidance summary: Extractive structural candidate: keep the reusable mechanism and bounded workflow, but hold novelty claims low. Review guidance action: Use this as an Architecture extraction/reference source. Extract only the bounded mechanisms listed here and reject wholesale framework adoption. Review guidance stop-line: Do not auto-promote this source to primary-base status or direct Runtime adoption without stronger live evidence. Uncertainty notes: Extraction fidelity: direct=0, derived=3, fallback=3 across 6 evidence items. Reconsideration triggers: Replace generic fallback summaries/snippets with targeted source excerpts before adoption scoring..
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
