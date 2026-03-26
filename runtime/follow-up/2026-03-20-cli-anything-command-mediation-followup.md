# CLI-Anything Command Mediation Follow-up

Date: 2026-03-20
Track: Directive Runtime
Type: runtime follow-up
Status: deferred

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\CLI-Anything`

## Surviving Value

CLI-Anything is useful as a reminder that software can be made agent-callable through a bounded CLI layer.

The real retained value is narrower:
- command mediation boundary
- structured JSON output expectation
- explicit harness layer between agent and target software

## Keep Rule

Retain only if Runtime later needs:
- safety-scoped command mediation
- generated or curated callable wrappers for external applications

## Do Not Keep

- the whole upstream generation stack
- broad multi-application runtime surface by default
- automatic wrapper generation without safety review

## Current Decision

Remain deferred until Runtime has an explicit mediated-command contract and approval model.
