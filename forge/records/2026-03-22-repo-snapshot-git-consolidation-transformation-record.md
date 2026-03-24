# Transformation Record: Repo Snapshot Git Command Consolidation

- Candidate id: `dw-transform-repo-snapshot-git-consolidation`
- Candidate name: `Repo Snapshot Git Command Consolidation`
- Record date: `2026-03-22`
- Transformation type: `speed`
- Discovery intake path: `discovery/intake/2026-03-22-repo-snapshot-git-consolidation-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: `collectGitSnapshot` spawned separate git processes for branch name, working-tree status, recent commits, and ahead/behind counts.
- Measured baseline:
  - metric: `repo-snapshot git metadata wall-clock ms`
  - value: `218.40`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-git.ts 5`, with the legacy multi-call git collection path

## After State

- Proposed change: replace branch/status/ahead-behind collection with one `git status --porcelain=1 --branch` call, keep the existing `git log` call for recent commits, and preserve legacy output semantics for the first status line.
- Preservation claim: `GitSnapshot` field values remain identical to the legacy path for the control-plane repo, including summary text, counts, and changed-file list.
- Expected improvement:
  - metric: `repo-snapshot git metadata wall-clock ms`
  - target value: `87.87`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-git.ts 5`, with the consolidated git collection path

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-repo-snapshot-git.ts 5 && npx tsx ./scripts/benchmark-context-pack-phases.ts 3 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-22-repo-snapshot-git-consolidation-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-22-repo-snapshot-git-consolidation-transformation-proof.json`

## Proof

- Correctness preserved: `yes - the benchmark verifies that the consolidated git snapshot matches the legacy snapshot exactly on the live control-plane repo`
- Metric improvement measured: `yes - 218.40ms -> 87.87ms average (-130.53ms, -59.8%) across 5 real control-plane runs`
- Rollback path: `revert collectGitSnapshot in mission-control/src/server/services/workspace-intel-service.ts, remove mission-control/scripts/benchmark-repo-snapshot-git.ts if undesired, and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - reduce repo-snapshot overhead in context-pack generation`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
