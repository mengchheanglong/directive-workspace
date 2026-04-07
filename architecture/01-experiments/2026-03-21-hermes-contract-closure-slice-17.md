# Hermes Contract Closure Slice 17

Date: 2026-03-21
Candidate id: `al-parked-hermes-agent`
Track: Directive Architecture
Status: complete

## Objective

Promote Hermes context-compaction surviving value from reference-pattern level into a shared compaction-fidelity contract tied to Directive handoff templates.

## Scope

In:
- product-owned shared compaction-fidelity contract
- handoff template binding for compaction profile and status
- Architecture closure policy note
- host-side completeness check

Out:
- Hermes runtime adoption
- broad memory stack adoption
- CLI/scheduler/gateway integration

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-20-hermes-agent-implementation-slice-01.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-hermes-context-compaction-contract.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-hermes-agent-surviving-patterns.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-21-architecture-wave-02-shortlist.md`

## Execution Steps

1. Normalize retained-field and bypass rules into a shared contract.
2. Bind the contract into the default handoff templates that can carry compacted state.
3. Keep the mechanism narrow: fidelity, required fields, bypass semantics.
4. Record the result as adopted for Wave 02.

## Required Output Artifact

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\context-compaction-fidelity.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-hermes-compaction-fidelity-policy.md`

## Validation Gates

- `npm run check:directive-hermes-contracts`
- `npm run check:directive-workflow-doctrine`
- `npm run check:ops-stack`

## Rollback / No-op

- remove the shared contract and template field additions
- remove the closure policy note and host-side check
- return Hermes to Wave 02 reference-pattern status only
