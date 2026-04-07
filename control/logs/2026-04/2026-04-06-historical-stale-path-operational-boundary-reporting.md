# 2026-04-06 Historical Stale Path Operational Boundary Reporting

## Affected layer

- historical artifact inventory and repo authority guardrails

## Owning lane

- Engine cross-cutting truth surfaces

## Mission usefulness

- keep pre-migration path drift visible without pretending the historical corpus was authored differently
- make the current safety boundary explicit: stale historical references may remain as narrative evidence, but active repo surfaces must not consume them

## Slice

- upgraded `report:historical-stale-path-inventory` to classify each stale artifact as:
  - `historical_only`
  - `operationally_consumed`
- added canonical location hints for each stale path family so the report points back to current repo truth:
  - `engine/state/`
  - `architecture/lib/`
  - `runtime/lib/`
  - `discovery/lib/`
- added `check:historical-stale-path-operational-boundary`
- wired the new checker into the foundation batch so the repo now fails if an active operational surface starts consuming stale historical anchors again

## Proof path

- `npm run report:historical-stale-path-inventory`
- `npm run check:historical-stale-path-operational-boundary`
- `npm run check`

## Rollback path

- revert `scripts/report-historical-stale-path-inventory.ts`
- revert `scripts/check-historical-stale-path-operational-boundary.ts`
- revert `scripts/check-batches.ts`
- revert `package.json`
- delete this log

## Stop summary

- stopped after making the historical-only versus operational-consumer boundary explicit and enforceable
- did not rewrite the historical corpus itself
- left narrative-only stale references intact as historical evidence
