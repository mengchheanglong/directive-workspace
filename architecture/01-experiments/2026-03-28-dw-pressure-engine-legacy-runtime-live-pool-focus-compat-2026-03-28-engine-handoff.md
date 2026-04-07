# Legacy Runtime Live Pool Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-live-pool-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-qualified-pool.json`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical Scientify live literature-monitoring outputs are retained Runtime evidence, but the canonical resolver cannot inspect those live pool artifacts directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical live qualified/degraded pool artifacts as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only:
  - `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-qualified-pool.json`
  - `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-degraded-pool.json`
- Preserve the live pool artifacts as historical and read-only.
- Do not map the sample JSON artifacts as first-class Runtime focuses in this slice.
- Do not map promotion, registry, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime live qualified pool: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-qualified-pool.json`
- Legacy Runtime live degraded pool: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-degraded-pool.json`
- Linked legacy Runtime live-fetch gate snapshot: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-fetch-gate-snapshot.json`
- Linked legacy Runtime live-fetch proof: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-02-live-fetch-proof.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_live_pool_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime live pool compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or treating sample JSON artifacts as workflow heads.

## Next decision

- `adopt`
