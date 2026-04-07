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
   - create one fast-path record in `01-intake/`
   - capture intake, triage, and routing in that one record
2. Split into `02-triage/` and `03-routing-log/` only when the case is complex, disputed, or held.
3. Route the candidate to one of:
   - Architecture
   - Runtime
   - `04-monitor/`
   - `05-deferred-or-rejected/`
   - `reference/`
4. If the route is not clear after first pass, hold it instead of stretching Discovery work.

This is already the Discovery cutdown rule:
- simple cases stay on the fast path in `01-intake/`
- `02-triage/` and `03-routing-log/` open only when the case genuinely needs the split path

## Folders

- `01-intake/` — fast-path markdown intake records
- `02-triage/` — complex-case triage records (split path only)
- `03-routing-log/` — routing decisions
- `04-monitor/` — candidates in monitor holding state
- `05-deferred-or-rejected/` — candidates rejected or deferred
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

- `../CLAUDE.md`
- `../control/runbook/current-priority.md`
- `../knowledge/README.md`
- `shared/templates/discovery-fast-path-record.md`
- `shared/templates/intake-record.md`
- `shared/contracts/discovery-to-architecture.md`
- `shared/contracts/discovery-to-runtime.md`
