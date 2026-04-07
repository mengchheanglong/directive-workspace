# 2026-04-04 Runtime Runner And Sequence Tier 2 Consolidation

## Scope

Bounded Tier 2 Runtime internal maintainability slice:
- consolidate the four checkpoint runner modules behind one shared runner helper
- consolidate the two explicit Runtime two-step sequence modules behind one shared sequence helper
- keep runtime entrypoints, approval guards, stale-head guards, interruption semantics, and artifact semantics unchanged

## Completed

- Added shared checkpoint runner orchestration in `shared/lib/runtime-runner-shared.ts`.
- Migrated:
  - `shared/lib/runtime-follow-up-runner.ts`
  - `shared/lib/runtime-proof-open-runner.ts`
  - `shared/lib/runtime-capability-boundary-runner.ts`
  - `shared/lib/runtime-promotion-readiness-runner.ts`
- Added shared two-step sequence orchestration in `shared/lib/runtime-sequence-shared.ts`.
- Migrated:
  - `shared/lib/runtime-follow-up-proof-sequence.ts`
  - `shared/lib/runtime-proof-capability-boundary-sequence.ts`

## Proof

Passed:
- `npm run check:runtime-follow-up-runner-kernel`
- `npm run check:runtime-proof-open-runner-kernel`
- `npm run check:runtime-capability-boundary-runner-kernel`
- `npm run check:runtime-runner-shared-invocation`
- `npm run check:runtime-follow-up-proof-sequence`
- `npm run check:runtime-proof-capability-boundary-sequence`
- `npm run check:runtime-named-sequence-invocation`

## Remaining blocker boundary

`npm run check:runtime-promotion-readiness-runner-kernel` still fails, but the failure is not in checkpoint runner orchestration.

The direct baseline inside that kernel already diverges from current live repo truth because the current promotion-readiness artifact for `dw-real-mini-swe-agent-runtime-route-v0-2026-03-25` contains a richer DW web-host preparation bundle and host-facing promotion review section than the current opener/projection model represents.

The remaining frontier is therefore not more runner/sequence dedup. It is a broader Runtime promotion-readiness content-model redesign:
- richer optional promotion-readiness sections
- richer mirrored projection input shape
- explicit modeling of the DW web-host prep bundle and manual-promotion review stop

That seam should be handled as a separate design slice rather than folded into the runner/sequence helper extraction.
