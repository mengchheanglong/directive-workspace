# Directive Workspace Control

This folder is the active run-control surface for autonomous work inside `directive-workspace/`.

Start here after reading:
1. `CLAUDE.md`
2. `AGENTS.md`

Then use:
- `control/runbook/active.md` for the active runbook
- `control/runbook/current-priority.md` for current mission and priority
- `control/policies/stop-lines.md` for active guardrails and hard boundaries
- `control/policies/continuation-rules.md` for cycle selection and continuation rules
- `control/policies/logging-rules.md` for log destinations and template rules
- `control/state/` for machine-readable completion-control surfaces when a loop needs a canonical next-slice selector

Authority split:
- `engine/workspace-truth.ts` = product truth summary
- `control/state/` = machine-readable control truth
- `state/` = case/event persistence
- `control/logs/` = history only

Historical logs now live under:
- `control/logs/`

Reusable templates live under:
- `control/templates/`
