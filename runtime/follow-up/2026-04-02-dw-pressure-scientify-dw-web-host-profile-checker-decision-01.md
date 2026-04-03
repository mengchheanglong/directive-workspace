# Scientify Pressure DW Web-Host Profile / Checker Decision 01

Date: 2026-04-02
Candidate id: `dw-pressure-scientify-2026-03-25`
Candidate name: `Scientify Runtime Generalization Run`
Track: Directive Workspace Runtime
Decision status: `bounded_dw_web_host_profile_selected`

## Objective

Record the bounded profile/checker decision for the existing Directive Workspace web-host seam-review preparation slice.

This is a profile/checker decision only. It does not:
- open a promotion record
- create a registry entry
- open runtime execution
- open host integration
- open automation

## Decision target

- Promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-readiness.md`
- Promotion-input package:
  - `runtime/follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-promotion-input-package-01.md`
- Compile-contract artifact:
  - `runtime/follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-seam-review-compile-contract-01.md`
- Proposed host:
  - `Directive Workspace web host (frontend/ + hosts/web-host/)`

## Existing catalog audit

Profile reviewed from `runtime/PROMOTION_PROFILES.json`:
- `dw_web_host_seam_review_guard/v1`

## Why this existing profile fits

`dw_web_host_seam_review_guard/v1` is the truthful bounded fit because:
- it is already defined for bounded non-executing Directive Workspace web-host seam-review surfaces
- it already resolves to the correct contract:
  - `shared/contracts/dw-web-host-seam-review-guard.md`
- it already resolves to the correct primary host checker:
  - `npm run check:directive-dw-web-host-runtime-seam-review`
- its proof shape matches the current one-case surface:
  - read-only seam review over canonical Runtime truth
  - explicit blocker and next-step visibility
  - no fake promotion, execution, or integration controls

## Decision

The bounded decision for this one case is now explicit:
- selected quality gate profile:
  - `dw_web_host_seam_review_guard/v1`
- selected family:
  - `bounded_dw_web_host_seam_review`
- selected proof shape:
  - `dw_web_host_seam_review_snapshot/v1`
- selected primary host checker:
  - `npm run check:directive-dw-web-host-runtime-seam-review`
- selected contract:
  - `shared/contracts/dw-web-host-seam-review-guard.md`
- selected focused case checker:
  - `npm run check:directive-pressure-scientify-dw-web-host-profile-checker-decision`

## What can be said now without overstating readiness

This selected bounded family validates that:
- the seam-review route resolves through the Directive Workspace web host
- the rendered surface reflects canonical Runtime truth
- blocker, next-step, and host-boundary language stay explicit
- the one-case compile contract and input package remain bounded and non-promoting
- no fake promotion, registry, execution, or integration controls are exposed

Supporting checks that remain relevant:
- `npm run check:directive-pressure-scientify-dw-web-host-seam-review-compile-contract`
- `npm run check:directive-pressure-scientify-dw-web-host-promotion-input-package`
- `npm run check:directive-pressure-scientify-dw-web-host-retarget`
- `npm run check:runtime-promotion-assistance`
- focused `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-readiness.md`

## What remains out of scope

- opening a promotion record
- creating a registry entry
- opening runtime execution
- opening host integration
- opening automation

## Rollback / no-op

- remove this decision artifact and its references from the promotion-readiness artifact
- keep the existing compile-contract and input-package artifacts only
- keep the case at `runtime.promotion_readiness.opened`
