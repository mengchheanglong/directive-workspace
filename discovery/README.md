# Directive Discovery

Directive Discovery is the mission-aware intake queue, routing surface, and capability-gap detector for Directive Workspace.

Everything enters through Discovery first.

It owns:
- mission-aware candidate intake (intake queue is the primary authoritative surface)
- mission-context interpretation that defines usefulness for the active objective
- capability-gap detection and registry
- gap-priority work selection for internal Discovery-native slices
- routing decisions by adoption target
- defer, monitor, reject, and reference holding states
- revisit loops for monitor/defer items (trigger conditions, review cadence, no-op rules)

It does not own:
- deep experiments by default (that is Architecture or Runtime)
- reusable operating-code extraction (that is Architecture)
- runtime/callable delivery or behavior-preserving transformation (that is Runtime)

Folders:
- `intake/` - fast-path markdown intake records
- `triage/` - complex-case triage records (split path only)
- `routing-log/` - routing decisions and execution records
- `monitor/` - candidates in monitor holding state
- `deferred-or-rejected/` - candidates rejected or deferred
- `reference/` - background knowledge and source maps
- `agent-lab-extraction/` - agent-lab retirement tracking

Key files:
- `intake-queue.json` - primary authoritative intake queue (primary mode since 2026-03-22)
- `capability-gaps.json` - machine-readable capability-gap registry
- `gap-worklist.json` - ranked open-gap worklist used to choose the next internal Discovery slice
- `C:\Users\User\.openclaw\scripts\submit-openclaw-discovery-candidate.ps1` - bounded OpenClaw-root helper for mission-relevant upstream Discovery submissions
- `C:\Users\User\.openclaw\scripts\submit-openclaw-runtime-verification-signal.ps1` - bounded OpenClaw-root helper for stale runtime-verification signals
- `C:\Users\User\.openclaw\scripts\submit-openclaw-maintenance-watchdog-signal.ps1` - bounded OpenClaw-root helper for degraded maintenance/watchdog state

Rule:
- all new candidates should enter through Discovery first - no bypass into Runtime or Architecture without a Discovery record
- Discovery routes by adoption target, not by source type
- routing is conditioned on the active mission (see `knowledge/active-mission.md`)
- candidates that address known capability gaps (see `capability-gaps.json`) should be tagged
- when there are multiple internal Discovery-native slices available, prefer the highest-ranked unresolved gap in `gap-worklist.json`
- default to the fast path first

Operational loop:
1. Default fast path:
   - create one fast-path record in `intake/`
   - capture intake, triage, and routing in that one record
2. Split into `triage/` and `routing-log/` only when the case is complex, disputed, or held.
3. Send the candidate to one of:
   - `Directive Architecture`
   - `Directive Runtime`
   - `monitor/`
   - `deferred-or-rejected/`
   - `reference/`

Decision rule:
- Discovery does not perform deep integration by default.
- Discovery must end each active candidate in one explicit routing or holding state.
- If the route is not clear after first pass, stop and hold it instead of stretching Discovery work.

Primary operating surfaces:
- `intake-queue.json` - authoritative machine-readable queue
- validated by: `npm run check:discovery-intake-queue`
- `check:discovery-front-door-coverage` - executable routine-usage checker for Discovery-first intake coverage on the live corpus
- `gap-worklist.json` - authoritative ranking surface for unresolved Discovery gaps
- validated by: `npm run check:discovery-gap-worklist`

Canonical references:
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\workflow.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\discovery-fast-path-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\intake-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\triage-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\routing-record.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\discovery-to-architecture.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\discovery-to-runtime.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\discovery-gap-worklist.md`

Retirement surface:
- `agent-lab` is being retired by extraction into Directive Workspace.
- use `agent-lab-extraction/` to record what is re-homed, what is dropped, and when removal becomes safe.
