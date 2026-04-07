# Scientify Pressure DW Web-Host Runtime-Implementation Slice 01

Date: 2026-04-02
Candidate id: `dw-pressure-scientify-2026-03-25`
Candidate name: `Scientify Runtime Generalization Run`
Track: Directive Workspace Runtime
Status: `opened_bounded_non_executing_runtime_implementation_slice`

## Objective

Open the first bounded Runtime-implementation slice for Scientify pressure without opening promotion, execution, host integration rollout, registry acceptance, or automation.

## Slice boundary

This slice is limited to one host-owned implementation behavior in the Directive Workspace web host:
- render the Scientify pressure implementation bundle directly on the existing promotion-readiness page
- expose the opened implementation slice, compile contract, promotion-input package, and profile/checker decision as explicit navigable product surfaces

This slice does not include:
- promotion record creation
- registry acceptance
- runtime execution
- host integration rollout
- automation

## DW web-host ownership

The DW web host owns:
- thin-host detail fields that expose the implementation-bundle artifact paths from the current promotion-readiness artifact
- one bounded implementation-bundle section on the Scientify pressure promotion-readiness page

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
  - `runtime/05-promotion-readiness/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-readiness.md`
- compile-contract artifact:
  - `runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-seam-review-compile-contract-01.md`
- promotion-input package:
  - `runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-promotion-input-package-01.md`
- profile/checker decision:
  - `runtime/00-follow-up/2026-04-02-dw-pressure-scientify-dw-web-host-profile-checker-decision-01.md`

## Why this is the smallest useful implementation move

The Scientify pressure seam-review surface already exists generically in the Directive Workspace web host, but until this slice the case did not explicitly open that real product-owned implementation boundary.

This slice makes one actual host-owned implementation stop explicit without implying:
- host-facing promotion
- promoted runtime status
- execution
- host integration rollout

## Proof expectation for this slice

This slice is open only if:
- the Scientify pressure promotion-readiness detail API exposes the implementation-bundle paths
- the Scientify pressure promotion-readiness page renders those bundle links and boundary wording
- the page remains read-only and non-promoting

## Rollback / no-op

- remove this artifact and its reference from the promotion-readiness artifact
- keep the case at `runtime.promotion_readiness.opened`
- keep promotion, registry acceptance, execution, host integration, and automation closed
