# Architecture Consumption Record: OpenClaw Maintenance Watchdog Signal Lane (2026-03-30)

## integration reference
- Candidate id: `dw-openclaw-maintenance-watchdog-signal-lane`
- Candidate name: OpenClaw Maintenance Watchdog Signal Lane
- Source integration record: `architecture/07-integration-records/2026-03-22-openclaw-maintenance-watchdog-signal-lane-integration-record.md`
- Source retained artifact: `architecture/06-retained/2026-03-22-openclaw-maintenance-watchdog-signal-lane-retained.md`
- Source implementation result: `architecture/05-implementation-results/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-target.md`
- Source adoption artifact: `architecture/02-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-22-openclaw-maintenance-watchdog-signal-lane-slice-01.md`
- Usefulness level: `meta`
- Retained objective: Materialize one OpenClaw-specific maintenance/watchdog signal adapter helper that normalizes the bounded degraded-state signal into canonical Discovery submission-router input without moving degraded-state detection, queue submission, or routing authority out of Discovery.

## where it was applied
- Directive Workspace shared Discovery-facing product logic within the current bounded Architecture surface.

## application summary
- The integration-ready OpenClaw maintenance/watchdog adapter has now been explicitly consumed as shared Discovery-facing product input by exposing the adapter helper alongside the canonical Discovery worklist and submission-router helpers.

## observed effect
- Directive Workspace now has an explicit applied-integration record for the OpenClaw maintenance/watchdog adapter without moving degraded-state detection, queue submission, route selection, or downstream artifact authority out of the existing OpenClaw and Discovery boundaries.

## validation result
- Consumption stayed within the integration-ready boundary: the adapter remains read-only, preserves queue-only record shape, and leaves Discovery queue, routing, and worklist state untouched.

## consumption decision
- Outcome: `success`
- Recorded by: `directive-lead-implementer`

## rollback note
- If this applied integration proves premature or inaccurate, fall back to the integration record, remove the consumption record, and reopen a bounded Architecture review before any further step.

## artifact linkage
- This applied-integration Architecture record is now stored at `architecture/08-consumption-records/2026-03-22-openclaw-maintenance-watchdog-signal-lane-consumption.md`.
- If this consumption record later proves inaccurate or premature, resume from `architecture/07-integration-records/2026-03-22-openclaw-maintenance-watchdog-signal-lane-integration-record.md` instead of reconstructing the chain by hand.

