# Discovery Intake: Context Pack Daily Log Summary Transformation

- Candidate id: `dw-transform-context-pack-daily-log-summary`
- Candidate name: `Context Pack Daily Log Summary Transformation`
- Intake date: `2026-03-22`
- Routed track: `Forge`
- Transformation class: `behavior-preserving speed optimization`

## Problem

`buildContextPack` only needs lightweight daily-log signals for memory highlights and promotion inference, but the current path loads daily reports by rebuilding full per-day markdown content and comparing/writing report files.

## Why It Matters

- Daily-log loading sits inside the active context-pack assembly path.
- This work is repeated in an operator-facing runtime path.
- Most of the daily-report markdown is not consumed by context-pack itself.

## Proposed Slice

- keep the full daily-report API/materialization path available
- add a read-only, summary-only daily-log path for context-pack assembly
- preserve the consumed memory/promotion signal while reducing load-data cost

## Expected Proof

- parity on the daily-log summary signal consumed by context-pack
- measured improvement in daily-log load wall-clock time on the control-plane project
