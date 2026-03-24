# Agent-Lab Orchestration Cutover

Date: 2026-03-20
Track: Directive Forge
Type: orchestration extraction
Status: planned

## Objective

Retire the useful orchestration boundary from:
- `C:\Users\User\.openclaw\workspace\agent-lab\orchestration`

without keeping `agent-lab` itself as an active Directive Workspace dependency.

## Extracted Value

The orchestration layer contains four things worth preserving:

1. capability registry semantics
2. external tool run envelope
3. adapter isolation pattern
4. host writeback rule

## Re-homing Plan

### Forge

Retain in Directive Forge:
- external run contract shape
- adapter-target boundary
- promotion path for external execution surfaces
- runtime follow-up records for tools that survive review

### Discovery

Retain in Directive Discovery:
- source-catalog reference map
- routing notes about what the orchestration layer used to cover
- classification guidance for tool-surface candidates

### Architecture

Retain in Directive Architecture only when a reusable pattern is architectural:
- supervision pattern
- curation policy
- execution isolation rule

## Explicitly Excluded

- `node_modules`
- local test artifacts
- local logs
- OpenViking local stack scripts as a default requirement
- old Mission Control writeback script as product truth

## Keep Rule

Keep only what survives as one of:
- a Forge contract
- a Forge follow-up candidate
- a Discovery routing/reference rule
- an Architecture pattern note

Everything else is disposable.

## Exit Condition

This cutover is complete when:
- Directive Workspace owns the retained orchestration contract and rules
- no active workflow needs `C:\Users\User\.openclaw\workspace\agent-lab\orchestration`
- any surviving runtime execution is promoted through Forge records and host handoff, not old `agent-lab` scripts
