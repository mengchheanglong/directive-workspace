# Engine Stale Current-Head Runtime Approval Legality Hardening Bounded Architecture Result

- Candidate id: dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28
- Candidate name: Engine Stale Current-Head Runtime Approval Legality Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: not explicitly recorded in the compact bounded result artifact; reconstructed from bounded start `architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that downgrades stale artifact-local approval steps on historical Runtime approval-boundary artifacts once `currentHead` has advanced downstream.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to stale current-head legality mismatch on Runtime approval-boundary artifacts only.
- Downgrade stale artifact-local next steps for Runtime follow-up, Runtime record, Runtime proof, and Runtime capability-boundary artifacts when `currentHead` already points to a later Runtime artifact.
- Do not broaden into generic stale-status cleanup, broken-link scanning, queue redesign, or Architecture/Discovery stale-local semantics.
- Inputs:
- `shared/lib/dw-state.ts` already derives `currentHead` from linked downstream artifacts.
- Historical Runtime approval surfaces already reject repeated downstream approval through openers and frontend approval flags.
- The shared resolver still exposes the old artifact-local approval step on those stale Runtime artifacts, even when `currentHead` is promotion-readiness.
- Expected output:
- One bounded Architecture slice that makes stale Runtime artifact-local approval wording truthful without changing case-level continuation truth.
- Validation gate(s):
- `stale_runtime_artifact_local_next_step_downgraded`
- `stale_current_head_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave stale Runtime approval-boundary artifacts readable but unchanged if the downgrade cannot stay limited to artifact-local wording.
- Failure criteria: The slice broadens into whole-case blocking, generic stale-status cleanup, or other lane semantics.
- Rollback: Revert the narrow stale-current-head downgrade, revert the composition assertions, and delete this DEEP case chain.
- Result summary: Stale Runtime approval-boundary artifacts now point operators to the live `currentHead` instead of still advertising the old local approval step after the case has advanced.
- Evidence path:
- Primary evidence path: `shared/lib/dw-state.ts`
- Bounded start: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-25T03-00-00-000Z-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-6b3acde0.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-25T03-00-00-000Z-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-6b3acde0.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`

## Closeout decision

- Verdict: `adopt`
- Rationale: This slice closes one real stale current-head mismatch in the shared resolver while leaving case-level continuation truth and integrity behavior unchanged.
- Review result: `not_run`
- Review score: `n/a`

