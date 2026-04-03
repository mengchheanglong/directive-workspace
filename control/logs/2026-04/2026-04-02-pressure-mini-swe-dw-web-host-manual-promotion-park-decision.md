# mini-swe-agent Pressure Run DW Web-Host Manual Promotion Park Decision

Date: 2026-04-02
Candidate id: `dw-pressure-mini-swe-agent-2026-03-25`
Candidate name: `mini-swe-agent Pressure Run`
Owning lane: `Runtime`
Mode: `STANDARD`

## bounded move

Keep the manual promotion seam closed for this case and park it at the current promotion-readiness stop.

This slice does not open:
- host-facing promotion record creation
- registry acceptance
- host integration
- runtime execution
- promotion automation

## reason

- current repo truth already proves this case is the strongest repo-native Runtime recommendation and that host selection is no longer the blocker
- the case still stops at `runtime.promotion_readiness.opened`
- unlike the existing DW web-host manual promotion cases, this case does not yet have a case-specific DW web-host proof bundle:
  - no compile-contract artifact
  - no promotion-input package
  - no profile/checker decision
  - no runtime-implementation slice/result
  - no case-specific manual promotion guard/check surface
- opening a manual promotion record without that bounded host-facing proof would overclaim repo truth
- this run is explicitly not allowed to start another preparation chain, so the truthful result is to park the case instead of manufacturing an under-proved promotion record

## proof path

- focused state on the promotion-readiness artifact resolves the case at `runtime.promotion_readiness.opened`
- runtime promotion assistance classifies the case as `ready_for_manual_promotion_seam_decision`, which is recommendation-first and not equivalent to an already-proved host-facing promotion boundary
- the current DW web-host manual promotion records for OpenMOSS and Scientify both depend on stronger case-specific proof bundles than this case currently has
- `npm run check` passes with the case still parked at promotion-readiness

## rollback

- remove this park decision log if new repo truth later provides a concrete one-case DW web-host proof bundle for this case

## reopen trigger

Reopen this case only if new repo truth already provides one bounded case-specific DW web-host proof bundle strong enough to support a manual promotion record without starting another preparation chain in the same run.

## stop-line

Stop after the park decision. Do not continue this case again without new repo truth.
