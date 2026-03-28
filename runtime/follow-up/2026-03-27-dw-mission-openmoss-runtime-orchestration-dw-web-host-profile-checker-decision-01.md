# OpenMOSS DW Web Host Profile / Checker Decision 01

Date: 2026-03-27
Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
Candidate name: `OpenMOSS Runtime Orchestration Surface`
Track: Directive Workspace Runtime
Decision status: `bounded_web_host_seam_review_profile_selected`

## Objective

Record the bounded profile/checker decision for the existing DW web-host pre-promotion seam-review slice.

This is a profile/checker decision only. It does not:
- open a promotion record
- open runtime execution
- open host integration
- open callable implementation

## Decision target

- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- Pre-promotion implementation slice: `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-pre-promotion-implementation-slice-01.md`
- Promotion-input package: `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-promotion-input-package-01.md`
- Compile-contract artifact: `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-seam-review-compile-contract-01.md`
- Proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`

## Existing catalog audit

Profiles reviewed from `runtime/PROMOTION_PROFILES.json`:
- `browser_smoke_guard/v1`
- `behavior_preserving_transformation_guard/v1`
- `promotion_quality_gate/v1`
- `agent_eval_guard/v1`
- `ao_cli_runtime_guard/v1`
- `workflow_operator_import_guard/v1`
- `design_review_skill_guard/v1`
- `context_operator_import_guard/v1`
- `skill_lifecycle_guard/v1`
- `legacy_live_runtime_guard/v1`

## Why existing profiles do not fit

### `browser_smoke_guard/v1`
Not a fit.
- It expects smoke report artifacts, passed/failed browser flows, screenshot paths, and a browser-smoke proof shape.
- The current OpenMOSS DW web-host slice is a read-only seam-review surface, not a browser automation lane and not a smoke-driven rollout candidate.

### `behavior_preserving_transformation_guard/v1`
Not a fit.
- It is for transformation proof artifacts where behavior is preserved while an implementation changes.
- The current slice is not yet a transformation execution slice and does not have a host-checked transformation proof artifact.

### `promotion_quality_gate/v1`
Not a fit.
- It is for callable claims with quality thresholds like coverage/evidence/citation metrics.
- The current slice is not a callable surface and does not have that proof shape.

### Import / eval / AO CLI / legacy-live profiles
Not a fit.
- These families assume import-pack behavior, eval behavior, AO CLI behavior, or already-live runtime normalization.
- The current slice is a bounded DW web-host seam-review surface over canonical Runtime truth.

## Decision

No existing cataloged promotion profile/checker truthfully fits this slice.

The bounded decision is therefore explicit now:
- create and select `dw_web_host_seam_review_guard/v1`
- selected family:
  - `bounded_dw_web_host_seam_review`
- selected proof shape:
  - `dw_web_host_seam_review_snapshot/v1`
- selected primary host checker:
  - `npm run check:directive-dw-web-host-runtime-seam-review`
- selected contract:
  - `shared/contracts/dw-web-host-seam-review-guard.md`

## What can be said now without overstating readiness

This selected bounded family validates that:
- the seam-review route resolves through the DW web host
- the rendered surface reflects canonical Runtime truth
- blocker / next-step / host-boundary language stays explicit
- no fake Runtime controls are exposed

Existing supporting checks that remain relevant:
- `npm run check`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`
- focused `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`

## What remains out of scope

- opening promotion
- opening runtime execution
- opening host integration rollout
- opening callable implementation

## Rollback / no-op

- Remove this decision artifact and its reference from the promotion-readiness artifact.
- Keep OpenMOSS at `runtime.promotion_readiness.opened`.
- Keep profile/checker selection unresolved.
