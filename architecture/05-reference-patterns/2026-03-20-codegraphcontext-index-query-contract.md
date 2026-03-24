# CodeGraphContext Index-Query Contract

Date: 2026-03-20
Track: Directive Architecture
Source slice: `2026-03-20-codegraphcontext-implementation-slice-01.md`
Status: active architecture contract

## Intent

Separate code-understanding into two explicit stages:
- index stage (build/refresh local structural context)
- query stage (retrieve/use context for analysis)

## Stage Contract

### Stage A: Index

Required outputs:
- `indexVersion`: semantic version or timestamp marker
- `sourceScope`: paths included in index
- `generatedAt`: ISO timestamp
- `coverageHint`: approximate coverage indicator

Failure states:
- `missing-index`
- `stale-index`
- `partial-index`

### Stage B: Query

Required inputs:
- valid Stage A output
- query intent
- target scope (optional)

Expected output:
- analysis response with explicit `indexState`
- confidence note tied to index state

## Fallback Policy

When index is missing or stale:
- query stage may run only in degraded mode
- output must mark `indexState` as degraded
- response must include recommended index refresh action

When index is partial:
- return scoped answer only
- list unresolved scope explicitly

## Validation Rules

- never present degraded output as complete
- never hide index state from downstream consumers
- downstream architecture notes must preserve `indexState`

## Non-Goals

- no graph database runtime adoption
- no MCP/runtime integration in this contract
- no mandatory host storage changes
