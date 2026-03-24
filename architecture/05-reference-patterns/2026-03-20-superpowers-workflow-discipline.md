# Superpowers Workflow Discipline

Date: 2026-03-20
Track: Directive Architecture
Type: reference pattern extraction

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\superpowers`

## Why It Matters

`superpowers` is useful because it codifies development discipline as mandatory workflow, not optional advice.

The value for Directive Architecture is the operating pattern:
- design before implementation
- explicit plan writing
- subagent task execution
- code review gates
- test-first discipline

## Patterns Worth Keeping

### Ordered development loop
- brainstorming
- worktree isolation
- plan writing
- execution
- test-first implementation
- review
- branch finish/merge decision

### Evidence-first completion
- verify before declaring done
- keep review as a blocking stage when needed

### Subagent boundary
- fresh-agent-per-task or per batch keeps execution bounded and inspectable

## Excluded Baggage

- plugin/runtime installation model
- automatic adoption of the full upstream skill library
- upstream platform-specific marketplace packaging

## Directive Target

- `Directive Architecture`

## Follow-up

Use this source as justification for stricter workflow rules where Directive Workspace still relies on operator memory instead of explicit stage discipline.
