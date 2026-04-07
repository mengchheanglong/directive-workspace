# Legacy Runtime Precondition/Decision Note Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-precondition-proof.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical agent-orchestrator precondition and host-adapter decision notes still carry product truth, but the canonical resolver cannot inspect that bounded note family directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical agent-orchestrator precondition/decision note family as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only:
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-precondition-proof.md`
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-precondition-correction.md`
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-host-adapter-decision.md`
- Preserve the note family as historical and read-only.
- Preserve truthful follow-up linkage where the notes explicitly carry it.
- Do not infer live proof, host promotion, registry, or Runtime v0 continuation in this slice.

## Inputs

- Legacy Runtime precondition proof note: `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-precondition-proof.md`
- Legacy Runtime precondition correction note: `runtime/legacy-records/2026-03-21-agent-orchestrator-precondition-correction.md`
- Legacy Runtime host-adapter decision note: `runtime/legacy-records/2026-03-21-agent-orchestrator-host-adapter-decision.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_precondition_decision_note_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime precondition/decision-note compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or inventing host/runtime linkage beyond what the notes explicitly declare.

## Next decision

- `adopt`
