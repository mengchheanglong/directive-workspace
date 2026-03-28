# OpenMOSS DW Web Host Promotion Go / No-Go Decision 01

Date: 2026-03-27
Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
Candidate name: `OpenMOSS Runtime Orchestration Surface`
Track: Directive Workspace Runtime
Decision status: `keep_parked_at_promotion_readiness`

## Objective

Make one explicit go / no-go decision on whether bounded host-facing promotion review should open now for OpenMOSS against the Directive Workspace web host.

This decision does not:
- open a promotion record
- open runtime execution
- open host integration rollout
- open callable implementation

## Decision target

- Promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- Pre-promotion implementation slice:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-pre-promotion-implementation-slice-01.md`
- Promotion-input package:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-promotion-input-package-01.md`
- Profile/checker decision:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-profile-checker-decision-01.md`
- Compile-contract artifact:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-seam-review-compile-contract-01.md`
- Runtime-to-host contract:
  - `shared/contracts/runtime-to-host.md`
- Promotion contract:
  - `shared/contracts/promotion-contract.md`

## Conditions already satisfied

- OpenMOSS is at `runtime.promotion_readiness.opened`
- the proposed host is explicit:
  - `Directive Workspace web host (frontend/ + hosts/web-host/)`
- the DW web-host pre-promotion implementation slice is explicit
- the promotion-input package is explicit
- the DW web-host seam-review profile/checker family is explicit
- the compile-contract artifact is explicit
- the bounded seam-review host checker now passes

## Conditions still not satisfied

- the shared Runtime truth still reports:
  - `executionState = not executing, not host-integrated, not implemented, not promoted`
- the shared Runtime blockers still include:
  - `runtime_implementation_unopened`
  - `host_facing_promotion_unopened`
- the current host-owned surface is still only a read-only seam-review slice over canonical Runtime truth
- no host-facing integration work beyond that seam-review slice is being proposed
- no promoted runtime status is justified beyond the current non-executing stop

## Decision

Do not open bounded host-facing promotion review now.

Keep OpenMOSS parked at `runtime.promotion_readiness.opened`.

## Why this is the truthful decision

`shared/contracts/runtime-to-host.md` says Runtime-to-host handoff is used when a Runtime slice is ready to move from product-owned planning into host-owned implementation or activation work.

That threshold is still not met here.

The current DW web-host surface is real and useful, but it is still a seam-review surface, not a promoted host-owned runtime implementation. Opening a promotion record now would overstate the meaning of that surface and blur the still-live blocker `runtime_implementation_unopened`.

## What remains out of scope

- promotion record creation
- runtime execution
- host integration rollout
- callable implementation rollout
- automation

## Rollback / no-op

- remove this decision artifact and its reference from the promotion-readiness artifact
- keep OpenMOSS at `runtime.promotion_readiness.opened`
- keep host-facing promotion unopened
