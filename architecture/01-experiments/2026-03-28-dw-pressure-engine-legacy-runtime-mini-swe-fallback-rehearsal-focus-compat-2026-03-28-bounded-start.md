# Legacy Runtime Mini-SWE Fallback Rehearsal Focus Compatibility Bounded Architecture Start

- Candidate id: dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28
- Candidate name: Legacy Runtime Mini-SWE Fallback Rehearsal Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical mini-swe fallback rehearsal as read-only legacy Runtime slice-execution state instead of throwing an unsupported-path error.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `engine/state/index.ts` and focused repo checks.
- Support only `runtime/legacy-records/2026-03-20-mini-swe-agent-fallback-rehearsal.md`.
- Reuse the existing legacy Runtime slice-execution reader instead of inventing a new note family.
- Keep the note historical and read-only.
- Do not infer a linked proof artifact when no truthful proof path exists.
- Do not infer live Runtime v0 continuation, promotion, or host execution surfaces.
- Inputs:
- The remaining unsupported direct Runtime focus includes one stable mini-swe fallback rehearsal note.
- The canonical resolver should inspect that note directly without inventing proof linkage or live Runtime continuation.
- Expected output:
- One bounded Architecture experiment slice that resolves the historical mini-swe fallback rehearsal cleanly through the canonical report and composition check.
- Validation gate(s):
- `legacy_runtime_mini_swe_fallback_rehearsal_focus_resolves`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the note historical and read-only, and stop before trying to normalize the daily-status digest.
- Failure criteria: The resolver still throws on the historical fallback rehearsal, or the slice starts inventing linked proof or Runtime continuation semantics that the note does not explicitly support.
- Rollback: Revert the narrow legacy slice-execution path-recognition widening, revert focused repo checks, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-engine-handoff.md`

