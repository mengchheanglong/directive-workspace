# 2026-04-01 - Open First Manual Scientify Runtime Promotion Seam

## Slice

- Completion slice: `decide_open_scientify_manual_runtime_promotion_seam`
- Candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Owning lane: `Architecture`
- Decision: explicitly open the first manual Scientify Runtime promotion seam

## Repo truth used

- Pre-host manual promotion-record prerequisites are now explicit and machine-checkable:
  - `shared/lib/runtime-promotion-record-writer.ts`
  - `scripts/check-pre-host-promotion-record-prerequisites.ts`
- The Scientify Runtime callable boundary is explicit and already proven through bounded live-provider checks:
  - `runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts`
  - `scripts/check-directive-scientify-runtime-callable.ts`
- The Scientify promotion specification is canonical and checked:
  - `runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json`
  - `scripts/check-runtime-promotion-specification.ts`
- The standalone host already consumes that promotion specification through a bounded adapter:
  - `hosts/standalone-host/runtime-lane.ts`
  - `scripts/check-standalone-scientify-host-adapter.ts`
- Registry acceptance is still explicitly post-host-acceptance and remains out of scope for pre-host preparation:
  - `control/logs/2026-04/2026-04-01-registry-acceptance-boundary-decision.md`
- Canonical current head for Scientify still resolves to:
  - `runtime.promotion_readiness.opened`
  - with `host_facing_promotion_unopened` as the remaining local blocker

## Decision

Open the first manual Scientify Runtime promotion seam.

This opening is intentionally narrow:

- manual
- Scientify-only
- standalone-host-targeted
- reversible
- non-automated

This decision authorizes the next bounded slice only:

- `scientify_manual_runtime_promotion_chain`

It does not authorize:

- broad runtime execution
- broad host integration
- promotion automation
- broader Runtime redesign
- automatic downstream advancement

## Why opening is now truthful

The earlier keep-closed decision was correct when the repo still lacked:

- explicit pre-host prerequisite proof
- an explicit registry boundary decision

Those gaps are now closed.

The repo now has enough bounded product truth to attempt one first manual promotion chain without inventing new doctrine mid-slice:

- Runtime-owned callable proof exists
- promotion-spec truth exists
- bounded host-adapter truth exists
- pre-host contract prerequisites exist
- registry acceptance remains clearly later than promotion preparation

So the remaining work is no longer a doctrine gap. It is now a bounded manual Runtime promotion slice.

## Completion-control effect

- Mark `decide_open_scientify_manual_runtime_promotion_seam` completed.
- Keep the broad closed-seam list unchanged.
- Explicitly unblock the single next slice:
  - `scientify_manual_runtime_promotion_chain`
- The next selector result should therefore become:
  - `selectionState = "selected"`
  - `selectedSlice.sliceId = "scientify_manual_runtime_promotion_chain"`

## Proof path

- `npm run report:next-completion-slice`
  - must now select `scientify_manual_runtime_promotion_chain`
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

Stop after the seam-open decision is recorded, the selector truthfully moves from `blocked` to the selected Scientify manual promotion chain, and the repo check surfaces remain green.
