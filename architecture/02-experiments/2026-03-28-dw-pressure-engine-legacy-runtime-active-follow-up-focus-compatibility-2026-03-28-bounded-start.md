# Legacy Runtime Active Follow-Up Focus Compatibility Bounded Architecture Start

- Candidate id: dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28
- Candidate name: Legacy Runtime Active Follow-Up Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical resolver and workbench follow-up detail treat the active bounded Scientify Runtime follow-up as read-only historical Runtime state instead of a broken deferred-contract case.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `shared/lib/dw-state.ts`, `hosts/web-host/data.ts`, and focused repo checks.
- Support the structured active bounded follow-up at `runtime/follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md`.
- Preserve deferred legacy follow-up requirements.
- Do not map legacy Runtime records, legacy Runtime execution history, or old promotion / registry semantics.
- Inputs:
- `resolveDirectiveWorkspaceState(...)` currently marks the structured legacy Scientify Runtime follow-up as broken because it treats `n/a - active bounded follow-up` as a missing deferred re-entry contract.
- `readDirectiveWorkbenchHandoffDetail(...)` still rejects that artifact for the same reason.
- The artifact already carries a bounded historical Runtime contract and should resolve as read-only legacy state without weakening deferred follow-up gates.
- Expected output:
- One bounded Architecture experiment slice that resolves the structured legacy Scientify Runtime follow-up cleanly through the canonical report and workbench host check.
- Validation gate(s):
- `legacy_runtime_active_follow_up_focus_resolves`
- `legacy_runtime_active_follow_up_scope_preserved`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the artifact historical and read-only, and stop before any Runtime continuation or normalization of broader legacy history.
- Failure criteria: The resolver or workbench detail still treats the active bounded legacy follow-up as broken, or the slice weakens deferred follow-up requirements.
- Rollback: Revert the legacy Runtime active follow-up compatibility slice, revert focused repo checks, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-engine-handoff.md`
