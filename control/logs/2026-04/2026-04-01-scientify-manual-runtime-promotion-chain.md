# 2026-04-01 - Scientify Manual Runtime Promotion Chain

## Slice

- Completion slice: `scientify_manual_runtime_promotion_chain`
- Candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Owning lane: `Runtime`
- Result: the first manual Scientify Runtime promotion chain now stops truthfully at one bounded promotion record

## What changed

- Added the first manual Scientify Runtime promotion record:
  - `runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md`
- Linked that promotion record into canonical Runtime truth:
  - `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
  - `shared/lib/dw-state.ts`
  - `shared/lib/dw-state/runtime.ts`
- Extended Runtime promotion specifications so they carry the linked promotion-record path when present:
  - `shared/lib/runtime-promotion-specification.ts`
  - `runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json`
- Added a dedicated bounded checker for the manual Scientify promotion stop:
  - `scripts/check-directive-scientify-runtime-promotion.ts`
- Extended the standalone-host and callable proof surfaces so they agree on the promotion-record stop:
  - `hosts/standalone-host/runtime-lane.ts`
  - `scripts/check-standalone-scientify-host-adapter.ts`
  - `scripts/check-directive-scientify-runtime-callable.ts`
- Re-generated the canonical Runtime promotion-specification set after the shared contract change:
  - `runtime/06-promotion-specifications/`

## Resulting truth

- Scientify now resolves from promotion-readiness to:
  - `currentStage = runtime.promotion_record.opened`
  - `currentHead = runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md`
- The promotion record is explicit and checked.
- Registry acceptance remains unopened.
- Host integration remains unopened.
- Runtime execution remains unopened.
- Promotion automation remains unopened.

## Completion-control effect

- Mark `scientify_manual_runtime_promotion_chain` completed.
- Advance the selector frontier to:
  - `runtime_cycle_evidence_feedback_loop`

## Proof path

- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
- `npm run report:directive-workspace-state -- runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md`
- `npm run check:runtime-promotion-specification`
- `npm run check:standalone-scientify-host-adapter`
- `npm run check:directive-scientify-runtime-callable`
- `npm run check:directive-scientify-runtime-promotion`
- `npm run report:next-completion-slice`
- `npm run check`

## Rollback

Revert:

- `runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md`
- the Scientify promotion-readiness and promotion-specification artifacts
- the Scientify promotion-record checker and host/callable proof expectations
- canonical Runtime current-head linking for promotion records
- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- this log

## Stop-line

Stop once the first manual Scientify promotion record is the checked current head and the selector advances to the evidence-feedback loop. Do not open registry acceptance, host integration, runtime execution, or promotion automation in this slice.
