# Discovery Fast Path: Context Pack Readonly Repo Cache Transformation

- Candidate id: `dw-transform-context-pack-readonly-repo-cache`
- Candidate name: `Context Pack Readonly Repo Cache Transformation`
- Date: `2026-03-23`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/repositories/docs-repo.ts`, `mission-control/src/server/repositories/quests-repo.ts`, `mission-control/src/server/repositories/notes-repo.ts`, `mission-control/src/server/repositories/reports-repo.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce repeated readonly repository load cost on context-pack assembly paths`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- removes repeated readonly repo query / file-load work from context-pack assembly when the underlying project state has not changed
- keeps the data contract identical by caching only list results and clearing the cache on local mutations
- strengthens the behavior-preserving transformation lane on a central host path without widening into architecture-only paperwork

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Add short-lived readonly caches for:
- `listDocs(userId, projectId)`
- `listQuests(userId, projectId, opts)`
- `listNotes(userId, projectId)`
- `listReports(userId, projectId, opts)`

with explicit invalidation on local create/update/delete mutation paths, without changing:
- returned ids, ordering, or content
- repo mutation semantics
- context-pack shape
- workspace-readiness logic

## Proof Boundary Notes

- keep the change inside the affected repository modules plus a dedicated readonly benchmark
- preserve parity for quest ids, report ids, doc ids, and note ids on the control-plane project
- use the broad context-pack phase benchmark only as a secondary signal for the `loadData` phase

## Result Link

- Runtime record: `runtime/records/2026-03-23-context-pack-readonly-repo-cache-transformation-record.md`
