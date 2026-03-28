# Legacy Runtime Transformation Focus Compatibility Bounded Architecture Start

- Candidate id: dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28
- Candidate name: Legacy Runtime Transformation Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical transformation record/proof family as read-only Runtime state instead of throwing unsupported-path errors.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `shared/lib/dw-state.ts` and focused repo checks.
- Support the historical `*-transformation-record.md` and `*-transformation-proof.json` family only.
- Allow the single older `candidate_id` / `baseline_measurement` JSON variant already present in the repo.
- Keep those transformation artifacts historical and read-only.
- Do not map legacy runtime-slice proof/execution, proof-checklist, registry, or callable continuation semantics.
- Inputs:
- `resolveDirectiveWorkspaceState(...)` still throws `unsupported Runtime artifact path` for historical transformation records and proof JSON artifacts.
- Those artifacts share a stable transformation contract with candidate identity, transformation type, proof/result references, and optional linked promotion evidence.
- The canonical truth anchor should inspect them directly without inventing Runtime v0 continuation.
- Expected output:
- One bounded Architecture experiment slice that resolves representative historical Runtime transformation records and proofs cleanly through the canonical report and composition check.
- Validation gate(s):
- `legacy_runtime_transformation_focus_resolves`
- `legacy_runtime_transformation_scope_preserved`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the transformation artifacts historical and read-only, and stop before any runtime-slice proof/execution or checklist normalization.
- Failure criteria: The resolver still throws on the historical transformation family, or the slice starts inventing Runtime continuation semantics beyond read-only history.
- Rollback: Revert the legacy Runtime transformation compatibility slice, revert focused repo checks, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-engine-handoff.md`
