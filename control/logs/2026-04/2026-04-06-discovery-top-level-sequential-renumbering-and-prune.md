# Discovery Top-Level Sequential Renumbering And Prune

Date: 2026-04-06

Affected layer: Discovery storage and read surfaces
Owning lane: Discovery
Mission usefulness: make Discovery match the numbered lane shape used by Architecture and Runtime without changing the actual front-door behavior
Proof path: `npm run check:discovery-mission-routing`, `npm run check:frontend-host`, `npm run check:directive-workspace-composition`, `npm run check`
Rollback path: rename the five Discovery flow folders back to their old names and restore the removed `discovery/agent-lab-extraction/` shelf from git if needed

## What changed

- Renumbered the active Discovery flow:
  - `discovery/intake` -> `discovery/01-intake`
  - `discovery/triage` -> `discovery/02-triage`
  - `discovery/routing-log` -> `discovery/03-routing-log`
  - `discovery/monitor` -> `discovery/04-monitor`
  - `discovery/deferred-or-rejected` -> `discovery/05-deferred-or-rejected`
- Updated active code, state, checks, docs, and artifact links to use the new numbered Discovery paths.
- Removed `discovery/agent-lab-extraction/` because it was a dead side shelf for clone-ready product use and no active code depended on it.

## Cutdown boundary

Discovery does not have the same dead-step problem Architecture had.

The active five-folder Discovery flow is still live:
- intake
- triage
- routing
- monitor
- defer/reject

The actual Discovery cutdown remains operational, not structural:
- default simple cases stay on the fast path in `01-intake/`
- `02-triage/` and `03-routing-log/` open only when the case truly needs the split path

`reference/` and `research-engine/` were intentionally kept because removing them would change real Discovery route semantics rather than only cleaning dead baggage.
