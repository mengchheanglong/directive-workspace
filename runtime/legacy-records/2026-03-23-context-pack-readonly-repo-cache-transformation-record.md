# Transformation Record: Context Pack Readonly Repo Cache Transformation

- Candidate id: `dw-transform-context-pack-readonly-repo-cache`
- Candidate name: `Context Pack Readonly Repo Cache Transformation`
- Record date: `2026-03-23`
- Transformation type: `speed`
- Discovery intake path: `discovery/01-intake/2026-03-23-context-pack-readonly-repo-cache-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/repositories/docs-repo.ts`, `mission-control/src/server/repositories/quests-repo.ts`, `mission-control/src/server/repositories/notes-repo.ts`, and `mission-control/src/server/repositories/reports-repo.ts`
- Current implementation: repeated context-pack reads reloaded the same readonly repo surfaces on every call, even when project state had not changed.
- Measured baseline:
  - metric: `context pack readonly repo bundle wall-clock ms`
  - value: `9.51`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-readonly-repos.ts 5`, clearing the readonly repo caches before every run and timing the bundle of `listQuests`, `listReports`, `listDocs`, and `listNotes`

## After State

- Proposed change: add short-lived readonly caches to the four repo list surfaces and clear them on local create/update/delete paths so repeated context-pack reads can reuse the same list results safely.
- Preservation claim: quest ids, report ids, doc ids, note ids, ordering, and content remain identical; only repeated readonly reconstruction work is removed when the underlying repo-backed state has not changed.
- Expected improvement:
  - metric: `context pack readonly repo bundle wall-clock ms`
  - target value: `0.02`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-readonly-repos.ts 5`, timing the warmed readonly repo list bundle after one cache-populating call

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-context-pack-readonly-repos.ts 5 && npx tsx ./scripts/benchmark-context-pack-phases.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `runtime/legacy-records/2026-03-23-context-pack-readonly-repo-cache-transformation-proof.json`
- Result artifact path: `runtime/legacy-records/2026-03-23-context-pack-readonly-repo-cache-transformation-proof.json`

## Proof

- Correctness preserved: `yes - cached readonly repo bundle returned the same quest/report/doc/note ids as the uncached bundle on the real control-plane project`
- Metric improvement measured: `yes - 9.51ms -> 0.02ms average (-9.49ms, -99.8%) across 5 real control-plane runs`
- Secondary signal: `benchmark-context-pack-phases.ts` moved the broader `loadDataMs` average from the earlier 125.17ms range down to 25.72ms, with warmed runs landing around 12-17ms`
- Rollback path: `remove the readonly caches and invalidation helpers from the four repository modules, remove mission-control/scripts/benchmark-context-pack-readonly-repos.ts if undesired, and remove the new Discovery / Runtime transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Runtime`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - reduce repeated repo-backed context assembly cost on central context-pack paths`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
