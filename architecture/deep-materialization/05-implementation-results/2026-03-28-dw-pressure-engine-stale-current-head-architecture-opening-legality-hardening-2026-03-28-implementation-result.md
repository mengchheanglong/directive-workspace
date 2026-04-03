# Implementation Result: Engine Stale Current-Head Architecture Opening Legality Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Architecture Opening Legality Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: replace stale artifact-local next-step wording with an explicit currentHead redirect once Architecture currentHead has advanced past the inspected opening artifact.

## completed tactical slice
- Hardened `shared/lib/dw-state/shared.ts` so stale Architecture handoff and bounded-start artifacts now downgrade `artifactNextLegalStep` to a currentHead redirect when `currentHead` already points elsewhere.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for stale opening-surface artifact-local wording while preserving the live case-level `nextLegalStep`.

## actual result summary
- Architecture stale-current-head legality is now stricter across the remaining opening-surface local-step family: inspecting old handoff or bounded-start artifacts no longer suggests taking their old local step after the case has already advanced elsewhere.

## mechanical success criteria check
- Stale Architecture handoff and bounded-start focuses now point to `currentHead` instead of exposing stale local next-step wording.
- The live case-level `nextLegalStep` remains unchanged.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not broaden into whole-case blocking.
- This slice does not broaden into post-consumption evaluation wording, generic stale-status cleanup, broken-link scanning, or queue redesign.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: stale_architecture_opening_next_steps_downgraded, stale_current_head_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `shared/lib/dw-state/shared.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state -- architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-engine-handoff.md`
- `npm run report:directive-workspace-state -- architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-start.md`
- `npm run report:directive-workspace-state -- architecture/05-implementation-results/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-implementation-result.md`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the narrow stale-current-head downgrade in `shared/lib/dw-state/shared.ts`, revert the composition assertions, and remove this DEEP case chain if later truth work needs a different artifact-local wording policy.
