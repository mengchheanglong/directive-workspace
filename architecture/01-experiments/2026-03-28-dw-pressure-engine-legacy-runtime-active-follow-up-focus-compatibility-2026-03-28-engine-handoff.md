# Legacy Runtime Active Follow-Up Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28`
- Source reference: `runtime/00-follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the structured legacy Scientify Runtime follow-up already carries a bounded historical contract, but the canonical reader and workbench fallback still misread its active bounded status as if it were missing a deferred re-entry contract.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver and workbench follow-up detail treat the active bounded Scientify Runtime follow-up as read-only historical Runtime state instead of a broken deferred-contract case.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts`, `hosts/web-host/data.ts`, and focused repo checks.
- Support the structured active bounded follow-up at `runtime/00-follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md`.
- Preserve deferred legacy follow-up requirements.
- Do not map legacy Runtime records, legacy Runtime execution history, or old promotion / registry semantics in this slice.

## Inputs

- Legacy Runtime follow-up: `runtime/00-follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current workbench handoff detail fallback: `hosts/web-host/data.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`
- Current frontend host check: `scripts/check-frontend-host.ts`

## Validation gate(s)

- `legacy_runtime_active_follow_up_focus_resolves`
- `legacy_runtime_active_follow_up_scope_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime active follow-up compatibility slice and delete this DEEP case chain if the resolver or workbench detail starts overstating old Runtime continuation state.

## Next decision

- `adopt`
