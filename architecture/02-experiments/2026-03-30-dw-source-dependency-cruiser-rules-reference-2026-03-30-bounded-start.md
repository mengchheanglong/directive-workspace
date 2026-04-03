# dependency-cruiser Rules Reference Bounded Architecture Start

- Candidate id: dw-source-dependency-cruiser-rules-reference-2026-03-30
- Candidate name: dependency-cruiser Rules Reference
- Experiment date: 2026-03-30
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by codex-architecture-boundary-pass from routed handoff `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md`

- Objective: Determine whether dependency-cruiser can truthfully express one bounded `dw-state` facade boundary proposal without broadening into repo-wide enforcement or misdescribing the current private-file import graph.
- Bounded scope:
- Keep this at one Architecture experiment slice.
- Preserve human review before any later enforcement or broader dependency-policy work.
- Do not open repo-wide dependency-cruiser adoption from this stub alone.
- Inputs:
- dependency-cruiser rules reference exposes `forbidden`, `path`, `pathNot`, schema-validated config, and JavaScript config composition.
- Current repo pressure is narrowly bounded: protect the canonical `shared/lib/dw-state.ts` facade if and only if the requested one-importer boundary matches actual repo imports.
- Expected output:
- One bounded Architecture experiment slice that either materializes the single dw-state facade-boundary proposal or records why the requested boundary is not truthful in current repo state.
- Validation gate(s):
- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before any broader dependency-boundary adoption.
- Failure criteria: Current repo truth shows the requested facade-only importer boundary is false, so a concrete proposal would misdescribe the product.
- Rollback: Keep the result at experiment status and do not integrate any boundary enforcement until the target rule matches current repo truth.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.md`
- Discovery routing record: `discovery/routing-log/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-routing-record.md`
- Next decision: `needs-more-evidence`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `structural`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `no`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md`
