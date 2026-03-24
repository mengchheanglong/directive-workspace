# Discovery Gap-Driven Priority Loop Slice 01

Date: `2026-03-22`
Candidate: `dw-discovery-gap-driven-priority-loop`
Track: `Directive Architecture`
Gap id: `gap-discovery-front-door-coverage`

## Claim

Discovery will behave more like the doctrine front door if open capability gaps are turned into an explicit ranked worklist that determines the next internal-signal slice, instead of leaving slice selection implicit in recent file activity.

## Bounded change

Create:
- a product-owned contract for the Discovery gap worklist
- a schema for the worklist structure
- one machine-readable `discovery/gap-worklist.json`
- one host-side checker that verifies unresolved gaps are represented and linked correctly to queue candidates

Do not:
- redesign Discovery again
- create a second intake queue
- widen into Mission Control UI work

## Proof method

Pass if all of the following are true:
1. `gap-worklist.json` exists and is structurally valid.
2. Every unresolved gap in `capability-gaps.json` appears exactly once in the worklist.
3. Any referenced latest candidate exists in `intake-queue.json` and points back to the same `capability_gap_id`.
4. Host checker passes.

## Result

Accepted.

The worklist exists as operating code, the open Discovery front-door gap is now the top-ranked work item, and the latest Architecture slice that created the worklist is linked back to the gap in both the queue and the worklist.
