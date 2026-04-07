# Implementation Result: Engine Stale Current-Head Architecture Downstream Legality Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Architecture Downstream Legality Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: replace stale artifact-local next-step wording with an explicit currentHead redirect once Architecture currentHead has advanced past the inspected downstream artifact.

## completed tactical slice
- Hardened `shared/lib/dw-state/shared.ts` so stale Architecture adoption, implementation-target, implementation-result, and retained artifacts now downgrade `artifactNextLegalStep` to a currentHead redirect when `currentHead` already points to a later or reopened Architecture artifact.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for stale downstream Architecture artifact-local wording while preserving the live case-level `nextLegalStep`.

## actual result summary
- Architecture stale-current-head legality is now stricter across the remaining downstream local-step family: inspecting old downstream Architecture artifacts no longer suggests taking their old local step after the case has already advanced elsewhere.

## mechanical success criteria check
- Stale Architecture adoption, implementation-target, implementation-result, and retained focuses now point to `currentHead` instead of exposing stale local next-step wording.
- The live case-level `nextLegalStep` remains unchanged.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into whole-case blocking.
- This slice does not broaden into handoff, bounded-start, post-consumption evaluation, generic stale-status cleanup, broken-link scanning, or queue redesign.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: stale_architecture_downstream_next_steps_downgraded, stale_current_head_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `shared/lib/dw-state/shared.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state -- architecture/02-adopted/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-adopted-planned-next.md`
- `npm run report:directive-workspace-state -- architecture/04-implementation-targets/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-implementation-target.md`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-implementation-result.md`
- `npm run report:directive-workspace-state -- architecture/06-retained/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-retained.md`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-28-dw-pressure-engine-stale-current-head-architecture-downstream-legality-hardening-2026-03-28-implementation-result.md`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the narrow stale-current-head downgrade in `shared/lib/dw-state/shared.ts`, revert the composition assertions, and remove this DEEP case chain if later truth work needs a different artifact-local wording policy.

