# dependency-cruiser Rules Reference Engine-Routed Architecture Experiment

Date: 2026-03-30
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-dependency-cruiser-rules-reference-2026-03-30`
- Source reference: `https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.md`
- Discovery routing record: `discovery/routing-log/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-routing-record.md`
- Usefulness level: `structural`
- Usefulness rationale: Structural usefulness: the source offers a bounded mechanism for preserving Engine-owned facade/private boundaries around the canonical dw-state read surface.

## Objective

Determine whether dependency-cruiser can truthfully express one bounded `dw-state` facade boundary proposal without broadening into repo-wide enforcement or misdescribing the current private-file import graph.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any later enforcement or broader dependency-policy work.
- Do not open repo-wide dependency-cruiser adoption from this stub alone.

## Inputs

  - dependency-cruiser rules reference exposes `forbidden`, `path`, `pathNot`, schema-validated config, and JavaScript config composition.
  - Current repo pressure is narrowly bounded: protect the canonical `shared/lib/dw-state.ts` facade if and only if the requested one-importer boundary matches actual repo imports.

## Validation gate(s)

  - `adaptation_complete`
  - `engine_boundary_preserved`
  - `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `structural`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Keep the result at experiment status and do not integrate any boundary enforcement until the target rule matches current repo truth.

## Next decision

- `needs-more-evidence`
