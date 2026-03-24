# Discovery Gap Priority Worklist Policy

Date: `2026-03-22`

Policy:
- unresolved capability gaps are not passive registry rows
- they should produce a ranked Discovery worklist
- the top-ranked unresolved gap should drive the next internal-signal Discovery slice unless a higher-priority mission emergency overrides it

Implementation rule:
- `capability-gaps.json` defines what is open
- `gap-worklist.json` defines what should be worked next
- `intake-queue.json` records the actual candidate slice that moved the gap

Why this pattern is retained:
- it makes Discovery act more like a queue-and-worker front door
- it reduces drift toward convenience-driven slice selection
- it ties internal work more directly to mission-conditioned usefulness gaps
