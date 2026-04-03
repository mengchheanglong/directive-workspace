# Directive Discovery

Discovery is the mission-aware intake queue, routing surface, and capability-gap detector for Directive Workspace.

Everything enters through Discovery first.

It owns:
- mission-aware candidate intake
- mission-context interpretation that defines usefulness
- capability-gap detection and registry
- routing decisions by adoption target
- defer, monitor, reject, and reference holding states

It does not own:
- deep experiments by default (that is Architecture or Runtime)
- reusable operating-code extraction (that is Architecture)
- runtime/callable delivery (that is Runtime)

## Default operational loop

1. Default fast path:
   - create one fast-path record in `intake/`
   - capture intake, triage, and routing in that one record
2. Split into `triage/` and `routing-log/` only when the case is complex, disputed, or held.
3. Route the candidate to one of:
   - Architecture
   - Runtime
   - `monitor/`
   - `deferred-or-rejected/`
   - `reference/`
4. If the route is not clear after first pass, hold it instead of stretching Discovery work.

## Folders

- `intake/` — fast-path markdown intake records
- `triage/` — complex-case triage records (split path only)
- `routing-log/` — routing decisions
- `monitor/` — candidates in monitor holding state
- `deferred-or-rejected/` — candidates rejected or deferred
- `reference/` — background knowledge and source maps
- `research-engine/` — Research Engine source-intelligence imports

## Key files

- `intake-queue.json` — primary authoritative intake queue
- `capability-gaps.json` — machine-readable capability-gap registry
- `gap-worklist.json` — ranked open-gap worklist

## Rules

- All new candidates enter through Discovery first — no bypass into Runtime or Architecture without a Discovery record.
- Discovery routes by adoption target, not by source type.
- Routing is conditioned on the active mission (`knowledge/active-mission.md`).
- When multiple internal slices are available, prefer the highest-ranked unresolved gap in `gap-worklist.json`.
- Default to the fast path.

## Canonical references

- `knowledge/workflow.md`
- `shared/templates/discovery-fast-path-record.md`
- `shared/templates/intake-record.md`
- `shared/contracts/discovery-to-architecture.md`
- `shared/contracts/discovery-to-runtime.md`
