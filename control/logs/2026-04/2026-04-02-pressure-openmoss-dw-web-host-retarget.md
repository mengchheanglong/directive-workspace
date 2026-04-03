# OpenMOSS Pressure Run DW Web-Host Retarget

Date: 2026-04-02
Candidate id: `dw-pressure-openmoss-architecture-loop-2026-03-26`
Candidate name: `OpenMOSS`
Owning lane: `Runtime`
Mode: `STANDARD`

## bounded move

Retarget the active proposed host for this case from unresolved host selection to the repo-native Directive Workspace web host.

This slice corrects live host truth only. It does not open:
- host-facing promotion
- promotion record creation
- registry acceptance
- host integration
- runtime execution
- promotion automation

## reason

- current repo truth already proves this case is the top repo-native Runtime promotion-assistance recommendation
- the only missing prerequisite in `runtime-promotion-assistance` was `proposedHost`
- Directive Workspace already has a product-owned frontend plus thin web host
- the repo already proves the same OpenMOSS web-host seam through the bounded manual promotion record for `dw-mission-openmoss-runtime-orchestration-2026-03-26`
- the smallest truthful next step is to make the current host target repo-native and reclassify the case as a candidate for a later manual promotion-seam decision

## proof path

- focused state on the promotion-readiness artifact resolves the case at `runtime.promotion_readiness.opened`
- the active proposed host now resolves to `Directive Workspace web host (frontend/ + hosts/web-host/)`
- the generated promotion specification matches the new host truth
- runtime promotion assistance now classifies the case as `ready_for_manual_promotion_seam_decision`
- `npm run check` passes

## rollback

- revert the host string corrections in the Runtime follow-up / record / proof / capability-boundary / promotion-readiness chain
- revert the promotion-specification host updates
- revert the dedicated retarget checker and the affected assistance/lifecycle checker expectations

## stop-line

Stop after host-truth correction and reclassification. Do not open the manual promotion seam in the same slice.
