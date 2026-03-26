# CLI-Anything Re-entry Contract

Date: 2026-03-20
Track: Directive Runtime
Candidate id: `al-parked-cli-anything`
Status: deferred with formal re-entry contract

## Purpose

Define objective conditions that must be true before `CLI-Anything` may move from `defer` to `experiment`.

## Re-entry Preconditions (All Required)

1. Command-mediation contract exists
- Runtime has a written command-mediation contract artifact
- contract defines command classes, input/output schema, and hard-deny behavior
 - current artifact: `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\command-mediation-contract.md`

2. Approval policy exists
- command classes are mapped to explicit approval policy
- policy defines which classes require manual approval vs pre-approved execution
 - current artifact: `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\command-class-approval-policy.md`

3. Rollback/no-op test exists
- one bounded command set has a documented rollback or no-op behavior
- test evidence is recorded as an artifact

4. Gate readiness
- host checks pass before any trial:
  - `npm run check:directive-v0`
  - `npm run check:ops-stack`
 - current verification anchor:
   - `npm run check:directive-cli-anything-reentry`

## Re-entry Decision Rule

- If any precondition is missing: keep `defer`.
- If all preconditions are present: allow one bounded `experiment` slice.
- Bounded slice must keep runtime isolation and explicit rollback.

## Trial Scope Limits

- max command class count: 1
- max target surface: 1 bounded non-critical path
- no auto-generated broad wrapper promotion
- no persistence of new privileged execution paths

## Exit Outcomes

- `accept-for-runtime-follow-up` only with clean evidence and rollback validation
- otherwise return to `defer` with updated blocker notes
