# OpenMOSS DW Web Host Promotion-Input Package 01

Date: 2026-03-27
Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
Candidate name: `OpenMOSS Runtime Orchestration Surface`
Track: Directive Workspace Runtime
Status: `explicit_non_promoting_input_bundle`

## Objective

Define the bounded promotion-input package for the existing DW web-host pre-promotion slice so the remaining pre-promotion definition work is explicit in repo truth.

This package makes the pre-promotion inputs explicit only. It does not:
- open a promotion record
- open runtime execution
- open host integration rollout
- open callable implementation

## Source boundary

- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- Pre-promotion implementation slice: `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-pre-promotion-implementation-slice-01.md`
- Compile-contract artifact: `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-seam-review-compile-contract-01.md`
- Profile/checker decision: `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-profile-checker-decision-01.md`
- Current proposed host: `Directive Workspace web host (frontend/ + hosts/web-host/)`

## Explicit compile-contract artifact for this slice

The compile-contract artifact for this slice is now explicit at:
- `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-seam-review-compile-contract-01.md`

It stays bounded to:
- one thin-host data read over canonical Runtime truth
- one OpenMOSS seam-review detail surface in the Directive Workspace web host/frontend pair

It pins:
- the host-owned files or entrypoints affected:
  - `frontend/src/app.ts`
  - `hosts/web-host/server.ts`
  - `hosts/web-host/data.ts`
- the read-only route/view surface for the OpenMOSS seam review
- the canonical truth inputs consumed from Runtime/Engine
- an explicit statement that no Runtime progression logic moves into the frontend or host layer

## Explicit runtime permissions profile for this slice

The explicit permissions profile for this slice is:

`read_only_lane = canonical Directive Workspace state plus linked Runtime artifacts through the existing DW thin-host reader; write_lane = none`

This remains read-only and product-local:
- read canonical Directive Workspace state and linked Runtime artifacts
- serve thin-host JSON and the frontend page for the seam-review surface

It must not include:
- runtime execution
- host integration writes
- task creation
- background jobs
- automation
- network-triggered capability activation

## Explicit safe output scope for this slice

The explicit safe output scope for this slice is limited to:
- the OpenMOSS seam-review page in Directive Workspace frontend/web-host
- thin-host response payloads for that page
- bounded presentation updates in:
  - `frontend/src/app.ts`
  - `hosts/web-host/server.ts`
  - `hosts/web-host/data.ts`

It must not expand to:
- host integration rollout
- runtime execution output
- callable runtime activation
- promotion automation

## Explicit proof / quality-gate expectations for this slice

The bounded profile/checker choice is now explicit:
- `Quality gate profile = dw_web_host_seam_review_guard/v1`
- `Promotion profile family = bounded_dw_web_host_seam_review`
- `Proof shape = dw_web_host_seam_review_snapshot/v1`
- `Primary host checker = npm run check:directive-dw-web-host-runtime-seam-review`
- contract path:
  - `shared/contracts/dw-web-host-seam-review-guard.md`

Supporting checks that remain relevant:
- `npm run check`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`
- focused `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`

## Why this package is still non-promoting

This package only makes the bounded pre-promotion inputs inspectable.

It does not mean:
- host-facing promotion is open
- runtime implementation is open
- host integration is open
- runtime execution is open

## Rollback / no-op

- Remove this promotion-input package artifact and the reference to it from the promotion-readiness artifact.
- Keep OpenMOSS at `runtime.promotion_readiness.opened`.
- Leave host-facing promotion, callable implementation, host integration, and runtime execution closed.
