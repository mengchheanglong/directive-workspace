# Discovery Gap Priority Worklist Adopted

Date: `2026-03-22`
Candidate: `dw-discovery-gap-driven-priority-loop`
Decision: `accept for architecture`
Status: `product_materialized`

Materialized outputs:
- `shared/contracts/discovery-gap-worklist.md`
- `shared/schemas/discovery-gap-worklist.schema.json`
- `discovery/gap-worklist.json`

Why it matters:
- Discovery now has a checked operating surface that ranks unresolved mission-linked gaps
- open gaps now have an explicit latest-slice linkage and next-action description
- the system no longer relies on recent file activity alone to decide the next internal Discovery slice

Boundary:
- this does not close `gap-discovery-front-door-coverage` by itself
- it gives Discovery the mechanism to work that gap intentionally instead of implicitly
