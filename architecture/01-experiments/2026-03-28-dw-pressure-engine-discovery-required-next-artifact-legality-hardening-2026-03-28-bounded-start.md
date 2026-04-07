# Engine Discovery Required-Next-Artifact Legality Hardening Bounded Architecture Start

- Candidate id: dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28
- Candidate name: Engine Discovery Required-Next-Artifact Legality Hardening
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-review from routed handoff `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-engine-handoff.md`

- Objective: Open one bounded DEEP Architecture slice that blocks Discovery route advancement when a concrete required next artifact is missing and no downstream stub can actually satisfy the claimed next step.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the change to Discovery route legality validation only.
- Mark a route inconsistent when its concrete required next artifact is missing and no downstream stub resolves.
- Add one staged composition check for the missing-required-artifact case.
- Do not broaden into generic broken-link scanning, stale-status repair, queue lifecycle redesign, or Runtime/frontend work.
- Inputs:
- `shared/lib/dw-state.ts` currently records missing concrete required next artifacts on Discovery routes under `missingExpectedArtifacts`.
- `engine/workspace-truth.ts` only blocks advancement when `inconsistentLinks` are present.
- A staged Discovery route can therefore stay `integrityState = ok` and keep its approval-style `nextLegalStep` even when the concrete required next artifact is absent and no downstream stub exists.
- Expected output:
- One bounded Architecture experiment slice that turns this specific false-legal route into blocked truth without widening the entire integrity model.
- Validation gate(s):
- `missing_required_next_artifact_blocks_advancement`
- `legality_slice_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the existing route truth as-is and stop before adoption if the missing-required-artifact case cannot be blocked without widening unrelated link semantics.
- Failure criteria: The slice broadens into generic missing-artifact blocking, queue policy changes, or unrelated stale-status work.
- Rollback: Revert the narrow Discovery-route legality rule, revert the staged composition coverage, and delete this DEEP case chain.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-engine-handoff.md`

