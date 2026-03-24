# Transformation Record: Daily Report Log Readonly Cache Transformation

- Candidate id: `dw-transform-daily-report-log-readonly-cache`
- Candidate name: `Daily Report Log Readonly Cache Transformation`
- Record date: `2026-03-22`
- Transformation type: `speed`
- Discovery intake path: `discovery/intake/2026-03-22-daily-report-log-readonly-cache-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/daily-report-log-service.ts` and `mission-control/src/server/repositories/reports-repo.ts`
- Current implementation: every readonly `listDailyReportLogs(... { materializeFiles: false, includeContent: false })` call rebuilt the same grouped daily-log summary surface from report rows, even when the report set had not changed.
- Measured baseline:
  - metric: `daily report readonly repeated-call wall-clock ms`
  - value: `43.39`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-daily-report-log-readonly.ts 5`, timing the legacy readonly daily-log builder with no cache reuse

## After State

- Proposed change: add a short-lived readonly cache for the non-materializing daily-log path and clear it on report mutation / daily-log sync so repeated callers can reuse the same grouped result safely.
- Preservation claim: readonly daily-log items, previews, grouping, and order remain identical; only repeated reconstruction work is removed when the underlying reports have not changed.
- Expected improvement:
  - metric: `daily report readonly repeated-call wall-clock ms`
  - target value: `19.53`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-daily-report-log-readonly.ts 5`, timing the warmed readonly daily-log path after one cache-populating call

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-daily-report-log-readonly.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-22-daily-report-log-readonly-cache-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-22-daily-report-log-readonly-cache-transformation-proof.json`

## Proof

- Correctness preserved: `yes - cached readonly daily-log output matched the legacy readonly builder exactly on the real control-plane project`
- Metric improvement measured: `yes - 43.39ms -> 19.53ms average (-23.86ms, -55.0%) across 5 real control-plane runs`
- Rollback path: `remove the readonly cache in mission-control/src/server/services/daily-report-log-service.ts, remove cache invalidation calls in mission-control/src/server/repositories/reports-repo.ts, remove mission-control/scripts/benchmark-daily-report-log-readonly.ts if undesired, and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - reduce repeated daily-log context reconstruction on host paths that reuse the same readonly summary surface`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
