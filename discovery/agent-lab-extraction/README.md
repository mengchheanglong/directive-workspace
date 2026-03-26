# Agent-Lab Extraction

This surface exists to retire `agent-lab` by extraction.

`agent-lab` is treated here as a temporary upstream source catalog, not a permanent product module.

It is allowed to provide:
- candidate skills
- orchestration patterns
- curation logic
- contracts
- wrappers
- workflow rules

It is not allowed to remain as a runtime dependency of Directive Workspace.

Rule:
- extract useful value into `Directive Discovery`, `Directive Runtime`, or `Directive Architecture`
- record the extraction outcome explicitly
- remove `agent-lab` only after every active dependency is cut over or dropped

Primary records:
- `AGENT_LAB_EXTRACTION_LEDGER.md`
- `AGENT_LAB_RETIREMENT_PLAN.md`
- `AGENT_LAB_ARCHIVE_RUNBOOK.md`

Canonical policy:
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\doctrine.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\ROUTING_MATRIX.md`
