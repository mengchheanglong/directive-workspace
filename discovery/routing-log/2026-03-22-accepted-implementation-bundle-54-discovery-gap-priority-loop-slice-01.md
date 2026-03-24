# Accepted Implementation Bundle 54

Date: `2026-03-22`
Candidate: `dw-discovery-gap-driven-priority-loop`
Route: `Discovery -> Architecture`
Gap id: `gap-discovery-front-door-coverage`

Accepted implementation:
- create a product-owned Discovery gap worklist contract and schema
- materialize `discovery/gap-worklist.json` as the ranked open-gap surface
- add a host-side checker proving unresolved gaps and latest queue candidates stay linked

Reason:
- Discovery already had a queue and a gap registry, but no operating surface for "what should be worked next"
- this slice turns the open gap registry into an explicit priority mechanism
