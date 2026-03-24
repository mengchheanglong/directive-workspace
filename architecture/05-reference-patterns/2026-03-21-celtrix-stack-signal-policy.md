# Celtrix Stack Signal Policy

Date: 2026-03-21
Track: Directive Architecture
Source slice: `2026-03-21-celtrix-contract-closure-slice-19.md`
Status: active architecture policy

## Policy Intent

Normalize Celtrix surviving value into a shared intake/routing stack-signal contract used by Discovery and Architecture.

## Materialized Outputs

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\intake-stack-signals.md`
- updated Discovery templates:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\intake-record.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\triage-record.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\discovery-fast-path-record.md`

## Retained Mechanism

- capture stack shape early
- separate stack metadata from integration intent
- distinguish boilerplate generation from product integration

## Directive Adaptation Rule

- keep the routing-quality checklist value
- do not adopt the Celtrix scaffolder runtime
- treat stack signals as classification metadata, not runtime truth

## Validation Hooks

- `npm run check:directive-celtrix-contracts`
- `npm run check:directive-workflow-doctrine`
- `npm run check:ops-stack`

## Closure Note

- this closes the Celtrix Wave 03 reference-gap for the current slice
- any later work should be optional host intake UX refinement, not missing product ownership
