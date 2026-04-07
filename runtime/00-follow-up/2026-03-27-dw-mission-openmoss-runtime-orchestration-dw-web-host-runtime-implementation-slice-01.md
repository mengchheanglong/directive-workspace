# OpenMOSS DW Web Host Runtime-Implementation Slice 01

Date: 2026-03-27
Candidate id: `dw-mission-openmoss-runtime-orchestration-2026-03-26`
Candidate name: `OpenMOSS Runtime Orchestration Surface`
Track: Directive Workspace Runtime
Status: `opened_bounded_non_executing_runtime_implementation_slice`

## Objective

Open the first bounded Runtime-implementation slice for OpenMOSS without opening promotion, execution, host integration rollout, or callable implementation rollout.

## Slice boundary

This slice is limited to one host-owned implementation behavior in the Directive Workspace web host:
- render the OpenMOSS seam-review implementation bundle directly on the existing promotion-readiness page
- expose the opened implementation slice, compile contract, promotion-input package, profile/checker decision, and promotion go/no-go decision as explicit navigable product surfaces

This slice does not include:
- promotion record creation
- runtime execution
- host integration rollout
- callable implementation rollout
- automation

## DW web-host ownership

The DW web host owns:
- thin-host detail fields that expose the implementation-bundle artifact paths from the current promotion-readiness artifact
- one bounded implementation-bundle section on the OpenMOSS seam-review page

Affected host-owned files:
- `frontend/src/app.ts`
- `hosts/web-host/data.ts`

## Runtime / Engine ownership

Runtime and Engine continue to own:
- `currentStage`
- `nextLegalStep`
- blocker judgment
- promotion legality
- execution legality
- downstream Runtime progression

## Required pre-promotion inputs

- promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md`
- compile-contract artifact:
  - `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-seam-review-compile-contract-01.md`
- promotion-input package:
  - `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-promotion-input-package-01.md`
- profile/checker decision:
  - `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-profile-checker-decision-01.md`
- promotion go/no-go decision:
  - `runtime/00-follow-up/2026-03-27-dw-mission-openmoss-runtime-orchestration-dw-web-host-promotion-go-no-go-decision-01.md`

## Why this is the smallest useful implementation move

The OpenMOSS seam-review surface already exists, but until this slice the host did not explicitly implement the full pre-promotion Runtime bundle as one coherent product-owned surface.

This slice makes one real host-owned implementation boundary explicit without implying:
- host-facing promotion
- promoted runtime status
- execution or integration rollout

## Proof expectation for this slice

This slice is open only if:
- the OpenMOSS promotion-readiness detail API exposes the implementation-bundle paths
- the OpenMOSS promotion-readiness page renders those bundle links and boundary wording
- the page remains read-only and non-promoting

## Rollback / no-op

- remove this artifact and its reference from the promotion-readiness artifact
- remove the implementation-bundle host display from `frontend/src/app.ts` and `hosts/web-host/data.ts`
- keep OpenMOSS at `runtime.promotion_readiness.opened`
- keep promotion, execution, host integration, and callable implementation closed

