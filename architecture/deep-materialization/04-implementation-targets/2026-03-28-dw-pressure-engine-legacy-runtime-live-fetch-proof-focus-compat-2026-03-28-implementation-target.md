# Implementation Target: Legacy Runtime Live-Fetch Proof Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Live-Fetch Proof Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical Runtime live-fetch proof without opening provider-output JSON artifacts, promotion, registry, or callable continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the live-fetch proof artifact as read-only historical Runtime state.
- Support `runtime/records/2026-03-23-scientify-literature-monitoring-runtime-slice-02-live-fetch-proof.md` only.
- Do not map provider-output JSON artifacts as first-class Runtime focuses in this slice.
- Do not map promotion, registry, or callable continuation semantics.

## inputs
- Legacy Runtime live-fetch proof: `runtime/records/2026-03-23-scientify-literature-monitoring-runtime-slice-02-live-fetch-proof.md`
- Linked legacy Runtime record: `runtime/records/2026-03-23-scientify-literature-monitoring-runtime-record.md`
- Linked legacy Runtime proof checklist: `runtime/records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the live-fetch proof artifact as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not map provider-output JSON artifacts as first-class Runtime focuses in this slice.
- Do not map promotion, registry, or callable continuation semantics.
- Rollback boundary: revert the legacy Runtime live-fetch proof compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_live_fetch_proof_focus_resolves`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves the historical Runtime live-fetch proof cleanly.
- Confirm the whole-product composition check covers the new compatibility path.

## selected tactical slice
- Add legacy Runtime live-fetch proof handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for the historical Scientify Runtime live-fetch proof artifact.

## mechanical success criteria
- The canonical report no longer throws on `2026-03-23-scientify-literature-monitoring-runtime-slice-02-live-fetch-proof.md`.
- `npm run check` still passes.
- The composition check covers the new read-only live-fetch proof path.

## explicit limitations
- No provider-output JSON direct-focus mapping is attempted.
- No promotion, registry, or callable continuation mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical Runtime live-fetch proof.
