# Legacy Runtime Follow-up Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28`
- Source reference: `runtime/00-follow-up/2026-03-20-cli-anything-runtime-follow-up-record.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the host already treats the deferred CLI-anything follow-up as a readable historical Runtime artifact, but the canonical resolver still crashed when focused directly on it.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical state resolver treat the deferred legacy CLI-anything Runtime follow-up as a read-only Runtime focus instead of crashing report resolution.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Support the deferred legacy Runtime follow-up only.
- Do not map legacy Runtime records, legacy Runtime handoffs, or old execution/promotion semantics in this slice.

## Inputs

- Historical deferred Runtime follow-up: `runtime/00-follow-up/2026-03-20-cli-anything-runtime-follow-up-record.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_follow_up_focus_resolves`
- `legacy_runtime_follow_up_route_truth_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime follow-up compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state.

## Next decision

- `adopt`
