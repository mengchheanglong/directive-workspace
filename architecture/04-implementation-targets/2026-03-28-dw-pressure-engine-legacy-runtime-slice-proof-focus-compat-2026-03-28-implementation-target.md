# Implementation Target: Legacy Runtime Slice Proof Focus Compatibility (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28`
- Candidate name: Legacy Runtime Slice Proof Focus Compatibility
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library truth-compatibility slice.
- Objective retained: Materialize direct canonical focus for the historical runtime-slice proof family without opening runtime-slice execution, proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics.

## scope (bounded)
- Keep this at one Architecture DEEP slice.
- Restrict the code change to `shared/lib/dw-state.ts` and `scripts/check-directive-workspace-composition.ts`.
- Preserve the proof artifacts as read-only historical Runtime state.
- Support the historical `runtime/records/*-runtime-slice-01-proof.md` family only.
- Do not map runtime-slice execution, proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics.

## inputs
- Legacy Runtime slice proof: `runtime/records/2026-03-21-promptfoo-runtime-slice-01-proof.md`
- Legacy Runtime slice proof: `runtime/records/2026-03-21-agent-orchestrator-cli-runtime-slice-01-proof.md`
- Legacy Runtime slice proof: `runtime/records/2026-03-21-superpowers-runtime-slice-01-proof.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-bounded-result.md`
- Adopted artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-adopted-planned-next.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-adopted-planned-next-adoption-decision.json`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-engine-handoff.md`

## constraints
- Preserve the proof artifacts as historical Runtime evidence only.
- Do not open Runtime execution, callable implementation, promotion reopening, or host integration.
- Do not map runtime-slice execution, proof-checklist, transformation-proof, promotion, registry, or callable continuation semantics in this slice.
- Rollback boundary: revert the legacy Runtime slice-proof compatibility slice and remove this DEEP case chain if direct focus starts overstating Runtime continuation.

## validation approach
- `legacy_runtime_slice_proof_focus_resolves`
- `legacy_runtime_slice_proof_queue_status_clean`
- `engine_boundary_preserved`
- Confirm `report:directive-workspace-state` resolves representative historical runtime-slice proofs cleanly.
- Confirm the whole-product composition check covers the new compatibility path and the stale-completed queue guard survives in staged verification.

## selected tactical slice
- Add legacy Runtime slice-proof handling in `shared/lib/dw-state.ts`.
- Add focused composition assertions for representative historical Runtime slice-proof artifacts and staged stale-completed queue behavior.

## mechanical success criteria
- The canonical report no longer throws on representative `*-runtime-slice-01-proof.md` artifacts.
- The live queue no longer shows `completed_inconsistent` for the historical proof family.
- The stale completed-status hardening still holds in staged verification when the recorded result artifact is unresolved.
- `npm run check` still passes.

## explicit limitations
- No runtime-slice execution mapping is attempted.
- No proof-checklist mapping is attempted.
- No transformation-proof, promotion, registry, or callable continuation mapping is attempted.
- No Runtime v0 continuation is opened.

## expected outcome
- One explicit Architecture implementation target that defines one bounded truth-compatibility slice for the historical runtime-slice proof family.
