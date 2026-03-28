# Legacy Runtime Transformation Label-Link Normalization Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28`
- Source reference: `runtime/records/2026-03-22-remaining-backend-test-boilerplate-transformation-record.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: two historical `runtime/records/*-transformation-record.md` artifacts still encode descriptive baseline/result labels like `this record (...)`, and the canonical resolver currently misreads those notes as broken linked artifact paths.

## Objective

Open one bounded DEEP Architecture slice that normalizes descriptive non-artifact baseline/result labels in historical Runtime transformation records so the canonical resolver treats them as notes instead of broken links.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only the descriptive baseline/result labels inside historical transformation records.
- Keep those transformation artifacts historical and read-only.
- Do not map runtime-slice proof/execution, proof-checklist, registry, promotion, or callable continuation semantics in this slice.

## Inputs

- Legacy Runtime transformation record: `runtime/records/2026-03-22-remaining-backend-test-boilerplate-transformation-record.md`
- Legacy Runtime transformation record: `runtime/records/2026-03-22-automation-test-boilerplate-transformation-record.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_transformation_label_notes_normalized`
- `legacy_runtime_transformation_scope_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the label-link normalization slice and delete this DEEP case chain if the resolver starts hiding real artifact-link breakage instead of descriptive note fields.

## Next decision

- `adopt`
