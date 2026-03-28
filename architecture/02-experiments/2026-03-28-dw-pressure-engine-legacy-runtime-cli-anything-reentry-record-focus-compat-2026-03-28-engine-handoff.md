# Legacy Runtime CLI-Anything Re-entry Record Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28`
- Source reference: `runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical CLI-Anything re-entry preconditions note already matches the legacy Runtime record contract, but the canonical resolver still rejects it because the filename does not match the narrow legacy-record path pattern.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical CLI-Anything re-entry preconditions note as read-only legacy Runtime record state instead of throwing an unsupported-path error.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only `runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md`.
- Reuse the existing legacy Runtime record reader instead of inventing a new note family.
- Preserve the note as historical and read-only.
- Preserve explicit follow-up linkage and proposed host exactly as recorded.
- Do not infer live Runtime v0 continuation, promotion, registry, or execution.

## Inputs

- Historical CLI-Anything re-entry note: `runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_cli_anything_reentry_record_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the narrow path-recognition widening for the CLI-Anything re-entry note and delete this DEEP case chain if the canonical resolver starts overstating Runtime continuation or begins treating unrelated historical notes as live Runtime records.

## Next decision

- `adopt`
