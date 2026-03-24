# Transformation Record: Repo Snapshot Internal Cache Transformation

- Candidate id: `dw-transform-repo-snapshot-internal-cache`
- Candidate name: `Repo Snapshot Internal Cache Transformation`
- Record date: `2026-03-23`
- Transformation type: `speed`
- Discovery intake path: `discovery/intake/2026-03-23-repo-snapshot-internal-cache-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: when the outer `buildRepoSnapshot(project)` cache missed, the service rebuilt git metadata and static repo surfaces from scratch even if those inner surfaces had not changed.
- Measured baseline:
  - metric: `repo snapshot outer-miss wall-clock ms`
  - value: `108.93`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-internal-caches.ts 5`, clearing the outer snapshot cache and the new inner caches before every run

## After State

- Proposed change: add short-lived inner caches for git snapshot and static repo surfaces so an outer repo-snapshot cache miss can still reuse those expensive sub-surfaces safely.
- Preservation claim: snapshot summary, route count, key-file count, git summary, and code-intel tool count remain identical; only repeated internal rebuild work is removed when the underlying repo state has not changed.
- Expected improvement:
  - metric: `repo snapshot outer-miss wall-clock ms`
  - target value: `0.18`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-internal-caches.ts 5`, clearing only the outer snapshot cache while keeping the internal caches warm

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-repo-snapshot-internal-caches.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-23-repo-snapshot-internal-cache-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-23-repo-snapshot-internal-cache-transformation-proof.json`

## Proof

- Correctness preserved: `yes - warmed internal-cache snapshots matched the uncached snapshot summary, route count, key-file count, git summary, and code-intel tool count on the real control-plane project`
- Metric improvement measured: `yes - 108.93ms -> 0.35ms average (-108.58ms, -99.7%) across 5 real control-plane runs`
- Scope note: `this metric measures outer repo-snapshot cache misses with the new internal caches warmed; it does not claim that a fully cold git / repo scan disappeared`
- Rollback path: `remove the git and static-surface inner caches plus helper exports from mission-control/src/server/services/workspace-intel-service.ts, remove mission-control/scripts/benchmark-repo-snapshot-internal-caches.ts if undesired, and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - reduce repo-snapshot rebuild cost on outer-cache misses`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
