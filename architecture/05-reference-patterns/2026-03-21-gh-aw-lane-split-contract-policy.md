# gh-aw Lane Split Contract Policy

Date: 2026-03-21
Candidate id: `gh-aw`
Track: Directive Architecture + Mission Control host checks

## Objective

Close gh-aw planned-next by enforcing read-only/write-lane split and compile-contract artifact requirements in Directive promotion contracts.

## Policy

1. Every promotion record must include both `source_intent_artifact` and `compile_contract_artifact`.
2. Runtime permissions must explicitly declare lane profile (`read_only_lane` and optional constrained `write_lane`).
3. If `write_lane` is present, `safe_output_scope` and `sanitize_policy` are mandatory.
4. Promotion contract review is fail-closed when lane split fields are missing.
5. Workflow tracking id must be present for audit/replay and cleanup.

## Validation Hooks

- `npm run check:directive-gh-aw-contracts`
- `npm run check:directive-architecture-contracts`
- `npm run check:directive-v0`
- `npm run check:ops-stack`

## Rollback

- remove lane split contract and this policy.
- remove lane split checker and ops-stack wiring.
- revert promotion contract/template field additions.
