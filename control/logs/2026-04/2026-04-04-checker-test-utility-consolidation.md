# Checker Test Utility Consolidation

Date: 2026-04-04

## Scope

Bounded checker-infrastructure dedup across the Runtime checker family.

## Changes

- Added `scripts/checker-test-helpers.ts` with shared helpers for:
  - `readJson`
  - `writeJson`
  - `copyRelativeFile`
  - `copyRelativeFiles`
  - `uniqueRelativePaths`
  - `extractOpenedBy`
  - `extractReviewedBy`
- Migrated the dense Runtime checker cluster to the shared helper surface.
- Replaced repeated local `QueueEntry` definitions in the migrated checker files with `DiscoveryIntakeQueueEntry`.

## Migrated Checker Families

- runner kernels
- projection parity checks
- two-step sequence checks
- named/shared runner invocation checks
- runtime follow-up checker subfamily

## Verification

- The main product verification path remains green under `npm run check`.
- Representative migrated checker families now pass on the shared helper surface:
  - proof-open runner kernel
  - capability-boundary runner kernel
  - runtime follow-up runner kernel
  - proof-capability-boundary sequence
  - named sequence invocation
  - proof-open projection parity
  - runtime follow-up projection parity

## Stop Line

Two non-chain targeted checkers still assert exact equality against richer live Runtime artifacts that have since accumulated downstream host/manual-promotion enrichment:

- `check:runtime-promotion-readiness-runner-kernel`
- `check:runtime-capability-boundary-projection-parity`

Those failures are parity-contract drift in the checks themselves, not helper-surface regression from this consolidation. They are outside the bounded utility-dedup slice.
