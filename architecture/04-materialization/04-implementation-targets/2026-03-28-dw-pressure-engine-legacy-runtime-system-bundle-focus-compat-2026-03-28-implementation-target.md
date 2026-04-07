# Implementation Target: Legacy Runtime System-Bundle Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime System-Bundle Focus Compatibility
- Source adoption artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime system-bundle note family without opening host, promotion, registry, or live Runtime continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the system-bundle notes as read-only historical Runtime state.
- Support only:
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-02-boundary-inventory.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-03-source-pack-catalog-cleanup.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-04-promotion-profile-normalization.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-05-import-source-policy-alignment.md`
  - `runtime/legacy-records/2026-03-21-runtime-system-bundle-06-legacy-live-runtime-normalization.md`
- Do not infer live proof, host, registry, or promotion linkage in this slice.
- Do not map Mission Control mirrors or host-owned surfaces into active Runtime v0 continuation.

## inputs
- Legacy Runtime system-bundle 02 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-02-boundary-inventory.md`
- Legacy Runtime system-bundle 03 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-03-source-pack-catalog-cleanup.md`
- Legacy Runtime system-bundle 04 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-04-promotion-profile-normalization.md`
- Legacy Runtime system-bundle 05 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-05-import-source-policy-alignment.md`
- Legacy Runtime system-bundle 06 note: `runtime/legacy-records/2026-03-21-runtime-system-bundle-06-legacy-live-runtime-normalization.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/01-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the system-bundle notes as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not infer live proof, host, registry, or promotion linkage in this slice.
- Do not map Mission Control mirrors or host-owned surfaces into active Runtime v0 continuation.
- Rollback boundary: revert the legacy Runtime system-bundle compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_system_bundle_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical system-bundle notes cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime system-bundle handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for the five historical Runtime system-bundle notes.

## mechanical success criteria
- The canonical report no longer throws on the five historical Runtime system-bundle notes.
- `npm run check` still passes.
- The composition check covers the new read-only system-bundle note paths.

## explicit limitations
- No live proof, host, registry, or promotion linkage is inferred.
- No Mission Control mirror semantics are mapped into active Runtime continuation.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime system-bundle note family.

