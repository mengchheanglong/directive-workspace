# 2026-04-07 Research Engine Runtime Handoff Linked Engine Run Bridge

- affected layer: Discovery Runtime route-opening seam for imported Research Engine candidates
- owning lane: Discovery
- mission usefulness: preserve truthful Runtime continuation for routed imports by honoring linked Engine run evidence paths and avoiding false route-open failures
- proof path:
  - npm run check:research-engine-discovery-import
  - npm run check:directive-workspace-composition
- rollback path:
  - revert discovery/lib/discovery-route-opener.ts
  - revert discovery/lib/discovery-front-door.ts
  - revert discovery/lib/discovery-routing-record-writer.ts
  - revert scripts/check-research-engine-discovery-import.ts
  - remove this log entry

## Bounded slice

- persisted linked Engine run record/report paths into Discovery routing artifacts emitted by front-door submission
- updated route opening to resolve Engine evidence by explicit linked paths when present, with fail-closed behavior when linked artifacts are missing
- fixed linked Engine run candidate matching to accept canonical Engine-normalized candidate IDs so long imported IDs do not produce false missing-artifact failures
- extended import checker coverage with Runtime-route regression and explicit missing-linked-artifact boundary assertions under non-default runtime artifact roots
- tuned checker fixture gaps so the Runtime candidate exercises a high-confidence Runtime handoff path

## Proof notes

- regression and boundary assertions now validate that:
  - Runtime-routed imports preserve linked Engine run paths in routing records
  - autonomous lane loop opens Discovery route and continues into Runtime follow-up when linked evidence exists
  - route opening fails closed when linked Engine artifacts are removed
- composition checker remained green after seam changes

## Stop-line

This slice stops at bounded Discovery route-opening correctness and regression coverage for linked Engine run evidence continuity. It does not change Runtime proof boundaries, host promotion behavior, or lane ownership doctrine.
