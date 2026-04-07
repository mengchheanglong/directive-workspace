# Integration Slice 1: autoresearch

## objective
Integrate a bounded `autoresearch` execution contract into Mission Control directive operations with zero runtime behavior change.

## bounded experiment steps
1. Add one operations doc in `mission-control` that defines a fixed `autoresearch` run template (`Iterations: 3`, scope guard, metric/verify format).
2. Keep change doc-only (no API/schema/runtime edits).
3. Run required Day 3 gates immediately after the doc addition.

## success criteria
- New slice doc exists in `mission-control/docs/operations`.
- Contract is specific enough to execute without extra interpretation.
- All required gates pass.

## risk + rollback
- Risk: low (documentation-only), but potential policy drift if contract is vague.
- Rollback: delete the added doc file.

## required gates
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`
