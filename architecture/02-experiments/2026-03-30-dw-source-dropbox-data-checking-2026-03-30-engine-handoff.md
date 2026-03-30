# Data Checking at Dropbox Engine-Routed Architecture Experiment

Date: 2026-03-30
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-dropbox-data-checking-2026-03-30`
- Source reference: `https://www.usenix.org/conference/srecon17asia/program/presentation/mah`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dropbox-data-checking-2026-03-30-83e78a78.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dropbox-data-checking-2026-03-30-83e78a78.md`
- Discovery routing record: `discovery/routing-log/2026-03-30-dw-source-dropbox-data-checking-2026-03-30-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Materialize the adapted mechanism as engine-owned product logic only after the staged proof boundary for "improve engine self-improvement quality" remains explicit through adaptation_complete.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## Inputs

  - Selected from awesome-scalability as the strongest outside source for current Engine-building pressure: checker-system design, validation coverage, violation reporting, and operator-simple triage that could improve Directive Workspace proof and evaluator quality without reopening runtime execution, planner, or host seams.
  - selected_from:awesome-scalability | stronger_than:boundary-layer-execution-seam,api-best-practices-genericity,secret-detector-repo-hygiene | primary_source:usenix

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
