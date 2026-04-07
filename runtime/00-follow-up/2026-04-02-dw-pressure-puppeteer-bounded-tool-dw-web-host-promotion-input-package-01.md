# Puppeteer Pressure DW Web-Host Promotion-Input Package 01

Date: 2026-04-02
Candidate id: `dw-pressure-puppeteer-bounded-tool-2026-03-25`
Candidate name: `Puppeteer Bounded Tool Runtime Run`
Track: Directive Workspace Runtime
Status: `explicit_non_promoting_dw_web_host_input_bundle`

## Objective

Define the bounded promotion-input package for the already-opened one-case Directive Workspace web-host manual promotion-seam preparation slice.

This package makes the pre-promotion inputs explicit only. It does not:
- open a promotion record
- create a registry entry
- open host integration rollout
- open runtime execution
- open promotion automation

## Source boundary

- Promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-readiness.md`
- Promotion specification artifact:
  - `runtime/06-promotion-specifications/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-specification.json`
- Compile-contract artifact:
  - `runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-seam-review-compile-contract-01.md`
- Profile/checker decision:
  - `runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-profile-checker-decision-01.md`
- Guard contract:
  - `shared/contracts/dw-web-host-seam-review-guard.md`
- Current proposed host:
  - `Directive Workspace web host (frontend/ + hosts/web-host/)`

## Explicit compile-contract artifact for this slice

The compile-contract artifact for this slice is now explicit at:
- `runtime/00-follow-up/2026-04-02-dw-pressure-puppeteer-bounded-tool-dw-web-host-seam-review-compile-contract-01.md`

It stays bounded to:
- one thin-host data read over canonical Runtime truth
- one Puppeteer pressure seam-review detail surface in the Directive Workspace web host/frontend pair
- no Runtime progression logic moving into the frontend or host layer

## Explicit runtime permissions profile for this slice

The explicit permissions profile for this slice is:

`read_only_lane = canonical Directive Workspace state plus linked Runtime artifacts through the existing DW thin-host reader; write_lane = none`

This remains read-only and product-local:
- read canonical Directive Workspace state and linked Runtime artifacts
- serve thin-host JSON and the frontend page for the seam-review surface

It must not include:
- promotion-record creation
- registry acceptance
- runtime execution
- host integration writes
- task creation
- background jobs
- automation

## Explicit safe output scope for this slice

The explicit safe output scope for this slice is limited to:
- the Puppeteer pressure seam-review page in Directive Workspace frontend/web-host
- thin-host response payloads for that page
- bounded presentation updates in:
  - `frontend/src/app.ts`
  - `hosts/web-host/server.ts`
  - `hosts/web-host/data.ts`
- this promotion-input package and checker/report snapshots

It must not expand to:
- host-facing promotion record creation
- registry acceptance
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
- `Focused profile/checker decision = npm run check:directive-puppeteer-pressure-dw-web-host-profile-checker-decision`
- `Focused input-package checker = npm run check:directive-puppeteer-pressure-dw-web-host-promotion-input-package`
- contract path:
  - `shared/contracts/dw-web-host-seam-review-guard.md`

Supporting checks that remain relevant:
- `npm run check:directive-puppeteer-pressure-dw-web-host-seam-review-compile-contract`
- `npm run check:directive-puppeteer-pressure-dw-web-host-retarget`
- `npm run check:runtime-promotion-assistance`
- focused `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-25-dw-pressure-puppeteer-bounded-tool-2026-03-25-promotion-readiness.md`

## Why this package is still non-promoting

This package only makes the bounded pre-promotion inputs inspectable.

It does not mean:
- host-facing promotion is open
- a promotion record exists
- a registry entry exists
- host integration is open
- runtime execution is open

## Rollback / no-op

- remove this promotion-input package artifact and the reference to it from the promotion-readiness artifact
- remove the linked compile-contract reference to this package
- keep the case at `runtime.promotion_readiness.opened`
- leave host-facing promotion, registry acceptance, host integration, runtime execution, and promotion automation closed
