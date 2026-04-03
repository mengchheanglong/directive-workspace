# 2026-04-01 - Registry Acceptance Boundary Decision

## Slice

- Completion slice: `decide_registry_acceptance_boundary_after_manual_promotion`
- Candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Owning lane: `Architecture`
- Decision: registry acceptance remains strictly post-host-acceptance for the first manual promotion cycle

## Repo truth used

- `runtime/README.md`
  - still says accepted runtime state is recorded in `registry/` only after host acceptance
- `runtime/registry/README.md`
  - still says a registry entry belongs only after:
    - a promotion record exists
    - required host gates have passed
    - proof is linked
    - runtime status is explicit
- `shared/contracts/runtime-to-host.md`
  - now says pre-host promotion-record prerequisites do not authorize registry acceptance
- `shared/lib/runtime-registry-entry-writer.ts`
  - still requires a linked promotion record, host, runtime surface, runtime status, proof path, and validation fields
- Scientify still remains at:
  - `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
  - with host-facing promotion unopened
  - with host integration unopened
  - with runtime execution unopened

## Decision

The first manual Runtime promotion cycle keeps registry acceptance strictly post-host-acceptance.

That means the loop may:

- prepare and verify pre-host promotion-record prerequisites
- later decide whether to open a manual host-facing promotion record

That means the loop must not:

- prepare a pre-host registry entry
- imply accepted runtime state before host acceptance
- treat a promotion specification or pre-host promotion-record contract as sufficient registry authority

## Why this is truthful

Registry state is the product-owned surface for accepted runtime capability, not a staging artifact.

The repo already distinguishes:

- promotion-readiness truth
- promotion-record truth
- accepted registry truth

Flattening registry acceptance into the pre-host seam would overstate what the current Scientify path has actually proved.

## Completion-control effect

- Mark `decide_registry_acceptance_boundary_after_manual_promotion` completed.
- The next frontier becomes:
  - `scientify_manual_runtime_promotion_chain`
- That frontier remains blocked by the still-closed seams:
  - `host_facing_promotion`
  - `callable_implementation`
  - `host_integration`

## Proof path

- `npm run report:next-completion-slice`
  - must end on `selectionState = "blocked"`
- `npm run report:directive-workspace-state`
  - must stay coherent
- `npm run check`
  - must stay green

## Rollback

Revert:

- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- this decision log

## Stop-line

Stop this slice after the decision is recorded and the canonical selector truthfully moves to the blocked manual-promotion frontier.
