# Scientify Live Pressure DW Web-Host Retarget

Date: 2026-04-02
Candidate id: `dw-live-scientify-engine-pressure-2026-03-24`
Candidate name: `Scientify Mixed Adoption Target Pressure`
Owning lane: `Runtime`
Mode: `STANDARD`

## bounded move

Retarget the active proposed host for this case from the now-forbidden external Mission Control path to the repo-native Directive Workspace web host.

This slice corrects live host truth only. It does not open:
- host-facing promotion
- promotion record creation
- registry acceptance
- host integration
- runtime execution
- promotion automation

## reason

- current repo truth already proves the case is Runtime-ready but was blocked only by external-host scope
- Mission Control is now out of scope for this project unless explicitly requested
- Directive Workspace already has a product-owned frontend plus thin web host
- the smallest truthful next step is to make the current host target repo-native and reclassify the case as a candidate for a later manual promotion-seam decision

## proof path

- focused state on the promotion-readiness artifact resolves the case at `runtime.promotion_readiness.opened`
- the active proposed host now resolves to `Directive Workspace web host (frontend/ + hosts/web-host/)`
- the generated promotion specification matches the new host truth
- runtime promotion assistance now classifies the case as `ready_for_manual_promotion_seam_decision`
- `npm run check` passes

## rollback

- revert the host string corrections in the Runtime follow-up / record / proof / capability-boundary / promotion-readiness chain
- revert the assistance checker expectation and the dedicated retarget checker
- regenerate promotion specifications back to the previous host truth if needed

## stop-line

Stop after host-truth correction and reclassification. Do not open the manual promotion seam in the same slice.
