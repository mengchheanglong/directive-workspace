# Legacy Runtime Proof Checklist Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-proof-checklist-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical Scientify runtime proof checklist is still part of product Runtime history, but the canonical resolver cannot inspect that checklist artifact directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical Runtime proof checklist as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md` only.
- Preserve the checklist artifact as historical and read-only.
- Do not map the linked live-fetch proof as a new direct focus in this slice.
- Do not map promotion, registry, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime proof checklist: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md`
- Linked legacy Runtime record: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-record.md`
- Linked legacy Runtime slice proof: `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_proof_checklist_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime proof-checklist compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or conflating the live-fetch proof contract.

## Next decision

- `adopt`
