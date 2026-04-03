# 2026-04-01 - First Manual Runtime Promotion Seam Decision

## Slice

- Completion slice: `decide_first_manual_runtime_promotion_seam`
- Candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Owning lane: `Architecture`
- Decision: keep the first manual Scientify Runtime promotion seam closed

## Repo truth used

- The current Scientify head remains `runtime.promotion_readiness.opened` at:
  - `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
- Canonical state still reports:
  - `nextLegalStep = No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.`
  - blocker: `host_facing_promotion_unopened`
- The Scientify callable and host-adapter proof now exist:
  - `runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts`
  - `runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json`
  - `hosts/standalone-host/runtime-lane.ts`
- Those surfaces prove a Runtime-owned callable capability and bounded host adapter consumption, but they still do not propose host activation or host-owned integration.
- `runtime/README.md` still says to create a promotion record only once host integration is actually being proposed.
- The promotion-record and registry-entry families currently resolve as legacy read-only Runtime truth in the canonical resolver; there is no new active v0 promotion-stage chain already materialized for Scientify.

## Why the seam stays closed

Opening the seam now would overstate current Runtime truth.

The repo has proved:

- a Runtime-owned Scientify callable capability
- canonical promotion specifications
- bounded standalone-host consumption through a read-only adapter

The repo has not yet proved:

- host-facing promotion review as an active v0 stage
- host-owned integration for Scientify
- Runtime execution
- a new non-legacy promotion/registry chain for the current Runtime v0 path

So the honest bounded decision is:

- keep `host_facing_promotion` closed
- keep `callable_implementation` closed
- keep `host_integration` closed

## Completion-control effect

- Mark `decide_first_manual_runtime_promotion_seam` completed.
- Leave the closed seams unchanged.
- Allow the canonical selector to move the frontier to:
  - `scientify_manual_runtime_promotion_chain`
- That frontier is now truthfully `blocked` by the still-closed seams above.

## Proof path

- `npm run report:next-completion-slice`
  - must return `selectionState = "blocked"`
- `npm run check:completion-slice-selector`
  - must prove the selector now points at the blocked Scientify promotion chain instead of the already-completed decision slice
- `npm run report:directive-workspace-state`
  - must stay coherent
- `npm run check`
  - must stay green

## Rollback

Revert:

- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- `scripts/check-completion-slice-selector.ts`
- this decision log

## Stop-line

Stop after the decision is recorded, the selector truthfully moves to `blocked`, and the repo check surfaces remain green.
