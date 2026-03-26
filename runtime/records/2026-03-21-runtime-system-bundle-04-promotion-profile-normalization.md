# Runtime System Bundle 04: Promotion Profile Family Normalization

Date: 2026-03-21
Owner: Directive Runtime
Status: completed

## Purpose

Make Runtime promotion-profile handling explicit and product-owned before opening broader runtime slices.

## Problem

Runtime already had more than one promotion-proof family:
- `promotion_quality_gate/v1`
- `agent_eval_guard/v1`

But the system still treated the mapping between:
- profile selector
- profile family
- proof shape
- primary host checker

as mostly implicit knowledge spread across contracts, records, and host scripts.

## Changes

1. Added canonical Runtime inventory:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\PROMOTION_PROFILES.json`
2. Normalized promotion records so they declare:
   - `Quality gate profile`
   - `Promotion profile family`
   - `Proof shape`
   - `Primary host checker`
3. Bound existing contracts to the same catalog:
   - `shared/contracts/promotion-quality-gate.md`
   - `shared/contracts/agent-eval-guard.md`
4. Added host catalog enforcement:
   - `npm run check:directive-promotion-profile-catalog`
5. Updated profile-specific host checks to resolve contract truth from the catalog instead of hardcoded path/profile assumptions.

## Result

Runtime now has one product-owned promotion-profile inventory that defines:
- which profiles are active
- which contract owns each profile
- which proof shape each profile expects
- which host checker is primary for each profile

This closes the last active Runtime system bundle before broader runtime expansion.

## Validation

- `npm run check:directive-promotion-profile-catalog`
- `npm run check:directive-promptfoo-runtime`
- `npm run check:directive-promotion-quality-contracts`
- `npm run check:ops-stack`

## Next

Open the first post-system-cleanup runtime slice:
- `al-tooling-puppeteer`
