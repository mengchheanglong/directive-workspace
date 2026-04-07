# Agent-Orchestrator Precondition Correction

Date: 2026-03-21
Owner: Directive Runtime
Status: completed
Decision state: `route_to_runtime_follow_up`
Adoption target: `Directive Runtime follow-up`

## Purpose

Correct a false-live Runtime state before opening any `agent-orchestrator` runtime slice.

## Problem

The Runtime source-pack catalog marked `agent-orchestrator` as `live_runtime`, but the Runtime-owned pack does not currently contain the runnable CLI artifact that the host expects:

- `packages/cli/dist/index.js`

That created an invalid state where the host could treat the pack as runtime-live even though bounded execution had not been proven from the Runtime-owned copy.

## Decision

`agent-orchestrator` is corrected back to:

- `classification = follow_up_only`
- `activationMode = manual_follow_up`

until the Runtime-owned pack proves the CLI precondition.

## Host Correction

- source-pack catalog no longer treats `agent-orchestrator` as live runtime
- backend runtime path resolution now enforces the same `live_runtime + ready` rule used by the frontend host path resolver
- dedicated host validation now checks that `agent-orchestrator` cannot be marked live runtime without the CLI artifact

## Precondition For Re-entry

Before a real Runtime runtime slice can open, the following must be true:

- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\source-packs\agent-orchestrator\packages\cli\dist\index.js` exists
- the pack can prove bounded CLI execution from the Runtime-owned copy
- the catalog is reclassified to `live_runtime`
- a real Runtime record, proof artifact, promotion record, and registry entry are created

## Validation

- `npm run check:directive-agent-orchestrator-preconditions`
- `npm run check:directive-source-pack-catalog`
- `npm run check:directive-source-pack-readiness`
- `npm run check:ops-stack`
