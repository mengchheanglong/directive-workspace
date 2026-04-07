# Hermes-Agent Utility Cutover

Date: 2026-03-20
Track: Directive Runtime
Type: bounded utility extraction
Status: closed (reference-only)

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\hermes-agent`

## Utility Value To Keep

- context-compaction helper pattern
- skill index generation helper pattern
- only bounded utilities that can stand alone without inheriting the Hermes runtime

## Do Not Keep

- the full Hermes runtime
- cross-platform gateway stack
- self-improvement loop as default Runtime behavior

## Gate Rule

Any retained utility must:
- stand alone under product ownership
- have explicit rollback
- avoid dependency on the old `agent-lab` source path

## Closure

Closed as reference-only:
- the surviving value was absorbed through Directive Architecture contracts/patterns
- no separate Runtime runtime lane is currently justified

## Exit Condition

This source becomes removable when:
- any retained bounded utility is re-homed into Directive Workspace
- everything else is explicitly dropped
