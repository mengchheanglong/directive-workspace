# Legacy Runtime Transformation Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-22-context-pack-async-latency-transformation-record.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical `runtime/legacy-records/*-transformation-record.md` and `*-transformation-proof.json` family is still part of product Runtime history, but the canonical resolver cannot inspect those transformation artifacts directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical transformation record/proof family as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support the historical `*-transformation-record.md` and `*-transformation-proof.json` family only.
- Allow the single older `candidate_id` / `baseline_measurement` JSON variant already present in the repo.
- Keep those transformation artifacts historical and read-only.
- Do not map legacy runtime-slice proof/execution, proof-checklist, registry, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime transformation record: `runtime/legacy-records/2026-03-22-context-pack-async-latency-transformation-record.md`
- Legacy Runtime transformation proof: `runtime/legacy-records/2026-03-22-context-pack-async-latency-transformation-proof.json`
- Legacy Runtime transformation record: `runtime/legacy-records/2026-03-22-v0-normalizer-transformation-record.md`
- Legacy Runtime transformation proof: `runtime/legacy-records/2026-03-22-v0-normalizer-transformation-proof.json`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_transformation_focus_resolves`
- `legacy_runtime_transformation_scope_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime transformation compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or conflating the mixed proof/execution family.

## Next decision

- `adopt`
