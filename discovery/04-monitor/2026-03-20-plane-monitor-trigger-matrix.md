# Plane Monitor Trigger Matrix

Date: 2026-03-20
Track: Directive Discovery
Candidate id: `al-unclassified-plane`
Status: knowledge-only monitor

## Purpose

Define explicit trigger conditions for when `plane` should stay in monitor vs be promoted for active routing.

## Trigger Matrix

| Condition | Action | Target | Notes |
|---|---|---|---|
| No concrete PM-system integration need in active roadmap | Stay monitor | Discovery | Default state |
| Integration request appears but no adapter contract needed | Stay reference/monitor | Discovery | Keep boundary-rule role only |
| Concrete integration request requires new adapter contract | Promote to triage | Discovery -> Architecture | Create intake + triage + routing records |
| Host/runtime callable capability is explicitly requested | Route to Runtime follow-up | Runtime | Only after Architecture/Discovery decision confirms runtime need |

## Promotion Preconditions

Before moving out of monitor:
- active roadmap item references concrete PM-system integration
- expected adoption target is explicit
- bounded scope and rollback/no-op path are defined

## Review Cadence

- review cadence: on-demand + monthly sweep
- mandatory re-check on any roadmap item that mentions PM platform integration

## No-op Rule

If trigger preconditions are not met:
- keep `knowledge-only`
- update monitor timestamp only
