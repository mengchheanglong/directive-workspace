# Implementation Target: Engine Discovery Monitor Truth Surface (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28`
- Candidate name: Engine Discovery Monitor Truth Surface
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-adopted-planned-next.md`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Target approval: `directive-lead-implementer`

## implementation objective
- Land one bounded shared-lib change so Discovery monitor artifacts resolve directly and routed monitor cases can expose the monitor artifact as the live current head.

## implementation scope
- Update `shared/lib/dw-state.ts`.
- Update `scripts/check-directive-workspace-composition.ts`.
- Keep generic Discovery completion parsing, queue precedence redesign, and historical normalization out of scope.

## proof target
- The real monitor artifact resolves with `integrityState = ok`.
- The routed monitor case resolves with `currentStage = discovery.monitor.active`.
- The completed monitor queue entry points at the monitor artifact as `current_head`.
- `npm run check` passes.

## rollback
- Revert the monitor resolver support, revert the checker coverage, and remove this DEEP case chain if the slice no longer looks clearly bounded.
