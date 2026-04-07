# Legacy Runtime Follow-up Focus Compatibility Bounded Architecture Start

- Candidate id: dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28
- Candidate name: Legacy Runtime Follow-up Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical state resolver treat the deferred legacy CLI-anything Runtime follow-up as a read-only Runtime focus instead of crashing report resolution.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `engine/state/index.ts` and checker coverage.
- Add one legacy Runtime follow-up parser and direct focus path.
- Keep the legacy follow-up historical and read-only.
- Do not map legacy Runtime records, legacy Runtime handoffs, or execution-era promotion semantics.
- Inputs:
- `resolveDirectiveWorkspaceState(...)` currently crashes on `runtime/00-follow-up/2026-03-20-cli-anything-runtime-follow-up-record.md`.
- The host already treats that artifact as readable legacy Runtime history.
- The canonical truth anchor should support direct inspection without inventing Runtime v0 continuation state.
- Expected output:
- One bounded Architecture experiment slice that resolves the deferred legacy Runtime follow-up directly through the canonical report and whole-product composition check.
- Validation gate(s):
- `legacy_runtime_follow_up_focus_resolves`
- `legacy_runtime_follow_up_route_truth_preserved`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The canonical resolver still crashes or overstates a new Runtime v0 continuation for the historical deferred follow-up.
- Rollback: Revert the legacy Runtime follow-up compatibility slice, revert checker coverage, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`

