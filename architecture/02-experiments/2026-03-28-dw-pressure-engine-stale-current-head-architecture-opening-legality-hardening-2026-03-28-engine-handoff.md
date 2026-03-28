# Engine Stale Current-Head Architecture Opening Legality Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28`
- Source reference: `shared/lib/dw-state/shared.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-real-gpt-researcher-engine-handoff-2026-03-24-3e8aed50.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-routing-record.md`
- Primary truth surface: `shared/lib/dw-state/shared.ts`
- Public entrypoint: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Integrity gate: `engine/workspace-truth.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the resolver already derives a stronger `currentHead` than the inspected Architecture opening artifacts, but stale handoff and bounded-start focuses still advertise their old artifact-local next step. One bounded resolver-side downgrade would stop those artifacts from presenting a no-longer-satisfiable local action while leaving the live case-level next step intact.

## Objective

Open one bounded DEEP Architecture slice that downgrades stale artifact-local next-step wording on historical Architecture handoff and bounded-start artifacts once `currentHead` has advanced elsewhere.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to stale current-head legality mismatch on `architecture_handoff` and `architecture_bounded_start` only.
- Downgrade stale artifact-local next-step wording for opening artifacts when `currentHead` already points to a later or reopened Architecture artifact.
- Do not broaden into generic stale-status cleanup, broken-link scanning, queue redesign, or other Architecture artifact families.

## Inputs

- `shared/lib/dw-state.ts` already derives `currentHead` from linked downstream artifacts.
- The shared finalize step already downgrades stale Runtime approval-boundary artifact-local next steps and stale Architecture bounded-result/downstream wording.
- Stale Architecture handoff and bounded-start focuses still expose their old local next step even when `currentHead` has already advanced to reopened or later downstream Architecture artifacts.

## Validation gate(s)

- `stale_architecture_opening_next_steps_downgraded`
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
