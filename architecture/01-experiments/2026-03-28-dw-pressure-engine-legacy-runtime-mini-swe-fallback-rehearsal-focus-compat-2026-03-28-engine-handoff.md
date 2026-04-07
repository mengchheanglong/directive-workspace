# Legacy Runtime Mini-SWE Fallback Rehearsal Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-20-mini-swe-agent-fallback-rehearsal.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical mini-swe fallback rehearsal is a stable read-only execution-era note, but the canonical resolver still rejects it because its filename does not match the narrow legacy slice-execution pattern.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical mini-swe fallback rehearsal as read-only legacy Runtime slice-execution state instead of throwing an unsupported-path error.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only `runtime/legacy-records/2026-03-20-mini-swe-agent-fallback-rehearsal.md`.
- Reuse the existing legacy Runtime slice-execution reader instead of inventing a new artifact family.
- Preserve the note as historical and read-only.
- Do not infer a linked proof artifact when no truthful proof path exists.
- Do not infer live Runtime v0 continuation, promotion, or host execution surfaces.

## Inputs

- Historical mini-swe fallback rehearsal note: `runtime/legacy-records/2026-03-20-mini-swe-agent-fallback-rehearsal.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_mini_swe_fallback_rehearsal_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the narrow legacy slice-execution path-recognition widening and delete this DEEP case chain if the canonical resolver starts inventing linked proof artifacts or live Runtime continuation for the historical rehearsal note.

## Next decision

- `adopt`
