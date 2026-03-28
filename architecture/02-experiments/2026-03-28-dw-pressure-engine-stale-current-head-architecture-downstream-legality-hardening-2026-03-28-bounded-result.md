# Engine Stale Current-Head Architecture Downstream Legality Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28
- Candidate name: Engine Stale Current-Head Architecture Downstream Legality Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: not explicitly recorded in the compact bounded result artifact; reconstructed from bounded start `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that downgrades stale artifact-local next-step wording on downstream Architecture artifacts once `currentHead` has advanced elsewhere.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to stale current-head legality mismatch on `architecture_adoption`, `architecture_implementation_target`, `architecture_implementation_result`, and `architecture_retained`.
- Downgrade stale artifact-local next-step wording for those artifacts when `currentHead` already points to a later or reopened Architecture artifact.
- Do not broaden into handoff, bounded-start, post-consumption evaluation, generic stale-status cleanup, broken-link scanning, or queue redesign.
- Inputs:
- `shared/lib/dw-state.ts` already derives `currentHead` from linked downstream artifacts.
- The shared finalize step already downgrades stale Runtime approval-boundary artifact-local next steps and stale Architecture bounded-result wording.
- Stale Architecture downstream focuses still expose their old local next step even when `currentHead` has already advanced to reopened or later downstream Architecture artifacts.
- Expected output:
- One bounded Architecture slice that makes stale downstream Architecture artifact-local wording truthful without changing case-level continuation truth.
- Validation gate(s):
- `stale_architecture_downstream_next_steps_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave stale downstream Architecture artifacts readable but unchanged if the downgrade cannot stay limited to artifact-local wording.
- Failure criteria: The slice broadens into whole-case blocking, generic stale-status cleanup, or other artifact families.
- Rollback: Revert the narrow stale-current-head downgrade, revert the composition assertions, and delete this DEEP case chain.
- Result summary: Stale downstream Architecture artifacts now point operators to the live `currentHead` instead of still advertising their old local next step after the case has advanced.
- Evidence path:
- Primary evidence path: `shared/lib/dw-state/shared.ts`
- Bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-routing-record.md`
- Closeout decision artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `shared/lib/dw-state/shared.ts`
- `scripts/check-directive-workspace-composition.ts`

## Closeout decision

- Verdict: `adopt`
- Rationale: This slice closes the remaining downstream stale current-head mismatch in the shared resolver while leaving case-level continuation truth and integrity behavior unchanged.
- Review result: `not_run`
- Review score: `n/a`
