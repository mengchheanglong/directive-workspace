# Engine Stale Current-Head Architecture Closure Legality Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28
- Candidate name: Engine Stale Current-Head Architecture Closure Legality Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-review from routed handoff `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that downgrades stale artifact-local next-step wording on historical Architecture integration, consumption, and evaluation artifacts once `currentHead` has advanced elsewhere.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to stale current-head legality mismatch on `architecture_integration_record`, `architecture_consumption_record`, and stale `architecture_post_consumption_evaluation` focuses only.
- Downgrade stale artifact-local next-step wording for closure artifacts when `currentHead` already points to a later or reopened Architecture artifact.
- Do not broaden into generic stale-status cleanup, broken-link scanning, queue redesign, or whole-case blocking.
- Inputs:
- `shared/lib/dw-state.ts` already derives `currentHead` from linked downstream artifacts.
- The shared finalize step already downgrades stale Runtime approval-boundary artifact-local next steps and stale Architecture opening/downstream wording.
- Stale Architecture integration, consumption, and evaluation focuses still expose their old local next step even when `currentHead` has already advanced to reopened or later downstream Architecture artifacts.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `stale_architecture_closure_next_steps_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Revert the narrow stale-current-head downgrade in `shared/lib/dw-state/shared.ts`, revert the composition assertions, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-engine-handoff.md`
