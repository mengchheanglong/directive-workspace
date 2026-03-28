# Engine Discovery Required-Next-Artifact Legality Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28`
- Source reference: `shared/lib/dw-state.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Integrity gate: `engine/workspace-truth.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: Discovery routing can still present a legal next step when a concrete required downstream artifact is absent and the queue no longer carries a downstream stub. One bounded resolver-side legality rule would downgrade that false-positive route to blocked instead of leaving it apparently advanceable.

## Objective

Open one bounded DEEP Architecture slice that blocks Discovery route advancement when a concrete required next artifact is missing and no downstream stub can actually satisfy the claimed next step.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the change to Discovery route legality validation only.
- Mark a route inconsistent when its concrete required next artifact is missing and no downstream stub resolves.
- Add one staged composition check for the missing-required-artifact case.
- Do not broaden into generic broken-link scanning, stale-status repair, queue lifecycle redesign, or Runtime/frontend work.

## Inputs

- `shared/lib/dw-state.ts` currently records missing concrete required next artifacts on Discovery routes under `missingExpectedArtifacts`.
- `engine/workspace-truth.ts` only blocks advancement when `inconsistentLinks` are present.
- A staged Discovery route can therefore stay `integrityState = ok` and keep its approval-style `nextLegalStep` even when the concrete required next artifact is absent and no downstream stub exists.

## Validation gate(s)

- `missing_required_next_artifact_blocks_advancement`
- `legality_slice_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the narrow Discovery-route legality rule in `shared/lib/dw-state.ts`, revert the staged composition coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
