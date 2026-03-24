# OpenClaw Maintenance Watchdog Signal Lane

Date: 2026-03-22
Track: Discovery -> Architecture
Candidate id: `dw-openclaw-maintenance-watchdog-signal-lane`
Source type: `internal-signal`
Source reference: `scripts/openclaw-maintenance-loop.ps1 + scripts/telegram-watchdog.ps1 + scripts/submit-openclaw-maintenance-watchdog-signal.ps1`

## Mission Alignment

OpenClaw should surface recurring orchestration-health degradation into Discovery before reliability drift turns into silent operator debt.

## Intake Summary

Current live maintenance/watchdog state is healthy, so this slice does not fabricate a degraded-state candidate.

Instead, the candidate materializes the upstream signal lane itself:

- contract
- schema
- root helper
- host checker

## Routing Decision

Route to Architecture.

Reason:
- this is operating-code extraction for the Discovery front door
- the value is the bounded signal adapter itself, not a Forge runtime promotion

## Expected Result

Directive Workspace gains a third OpenClaw -> Discovery upstream lane:

1. direct root submission
2. stale runtime verification freshness
3. degraded maintenance/watchdog state
