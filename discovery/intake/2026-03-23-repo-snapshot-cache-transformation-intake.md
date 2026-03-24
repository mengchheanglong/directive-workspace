# Discovery Fast Path: Repo Snapshot Cache Transformation

- Candidate id: `dw-transform-repo-snapshot-cache`
- Candidate name: `Repo Snapshot Cache Transformation`
- Date: `2026-03-23`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - remove repeated repo-snapshot reconstruction across host context paths`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Forge transformation candidate.

Useful value:
- removes repeated repo-snapshot reconstruction work across repeated dashboard/context reads
- preserves repo-snapshot output inside a short bounded cache window
- strengthens the behavior-preserving transformation lane with a measurable host-level cache on a previously dominant repeated hotspot

## Routing Decision

- Primary adoption target: `Directive Forge`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Add a short-lived cache around `buildRepoSnapshot(project)` so repeated calls reuse the same snapshot for a bounded interval, without changing:
- snapshot structure
- snapshot summary semantics
- code-intel payload shape
- git payload shape

Bounded tradeoff:
- repo snapshot can be stale for up to the cache TTL (`10s`)

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts` and a dedicated benchmark script
- benchmark uncached repeated builds against the warmed cached path on the real control-plane project
- keep cache control explicit via `clearRepoSnapshotCache`

## Result Link

- Forge record: `forge/records/2026-03-23-repo-snapshot-cache-transformation-record.md`
