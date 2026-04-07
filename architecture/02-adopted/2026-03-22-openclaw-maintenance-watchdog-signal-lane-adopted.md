# OpenClaw Maintenance Watchdog Signal Lane Adopted

Date: 2026-03-22
Candidate id: `dw-openclaw-maintenance-watchdog-signal-lane`
Track: Architecture
Status: adopted

## Adopted Result

Directive Workspace now owns a bounded upstream signal lane that can submit degraded maintenance/watchdog state into Discovery.

Adopted artifacts:

- `shared/contracts/openclaw-maintenance-watchdog-signal.md`
- `shared/schemas/openclaw-maintenance-watchdog-signal.schema.json`
- `C:\Users\User\.openclaw\scripts\submit-openclaw-maintenance-watchdog-signal.ps1`
- `mission-control/scripts/check-openclaw-maintenance-watchdog-signal.ts`

## Why Adopted

- it strengthens Discovery as the real front door
- it turns orchestration-health drift into a product-owned signal path
- it stays bounded and does not bypass Discovery routing

## Operational Status

- lane implemented: yes
- live degraded-state exercise: not yet
- reason: current maintenance/watchdog runtime state is healthy, so no fake signal was opened
