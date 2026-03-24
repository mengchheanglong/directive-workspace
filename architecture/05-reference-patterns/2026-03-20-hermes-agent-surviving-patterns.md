# Hermes-Agent Surviving Patterns

Date: 2026-03-20
Track: Directive Architecture
Type: reference pattern extraction

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\hermes-agent`

## Why It Still Matters

`hermes-agent` is too broad to adopt as a system, but some surviving value remains worth preserving.

## Surviving Value

### Context compaction contract
- preserve an explicit boundary for reducing context without losing the handoff meaning

### Skill index generation
- treat skill discovery as a generated indexable surface, not only a folder listing

### Self-improvement skepticism
- broad self-improving runtime loops are high-risk
- retain only bounded mechanisms with clear rollback

### Multi-surface interaction boundary
- useful reminder that one agent system can span CLI, scheduling, memory, and messaging, but Directive should extract only the needed layer

## Excluded Baggage

- broad multi-platform gateway runtime
- full memory stack
- cloud/serverless execution layer
- migration/runtime ownership assumptions

## Directive Target

- `Directive Architecture`

## Follow-up

Only bounded utilities or contracts should survive into Forge.
