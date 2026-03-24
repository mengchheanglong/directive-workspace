# Impeccable Review Policy

Date: 2026-03-20
Track: Directive Architecture
Source slice: `2026-03-20-impeccable-implementation-slice-01.md`
Status: active architecture policy

## Policy Intent

Standardize frontend and UX quality review language for Architecture documentation and implementation proposals.

## Named Guardrails

1. Signal Over Noise
- keep interfaces purpose-driven
- remove decorative complexity that hides state and decisions

2. Explicit State Visibility
- surface status, blockers, and next actions clearly
- avoid ambiguous labels for lifecycle state

3. Safe Defaults
- prefer reversible changes
- preserve rollback/no-op paths in every proposal

4. Scope Discipline
- isolate feature intent from unrelated redesign changes
- reject broad rewrites without evidence

5. Operational Traceability
- connect every recommendation to validation gates
- keep ownership and handoff destinations explicit

## Anti-Pattern List

- vague status labels with no decision meaning
- UI changes that conceal gate failures or degraded states
- policy statements without validation method
- architecture notes that blur Forge vs Architecture ownership

## Usage Rule

This policy is:
- required for Architecture proposal reviews
- advisory for host UI implementation unless explicitly elevated by slice contract

## Boundary

This policy does not add runtime dependencies and does not authorize upstream skill-pack adoption.
