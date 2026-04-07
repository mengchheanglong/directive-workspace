# Legacy Runtime Registry Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28`
- Source reference: `runtime/08-registry/2026-03-20-agentics-registry-entry.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical `runtime/08-registry/*-registry-entry.md` family is still part of product Runtime history, but the canonical resolver cannot inspect those registry entries directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical `runtime/08-registry/*-registry-entry.md` family as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support the historical `*-registry-entry.md` family only.
- Keep those registry entries historical and read-only.
- Do not map legacy promotion records, proof execution records, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime registry entry: `runtime/08-registry/2026-03-20-agentics-registry-entry.md`
- Legacy Runtime registry entry: `runtime/08-registry/2026-03-21-promptfoo-registry-entry.md`
- Legacy Runtime registry entry: `runtime/08-registry/2026-03-22-v0-normalizer-transformation-registry-entry.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_registry_focus_resolves`
- `legacy_runtime_registry_scope_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime registry compatibility slice and delete this DEEP case chain if the resolver starts overstating old callable Runtime continuation state.

## Next decision

- `adopt`
