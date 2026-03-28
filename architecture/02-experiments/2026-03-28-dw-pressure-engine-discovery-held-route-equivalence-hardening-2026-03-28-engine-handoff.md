# Engine Discovery-Held Route Equivalence Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28`
- Source reference: `shared/lib/dw-state.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.md`
- Discovery routing record: `discovery/routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Queue read surface: `hosts/web-host/data.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the canonical resolver currently marks a real Discovery-held `monitor` route as broken because the Engine selected lane is `discovery` while the route destination is `monitor`. One bounded equivalence rule would stop that false lane mismatch without broadening Discovery workflow mechanics.

## Objective

Open one bounded DEEP Architecture slice that hardens Discovery route integrity so Discovery-held destinations (`monitor`, `defer`, `reject`, `reference`) do not masquerade as lane mismatches against Engine lane `discovery`.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to Discovery route integrity validation in `shared/lib/dw-state.ts`.
- Treat Discovery-held route destinations as compatible with Engine lane `discovery`.
- Add composition coverage proving the real `monitor` case resolves cleanly.
- Do not broaden into monitor-artifact parsing, queue lifecycle rewrite, or Discovery workflow redesign.

## Inputs

- `shared/lib/dw-state.ts` currently compares Engine `selectedLane` directly against the literal Discovery `routeDestination`.
- `discovery/routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md` is a real monitor route whose Engine run correctly selected `discovery`.
- `scripts/check-directive-workspace-composition.ts` currently expects that queue row to surface as `completed_inconsistent`, which reflects the false mismatch rather than product truth.

## Validation gate(s)

- `discovery_held_route_equivalence_complete`
- `discovery_held_route_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the Discovery-held route equivalence guard, revert the checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
