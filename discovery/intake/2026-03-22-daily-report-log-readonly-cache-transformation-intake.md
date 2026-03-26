# Discovery Fast Path: Daily Report Log Readonly Cache Transformation

- Candidate id: `dw-transform-daily-report-log-readonly-cache`
- Candidate name: `Daily Report Log Readonly Cache Transformation`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/daily-report-log-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce repeated readonly daily-log reconstruction in context assembly paths`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- reduces repeated readonly daily-log reconstruction work for context-pack and related host paths
- preserves the existing readonly daily-log output exactly while using bounded cache reuse
- strengthens the behavior-preserving transformation lane with explicit mutation invalidation instead of blind staleness

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Add a short-lived readonly cache for `listDailyReportLogs(userId, projectId, { materializeFiles: false, includeContent: false })`, with explicit invalidation on report create/delete and on daily-log file sync, without changing:
- readonly daily-log output
- materialized daily-log output
- daily report markdown generation
- report mutation behavior

## Proof Boundary Notes

- keep the change inside `daily-report-log-service.ts`, `reports-repo.ts`, and a dedicated readonly benchmark
- preserve parity against the legacy readonly daily-log output
- benchmark repeated readonly calls on the real control-plane project, where the same daily-log summary surface is reused across context-building paths

## Result Link

- Runtime record: `runtime/records/2026-03-22-daily-report-log-readonly-cache-transformation-record.md`
