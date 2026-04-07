# OpenMOSS DW Web-Host Seam-Review Compile Contract 01

Date: 2026-03-27
Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
Candidate name: `OpenMOSS Runtime Orchestration Surface`
Track: Directive Workspace Runtime
Status: `explicit_non_promoting_compile_contract`

## Objective

Pin the exact host-owned compile boundary for the existing OpenMOSS DW web-host seam-review slice.

This compile contract is pre-promotion only. It does not open:
- host-facing promotion
- callable implementation
- host integration rollout
- runtime execution

## Source boundary

- Promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- Pre-promotion implementation slice:
  - `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-pre-promotion-implementation-slice-01.md`
- Promotion-input package:
  - `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-promotion-input-package-01.md`

## Host-owned files pinned by this contract

- `frontend/src/app.ts`
- `hosts/web-host/server.ts`
- `hosts/web-host/data.ts`

## Host-owned routes pinned by this contract

- view route:
  - `/runtime-promotion-readiness/view?path=runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- detail payload route:
  - `/api/runtime-promotion-readiness/detail?path=runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`

## Canonical Runtime/Engine truth inputs

- `engine/state/index.ts`
- `engine/workspace-truth.ts`
- the current OpenMOSS promotion-readiness artifact
- linked Runtime capability boundary / proof / record / follow-up / Discovery routing artifacts already referenced from that head

The host must render these inputs as read-only product truth. It must not infer or own downstream Runtime legality.

## Runtime permissions profile

`read_only_lane = canonical Directive Workspace state plus linked Runtime artifacts through the existing DW thin-host reader; write_lane = none`

## Safe output scope

Bounded host output is limited to:
- the OpenMOSS seam-review page rendered by the Directive Workspace web host
- the thin-host JSON detail payload for that page
- bounded presentation updates inside:
  - `frontend/src/app.ts`
  - `hosts/web-host/server.ts`
  - `hosts/web-host/data.ts`

Explicitly not allowed:
- runtime execution output
- host integration writes
- background jobs
- task creation
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
- Supporting host checks:
  - `npm run check:frontend-host`
  - `npm run check:directive-workspace-composition`

The required snapshot for this bounded seam-review slice is:
- the view route resolves through the DW web host
- the detail payload resolves through the DW web host
- `currentStage` matches the shared Runtime truth
- `nextLegalStep` matches the shared Runtime truth
- `proposedHost` matches the current proposed host
- `promotionReadinessBlockers` remain explicit
- no host-facing promotion, execution, or integration controls are implied

## Rollback / no-op

- remove this compile-contract artifact and its references from the OpenMOSS pre-promotion bundle
- keep OpenMOSS at `runtime.promotion_readiness.opened`
- keep host-facing promotion, callable implementation, host integration, and runtime execution closed
