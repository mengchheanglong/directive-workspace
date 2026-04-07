# Paper2Code Multi-Agent Code Generation System Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-paper2code-2026-03-27`
- Source reference: `sources/intake/Paper2Code`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-paper2code-2026-03-27-3480346a.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-paper2code-2026-03-27-3480346a.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-paper2code-2026-03-27-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## Inputs

  - Multi-agent system that transforms academic papers into functional code repositories using a 3-stage pipeline (planning, analysis, code generation). Relevant to Directive Workspace's core mission of automated source-to-usefulness conversion — the pipeline architecture, agent coordination patterns, and structured extraction workflow are directly applicable to improving Engine's source consumption and adaptation capabilities.
  - Python/OpenAI-based. 3 stages: PlanningAgent, AnalysisAgent, CodeGenerationAgent. Uses structured prompts and inter-agent handoff. Could inform Engine workflow design or become a runtime capability for automated paper-to-implementation.

## Validation gate(s)

  - `adaptation_complete`
  - `engine_boundary_preserved`
  - `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Keep the result at experiment status and do not integrate it into the engine until the adaptation boundary is clearer.

## Next decision

- `needs-more-evidence`
