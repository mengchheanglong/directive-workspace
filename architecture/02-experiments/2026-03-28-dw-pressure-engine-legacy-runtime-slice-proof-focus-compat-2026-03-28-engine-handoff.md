# Legacy Runtime Slice Proof Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28`
- Source reference: `runtime/records/2026-03-21-promptfoo-runtime-slice-01-proof.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical `runtime/records/*-runtime-slice-01-proof.md` family is still part of product Runtime history, but the canonical resolver cannot inspect those proof artifacts directly yet, which leaves stale `completed_inconsistent` queue rows.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical runtime-slice proof family as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support the historical `runtime/records/*-runtime-slice-01-proof.md` family only.
- Preserve those proof artifacts as historical and read-only.
- Do not map runtime-slice execution, proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime slice proof: `runtime/records/2026-03-21-promptfoo-runtime-slice-01-proof.md`
- Legacy Runtime slice proof: `runtime/records/2026-03-21-agent-orchestrator-cli-runtime-slice-01-proof.md`
- Legacy Runtime slice proof: `runtime/records/2026-03-21-superpowers-runtime-slice-01-proof.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_slice_proof_focus_resolves`
- `legacy_runtime_slice_proof_queue_status_clean`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime slice-proof compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or conflating the execution/checklist family.

## Next decision

- `adopt`
