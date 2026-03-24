# Discovery Fast Path: Repo Snapshot Internal Cache Transformation

- Candidate id: `dw-transform-repo-snapshot-internal-cache`
- Candidate name: `Repo Snapshot Internal Cache Transformation`
- Date: `2026-03-23`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce repo-snapshot rebuild cost when the outer snapshot cache misses`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Forge transformation candidate.

Useful value:
- reduces repo-snapshot rebuild cost even when the outer snapshot cache is cleared or expired
- keeps summary, git status, route count, key-file count, and code-intel tool count identical
- adds bounded reuse for git and static repo surfaces without widening into unrelated runtime behavior

## Routing Decision

- Primary adoption target: `Directive Forge`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Add short-lived internal caches beneath `buildRepoSnapshot(project)` for:
- git snapshot
- static repo surfaces (package-derived stack, dashboard surfaces, api routes, scripts, verification presets, workspace areas, key files, hotspots)

without changing:
- `RepoSnapshot` shape
- snapshot summary semantics
- git summary semantics
- route discovery behavior

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts` plus a dedicated benchmark
- benchmark the case where the outer repo-snapshot cache is cleared but the internal caches remain warm
- preserve summary / route / key-file / code-intel parity on the control-plane project

## Result Link

- Forge record: `forge/records/2026-03-23-repo-snapshot-internal-cache-transformation-record.md`
