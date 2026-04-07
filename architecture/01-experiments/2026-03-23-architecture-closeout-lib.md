# Architecture Closeout Lib

- Date: 2026-03-23
- Track: Architecture
- Type: executable operating-code slice

## Problem

Architecture had executable review resolution, adoption resolution, adoption artifact generation, and retained adopted-decision writing, but it still lacked one canonical closeout lane.

That left the Decide step as a sequence of helpers instead of a single operating path.

## Change

Added `shared/lib/architecture-closeout.ts` as the canonical closeout lane.

It now:
- resolves review input when needed
- resolves adoption canonically
- enforces record-state correctness
- emits the retained `architecture-adoption-decision` artifact shape

It supports:
- `stay_experimental` closeout from `architecture/01-experiments/`
- `adopt` closeout from `architecture/02-adopted/`
- `hand_off_to_runtime` closeout from `architecture/02-adopted/`

## Why it matters

Architecture can now close a slice through one executable path instead of manual sequencing across multiple helpers.

That reduces Decide-step drift and gives later cycle evaluation a cleaner on-disk decision trail.

