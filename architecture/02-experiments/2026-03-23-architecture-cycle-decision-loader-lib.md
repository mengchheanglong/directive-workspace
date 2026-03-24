# Architecture Cycle Decision Loader Lib

- Date: 2026-03-23
- Track: Architecture
- Type: executable operating-code slice

## Problem

Architecture cycle evaluation could summarize machine-readable decision artifacts, but it still depended on manual `*-adoption-decision.json` path selection.

That meant the system still reasoned about the wave through artifact lists instead of through the wave's actual experiment/adopted records.

## Change

Added `shared/lib/architecture-cycle-decision-loader.ts`.

It now:
- takes experiment/adopted record refs
- resolves adjacent decision-artifact paths canonically
- loads the on-disk artifacts
- returns a cycle summary from those real retained decisions

## Why it matters

Cycle evaluation can now consume the live closeout lane directly from wave record refs instead of maintaining separate manual artifact inventories.
