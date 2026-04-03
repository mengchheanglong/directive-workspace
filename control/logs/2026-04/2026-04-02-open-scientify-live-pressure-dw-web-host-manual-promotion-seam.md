# 2026-04-02 - Open Scientify Live Pressure DW Web-Host Manual Promotion Seam

## Slice

- Candidate: `dw-live-scientify-engine-pressure-2026-03-24`
- Owning lane: `Runtime`
- Decision: explicitly open one bounded manual promotion-seam path for the Directive Workspace web host

## Repo truth used

- Runtime promotion assistance now identifies this case as the strongest repo-native host candidate:
  - `assistanceState = ready_for_manual_promotion_seam_decision`
  - `recommendedActionKind = request_manual_promotion_seam_decision`
  - `hostScope = directive_workspace_host`
- The active promotion-readiness head remains:
  - `runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
  - `currentStage = runtime.promotion_readiness.opened`
  - blockers remain only:
    - `runtime_implementation_unopened`
    - `host_facing_promotion_unopened`
- Proposed host is now repo-native:
  - `Directive Workspace web host (frontend/ + hosts/web-host/)`
- Mission Control is out of scope for this project unless explicitly reintroduced by the user.
- Canonical promotion-spec truth now agrees with the repo-native host retarget:
  - `runtime/06-promotion-specifications/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-specification.json`
- The repo already has a bounded Directive Workspace web-host seam-review pattern:
  - `shared/contracts/dw-web-host-seam-review-guard.md`
  - `scripts/check-directive-dw-web-host-runtime-seam-review.ts`
  - `shared/contracts/openmoss-dw-web-host-runtime-promotion-guard.md`

## Decision

Open one bounded manual promotion-seam path for `dw-live-scientify-engine-pressure-2026-03-24`, targeted only at the Directive Workspace web host.

This opening is intentionally narrow:

- one case only
- repo-native host only
- manual
- reversible
- non-automated
- non-executing

This decision authorizes the next bounded slice only:

- add the first Scientify live-pressure DW web-host seam-review / compile-contract preparation that is stronger than promotion-readiness and weaker than promotion-record truth

This decision does not authorize:

- a promotion record
- registry acceptance
- host integration
- runtime execution
- runtime implementation
- promotion automation
- generalized external-host support

## Why opening is now truthful

The earlier keep-closed decisions were correct while the case still depended on a non-repo-native host target.

That gap is now closed:

- the case has been retargeted to the Directive Workspace web host
- the retarget is checker-backed
- runtime promotion assistance now treats the case as ready for a manual promotion-seam decision
- the repo already has a bounded web-host seam-review pattern that can absorb one more case without opening broader host integration

So the next missing value is no longer another host-selection decision. It is one bounded repo-native promotion-seam preparation slice.

## Proof path

- `npm run generate:promotion-specifications`
- `npm run check:directive-scientify-dw-web-host-retarget`
- `npm run check:runtime-promotion-assistance`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- `npm run check`

## Rollback

Revert this decision log only.

If the next slice cannot be completed truthfully, keep the case at the current promotion-readiness head with the repo-native web-host retarget still intact.

## Stop-line

Stop after recording the seam-opening decision and verifying that the repo continues to resolve this case to `runtime.promotion_readiness.opened`.

Do not create a promotion record, registry entry, host integration surface, or runtime execution surface in this slice.
