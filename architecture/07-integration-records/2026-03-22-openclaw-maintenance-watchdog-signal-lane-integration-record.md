# Architecture Integration Record: OpenClaw Maintenance Watchdog Signal Lane (2026-03-30)

## retained objective
- Candidate id: `dw-openclaw-maintenance-watchdog-signal-lane`
- Candidate name: OpenClaw Maintenance Watchdog Signal Lane
- Source retained artifact: `architecture/06-retained/2026-03-22-openclaw-maintenance-watchdog-signal-lane-retained.md`
- Source implementation result: `architecture/05-implementation-results/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-22-openclaw-maintenance-watchdog-signal-lane-slice-01.md`
- Usefulness level: `meta`
- Objective retained: Materialize one OpenClaw-specific maintenance/watchdog signal adapter helper that normalizes the bounded degraded-state signal into canonical Discovery submission-router input without moving degraded-state detection, queue submission, or routing authority out of Discovery.

## integration target/surface
- Directive Workspace shared Discovery boundary only; the retained OpenClaw maintenance/watchdog adapter is integrated as a bounded normalization seam before canonical Discovery submission-router handling.

## readiness summary
- The retained maintenance/watchdog signal adapter is stable enough to be recorded as integration-ready shared product input because it normalizes degraded-state payload shape without moving signal detection, queue submission, or route selection authority out of OpenClaw and Discovery.

## expected effect
- Directive Workspace can reuse the OpenClaw maintenance/watchdog adapter as explicit shared Discovery-facing product logic without re-reading the Architecture chain or introducing host-specific branching into the canonical router.

## validation boundary
- Validate against the retained artifact, implementation result, adapter contract check, and canonical Discovery submission-router contract only; do not imply degraded-state polling, queue mutation, route mutation, or downstream auto-opening.

## evidence links
- Retained artifact: `architecture/06-retained/2026-03-22-openclaw-maintenance-watchdog-signal-lane-retained.md`
- Implementation result: `architecture/05-implementation-results/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-result.md`
- Implementation target: `architecture/04-implementation-targets/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-target.md`
- Adoption artifact: `architecture/03-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md`
- Upstream bounded result: `architecture/02-experiments/2026-03-22-openclaw-maintenance-watchdog-signal-lane-slice-01.md`

## integration decision
- Decision approval: `directive-lead-implementer`
- Decision: Record this retained OpenClaw maintenance/watchdog adapter as integration-ready shared Discovery-facing Architecture output for the current bounded scope.

## rollback boundary
- If this integration-ready record proves premature, fall back to the retained artifact, remove the integration record, and reopen one bounded Architecture slice instead of broadening maintenance/watchdog behavior by momentum.

## artifact linkage
- This integration-ready Architecture record is now retained at `architecture/07-integration-records/2026-03-22-openclaw-maintenance-watchdog-signal-lane-integration-record.md`.
- If integration readiness later proves premature, resume from `architecture/06-retained/2026-03-22-openclaw-maintenance-watchdog-signal-lane-retained.md` instead of reconstructing the chain by hand.
