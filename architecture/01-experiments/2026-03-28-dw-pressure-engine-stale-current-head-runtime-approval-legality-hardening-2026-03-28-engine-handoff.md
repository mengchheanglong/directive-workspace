# Engine Stale Current-Head Runtime Approval Legality Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28`
- Source reference: `shared/lib/dw-state.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-25T03-00-00-000Z-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-6b3acde0.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-25T03-00-00-000Z-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-6b3acde0.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Integrity gate: `engine/workspace-truth.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the resolver already derives a stronger `currentHead` than the inspected Runtime artifact, but stale Runtime approval-boundary artifacts still advertise their old artifact-local next step. One bounded resolver-side downgrade would stop those artifacts from presenting a no-longer-satisfiable approval action while leaving the live case-level next step intact.

## Objective

Open one bounded DEEP Architecture slice that downgrades stale artifact-local approval steps on historical Runtime approval-boundary artifacts once `currentHead` has advanced downstream.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to stale current-head legality mismatch on Runtime approval-boundary artifacts only.
- Downgrade stale artifact-local next steps for Runtime follow-up, Runtime record, Runtime proof, and Runtime capability-boundary artifacts when `currentHead` already points to a later Runtime artifact.
- Do not broaden into generic stale-status cleanup, broken-link scanning, queue redesign, or Architecture/Discovery stale-local semantics.

## Inputs

- `shared/lib/dw-state.ts` already derives `currentHead` from linked downstream artifacts.
- Historical Runtime approval surfaces already reject repeated downstream approval through openers and frontend approval flags.
- The shared resolver still exposes the old artifact-local approval step on those stale Runtime artifacts, even when `currentHead` is promotion-readiness.

## Validation gate(s)

- `stale_runtime_artifact_local_next_step_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the narrow stale-current-head downgrade in `shared/lib/dw-state.ts`, revert the composition assertions, and delete this DEEP case chain.

## Next decision

- `adopt`
