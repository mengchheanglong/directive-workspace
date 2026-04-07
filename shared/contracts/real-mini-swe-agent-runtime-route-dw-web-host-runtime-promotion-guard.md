# mini-swe-agent Runtime Route Proof DW Web-Host Runtime Promotion Guard

Quality gate profile: `real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_guard/v1`  
Promotion profile family: `bounded_real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion`  
Proof shape: `real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_snapshot/v1`  
Primary host checker: `npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion`

## Purpose

Define one bounded manual host-facing promotion record for the mini-swe route Runtime surface on the Directive Workspace web host.

This guard opens one explicit manual promotion-record seam only. It does not open:
- registry acceptance
- host integration
- runtime execution
- promotion automation

## Scope

- applies only to `dw-real-mini-swe-agent-runtime-route-v0-2026-03-25`
- applies only to the Directive Workspace web host (`frontend/ + hosts/web-host/`)
- applies only while the promoted surface remains one read-only Runtime seam-review surface over canonical Runtime truth
- requires Runtime and Engine to remain the owners of stage truth, blockers, legality, and downstream progression

## Pass Conditions

- the mini-swe route promotion record exists and links the Runtime record, Runtime proof, Runtime capability boundary, and DW web-host compile-contract artifact truthfully
- canonical state resolves the mini-swe route current head to that promotion record
- the linked promotion specification remains canonical and checked
- the Directive Workspace web host still exposes the bounded seam-review route and detail payload without fake integration or execution controls
- no registry entry exists yet for the mini-swe route candidate
- no host integration, runtime execution, promotion automation claim is introduced

## Required Host Artifacts

- current mini-swe route promotion-readiness artifact
- current mini-swe route promotion specification
- current mini-swe route promotion record
- current mini-swe route DW web-host seam-review compile-contract artifact
- `shared/contracts/runtime-to-host.md`

## Required Host Commands

- `npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion`
- `npm run check:directive-real-mini-swe-agent-runtime-route-v0-dw-web-host-runtime-implementation-slice`
- `npm run check:pre-host-promotion-record-prerequisites`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`

## Required Evidence

- promotion record declares:
  - `Quality gate profile: real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_guard/v1`
  - `Promotion profile family: bounded_real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion`
  - `Proof shape: real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_snapshot/v1`
  - `Primary host checker: npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion`
- promotion record keeps:
  - target host bounded to `Directive Workspace web host (frontend/ + hosts/web-host/)`
  - compile contract bounded to the existing mini-swe route DW web-host seam-review compile-contract artifact
  - rollback explicit
  - validation bounded to local/manual proof only

## Decision Rules

1. This guard validates one manual mini-swe route promotion record only.
2. Passing this guard does not imply registry acceptance.
3. Passing this guard does not imply host integration, runtime execution, promotion automation.
4. Any later registry entry must still prove explicit host acceptance and linked proof.

## Validation Hooks

- `npm run check:directive-real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion`
- `npm run check:frontend-host`

## Canonical Inventory

- `runtime/meta/PROMOTION_PROFILES.json`
