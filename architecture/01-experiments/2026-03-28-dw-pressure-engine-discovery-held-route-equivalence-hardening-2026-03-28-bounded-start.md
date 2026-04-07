# Engine Discovery-Held Route Equivalence Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28
- Candidate name: Engine Discovery-Held Route Equivalence Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-review from routed handoff `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that hardens Discovery route integrity so Discovery-held destinations (`monitor`, `defer`, `reject`, `reference`) do not masquerade as lane mismatches against Engine lane `discovery`.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to Discovery route integrity validation in `engine/state/index.ts`.
- Treat Discovery-held route destinations as compatible with Engine lane `discovery`.
- Add composition coverage proving the real `monitor` case resolves cleanly.
- Do not broaden into monitor-artifact parsing, queue lifecycle rewrite, or Discovery workflow redesign.
- Inputs:
- `engine/state/index.ts` currently compares Engine `selectedLane` directly against the literal Discovery `routeDestination`.
- `discovery/03-routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md` is a real monitor route whose Engine run correctly selected `discovery`.
- `scripts/check-directive-workspace-composition.ts` previously treated that queue row as inconsistent, which reflected the false mismatch rather than product truth.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `discovery_held_route_equivalence_complete`
- `discovery_held_route_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Revert the Discovery-held route equivalence guard, revert the checker coverage, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-engine-handoff.md`

