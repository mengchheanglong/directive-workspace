# Hermes Compaction Fidelity Policy

Date: 2026-03-21
Track: Directive Architecture
Source slice: `2026-03-21-hermes-contract-closure-slice-17.md`
Status: active architecture policy

## Policy Intent

Normalize Hermes surviving value into a product-owned compaction-fidelity contract and bind it to the default Directive handoff templates.

## Materialized Outputs

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\context-compaction-fidelity.md`
- updated handoff-facing templates:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\decision-record.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\routing-record.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\discovery-fast-path-record.md`

## Retained Mechanism

- compaction may reduce verbosity
- compaction may not alter handoff meaning
- bypass mode must be explicit when fidelity confidence is low

## Required Retained Fields

- `candidateId`
- `decisionState`
- `adoptionTarget`
- `nextAction`
- `riskNotes`
- `rollbackOrNoOp`

## Directive Adaptation Rule

- keep the fidelity boundary and bypass semantics
- do not adopt the broader Hermes runtime or memory platform
- treat compaction as a bounded handoff concern, not a general license to compress anything

## Validation Hooks

- `npm run check:directive-hermes-contracts`
- `npm run check:directive-workflow-doctrine`
- `npm run check:ops-stack`

## Closure Note

- this closes the Hermes Wave 02 reference-pattern gap for the current slice
- any later work should be optional schema or host-consumption refinement, not missing Architecture ownership
