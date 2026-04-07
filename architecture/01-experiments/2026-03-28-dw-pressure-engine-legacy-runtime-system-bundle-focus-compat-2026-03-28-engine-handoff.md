# Legacy Runtime System-Bundle Focus Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28`
- Source reference: `runtime/legacy-records/2026-03-21-runtime-system-bundle-02-boundary-inventory.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the historical Runtime system-bundle notes still carry product truth, but the canonical resolver cannot inspect that structured note family directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver treat the historical Runtime system-bundle note family as read-only Runtime state instead of throwing unsupported-path errors.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts` and focused repo checks.
- Support only:
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-02-boundary-inventory.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-03-source-pack-catalog-cleanup.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-04-promotion-profile-normalization.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-05-import-source-policy-alignment.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-06-legacy-live-runtime-normalization.md`
- Preserve the system-bundle notes as historical and read-only.
- Do not infer live proof, host, registry, or promotion linkage in this slice.
- Do not map Mission Control mirrors or host-owned surfaces into active Runtime v0 continuation.

## Inputs

- Legacy Runtime system-bundle 02 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-02-boundary-inventory.md`
- Legacy Runtime system-bundle 03 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-03-source-pack-catalog-cleanup.md`
- Legacy Runtime system-bundle 04 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-04-promotion-profile-normalization.md`
- Legacy Runtime system-bundle 05 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-05-import-source-policy-alignment.md`
- Legacy Runtime system-bundle 06 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-06-legacy-live-runtime-normalization.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`

## Validation gate(s)

- `legacy_runtime_system_bundle_focus_resolves`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy Runtime system-bundle compatibility slice and delete this DEEP case chain if the resolver starts overstating old Runtime continuation state or inventing host linkage for the bundle notes.

## Next decision

- `adopt`
