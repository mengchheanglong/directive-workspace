# Agent-Orchestrator Precondition Correction

Date: 2026-03-21
Owner: Directive Forge
Status: completed
Decision state: `route_to_forge_follow_up`
Adoption target: `Directive Forge follow-up`

## Purpose

Correct a false-live Forge state before opening any `agent-orchestrator` runtime slice.

## Problem

The Forge source-pack catalog marked `agent-orchestrator` as `live_runtime`, but the Forge-owned pack does not currently contain the runnable CLI artifact that the host expects:

- `packages/cli/dist/index.js`

That created an invalid state where the host could treat the pack as runtime-live even though bounded execution had not been proven from the Forge-owned copy.

## Decision

`agent-orchestrator` is corrected back to:

- `classification = follow_up_only`
- `activationMode = manual_follow_up`

until the Forge-owned pack proves the CLI precondition.

## Host Correction

- source-pack catalog no longer treats `agent-orchestrator` as live runtime
- backend runtime path resolution now enforces the same `live_runtime + ready` rule used by the frontend host path resolver
- dedicated host validation now checks that `agent-orchestrator` cannot be marked live runtime without the CLI artifact

## Precondition For Re-entry

Before a real Forge runtime slice can open, the following must be true:

- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\source-packs\agent-orchestrator\packages\cli\dist\index.js` exists
- the pack can prove bounded CLI execution from the Forge-owned copy
- the catalog is reclassified to `live_runtime`
- a real Forge record, proof artifact, promotion record, and registry entry are created

## Validation

- `npm run check:directive-agent-orchestrator-preconditions`
- `npm run check:directive-source-pack-catalog`
- `npm run check:directive-source-pack-readiness`
- `npm run check:ops-stack`
