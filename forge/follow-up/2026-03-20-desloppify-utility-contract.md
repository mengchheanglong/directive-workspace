# Desloppify Utility Contract

Date: 2026-03-20
Track: Directive Forge
Source slice: `2026-03-20-desloppify-implementation-slice-01.md`
Status: active contract (helper lane only)

## Intent

Define a bounded quality-cleanup helper contract for Forge workflows.

This helper is optional and never becomes runtime truth for Directive lifecycle state.

## Trigger Condition

Run only when all are true:
- an operator explicitly requests a cleanup pass
- target artifact already exists and is readable
- cleanup goal is textual/format quality, not semantic decision rewrite

Do not trigger for:
- lifecycle decision changes
- source-of-truth metadata updates
- contract/gate result rewriting

## I/O Contract

Input envelope:
- `targetPath`: absolute file path under Directive Workspace or Mission Control
- `cleanupGoal`: one sentence quality objective
- `constraints`: list of hard constraints (must preserve)
- `maxEdits`: bounded integer edit budget

Output envelope:
- `ok`: boolean
- `editsApplied`: integer
- `summary`: short description of changes
- `noOpReason`: string when no edits are applied
- `warnings`: optional list

## Execution Rules

- helper may improve clarity and consistency only
- helper must preserve meaning and decisions
- helper must not introduce new external dependencies
- helper must stop on constraint conflict and return no-op

## No-op / Rollback

No-op when:
- target is missing
- constraints are ambiguous
- requested changes exceed `maxEdits`

Rollback path:
- discard helper output
- keep previous artifact unchanged
- record `noOpReason` in follow-up log

## Verification Commands

Run after helper use:
```powershell
cd C:\Users\User\.openclaw\workspace\mission-control
npm run check:directive-v0
npm run check:ops-stack
```

## Boundary

This contract does not authorize:
- upstream `desloppify` runtime adoption
- automatic lifecycle mutation
- replacement of operator review
