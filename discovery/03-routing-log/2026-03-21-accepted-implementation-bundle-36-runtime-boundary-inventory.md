# Accepted Implementation Bundle 36: Runtime Boundary Inventory

Date: 2026-03-21
Owner: Directive Discovery -> Directive Runtime
Decision state: `route_to_runtime_follow_up`
Adoption target: `Directive Runtime follow-up`
Status: accepted

## Decision

Close Runtime System Bundle 02 by making the mirror and package boundary explicit and machine-checkable.

## Outcome

- added a canonical Runtime boundary inventory
- kept direct package import cutover explicitly deferred
- kept runtime host surfaces explicitly host-only
- moved mirror/sync truth away from hardcoded host assumptions and into a product-owned inventory

## Next active Runtime work

Runtime System Bundle 03: source-pack catalog and activation cleanup
