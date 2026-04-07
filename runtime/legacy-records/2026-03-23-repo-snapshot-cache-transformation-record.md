# Transformation Record: Repo Snapshot Cache Transformation

- Candidate id: `dw-transform-repo-snapshot-cache`
- Candidate name: `Repo Snapshot Cache Transformation`
- Record date: `2026-03-23`
- Transformation type: `speed`
- Discovery intake path: `discovery/01-intake/2026-03-23-repo-snapshot-cache-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: every `buildRepoSnapshot(project)` call rebuilt package, route, code-intel, and git snapshot surfaces even when the same project snapshot was requested repeatedly within the same short host interaction window.
- Measured baseline:
  - metric: `repo snapshot repeated-call wall-clock ms`
  - value: `518.68`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-cache.ts 5`, forcing the uncached path before each build

## After State

- Proposed change: add a short-lived per-project repo-snapshot cache with explicit clear support so repeated callers can reuse the same snapshot for a bounded interval.
- Preservation claim: cached repo-snapshot payloads remain identical to the cold-built snapshot within the cache window; only repeated reconstruction work is removed.
- Expected improvement:
  - metric: `repo snapshot repeated-call wall-clock ms`
  - target value: `0.01`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-cache.ts 5`, timing the warmed cached path after one initial population call

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-repo-snapshot-cache.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `runtime/legacy-records/2026-03-23-repo-snapshot-cache-transformation-proof.json`
- Result artifact path: `runtime/legacy-records/2026-03-23-repo-snapshot-cache-transformation-proof.json`

## Proof

- Correctness preserved: `yes - cached repo snapshot output matched the cold-built snapshot on the real control-plane project`
- Metric improvement measured: `yes - 518.68ms -> 0.01ms average (-518.67ms, -100.0%) across 5 real control-plane runs`
- Rollback path: `remove the repo snapshot cache from mission-control/src/server/services/workspace-intel-service.ts, remove mission-control/scripts/benchmark-repo-snapshot-cache.ts if undesired, and remove the new Discovery / Runtime transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Runtime`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - remove repeated repo-snapshot cost from host-level context assembly and overview surfaces`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
