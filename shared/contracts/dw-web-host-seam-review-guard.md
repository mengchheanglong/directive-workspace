# DW Web-Host Seam Review Guard

Quality gate profile: `dw_web_host_seam_review_guard/v1`  
Promotion profile family: `bounded_dw_web_host_seam_review`  
Proof shape: `dw_web_host_seam_review_snapshot/v1`  
Primary host checker: `npm run check:directive-dw-web-host-runtime-seam-review`

## Purpose

Define the bounded pre-promotion host contract for the Directive Workspace web-host seam-review surface over canonical Runtime truth.

This guard applies only to read-only seam review. It does not open:
- host-facing promotion
- runtime execution
- callable implementation
- host integration rollout

## Scope

- applies only to Runtime promotion records that would later target the Directive Workspace web host for the OpenMOSS-style seam-review surface
- applies only when the proposed host-owned slice is one thin-host data read plus one operator-facing Runtime seam-review page
- requires Runtime and Engine to remain the owners of currentStage, nextLegalStep, blockers, legality, and downstream progression rules

## Pass Conditions

- the web-host detail route resolves through the Directive Workspace web host
- the host detail payload exposes canonical Runtime truth for:
  - `currentStage`
  - `nextLegalStep`
  - `proposedHost`
  - `executionState`
  - `promotionReadinessBlockers`
- the surface remains explicitly non-promoting and non-executing
- the host wording keeps Runtime/Engine ownership explicit and does not expose fake promotion, execution, or integration controls
- the selected compile contract artifact, runtime permissions profile, and safe output scope remain bounded to the seam-review slice only

## Required Host Artifacts

- current Runtime promotion-readiness artifact for the candidate
- current DW web-host compile-contract artifact for the seam-review slice
- the web-host route:
  - `/runtime-promotion-readiness/view?path=...`
- the thin-host detail payload:
  - `/api/runtime-promotion-readiness/detail?path=...`

## Required Host Commands

- `npm run check:directive-dw-web-host-runtime-seam-review`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`

## Required Evidence

- promotion record declares:
  - `Quality gate profile: dw_web_host_seam_review_guard/v1`
  - `Promotion profile family: bounded_dw_web_host_seam_review`
  - `Proof shape: dw_web_host_seam_review_snapshot/v1`
  - `Primary host checker: npm run check:directive-dw-web-host-runtime-seam-review`
- compile-contract artifact pins:
  - `frontend/src/app.ts`
  - `hosts/web-host/server.ts`
  - `hosts/web-host/data.ts`
- runtime permissions profile remains read-only
- safe output scope remains limited to seam-review payloads and page rendering

## Decision Rules

1. This guard may only validate a non-executing seam-review slice.
2. Passing this guard does not imply host-facing promotion is open.
3. Passing this guard does not imply callable implementation, host integration, or runtime execution are allowed.
4. Any later promotion record must still declare explicit rollback and remain bounded to the seam-review slice.

## Validation Hooks

- `npm run check:directive-dw-web-host-runtime-seam-review`
- `npm run check:frontend-host`

## Canonical Inventory

- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\PROMOTION_PROFILES.json`

