# 2026-04-01 - Pre-Host Promotion Record Contract Decision

## Slice

- Completion slice: `decide_pre_host_promotion_record_contract`
- Candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Owning lane: `Architecture`
- Decision: allow a non-executing promotion-record contract to be prepared before host-facing promotion opens

## Repo truth used

- Scientify remains at:
  - `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
  - `currentStage = runtime.promotion_readiness.opened`
- Canonical Runtime truth still says:
  - host-facing promotion is unopened
  - callable implementation is unopened
  - host integration is unopened
  - runtime execution is unopened
- The repo already has the product-owned promotion-record contract surfaces:
  - `shared/templates/promotion-record.md`
  - `shared/lib/runtime-promotion-record-writer.ts`
  - `runtime/promotion-records/README.md`
  - `shared/contracts/runtime-to-host.md`
- The repo also already has the inputs needed to prepare a non-executing pre-host contract honestly:
  - Runtime record
  - Runtime proof
  - Runtime capability boundary
  - promotion-readiness artifact
  - promotion specification
  - callable stub
  - bounded standalone-host adapter surface

## Decision

Preparing a promotion-record contract is allowed as bounded Architecture work if it remains explicitly pre-host and non-executing.

That means the next slice may:

- formalize prerequisites for a pre-host promotion record
- define what fields and checks are required before any later host-facing promotion review
- keep host-facing promotion itself closed
- keep registry acceptance closed
- keep callable activation, host integration, and runtime execution closed

That means the next slice must not:

- create a live promotion record for Scientify
- imply host activation
- imply accepted Runtime state
- imply registry entry creation
- imply host integration or execution

## Why this is truthful

The repo already separates:

- pre-host Runtime truth at promotion-readiness
- host-loading truth through the promotion specification
- host acceptance truth through promotion-record and registry families

So the missing step is not to open promotion now. The missing step is to formalize the contract boundary that later promotion review would need, while still keeping that later seam closed.

## Completion-control effect

- Mark `decide_pre_host_promotion_record_contract` completed.
- Leave closed seams unchanged.
- Advance the selector frontier to:
  - `formalize_pre_host_promotion_record_prerequisites`

## Proof path

- `npm run report:next-completion-slice`
  - must advance to the prerequisite-formalization slice
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

Stop this slice after the decision is recorded and the canonical selector advances to the pre-host prerequisite formalization slice.
