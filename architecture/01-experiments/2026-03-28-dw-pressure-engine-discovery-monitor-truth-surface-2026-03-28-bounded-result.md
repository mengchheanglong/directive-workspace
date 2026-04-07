# Engine Discovery Monitor Truth Surface Bounded Architecture Result

- Candidate id: dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28
- Candidate name: Engine Discovery Monitor Truth Surface
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: not explicitly recorded in the compact bounded result artifact; reconstructed from bounded start `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that adds first-class `discovery/monitor` resolver support and lets a completed monitor route resolve through the live monitor artifact as the current head.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to `engine/state/index.ts` and checker coverage.
- Add a minimal monitor-record reader and direct focus path.
- Let monitor routes resolve their live current head through the linked monitor artifact when it exists.
- Do not broaden into generic Discovery completion parsing, queue precedence redesign, or historical normalization.
- Inputs:
- `resolveDirectiveWorkspaceState(...)` currently throws on `discovery/04-monitor/*.md`.
- The real monitor case is `discovery/04-monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md`.
- The queue surface already shows this is the only healthy completed row whose live current head still differs from its `result_record_path`.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `discovery_monitor_truth_surface_complete`
- `discovery_monitor_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Revert the monitor resolver support, revert the checker coverage, and delete this DEEP case chain.
- Result summary: Canonical Discovery truth now resolves `discovery/04-monitor/*.md` directly, and monitor routes can use the linked monitor artifact as the live current head.
- Evidence path:
- Primary evidence path: `engine/state/index.ts`
- Bounded start: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `engine/state/index.ts`
- `scripts/check-directive-workspace-composition.ts`

## Closeout decision

- Verdict: `adopt`
- Rationale: The monitor artifact is a real current-era Discovery output, and this bounded shared-truth fix makes that held artifact directly resolvable without broadening into queue policy or generic Discovery completion parsing.
- Review result: `not_run`
- Review score: `n/a`

