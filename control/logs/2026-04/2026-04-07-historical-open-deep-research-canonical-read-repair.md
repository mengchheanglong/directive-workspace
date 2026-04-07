Affected layer: Discovery -> Architecture historical canonical read surfaces
Owning lane: Discovery
Mission usefulness: remove the last broken canonical read integrity failures so historical routed entries no longer advertise missing downstream artifacts
Proof path: `npm run check:canonical-read-surface-coverage`, `npm run check:directive-workspace-composition`
Rollback path: delete the two 2026-04-06 Architecture handoff stubs and the 2026-04-06 routing review resolution artifact if the historical repair must be reverted
Stop-line: historical integrity repair only; no routing-policy, Runtime, or Architecture chain semantics changed

What changed:
- materialized the missing Architecture handoff stub for `research-engine-open-deep-research-20260406t145339z-20260406t154500z`
- created an explicit Discovery routing review resolution artifact for `research-engine-open-deep-research-20260406t145339z-20260406t155500z`
- materialized the missing Architecture handoff stub for `research-engine-open-deep-research-20260406t145339z-20260406t155500z` after the explicit review resolution

Validation:
- `npm run check:canonical-read-surface-coverage`
- `npm run check:directive-workspace-composition`

Result:
- the two historical 2026-04-06 `open-deep-research` routed entries now resolve cleanly through canonical read surfaces
- no remaining canonical read coverage violations remain in current repo truth
