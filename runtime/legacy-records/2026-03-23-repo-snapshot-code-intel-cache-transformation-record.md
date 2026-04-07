# Transformation Record: Repo Snapshot Code-Intel Cache Transformation

- Candidate id: `dw-transform-repo-snapshot-code-intel-cache`
- Candidate name: `Repo Snapshot Code-Intel Cache Transformation`
- Record date: `2026-03-23`
- Transformation type: `speed`
- Discovery intake path: `discovery/01-intake/2026-03-23-repo-snapshot-code-intel-cache-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: every repo snapshot rebuild reconstructed the code-intelligence payload, including language-server probe assembly, project override reads, and CodeGraphContext snapshot work, even when the outer repo snapshot cache was the only surface being cleared.
- Measured baseline:
  - metric: `repo snapshot repeated rebuild wall-clock ms with cold code-intel path`
  - value: `292.65`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-code-intel-cache.ts 5`, clearing repo/project caches and CodeGraphContext CLI health before each measurement

## After State

- Proposed change: add a short-lived per-project code-intel snapshot cache with explicit clear support so repeated repo-snapshot rebuilds can reuse the same code-intel payload for a bounded interval.
- Preservation claim: the optimized path preserves the same repo snapshot summary and the same code-intel overall status, summary, tool count, and CodeGraphContext status/source/error fields; only repeated code-intel reconstruction work is removed.
- Expected improvement:
  - metric: `repo snapshot repeated rebuild wall-clock ms with warmed code-intel path`
  - target value: `117.95`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-code-intel-cache.ts 5`, priming code-intel once and then rebuilding repo snapshots with repo/git/static/code-graph caches cleared but code-intel reused

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-repo-snapshot-code-intel-cache.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync`
- Comparison mode: `before-after`
- Baseline artifact path: `runtime/legacy-records/2026-03-23-repo-snapshot-code-intel-cache-transformation-proof.json`
- Result artifact path: `runtime/legacy-records/2026-03-23-repo-snapshot-code-intel-cache-transformation-proof.json`

## Proof

- Correctness preserved: `yes - repo snapshot summary and code-intel/code-graph fields matched after code-intel reuse`
- Metric improvement measured: `yes - 292.65ms -> 117.95ms average (-174.69ms, -59.7%) across 5 real control-plane runs`
- Rollback path: `remove the code-intel snapshot cache from mission-control/src/server/services/workspace-intel-service.ts, remove mission-control/scripts/benchmark-repo-snapshot-code-intel-cache.ts if undesired, and remove the new Discovery / Runtime transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Runtime`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - keep repo snapshot and context assembly from rebuilding unchanged code-intel state on repeated host reads`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
