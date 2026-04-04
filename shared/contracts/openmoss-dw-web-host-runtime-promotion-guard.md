# OpenMOSS DW Web-Host Runtime Promotion Guard

Quality gate profile: `openmoss_dw_web_host_manual_promotion_guard/v1`  
Promotion profile family: `bounded_openmoss_dw_web_host_manual_promotion`  
Proof shape: `openmoss_dw_web_host_manual_promotion_snapshot/v1`  
Primary host checker: `npm run check:directive-openmoss-runtime-promotion`

## Purpose

Define one bounded manual host-facing promotion record for the OpenMOSS Runtime Orchestration Surface.

This guard opens one explicit manual promotion-record seam only. It does not open:
- registry acceptance
- host integration
- callable implementation
- runtime execution
- promotion automation

## Scope

- applies only to `dw-mission-openmoss-runtime-orchestration-2026-03-26`
- applies only to the Directive Workspace web host (`frontend/ + hosts/web-host/`)
- applies only while the promoted surface remains one read-only Runtime seam-review surface over canonical Runtime truth
- requires Runtime and Engine to remain the owners of stage truth, blockers, legality, and downstream progression

## Pass Conditions

- the OpenMOSS promotion record exists and links the Runtime record, Runtime proof, Runtime capability boundary, and DW web-host compile-contract artifact truthfully
- canonical state resolves the OpenMOSS current head to that promotion record
- the linked promotion specification remains canonical and checked
- the Directive Workspace web host still exposes the bounded seam-review route and detail payload without fake integration or execution controls
- no registry entry exists yet for the OpenMOSS candidate
- no host integration, callable implementation, runtime execution, promotion automation claim is introduced

## Required Host Artifacts

- current OpenMOSS promotion-readiness artifact
- current OpenMOSS promotion specification
- current OpenMOSS promotion record
- current OpenMOSS DW web-host seam-review compile-contract artifact
- `shared/contracts/runtime-to-host.md`

## Required Host Commands

- `npm run check:directive-openmoss-runtime-promotion`
- `npm run check:pre-host-promotion-record-prerequisites`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`

## Required Evidence

- promotion record declares:
  - `Quality gate profile: openmoss_dw_web_host_manual_promotion_guard/v1`
  - `Promotion profile family: bounded_openmoss_dw_web_host_manual_promotion`
  - `Proof shape: openmoss_dw_web_host_manual_promotion_snapshot/v1`
  - `Primary host checker: npm run check:directive-openmoss-runtime-promotion`
- promotion record keeps:
  - target host bounded to `Directive Workspace web host (frontend/ + hosts/web-host/)`
  - compile contract bounded to the existing OpenMOSS DW web-host seam-review compile-contract artifact
  - rollback explicit
  - validation bounded to local/manual proof only

## Decision Rules

1. This guard validates one manual OpenMOSS promotion record only.
2. Passing this guard does not imply registry acceptance.
3. Passing this guard does not imply host integration, callable implementation, runtime execution, promotion automation.
4. Any later registry entry must still prove explicit host acceptance and linked proof.

## Validation Hooks

- `npm run check:directive-openmoss-runtime-promotion`
- `npm run check:frontend-host`

## Canonical Inventory

- `runtime/PROMOTION_PROFILES.json`
