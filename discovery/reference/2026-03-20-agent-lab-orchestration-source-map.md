# Agent-Lab Orchestration Source Map

Date: 2026-03-20
Track: Directive Discovery
Type: source reference

## Purpose

Record what `agent-lab/orchestration` used to do so the value can be routed into Directive Workspace tracks before `agent-lab` is removed.

## Source Surface

- `C:\Users\User\.openclaw\workspace\agent-lab\orchestration\README.md`
- `C:\Users\User\.openclaw\workspace\agent-lab\orchestration\ROADMAP.md`
- `C:\Users\User\.openclaw\workspace\agent-lab\orchestration\CAPABILITY_REGISTRY.json`
- `C:\Users\User\.openclaw\workspace\agent-lab\orchestration\contracts\external-tool-run.contract.schema.json`

## What It Covered

### Registry
- capability inventory
- default selection order
- status labeling for active, parked, and deferred tooling

### Execution envelope
- one external run contract for tool execution
- common fields for task, source, output paths, and report-back behavior

### Adapter pattern
- one runner dispatching into isolated adapters
- examples included curation/export/install wrappers, browser work, eval work, and experimental memory path work

### Writeback rule
- raw artifacts stay on disk
- host receives summaries and follow-up actions

## Routing Guidance

Route from this source as follows:

- registry semantics -> `Directive Discovery` and `Directive Forge`
- external run contract -> `Directive Forge`
- adapter isolation pattern -> `Directive Forge` and `Directive Architecture`
- curation/export allowlist policy -> `Directive Architecture`
- start/health/stop local stack scripts -> `reference-only` unless a surviving host runbook needs them

## Not To Preserve

- vendored dependencies
- local logs
- generated test artifacts
- old folder layout as a required runtime boundary
