# 2026-03-31 - Core Principles Consumption Record

- affected layer: Architecture continuation chain
- owning lane: Architecture
- mission usefulness: advance the core-principles operating-discipline case from integration-ready to explicit applied consumption without widening scope
- proof path: focused workspace-state resolution for the new consumption artifact, planner parity on the mirrored case, and full repo `npm run check`
- rollback path: remove `architecture/08-consumption-records/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-consumption.md` and resume from `architecture/07-integration-records/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-integration-record.md`
- stop-line: stop at the consumption record boundary; any move into post-consumption evaluation is the next bounded Architecture slice

## bounded slice

- created `architecture/08-consumption-records/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-consumption.md` using the repo-native consumption-record helper
- advanced planner doctrine for the exact next legal step exposed by that artifact: `Explicitly evaluate the applied Architecture output after use.`
- updated checker parity so the mirrored case now expects `architecture.consumption.success` and task kind `evaluate_post_consumption`

## verification

- `npm run report:directive-workspace-state -- architecture/08-consumption-records/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-consumption.md`
- `node --experimental-strip-types ./scripts/check-case-planner-parity.ts`
- `npm run report:directive-workspace-state`
- `npm run check`
