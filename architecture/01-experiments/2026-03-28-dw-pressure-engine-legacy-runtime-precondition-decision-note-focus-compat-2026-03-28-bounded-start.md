# Legacy Runtime Precondition/Decision Note Focus Compatibility Bounded Architecture Start

- Candidate id: dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28
- Candidate name: Legacy Runtime Precondition/Decision Note Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical agent-orchestrator precondition/decision note family as read-only Runtime state instead of throwing unsupported-path errors.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `engine/state/index.ts` and focused repo checks.
- Support the three agent-orchestrator precondition/decision notes only.
- Keep the notes historical and read-only.
- Preserve truthful follow-up linkage where the notes explicitly carry it.
- Do not infer live proof, host promotion, registry, or Runtime v0 continuation in this slice.
- Inputs:
- The remaining unsupported direct Runtime focus now includes a stable three-file agent-orchestrator precondition/decision note family.
- The canonical resolver still throws `unsupported Runtime artifact path` for those notes.
- The truth anchor should inspect them directly without inventing Runtime v0 continuation.
- Expected output:
- One bounded Architecture experiment slice that resolves the historical agent-orchestrator precondition/decision note family cleanly through the canonical report and composition check.
- Validation gate(s):
- `legacy_runtime_precondition_decision_note_focus_resolves`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the note family historical and read-only, and stop before broader operational-note normalization.
- Failure criteria: The resolver still throws on the historical agent-orchestrator precondition/decision notes, or the slice starts inventing Runtime continuation semantics beyond read-only history.
- Rollback: Revert the legacy Runtime precondition/decision-note compatibility slice, revert focused repo checks, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-engine-handoff.md`

