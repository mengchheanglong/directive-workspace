# Legacy Runtime Handoff Focus Compatibility Bounded Architecture Result

- Candidate id: dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28
- Candidate name: Legacy Runtime Handoff Focus Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: not explicitly recorded in the compact bounded result artifact; reconstructed from bounded start `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical state resolver treat the two legacy architecture-to-runtime handoffs as read-only Runtime focus artifacts instead of crashing report resolution.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `shared/lib/dw-state.ts` and checker coverage.
- Add direct focus support for the two legacy Runtime handoffs only.
- Keep the handoffs historical and read-only.
- Do not map legacy Runtime records, legacy Runtime follow-up execution chains, or old promotion / registry semantics.
- Inputs:
- `resolveDirectiveWorkspaceState(...)` currently crashes on the two legacy `runtime/handoff/*.md` artifacts.
- The workbench already treats those artifacts as readable historical Runtime handoffs.
- The canonical truth anchor should support direct inspection without inventing Runtime v0 continuation state.
- Expected output:
- One bounded Architecture experiment slice that resolves the two legacy Runtime handoffs directly through the canonical report and whole-product composition check.
- Validation gate(s):
- `legacy_runtime_handoff_focus_resolves`
- `legacy_runtime_handoff_scope_preserved`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: The canonical resolver still crashes or overstates a new Runtime v0 continuation for the historical handoff artifacts.
- Rollback: Revert the legacy Runtime handoff compatibility slice, revert checker coverage, and delete this DEEP case chain.
- Result summary: Canonical Runtime truth now resolves the two legacy architecture-to-runtime handoffs directly as read-only historical Runtime state instead of throwing.
- Evidence path:
- Primary evidence path: `shared/lib/dw-state.ts`
- Bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Closeout decision artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`

## Closeout decision

- Verdict: `adopt`
- Rationale: This is a bounded shared-truth compatibility fix that removes real report crashes on the two known legacy Runtime handoffs without widening old Runtime execution or promotion semantics.
- Review result: `not_run`
- Review score: `n/a`
