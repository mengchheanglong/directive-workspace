# Implementation Target: Legacy Runtime Transformation Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Transformation Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime transformation record/proof family without opening runtime-slice execution, checklist, registry, or callable continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the transformation artifacts as read-only historical Runtime state.
- Allow the single older `candidate_id` / `baseline_measurement` JSON variant already present in the repo.
- Do not map legacy runtime-slice proof/execution, proof-checklist, registry, or callable continuation semantics.

## inputs
- Legacy Runtime transformation record: `runtime/records/2026-03-22-context-pack-async-latency-transformation-record.md`
- Legacy Runtime transformation proof: `runtime/records/2026-03-22-context-pack-async-latency-transformation-proof.json`
- Legacy Runtime transformation record: `runtime/records/2026-03-22-v0-normalizer-transformation-record.md`
- Legacy Runtime transformation proof: `runtime/records/2026-03-22-v0-normalizer-transformation-proof.json`
- Legacy Runtime transformation record: `runtime/records/2026-03-23-repo-snapshot-code-intel-cache-transformation-record.md`
- Legacy Runtime transformation proof: `runtime/records/2026-03-23-repo-snapshot-code-intel-cache-transformation-proof.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the transformation artifacts as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not map legacy runtime-slice proof/execution, proof-checklist, registry, or callable continuation semantics in this slice.
- Rollback boundary: revert the legacy Runtime transformation compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_transformation_focus_resolves`
- `legacy_runtime_transformation_scope_preserved`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves representative historical transformation records and proof JSONs cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime transformation record/proof handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for representative historical transformation records and proof JSONs.

## mechanical success criteria
- The canonical report no longer throws on representative `*-transformation-record.md` artifacts.
- The canonical report no longer throws on representative `*-transformation-proof.json` artifacts.
- The historical Runtime transformation artifacts resolve as read-only Runtime state.
- `npm run check` still passes.

## explicit limitations
- No legacy runtime-slice proof/execution mapping is attempted.
- No proof-checklist mapping is attempted.
- No registry or callable continuation mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime transformation record/proof family.
