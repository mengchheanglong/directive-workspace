# 2026-04-06 - Generic supervised autonomous lane loop alignment

Affected layer: Engine coordination + lifecycle/state compatibility

Owning lane: Architecture

Mission usefulness:
- make the one-input loop behave like the operator's normal phased workflow
- advance phase by phase automatically
- emit phase reports
- stop only when the current phase truthfully stops, parks, defers, rejects, or blocks

What changed:
- kept the default runner on the generic supervised loop surface in `scripts/run-autonomous-lane-loop.ts`
- removed the earlier special-case effectful Runtime closeout side path so only the generic supervised loop remains
- fixed Architecture deep-tail path compatibility so both legacy logical paths and current physical `architecture/04-materialization/...` paths resolve correctly
- taught the mirrored case planner that `architecture.implementation_target.opened` is a valid bounded next-step stage and should recommend `record_implementation_result`
- updated the affected proof surfaces and lifecycle-control check expectations to current repo truth

Result:
- one input now runs the bounded lane loop across open phases automatically
- each phase is reported through the supervised loop result
- the loop stops truthfully when the current stage says stop, park, reject/defer, or block
- no source-specific effectful logic is required for the default loop behavior

Proof path:
- `npm run check:autonomous-lane-loop`
- `npm run check:case-planner-parity`
- `npm run check:directive-workspace-composition`
- `npm run check:runtime-loop-control`
- `npm run check:read-only-lifecycle-coordination`
- `npm run check`

Rollback path:
- revert the supervised loop/checker/planner compatibility changes in this slice
- remove this log entry
