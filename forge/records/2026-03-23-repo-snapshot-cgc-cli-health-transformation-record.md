# Transformation Record: Repo Snapshot CodeGraphContext CLI Health Transformation

- Candidate id: `dw-transform-repo-snapshot-cgc-cli-health`
- Candidate name: `Repo Snapshot CodeGraphContext CLI Health Transformation`
- Record date: `2026-03-23`
- Transformation type: `speed`
- Discovery intake path: `discovery/intake/2026-03-23-repo-snapshot-cgc-cli-health-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: `collectCodeGraphContextSnapshot(project)` treated `where cgc` / `which cgc` as enough to invoke `cgc list`, then parsed thrown error text as ordinary output. In the current environment the launcher exists on PATH but fails immediately with `ModuleNotFoundError: No module named 'codegraphcontext'`, so repeated repo-snapshot rebuilds kept paying failed CLI startup cost.
- Measured baseline:
  - metric: `repo snapshot repeated rebuild wall-clock ms with broken cgc CLI health cleared`
  - value: `167.57`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-cgc-cli-health.ts 5`, clearing repo/project caches and the CodeGraphContext CLI health cache before each measurement

## After State

- Proposed change: detect broken CodeGraphContext CLI startup explicitly, preserve the missing/unavailable snapshot result, and reuse that broken-health signal for a bounded interval so repeated repo-snapshot rebuilds stop reinvoking the failing launcher.
- Preservation claim: the optimized path preserves the same repo-snapshot summary and the same CodeGraphContext `status`, `source`, `indexed`, and `lastError` values for the current broken-CLI environment; only repeated failed startup work is removed.
- Expected improvement:
  - metric: `repo snapshot repeated rebuild wall-clock ms after broken cgc CLI health is known`
  - target value: `82.58`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-repo-snapshot-cgc-cli-health.ts 5`, priming the broken CLI health once and then rebuilding repo snapshots with project caches cleared but health reused

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-repo-snapshot-cgc-cli-health.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-23-repo-snapshot-cgc-cli-health-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-23-repo-snapshot-cgc-cli-health-transformation-proof.json`

## Proof

- Correctness preserved: `yes - repo snapshot summary and CodeGraphContext status/source/error fields matched after broken CLI health reuse`
- Metric improvement measured: `yes - 167.57ms -> 82.58ms average (-84.98ms, -50.7%) across 5 real control-plane runs`
- Rollback path: `remove the CodeGraphContext CLI health cache and structured CLI result handling from mission-control/src/server/services/workspace-intel-service.ts, remove mission-control/scripts/benchmark-repo-snapshot-cgc-cli-health.ts if undesired, and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - keep repo snapshot and context assembly from paying repeated broken external-tool startup overhead`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
