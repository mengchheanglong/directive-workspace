# Architecture Review Resolution Lib Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Forge threshold check: `yes`
- Decision: `adopted`

## Problem

Directive Workspace had Architecture review doctrine and checklist structure, but the lane was still not executable.

That meant the system could say what a good review should inspect, but it still could not deterministically resolve:
- review score
- approve vs reject
- follow-up vs blocked recovery
- lifecycle next state for an evaluated Architecture slice

## Adopted result

Added canonical product-owned code:
- `shared/lib/architecture-review-resolution.ts`

Added bounded host mirror:
- `mission-control/src/lib/directive-workspace/architecture-review-resolution.ts`

Bound the lane to existing review enforcement:
- `mission-control/scripts/check-directive-impeccable-contracts.ts`

The executable lane now:
1. evaluates the required Architecture review checks
2. penalizes anti-patterns deterministically
3. resolves a canonical 1-5 review score
4. decides approved vs rejected
5. delegates lifecycle next-state resolution to `shared/lib/lifecycle-review-feedback.ts`
6. returns required changes plus the exact transition request for the evaluated slice

## Why this is useful

This improves the system itself, not only a single review.

Architecture review is now better at its job because:
- review outcomes are no longer only checklist prose
- follow-up and blocked-recovery behavior now come from product-owned code
- the review lane consumes the previously extracted OpenMOSS lifecycle/review mechanism instead of leaving it as an isolated shared helper

## Rollback

If this executable lane proves unhelpful:
- remove `shared/lib/architecture-review-resolution.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-review-resolution.ts`
- revert the executable-resolution additions in `mission-control/scripts/check-directive-impeccable-contracts.ts`
- revert the inventory/README/changelog updates tied to this slice
