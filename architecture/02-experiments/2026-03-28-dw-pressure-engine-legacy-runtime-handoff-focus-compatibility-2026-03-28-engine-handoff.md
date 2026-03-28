# Legacy Runtime Handoff Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28`
- Source reference: `runtime/handoff/2026-03-22-autoresearch-architecture-to-runtime-handoff.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the workbench already treats the two legacy architecture-to-runtime handoffs as readable historical Runtime artifacts, but the canonical resolver still crashed when focused directly on them.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical state resolver treat the two legacy architecture-to-runtime handoffs as read-only Runtime focus artifacts instead of crashing report resolution.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Support the two legacy `runtime/handoff/*.md` artifacts only.
- Do not map legacy Runtime records, legacy Runtime follow-up execution chains, or old promotion / registry semantics in this slice.

## Inputs

- Legacy Runtime handoff: `runtime/handoff/2026-03-22-autoresearch-architecture-to-runtime-handoff.md`
- Legacy Runtime handoff: `runtime/handoff/2026-03-23-scientify-literature-monitoring-architecture-to-runtime-handoff.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_handoff_focus_resolves`
- `legacy_runtime_handoff_scope_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime handoff compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state.

## Next decision

- `adopt`
