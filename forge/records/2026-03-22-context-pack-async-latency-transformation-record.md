# Transformation Record: Context Pack Async Surface Concurrency

- Candidate id: `dw-transform-context-pack-async-latency`
- Candidate name: `Context Pack Async Surface Concurrency`
- Record date: `2026-03-22`
- Transformation type: `latency`
- Discovery intake path: `discovery/intake/2026-03-22-context-pack-async-latency-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/context-pack-service.ts`
- Current implementation: `buildContextPack` waited for the bounded codegraph summary and the n8n automation snapshot sequentially even though the two async surfaces are independent.
- Measured baseline:
  - metric: `context-pack async surface wall-clock ms`
  - value: `0.37`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-async-surfaces.ts 5` with sequential async surface collection

## After State

- Proposed change: add `collectAsyncContextPackSurfaces(project)` and use `Promise.all` so bounded codegraph summary collection and n8n automation snapshot collection overlap before the rest of `buildContextPack` continues.
- Preservation claim: `ContextPack` return shape, codegraph summary gating behavior, automation snapshot behavior, and the rest of the sync context assembly remain unchanged.
- Expected improvement:
  - metric: `context-pack async surface wall-clock ms`
  - target value: `0.18`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-async-surfaces.ts 5` with parallel async surface collection

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:discovery-intake-queue && npm run check:directive-transformation-proof && npm run check:directive-workflow-doctrine && npx tsx ./scripts/benchmark-context-pack-async-surfaces.ts 5 && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-22-context-pack-async-latency-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-22-context-pack-async-latency-transformation-proof.json`

## Proof

- Correctness preserved: `yes - async surfaces are independent and still resolve to the same codegraph-summary and automation snapshot shapes; host typecheck passes`
- Metric improvement measured: `yes - 0.37ms -> 0.18ms average (-0.20ms, -53.1%) across 5 real control-plane runs`
- Environment note: `Absolute gain is small in the current environment because n8n is currently missing, but the concurrency boundary is now real and scales with slower external surfaces.`
- Rollback path: `revert mission-control/src/server/services/context-pack-service.ts, remove scripts/benchmark-context-pack-async-surfaces.ts if undesired, and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - lower-friction context-pack assembly latency`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
