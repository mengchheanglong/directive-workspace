# Discovery Fast Path: Repo Snapshot Code-Intel Cache Transformation

- Candidate id: `dw-transform-repo-snapshot-code-intel-cache`
- Candidate name: `Repo Snapshot Code-Intel Cache Transformation`
- Date: `2026-03-23`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - remove repeated repo code-intelligence reconstruction from repo snapshot and context assembly rebuilds`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- removes repeated code-intelligence reconstruction from repo snapshot rebuilds after the outer repo snapshot cache is cleared
- preserves the same repo snapshot summary and code-intel/code-graph output within a bounded reuse window
- strengthens the behavior-preserving transformation lane on a remaining repo-snapshot hotspot after git and broken-CLI cleanup

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host service`

## Bounded Claim

Add a short-lived per-project cache around `collectCodeIntelSnapshot(project, pkg)` so repeated repo-snapshot rebuilds can reuse the same code-intel payload for a bounded interval, without changing:
- repo snapshot summary semantics
- code-intel overall status
- code-intel tool count
- CodeGraphContext status/source/error reporting

Bounded tradeoff:
- code-intel and CodeGraphContext signals can be stale for up to the cache TTL (`10s`) unless explicitly cleared

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts` and a dedicated benchmark script
- compare fully cold repo-snapshot rebuilds against rebuilds that reuse only the code-intel snapshot
- preserve parity on repo summary and code-intel/code-graph fields

## Result Link

- Runtime record: `runtime/records/2026-03-23-repo-snapshot-code-intel-cache-transformation-record.md`
