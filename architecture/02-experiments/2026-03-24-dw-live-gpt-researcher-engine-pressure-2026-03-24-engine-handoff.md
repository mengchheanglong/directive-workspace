# GPT Researcher Engine Pattern Audit Engine-Routed Architecture Experiment

Date: 2026-03-24
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-live-gpt-researcher-engine-pressure-2026-03-24`
- Source reference: `https://github.com/assafelovic/gpt-researcher`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-gpt-researcher-engine-pressure-2026-03-24-cc5eed01.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-gpt-researcher-engine-pressure-2026-03-24-cc5eed01.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-gpt-researcher-engine-pressure-2026-03-24-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## Inputs

  - Directive engine materialization and evaluation quality. Assess whether planner or execution or publisher structure, citation-backed report generation, MCP retrieval, and report persistence patterns improve Engine routing, adaptation, proof, and self-improvement rather than merely becoming a host feature.
  - Real GitHub source under sources/intake/gpt-researcher. Signals: engine, adaptation, evaluation, report persistence, routing, self-improvement, workflow structure, research planner, publisher. Expected pressure: Architecture follow-through after Engine acceptance may still be manual.
  - record_shape:queue_only

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
