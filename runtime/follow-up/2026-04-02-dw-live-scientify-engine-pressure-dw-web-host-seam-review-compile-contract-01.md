# Scientify Live Pressure DW Web-Host Seam-Review Compile Contract 01

Date: 2026-04-02
Candidate id: `dw-live-scientify-engine-pressure-2026-03-24`
Candidate name: `Scientify Mixed Adoption Target Pressure`
Track: Directive Workspace Runtime
Status: `explicit_non_promoting_dw_web_host_compile_contract`

## Objective

Pin the exact host-owned compile boundary for the first bounded Directive Workspace web-host seam-review preparation slice for this case.

This compile contract is pre-promotion only. It does not open:
- host-facing promotion
- a promotion record
- registry acceptance
- host integration rollout
- runtime execution
- promotion automation

## Source boundary

- Promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- Promotion specification artifact:
  - `runtime/06-promotion-specifications/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-specification.json`
- Promotion-input package:
  - `runtime/follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-promotion-input-package-01.md`
- Profile/checker decision:
  - `runtime/follow-up/2026-04-02-dw-live-scientify-engine-pressure-dw-web-host-profile-checker-decision-01.md`
- Manual seam-open decision:
  - `control/logs/2026-04/2026-04-02-open-scientify-live-pressure-dw-web-host-manual-promotion-seam.md`
- Contract guard:
  - `shared/contracts/dw-web-host-seam-review-guard.md`

## Host-owned files pinned by this contract

- `frontend/src/app.ts`
- `hosts/web-host/server.ts`
- `hosts/web-host/data.ts`

## Host-owned routes pinned by this contract

- view route:
  - `/runtime-promotion-readiness/view?path=runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- detail payload route:
  - `/api/runtime-promotion-readiness/detail?path=runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`

## Canonical Runtime/Engine truth inputs

- `shared/lib/dw-state.ts`
- `engine/workspace-truth.ts`
- the current Scientify live-pressure promotion-readiness artifact
- the linked Runtime capability boundary, Runtime proof, Runtime record, Runtime follow-up, and Discovery routing artifacts already referenced from that head
- the current generated promotion specification

The host must render these inputs as read-only product truth. It must not infer or own downstream Runtime legality.

## Runtime permissions profile

`read_only_lane = canonical Directive Workspace state plus linked Runtime artifacts through the existing DW thin-host reader; write_lane = none`

## Safe output scope

Bounded host output is limited to:
- the Scientify live-pressure seam-review page rendered by the Directive Workspace web host
- the thin-host JSON detail payload for that page
- bounded presentation updates inside:
  - `frontend/src/app.ts`
  - `hosts/web-host/server.ts`
  - `hosts/web-host/data.ts`

Explicitly not allowed:
- promotion-record creation
- registry acceptance
- runtime execution output
- host integration writes
- background jobs
- automation
- callable activation

## Sanitize policy

Render-only product presentation:
- escape artifact text for display
- keep raw artifact content informational only
- do not treat displayed text as execution input
- do not introduce frontend-owned progression decisions

## Proof / quality-gate expectations for this slice

- Quality gate profile:
  - `dw_web_host_seam_review_guard/v1`
- Promotion profile family:
  - `bounded_dw_web_host_seam_review`
- Proof shape:
  - `dw_web_host_seam_review_snapshot/v1`
- Primary host checker:
  - `npm run check:directive-dw-web-host-runtime-seam-review`
- Focused compile-contract checker:
  - `npm run check:directive-scientify-dw-web-host-seam-review-compile-contract`
- Focused profile/checker decision:
  - `npm run check:directive-scientify-dw-web-host-profile-checker-decision`
- Focused input-package checker:
  - `npm run check:directive-scientify-dw-web-host-promotion-input-package`
- Supporting checks:
  - `npm run check:directive-scientify-dw-web-host-retarget`
  - `npm run check:runtime-promotion-assistance`
  - focused `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`

The required snapshot for this bounded seam-review slice is:
- the view route resolves through the Directive Workspace web host
- the detail payload resolves through the Directive Workspace web host
- `currentStage` matches the shared Runtime truth
- `nextLegalStep` matches the shared Runtime truth
- `proposedHost` matches the current proposed host
- `promotionReadinessBlockers` remain explicit
- no host-facing promotion, registry acceptance, execution, or integration controls are implied

## Rollback / no-op

- remove this compile-contract artifact and its references from the Scientify live-pressure promotion-readiness artifact
- remove the linked promotion-input package artifact
- keep the case at `runtime.promotion_readiness.opened`
- keep host-facing promotion, registry acceptance, host integration, runtime execution, and promotion automation closed
