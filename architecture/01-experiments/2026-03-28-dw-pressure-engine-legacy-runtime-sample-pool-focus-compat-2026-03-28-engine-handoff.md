# Legacy Runtime Sample Pool Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-qualified-pool-sample.json`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical Scientify sample output artifacts are retained Runtime-side evidence, but the canonical resolver cannot inspect those sample artifacts directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical sample qualified/degraded pool artifacts as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only:
  - `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-qualified-pool-sample.json`
  - `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-degraded-quality-sample.json`
- Preserve the sample pool artifacts as historical and read-only.
- Do not infer live proof, gate snapshot, or host linkage in this slice.
- Do not map promotion, registry, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime sample qualified pool: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-qualified-pool-sample.json`
- Legacy Runtime sample degraded pool: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-degraded-quality-sample.json`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_sample_pool_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime sample pool compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or inventing live linkage for sample evidence.

## Next decision

- `adopt`
