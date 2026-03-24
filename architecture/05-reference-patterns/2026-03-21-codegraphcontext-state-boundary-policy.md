# CodeGraphContext State Boundary Policy

Date: 2026-03-21
Track: Directive Architecture
Source slice: `2026-03-21-codegraphcontext-contract-closure-slice-16.md`
Status: active architecture policy

## Policy Intent

Normalize CodeGraphContext surviving value into a product-owned state boundary contract rather than keeping it as reference-pattern prose only.

## Materialized Output

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\index-query-state-boundary.md`

## Retained Mechanism

- index stage and query stage are separate concerns
- query results must disclose `index_state`
- degraded structural context must remain visible instead of being implied away

## Required State Vocabulary

- `ready`
- `missing-index`
- `stale-index`
- `partial-index`

## Directive Adaptation Rule

- keep state disclosure and degraded-mode semantics
- do not import graph database or MCP runtime baggage
- keep the output at shared-contract level until a later host/runtime decision explicitly requests more

## Validation Hooks

- `npm run check:directive-codegraphcontext-contracts`
- `npm run check:directive-architecture-contracts`
- `npm run check:ops-stack`

## Closure Note

- this closes the CodeGraphContext Wave 02 reference-pattern gap for the current slice
- any later work should be optional host consumption or additional schema/template binding, not missing Architecture ownership
