# OpenClaw Maintenance Watchdog Signal

Last updated: 2026-03-23

## Purpose

Define the bounded upstream signal that lets OpenClaw surface degraded maintenance-loop or Telegram watchdog state into Directive Discovery.

This lane exists so orchestration health drift becomes a Discovery candidate before it turns into silent operator debt.

## Signal Sources

- `C:\Users\User\.openclaw\runtime\openclaw-maintenance-loop-state.json`
- `C:\Users\User\.openclaw\runtime\telegram-watchdog-state.json`
- `C:\Users\User\.openclaw\runtime\telegram-watchdog-history.jsonl`

## Implemented Helper

- `C:\Users\User\.openclaw\scripts\submit-openclaw-maintenance-watchdog-signal.ps1`

## Submission Target

- `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\intake-queue.json`

## Signal Rules

The helper may open a Discovery candidate when one or more of these conditions are true:

- maintenance state file missing or unreadable
- maintenance loop `updatedAt` is stale
- maintenance loop `lastWatchdogAt` is stale
- maintenance loop `lastGuardAt` is stale
- watchdog state file missing or unreadable
- watchdog `lastProbeAt` is stale
- watchdog reports `lastProbeOk = false`
- watchdog `lastAction` indicates a degraded state instead of `none` or `replay_sent`
- latest watchdog history row reports `criticalFailures > 0`
- latest watchdog history row reports `queuePendingOld > 0`

## Submission Shape

When the helper detects a signal, it submits one pending Discovery queue entry through the canonical OpenClaw submission helper.

Required payload characteristics:

- candidate id is stable per day unless explicitly overridden
- source type is `internal-signal`
- source reference points at maintenance/watchdog runtime state
- mission alignment points back to orchestration reliability and Discovery-first intake
- capability gap field stays `null` unless the degraded condition clearly maps to a currently unresolved Discovery gap
- notes summarize the detected degraded conditions

## Boundaries

- This helper only submits into Discovery
- This helper does not route directly to Runtime or Architecture
- This helper does not mutate existing Discovery records
- This helper does not fabricate a candidate when the runtime state is healthy

## Host Validation

- `npm run check:openclaw-maintenance-watchdog-signal`

## Current Status

As of `2026-03-22`, this lane is implemented and checker-backed.
It should only be exercised against a real candidate when maintenance/watchdog state actually degrades.
