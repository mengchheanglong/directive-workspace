# Agent-Orchestrator Pattern Split

Date: 2026-03-20
Track: Directive Architecture
Type: reference pattern extraction

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\agent-orchestrator`

## Why It Matters

`agent-orchestrator` is useful for Directive Workspace in two different ways:

1. architecture pattern source
2. possible Runtime runtime follow-up

This note records only the Architecture side.

## Architecture Value

### Workspace isolation

Useful invariant:
- each agent works in an isolated workspace/worktree

Directive implication:
- parallel execution should preserve branch/worktree isolation by design, not by operator memory

### Swappable slots

Useful invariant:
- runtime, agent, workspace, tracker, notifier, and terminal are separable concerns

Directive implication:
- useful for Directive contracts because it prevents one execution stack from becoming product truth

### Reactions

Useful invariant:
- CI failure, review feedback, and approval are explicit event types with default actions

Directive implication:
- good model for downstream runtime escalation rules and host handoff conditions

### Human escalation boundary

Useful invariant:
- human attention is pulled in only when judgment is needed

Directive implication:
- aligns with Directive’s explicit proof, gate, and escalation model

## Excluded Baggage

- full upstream runtime stack
- dashboard product
- tmux/docker runtime implementation details as default Directive requirement

## Follow-up

The runtime-candidate side is tracked separately in Runtime.
