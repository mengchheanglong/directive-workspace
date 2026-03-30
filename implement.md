# implement.md

## Control Entrypoint

`implement.md` is now a thin compatibility entrypoint.

For substantive autonomous work in `directive-workspace/`, read in this order:
1. `CLAUDE.md`
2. `AGENTS.md`
3. `control/README.md`

Control structure:
- active runbook: `control/runbook/active.md`
- current mission and priority surface: `control/runbook/current-priority.md`
- stop-lines and guardrails: `control/policies/stop-lines.md`
- continuation policy: `control/policies/continuation-rules.md`
- logging policy: `control/policies/logging-rules.md`
- templates: `control/templates/`
- historical logs: `control/logs/`

This refactor separates active execution guidance from historical logs without changing product semantics, doctrine, or stop-lines.
