# Stop-Lines

## Current Runtime Execution Stop-Line

Current sanctioned execution boundary:
- `scripts/runtime-manual-control.ts`
- backed by `shared/lib/runtime-manual-control.ts`

Allowed now:
- explicit single Runtime actions through the proven execution substrate
- approved named Runtime sequences
- admin/test-only CLI invocation
- explicit choice and approval required

Not allowed now:
- host-admin execution seam
- normal user-facing execution surface
- planner-driven execution
- arbitrary action lists or sequences
- authority cutover away from `shared/lib/dw-state.ts`

Reopen criteria:
- concrete operator need that the CLI cannot adequately support
- explicit documented justification

## Current Operating Mode Stop-Lines

Default mode is NOTE unless repo truth clearly justifies STANDARD or DEEP.

Architecture:
- default stop at `bounded-result` in `architecture/02-experiments/`
- downstream materialization stages (04-09) are DEEP-only
- do not continue past bounded-result unless the next step adds a concrete new Directive-owned artifact

Runtime:
- default stop at follow-up record in `runtime/follow-up/`
- deeper chain only when real delivery work is active
- do not continue deeper just to complete the chain

Discovery:
- default to one fast-path intake record
- split into intake + triage + routing only when the case is disputed, held, complex, or rerouted

## Current Structural Mapping Experiment Boundary

Status: parked.

The two existing sidecars (`ts-edge`, `Scientify`) are retained but expansion is not allowed without an explicit bounded decision.

## Current Structural Mapping Stop-Line

Status: parked. No live integration, no expansion without explicit bounded decision.

## Relocation

Status: complete.

Canonical product root: `C:\Users\User\projects\directive-workspace`

Do not drift back to `.openclaw\workspace` as the canonical root.
