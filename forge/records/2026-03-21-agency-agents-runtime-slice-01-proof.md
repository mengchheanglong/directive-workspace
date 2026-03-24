# Agency-Agents Runtime Slice 01 Proof

Date: 2026-03-21
Candidate id: `agency-agents`
Track: `Directive Forge`
Slice type: legacy live-runtime normalization

## Run Contract

Source follow-up:
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\follow-up\2026-03-20-agency-agents-skill-pack-cutover.md`

Execution scope:
- one current run-scoped sync validation
- one rollback dry-run validation
- no widening beyond the existing curated specialist pack lane

## Runtime Artifacts

- sync artifact:
  - `C:\Users\User\.openclaw\workspace\mission-control\reports\ops\agency-agents-sync-fa6c6b81-db29-446c-8b86-9708390f23e5.md`
- rollback artifact:
  - `C:\Users\User\.openclaw\workspace\mission-control\reports\ops\agency-agents-rollback-fa6c6b81-db29-446c-8b86-9708390f23e5.md`

## Operational Outcomes

- The existing run-scoped sync lane succeeded against the Forge-owned `agency-agents` source pack.
- The rollback dry-run succeeded against the captured snapshot set.
- This proves the live host lane can be kept under explicit Forge accounting without pretending the whole upstream persona library is active runtime truth.

## Runtime Snapshot

- Quality gate profile: legacy_live_runtime_guard/v1
- Promotion profile family: legacy_live_runtime
- Proof shape: legacy_runtime_snapshot/v1
- Primary host checker: `npm run check:directive-live-runtime-accounting`
- supporting host evidence command: `npm run check:agency-agents`
- sync status: `success`
- rollback dry-run status: `success`
- profile: `engineering`
- selected directories: `engineering`, `examples`, `integrations`, `specialized`
- manifest hash: `10bd678a880b2828ff3d5c0668fba1836b78eb3315f3a96470329067f0dfc5dc`
- pre snapshot id: `2026-03-21T14-57-51-721Z-80c264ce`
- post snapshot id: `2026-03-21T14-57-51-913Z-fd81bf12`
- rollback snapshot id: `2026-03-21T14-57-51-721Z-80c264ce`

## Required Gates

- `npm run check:agency-agents` -> PASS
- `npm run check:directive-live-runtime-accounting` -> PASS
- `npm run check:directive-source-pack-catalog` -> PASS
- `npm run check:directive-source-pack-readiness` -> PASS
- `npm run check:ops-stack` -> PASS

## Keep/Discard Decisions

- `keep`: curated specialist-role sync and rollback behavior through the Forge-owned pack
- `keep`: explicit profile and manifest hash evidence as part of live-runtime accountability
- `discard`: any implication that every upstream persona file or workflow is callable runtime truth

## Risk Note

Current live value is bounded to the run-scoped specialist pack lane. It should be treated as curated sync/rollback infrastructure, not as approval to expose the full upstream persona library.

## Rollback

If this normalization is rolled back:
- remove agency-agents-specific Forge proof/promotion/registry artifacts
- restore source-pack classification to `follow_up_only`
- disable the live runtime lane until a fresh bounded promotion is approved
