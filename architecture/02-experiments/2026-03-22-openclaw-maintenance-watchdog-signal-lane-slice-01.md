# OpenClaw Maintenance Watchdog Signal Lane Slice 01

Date: 2026-03-22
Candidate id: `dw-openclaw-maintenance-watchdog-signal-lane`
Track: Architecture
Status: completed

## Goal

Materialize a bounded upstream Discovery signal lane for degraded maintenance-loop and Telegram watchdog state without faking a live degraded event.

## Implemented

- `shared/contracts/openclaw-maintenance-watchdog-signal.md`
- `shared/schemas/openclaw-maintenance-watchdog-signal.schema.json`
- `C:\Users\User\.openclaw\scripts\submit-openclaw-maintenance-watchdog-signal.ps1`
- `mission-control/scripts/check-openclaw-maintenance-watchdog-signal.ts`

## Proof

- the root helper inspects:
  - `runtime/openclaw-maintenance-loop-state.json`
  - `runtime/telegram-watchdog-state.json`
  - `runtime/telegram-watchdog-history.jsonl`
- the helper only opens a Discovery candidate when degraded conditions are detected
- the host checker drives the helper in dry-run mode against stale fixture state and requires:
  - `signal_detected = true`
  - `submitted = false`
  - preview queue entry remains `pending`

## Boundary Decision

Do not force a fake live candidate while runtime state is healthy.

The lane itself is the Architecture output.
Real live exercise should happen only when maintenance/watchdog state actually degrades.
