# OpenMOSS DW Web Host Pre-Promotion Implementation Slice 01

Date: 2026-03-27
Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
Candidate name: `OpenMOSS Runtime Orchestration Surface`
Track: Directive Workspace Runtime
Status: `explicit_non_promoting_slice`

## Objective

Define one bounded DW web-host implementation slice that is truthful before any host-facing promotion review opens.

This slice exists to make the pre-promotion host boundary explicit without opening:
- host-facing promotion
- callable implementation
- host integration
- runtime execution

## Source boundary

- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-routing-record.md`

## Runtime-owned output to expose

The bounded output exposed to the DW web host is one non-executing OpenMOSS seam-review payload derived from canonical Directive Workspace truth:
- candidate identity
- Runtime objective
- currentStage
- nextLegalStep
- proposedHost
- executionState
- promotionReadinessBlockers
- linked Runtime artifact paths

Runtime and Engine remain the only owners of:
- lifecycle truth
- blocker judgment
- legality of downstream Runtime progression
- promotion, implementation, integration, and execution decisions

## DW web-host owned implementation slice

The DW web host owns one bounded product slice only:
- one thin-host data read that resolves the OpenMOSS seam-review payload from canonical Runtime truth
- one Directive Workspace frontend/web-host detail surface that renders that payload for operator-facing review

This slice is truthful because it:
- uses the existing product-owned frontend/web-host surface
- keeps the frontend thin
- does not duplicate Runtime or Engine decision logic
- does not imply host-facing promotion, callable implementation, host integration, or execution

## Required inputs for this slice

- canonical state from `shared/lib/dw-state.ts`
- current OpenMOSS promotion-readiness artifact
- linked Runtime proof, runtime capability boundary, runtime record, follow-up, and Discovery routing artifacts
- existing DW frontend/web-host seam-review surface
- compile-contract artifact:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-seam-review-compile-contract-01.md`
- promotion-input package:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-promotion-input-package-01.md`
- selected profile/checker decision:
  - `runtime/follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-profile-checker-decision-01.md`

## What this slice does not open

This slice does not create:
- a promotion record
- runtime execution
- host integration rollout
- callable implementation rollout

## Why this is the smallest truthful pre-promotion slice

OpenMOSS already has a real non-executing Runtime head and Directive Workspace already has a real product-owned web host. The smallest truthful host-owned implementation slice is therefore the existing operator-facing seam-review surface that consumes canonical Runtime truth without attempting to activate the Runtime candidate.

Anything broader would overstate the current case.

## Rollback / no-op

- Remove this implementation-slice artifact and the reference to it from the promotion-readiness artifact.
- Keep OpenMOSS at `runtime.promotion_readiness.opened`.
- Do not open host-facing promotion, callable implementation, host integration, or runtime execution.
