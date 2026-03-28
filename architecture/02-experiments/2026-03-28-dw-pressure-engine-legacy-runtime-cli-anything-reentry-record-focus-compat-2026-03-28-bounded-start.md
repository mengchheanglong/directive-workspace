# Legacy Runtime CLI-Anything Re-entry Record Focus Compatibility Bounded Architecture Start

- Candidate id: dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28
- Candidate name: Legacy Runtime CLI-Anything Re-entry Record Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical CLI-Anything re-entry preconditions note as read-only legacy Runtime record state instead of throwing an unsupported-path error.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only `runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md`.
- Reuse the existing legacy Runtime record reader instead of inventing a new note family.
- Keep the note historical and read-only.
- Preserve explicit follow-up linkage and proposed host exactly as recorded.
- Do not infer live Runtime v0 continuation, promotion, registry, or execution.
- Inputs:
- The remaining unsupported direct Runtime focus includes a structured CLI-Anything re-entry preconditions note.
- The note already matches the legacy Runtime record contract except for its filename shape.
- The canonical resolver should inspect it directly without inventing Runtime continuation.
- Expected output:
- One bounded Architecture experiment slice that resolves the historical CLI-Anything re-entry preconditions note cleanly through the canonical report and composition check.
- Validation gate(s):
- `legacy_runtime_cli_anything_reentry_record_focus_resolves`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the note historical and read-only, and stop before fallback-rehearsal or daily-digest normalization.
- Failure criteria: The resolver still throws on the historical CLI-Anything re-entry note, or the slice starts treating external origin evidence as in-product artifact linkage.
- Rollback: Revert the narrow legacy Runtime record path-recognition widening, revert focused repo checks, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-engine-handoff.md`
