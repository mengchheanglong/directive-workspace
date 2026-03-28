# Adopted Planned Next: Engine Discovery-Held Route Equivalence Hardening (2026-03-28)

## adoption
- Candidate id: `dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28`
- Candidate name: Engine Discovery-Held Route Equivalence Hardening
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-bounded-result.md`
- Adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status: `adopt_planned_next`

## adopted value
- Treat Discovery-held route destinations as compatible with Engine lane `discovery` so canonical route integrity does not mark real monitor/defer/reject/reference routes as broken lane mismatches.

## planned next
- Materialize the bounded shared-lib change in `shared/lib/dw-state.ts`.
- Add composition coverage proving the real monitor route resolves cleanly.
- Stop after verification.

## rollback
- Revert the shared-lib change, revert the checker coverage, and remove this DEEP case chain if later Discovery policy changes the meaning of held routes.
