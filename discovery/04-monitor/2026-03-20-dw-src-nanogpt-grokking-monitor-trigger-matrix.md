# Monitor Trigger Matrix: NanoGPT/Grokking Paper Cluster

Date: 2026-03-20
Track: Directive Discovery
Candidate id: `dw-src-nanogpt-grokking`
Status: knowledge-only

## Purpose

Define explicit re-entry conditions for the knowledge-only scientific paper cluster candidate.

## Trigger Matrix

| Condition | Action | Target | Notes |
|---|---|---|---|
| No scientific-research automation scope in roadmap | Stay knowledge-only | Discovery reference/monitor | Default state |
| Roadmap explicitly adds scientific-research automation | Promote to triage | Discovery -> Architecture | Evaluate bounded extraction value |
| Request is only background context | Stay knowledge-only | Discovery reference | No implementation routing |

## Promotion Preconditions

- explicit adoption target is declared
- bounded scope and rollback/no-op path are defined
- receiving track owner is confirmed

## Review Cadence

- quarterly + on roadmap-change signal

## No-op Rule

If trigger conditions are not met:
- keep `knowledge-only`
- update monitor timestamp only
