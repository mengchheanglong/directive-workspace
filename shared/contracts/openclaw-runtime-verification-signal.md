# OpenClaw Runtime Verification Signal Contract

Last updated: 2026-03-22

## Purpose

Define one bounded OpenClaw-originated signal source that can feed Directive Discovery when runtime verification evidence becomes stale.

This contract exists to turn OpenClaw operational drift into a Discovery candidate before the system starts pretending healthy runtime status is enough without recent proof.

## Source inputs

The bounded implementation reads:

- `C:\Users\User\.openclaw\reports\ops\openclaw-runtime-regression-latest.json`
- `C:\Users\User\.openclaw\runtime\telegram-soak\daily-latest.json`

The active helper is:

- `C:\Users\User\.openclaw\scripts\submit-openclaw-runtime-verification-signal.ps1`

## Signal rule

OpenClaw should emit a Discovery candidate when either of the following becomes stale beyond its configured threshold:

- runtime regression evidence
- telegram soak evidence

The candidate must still enter Discovery as:

- `status: pending`
- `routing_target: null`

OpenClaw does not route or resolve the candidate itself.

## Bounded stale conditions

The helper currently evaluates:

- regression report age in hours
- soak summary age in hours

If both are within threshold, no submission is made.

If one or both are stale, the helper may submit exactly one bounded Discovery candidate for the current day key.

## Required output shape

The signal output must include:

- whether a signal was detected
- which reports were stale
- age in hours for each monitored report
- the candidate id that would be or was submitted

## Submission boundary

This slice does not implement:

- automatic scheduled submission
- webhook emission
- Telegram-originated discovery submission
- broad log scraping

It is limited to machine-readable verification freshness from existing OpenClaw reports.

## Why this matters

OpenClaw is the orchestration layer.
If its runtime verification evidence goes stale, the system loses a reliable picture of whether persistent orchestration is still actually healthy.

That is a mission-relevant capability signal and should reach Discovery as such.
