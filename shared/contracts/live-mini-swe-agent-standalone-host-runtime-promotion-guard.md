# live mini-swe-agent Standalone Host Runtime Promotion Guard

Quality gate profile: `live_mini_swe_agent_standalone_host_manual_promotion_guard/v1`  
Promotion profile family: `bounded_live_mini_swe_agent_standalone_host_manual_promotion`  
Proof shape: `live_mini_swe_agent_standalone_host_manual_promotion_snapshot/v1`  
Primary host checker: `npm run check:directive-live-mini-swe-agent-runtime-promotion`

## Purpose

Define the first bounded manual host-facing promotion record for the live mini-swe Runtime capability pressure case.

This guard opens one explicit manual promotion-record seam only. It does not open:
- registry acceptance
- host integration rollout
- runtime execution
- promotion automation

## Scope

- applies only to `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
- applies only to the Directive Workspace standalone host
- applies only while the callable boundary remains a bounded non-executing coding-agent descriptor
- requires Runtime and Engine to remain the owners of stage truth, blockers, legality, and downstream progression

## Pass Conditions

- the live mini-swe promotion record exists and links the Runtime record, Runtime proof, Runtime capability boundary, and compile contract truthfully
- canonical state resolves the live mini-swe current head to that promotion record
- the linked promotion specification remains canonical and checked
- the standalone host still consumes the capability through a bounded adapter path only
- no registry entry exists yet for the live mini-swe candidate
- no host integration, runtime execution, or automation claim is introduced

## Required Host Artifacts

- current live mini-swe promotion-readiness artifact
- current live mini-swe promotion specification
- current live mini-swe callable stub
- current live mini-swe promotion record
- `shared/contracts/runtime-to-host.md`

## Required Host Commands

- `npm run check:directive-live-mini-swe-agent-runtime-promotion`
- `npm run check:standalone-live-mini-swe-agent-host-adapter`
- `npm run check:directive-live-mini-swe-agent-runtime-callable`
- `npm run check:pre-host-promotion-record-prerequisites`

## Required Evidence

- promotion record declares:
  - `Quality gate profile: live_mini_swe_agent_standalone_host_manual_promotion_guard/v1`
  - `Promotion profile family: bounded_live_mini_swe_agent_standalone_host_manual_promotion`
  - `Proof shape: live_mini_swe_agent_standalone_host_manual_promotion_snapshot/v1`
  - `Primary host checker: npm run check:directive-live-mini-swe-agent-runtime-promotion`
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

- `npm run check:directive-live-mini-swe-agent-runtime-promotion`
- `npm run check:standalone-live-mini-swe-agent-host-adapter`

## Canonical Inventory

- `runtime/meta/PROMOTION_PROFILES.json`
