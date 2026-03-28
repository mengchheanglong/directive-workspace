# Implementation Result: Engine Discovery-Held Route Equivalence Hardening (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28`
- Candidate name: Engine Discovery-Held Route Equivalence Hardening
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: stop the canonical Discovery route resolver from flagging Discovery-held destinations as false lane mismatches against Engine lane `discovery`.

## completed tactical slice
- Hardened `shared/lib/dw-state.ts` so Discovery-held route destinations (`monitor`, `defer`, `reject`, `reference`) are treated as compatible with Engine lane `discovery` during route integrity validation.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` proving the real monitor route resolves cleanly.
- Updated the completed monitor queue expectation so it stays `completed` instead of surfacing a false `completed_inconsistent` warning.

## actual result summary
- Canonical Discovery route truth is now stricter in one bounded seam: it no longer marks a real Discovery-held monitor route as broken just because the route destination is more specific than Engine lane `discovery`.

## mechanical success criteria check
- The real monitor route now resolves with `integrityState = ok`.
- The completed monitor queue entry now preserves `status_effective = completed`.
- `npm run check` passed.
- `npm run report:directive-workspace-state` passed.

## explicit limitations carried forward
- This slice does not add first-class monitor-artifact parsing.
- This slice does not rewrite queue lifecycle semantics.
- It does not broaden into generic stale-status repair or Discovery workflow redesign.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: discovery_held_route_equivalence_complete, discovery_held_route_scope_preserved, decision_review, workspace_check_ok.

## evidence
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run check`
- `npm run report:directive-workspace-state`

## rollback note
- Revert the Discovery-held route equivalence guard and remove this DEEP case chain if later Discovery policy needs a different held-route model.
