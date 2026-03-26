# Transformation Record: Dashboard Context Preload Transformation

- Candidate id: `dw-transform-dashboard-context-preload`
- Candidate name: `Dashboard Context Preload Transformation`
- Record date: `2026-03-22`
- Transformation type: `speed`
- Discovery intake path: `discovery/intake/2026-03-22-dashboard-context-preload-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-context-writer.ts` and `mission-control/src/server/services/context-pack-service.ts`
- Current implementation: `writeDashboardContextFiles` rebuilt overlapping workspace surfaces separately for summary, overview, and full context packs, then reloaded readiness and repo-snapshot surfaces again for the same write cycle.
- Measured baseline:
  - metric: `dashboard context bundle wall-clock ms`
  - value: `711.8`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-dashboard-context-preload.ts 5`, timing the legacy dashboard context bundle path that rebuilds each surface independently

## After State

- Proposed change: add a canonical preload bundle in `loadContextPackPreloadedData`, preserve legacy quest-scope behavior by separating pack quest data from readiness quest data, and have `writeDashboardContextFiles` reuse the shared preloaded surfaces across all generated outputs.
- Preservation claim: generated context packs, readiness, collaboration guide, and repo snapshot outputs remain identical after normalizing volatile timestamps; only duplicate loading and recomputation are removed.
- Expected improvement:
  - metric: `dashboard context bundle wall-clock ms`
  - target value: `171.56`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-dashboard-context-preload.ts 5`, timing the preloaded dashboard context bundle path that reuses one shared context surface set

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-dashboard-context-preload.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `runtime/records/2026-03-22-dashboard-context-preload-transformation-proof.json`
- Result artifact path: `runtime/records/2026-03-22-dashboard-context-preload-transformation-proof.json`

## Proof

- Correctness preserved: `yes - legacy and preloaded dashboard context bundles matched exactly after timestamp normalization on the real control-plane project`
- Metric improvement measured: `yes - 711.8ms -> 171.56ms average (-540.25ms, -75.9%) across 5 real control-plane runs`
- Rollback path: `revert the preload path in mission-control/src/server/services/context-pack-service.ts, revert the writer reuse changes in mission-control/src/server/services/workspace-context-writer.ts, remove mission-control/scripts/benchmark-dashboard-context-preload.ts if undesired, and remove the new Discovery / Runtime transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Runtime`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - reduce repeated context-generation cost on an operator-facing host path`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
