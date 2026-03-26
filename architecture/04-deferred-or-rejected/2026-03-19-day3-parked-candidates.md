# Day 3 Parked Candidates (2026-03-19)

## Park/Defer Set

1. `metaclaw` (3.60)
- Reason: RL/proxy complexity is premature for current Phase 2 stability goals.

2. `swe-agent` (3.45)
- Reason: overlaps with `mini-swe-agent` and Codex lane; higher integration overhead now.

3. `autoresearchclaw` (3.45)
- Reason: 23-stage pipeline is heavy versus current bounded-slice cadence.

4. `autogen` (3.15)
- Reason: broad framework, weaker direct fit to Directive Runtime loop.

5. `openhands` (3.00)
- Reason: execution overlap, no clear differentiated ROI over existing lanes.

## Notes
- `gpt-researcher` remains deferred separately due runtime instability on this host.
- Re-open parked items only after top-3 and queue-3 slices finish or if blocking gaps appear.
