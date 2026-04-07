# Engine Discovery Monitor Truth Surface Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28`
- Source reference: `shared/lib/dw-state.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T08-35-07-216Z-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-34f1b525.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md`
- Discovery monitor record: `discovery/04-monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Queue read surface: `hosts/web-host/data.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the monitor route now resolves cleanly, but the real monitor artifact is still unsupported as a direct canonical focus path and the queue still cannot treat that held artifact as the live current head through resolver-owned truth.

## Objective

Open one bounded DEEP Architecture slice that adds first-class `discovery/monitor` resolver support and lets a completed monitor route resolve through the live monitor artifact as the current head.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to `shared/lib/dw-state.ts` and checker coverage.
- Add a minimal monitor-record reader and direct focus path.
- Let monitor routes resolve their live current head through the linked monitor artifact when it exists.
- Do not broaden into generic Discovery completion parsing, queue precedence redesign, or historical normalization.

## Inputs

- `resolveDirectiveWorkspaceState` currently throws on `discovery/04-monitor/*.md`.
- The real monitor case is `discovery/04-monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md`.
- The queue surface already shows this is the only healthy completed row whose live current head still differs from its `result_record_path`.

## Validation gate(s)

- `discovery_monitor_truth_surface_complete`
- `discovery_monitor_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the monitor resolver support, revert the checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
