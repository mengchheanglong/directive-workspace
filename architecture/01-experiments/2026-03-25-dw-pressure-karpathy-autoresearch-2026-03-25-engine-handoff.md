# Karpathy Autoresearch Pressure Run Engine-Routed Architecture Experiment

Date: 2026-03-25
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-karpathy-autoresearch-2026-03-25`
- Source reference: `sources/intake/source-karpathy-autoresearch-concept.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-25T07-15-08-005Z-dw-pressure-karpathy-autoresearch-2026-03-25-50483461.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-25T07-15-08-005Z-dw-pressure-karpathy-autoresearch-2026-03-25-50483461.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-25-dw-pressure-karpathy-autoresearch-2026-03-25-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## Inputs

  - Assess whether Karpathy's metric-plus-iteration autoresearch concept should improve Directive Workspace engine experimentation, proof discipline, and self-improvement loops under the current engine-building mission.
  - pressure_run_role:architecture_likely

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
