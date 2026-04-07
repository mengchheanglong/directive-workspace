# Discovery Fast Path: Repo Snapshot CodeGraphContext CLI Health Transformation

- Candidate id: `dw-transform-repo-snapshot-cgc-cli-health`
- Candidate name: `Repo Snapshot CodeGraphContext CLI Health Transformation`
- Date: `2026-03-23`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - remove repeated broken CodeGraphContext CLI overhead from repo snapshot and context assembly cold paths`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- stops repo snapshot from treating a broken `cgc` launcher as a valid CodeGraphContext runtime
- preserves the same missing/unavailable CodeGraphContext result while avoiding repeated failed CLI startup cost
- strengthens the verifier lane with an environment-specific benchmark for broken external tool health

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency and reliability correction on a mission-relevant host service`

## Bounded Claim

Cache broken CodeGraphContext CLI health for a bounded interval and degrade repo snapshot code-intel reporting to the same unavailable state immediately, without changing:
- repo snapshot summary semantics
- code-intel tool counts
- CodeGraphContext missing status/source for the current environment

Bounded tradeoff:
- if the `cgc` installation is repaired during the health TTL window, the host may need an explicit health-cache clear or wait for expiry before the repaired CLI is rechecked

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts` and a dedicated benchmark script
- prove parity on the CodeGraphContext status/source/error fields
- benchmark repeated repo-snapshot rebuilds with and without reusing the detected broken CLI health

## Result Link

- Runtime record: `runtime/legacy-records/2026-03-23-repo-snapshot-cgc-cli-health-transformation-record.md`
