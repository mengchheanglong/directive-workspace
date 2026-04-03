# Implementation Result: Engine Stale Current-Head Architecture Bounded-Result Legality Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-stale-current-head-architecture-bounded-result-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Architecture Bounded-Result Legality Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-stale-current-head-architecture-bounded-result-legality-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-bounded-result-legality-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-bounded-result-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: replace stale artifact-local next-step wording with an explicit currentHead redirect once Architecture currentHead has advanced past the inspected bounded-result artifact.

## completed tactical slice
- Hardened `shared/lib/dw-state/shared.ts` so stale Architecture bounded-result artifacts now downgrade `artifactNextLegalStep` to a currentHead redirect when `currentHead` already points to a later or reopened Architecture artifact.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for stale Architecture bounded-result artifact-local wording while preserving the live case-level `nextLegalStep`.

## actual result summary
- Architecture stale-current-head legality is now stricter in one bounded way: inspecting an old bounded-result artifact no longer suggests continuing the old local step after the case has already advanced elsewhere.

## mechanical success criteria check
- A stale Architecture bounded-result focus now points to `currentHead` instead of exposing stale local next-step wording.
- The live case-level `nextLegalStep` remains unchanged.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into whole-case blocking.
- This slice does not broaden into generic stale-status cleanup, broken-link scanning, or queue redesign.
- It does not normalize stale-local wording for other Architecture artifact families.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: stale_architecture_bounded_result_next_step_downgraded, stale_current_head_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `shared/lib/dw-state/shared.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state -- architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-28-dw-pressure-engine-stale-current-head-architecture-bounded-result-legality-hardening-2026-03-28-implementation-result.md`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the narrow stale-current-head downgrade in `shared/lib/dw-state/shared.ts`, revert the composition assertions, and remove this DEEP case chain if later truth work needs a different artifact-local wording policy.
