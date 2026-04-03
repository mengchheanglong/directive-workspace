# Standalone Scientify Runtime Promotion Guard

Quality gate profile: `standalone_scientify_manual_promotion_guard/v1`  
Promotion profile family: `bounded_standalone_scientify_manual_promotion`  
Proof shape: `standalone_scientify_manual_promotion_snapshot/v1`  
Primary host checker: `npm run check:directive-scientify-runtime-promotion`

## Purpose

Define the first bounded manual host-facing promotion record for the Scientify literature-access Runtime bundle.

This guard opens one explicit manual promotion-record seam only. It does not open:
- registry acceptance
- host integration rollout
- runtime execution
- promotion automation

## Scope

- applies only to `dw-source-scientify-research-workflow-plugin-2026-03-27`
- applies only to the Directive Workspace standalone host
- applies only while the callable bundle remains a bounded 4-tool literature-access capability
- requires Runtime and Engine to remain the owners of stage truth, blockers, legality, and downstream progression

## Pass Conditions

- the Scientify promotion record exists and links the Runtime record, Runtime proof, Runtime capability boundary, and compile contract truthfully
- canonical state resolves the Scientify current head to that promotion record
- the linked promotion specification remains canonical and checked
- the standalone host still consumes the capability through the bounded adapter path only
- no registry entry exists yet for the Scientify candidate
- no host integration, runtime execution, or automation claim is introduced

## Required Host Artifacts

- current Scientify promotion-readiness artifact
- current Scientify promotion specification
- current Scientify callable stub
- current Scientify promotion record
- `shared/contracts/runtime-to-host.md`

## Required Host Commands

- `npm run check:directive-scientify-runtime-promotion`
- `npm run check:standalone-scientify-host-adapter`
- `npm run check:directive-scientify-runtime-callable`
- `npm run check:pre-host-promotion-record-prerequisites`

## Required Evidence

- promotion record declares:
  - `Quality gate profile: standalone_scientify_manual_promotion_guard/v1`
  - `Promotion profile family: bounded_standalone_scientify_manual_promotion`
  - `Proof shape: standalone_scientify_manual_promotion_snapshot/v1`
  - `Primary host checker: npm run check:directive-scientify-runtime-promotion`
- promotion record keeps:
  - target host bounded to `Directive Workspace standalone host (hosts/standalone-host/)`
  - compile contract bounded to `shared/contracts/runtime-to-host.md`
  - rollback explicit
  - validation bounded to local/manual proof only

## Decision Rules

1. This guard validates one manual promotion record only.
2. Passing this guard does not imply registry acceptance.
3. Passing this guard does not imply host integration, runtime execution, or automation.
4. Any later registry entry must still prove explicit host acceptance and linked proof.

## Validation Hooks

- `npm run check:directive-scientify-runtime-promotion`
- `npm run check:standalone-scientify-host-adapter`

## Canonical Inventory

- `runtime/PROMOTION_PROFILES.json`
