# Legacy Runtime Validation-Note Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical Runtime docs-maintenance validation notes still carry product truth, but the canonical resolver cannot inspect that validation note pair directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical Runtime docs-maintenance validation notes as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only:
  - `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation.md`
  - `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation-rerun.md`
- Preserve the validation notes as historical and read-only.
- Do not infer live proof, host, or runtime continuation linkage in this slice.
- Do not normalize broader status-digest, rehearsal, or decision-note families in this slice.

## Inputs

- Legacy Runtime validation note: `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation.md`
- Legacy Runtime validation rerun note: `runtime/legacy-records/2026-03-20-agentics-docs-maintenance-validation-rerun.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_validation_note_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime validation-note compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or inventing host linkage for the validation notes.

## Next decision

- `adopt`
