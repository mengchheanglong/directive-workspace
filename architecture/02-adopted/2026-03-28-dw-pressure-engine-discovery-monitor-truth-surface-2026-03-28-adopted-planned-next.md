# Adopted Planned Next: Engine Discovery Monitor Truth Surface (2026-03-28)

## adoption
- Candidate id: `dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28`
- Candidate name: Engine Discovery Monitor Truth Surface
- Source bounded result: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-result.md`
- Adoption decision: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-result-adoption-decision.json`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status: `adopt_planned_next`

## adopted value
- Add one canonical Discovery monitor truth surface so real monitor artifacts resolve directly and routed monitor cases can point at the held monitor artifact as the current head.

## planned next
- Materialize the bounded shared-lib change in `shared/lib/dw-state.ts`.
- Add checker coverage proving both direct monitor focus and routed monitor current-head resolution.
- Stop after verification.

## rollback
- Revert the shared-lib change, revert the checker coverage, and remove this DEEP case chain if later Discovery policy changes the monitor-artifact contract.

