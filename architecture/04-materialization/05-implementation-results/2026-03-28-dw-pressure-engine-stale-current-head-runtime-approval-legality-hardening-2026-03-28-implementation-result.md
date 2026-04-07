# Implementation Result: Engine Stale Current-Head Runtime Approval Legality Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Runtime Approval Legality Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: replace stale artifact-local approval wording with an explicit currentHead redirect once Runtime currentHead has advanced past the inspected approval boundary.

## completed tactical slice
- Hardened `shared/lib/dw-state.ts` so stale Runtime approval-boundary artifacts now downgrade `artifactNextLegalStep` to a currentHead redirect when `currentHead` already points to a later Runtime artifact.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for stale Runtime follow-up, record, proof, and capability-boundary artifact-local wording, while preserving the live pending follow-up behavior.

## actual result summary
- Runtime stale-current-head legality is now stricter in one bounded way: inspecting an old Runtime approval-boundary artifact no longer suggests re-approving the old local step after the case has already advanced.

## mechanical success criteria check
- Historical Runtime follow-up, record, proof, and capability-boundary focuses now point to `currentHead` instead of exposing stale local approval wording.
- The live pending Runtime follow-up remains unchanged and still exposes its ordinary artifact-local approval step.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into whole-case blocking.
- This slice does not broaden into generic stale-status cleanup, broken-link scanning, or queue redesign.
- It does not normalize stale-local wording for non-Runtime artifact families.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: stale_runtime_artifact_local_next_step_downgraded, stale_current_head_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state -- runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
- `npm run report:directive-workspace-state -- runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-28-dw-pressure-engine-stale-current-head-runtime-approval-legality-hardening-2026-03-28-implementation-result.md`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the narrow stale-current-head downgrade in `shared/lib/dw-state.ts`, revert the composition assertions, and remove this DEEP case chain if later truth work needs a different artifact-local wording policy.

