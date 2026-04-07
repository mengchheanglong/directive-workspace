# Legacy Live-Runtime Guard

Status: active
Updated: 2026-03-21
Owner: Directive Runtime

## Purpose

Normalize older Runtime packs that were already live in the host before the current proof/promotion/registry discipline was in place.

This contract exists to stop silent grandfathering.

## When To Use

Use `legacy_live_runtime_guard/v1` only when all are true:
- the pack is already classified `live_runtime` in `runtime/source-packs/CATALOG.json`
- a real host adapter already consumes it
- a current bounded proof artifact can still be produced from the host
- rollback can downgrade the pack back to `follow_up_only` without losing product ownership

Do not use this contract for new promotions.

New Runtime runtime work must use a purpose-built promotion profile instead.

## Required Accounting

Every normalized legacy live-runtime pack must declare:
- one Runtime record
- one Runtime proof record
- one promotion record
- one registry entry
- one live-runtime accounting entry in `runtime/meta/LIVE_RUNTIME_ACCOUNTING.json`

## Proof Shape

Proof shape: `legacy_runtime_snapshot/v1`

The proof record must capture:
- the live host surface being preserved
- the exact host evidence artifact paths
- the bounded operational scope that remains approved
- the discard rule for non-bounded or upstream-baggage behavior
- the rollback path back to `follow_up_only`

## Guard Rule

This contract normalizes already-live bounded lanes.

It does not authorize:
- broadening the runtime surface
- adopting the upstream repo as runtime truth
- skipping current host checks for newly promoted lanes

## Validation Rule

The primary structural checker is:
- `npm run check:directive-live-runtime-accounting`

Supporting host proof stays pack-specific and is recorded in the linked Runtime proof record.
