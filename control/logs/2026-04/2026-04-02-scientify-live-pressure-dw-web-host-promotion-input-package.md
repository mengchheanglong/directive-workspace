# Scientify Live Pressure DW Web-Host Promotion-Input Package

Date: 2026-04-02
Candidate id: `dw-live-scientify-engine-pressure-2026-03-24`
Candidate name: `Scientify Mixed Adoption Target Pressure`
Owning lane: `Runtime`
Mode: `STANDARD`

## bounded move

Add one bounded Directive Workspace web-host promotion-input package for the retargeted Scientify live-pressure case.

This slice is stronger than the compile-contract stop and weaker than a promotion record.

It does not open:
- a promotion record
- a registry entry
- host integration
- runtime execution
- promotion automation

## reason

- current repo truth already pins the exact DW web-host compile boundary for this case
- the repo-native web-host seam-review pattern already uses an explicit input package before any promotion record
- the smallest missing value is to make the one-case pre-promotion review inputs explicit without overstating promotion truth

## proof path

- the promotion-readiness artifact now links one explicit DW web-host promotion-input package
- the focused input-package checker proves the readiness artifact, compile-contract artifact, promotion specification, and existing DW web-host seam-review guard all agree
- the case still resolves to `runtime.promotion_readiness.opened`
- no promotion record or registry entry exists for this case
- `npm run check` passes

## rollback

- remove the promotion-input package artifact
- remove the readiness linkage to that artifact
- remove the focused checker and its package wiring
- remove the compile-contract reference to that package if desired
- keep the case at the existing compile-contract stop

## stop-line

Stop after the first truthful stronger boundary after the compile-contract slice.

Do not create a promotion record, registry entry, host integration surface, or runtime execution surface in this slice.
