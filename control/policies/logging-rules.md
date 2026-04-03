# Logging Rules

## Purpose

Keep active execution guidance separate from historical logs.

Use:
- `control/runbook/` for live run-control guidance
- `control/policies/` for stable execution rules
- `control/logs/` for completed cycle and loop-run history
- `control/templates/` for reusable logging and handoff formats

## Logging destinations

- place historical run logs under `control/logs/YYYY-MM/`
- keep active run-control guidance out of historical log files
- leave `implement.md` as a thin entrypoint only

## Logging model

Use one entry per completed bounded cycle unless the work is a repeated same-class micro-repair loop.

For NOTE-mode work, use the lightest truthful logging that preserves the decision and stop-line.
Do not imitate DEEP-mode structure when the case ended as one bounded note or parked review.

For repeated same-class wording or authority-alignment micro-repairs, prefer batched loop-run logging:
- one run header
- one compact bullet per verified micro-fix
- one final stop summary

Reserve full standalone cycle entries for slices that:
- change structural rules
- add a new contract or check
- require non-trivial product interpretation

## Templates

Use these templates:
- `control/templates/cycle-entry.md`
- `control/templates/loop-run.md`
- `control/templates/handoff.md`
