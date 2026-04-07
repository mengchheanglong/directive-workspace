# Engine Stale Current-Head Architecture Downstream Legality Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28`
- Source reference: `shared/lib/dw-state/shared.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-routing-record.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Shared finalize helper: `shared/lib/dw-state/shared.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Integrity gate: `engine/workspace-truth.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the resolver now handles stale Architecture bounded-result wording correctly, but the same stronger `currentHead` still loses against stale Architecture adoption, implementation-target, implementation-result, and retained artifact-local next steps. One bounded downstream-family downgrade would remove that remaining overstatement without changing case-level continuation truth.

## Objective

Open one bounded DEEP Architecture slice that downgrades stale artifact-local next-step wording on downstream Architecture artifacts once `currentHead` has advanced elsewhere.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to stale current-head legality mismatch on `architecture_adoption`, `architecture_implementation_target`, `architecture_implementation_result`, and `architecture_retained`.
- Downgrade stale artifact-local next-step wording for those artifacts when `currentHead` already points to a later or reopened Architecture artifact.
- Do not broaden into handoff, bounded-start, post-consumption evaluation, generic stale-status cleanup, broken-link scanning, or queue redesign.

## Inputs

- `shared/lib/dw-state.ts` already derives `currentHead` from linked downstream artifacts.
- The shared finalize step already downgrades stale Runtime approval-boundary artifact-local next steps and stale Architecture bounded-result wording.
- Stale Architecture downstream focuses still expose their old local next step even when `currentHead` has already advanced to reopened or later downstream Architecture artifacts.

## Validation gate(s)

- `stale_architecture_downstream_next_steps_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the narrow stale-current-head downgrade in `shared/lib/dw-state/shared.ts`, revert the composition assertions, and delete this DEEP case chain.

## Next decision

- `adopt`
