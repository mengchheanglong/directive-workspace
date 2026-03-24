# Directive Workspace Routing Matrix

Use this matrix during Discovery and downstream planning.

Fast routing question:
- "Is the main value a callable capability or an internal framework improvement?"

## Route To Directive Architecture

Choose `Directive Architecture` when the main value is:
- reusable internal operating logic (contracts, schemas, templates, policies, rules)
- an architectural pattern or workflow rule
- a decision framework or quality gate
- a mechanism that improves how Directive Workspace evaluates or integrates capability
- doctrine improvement or operating-code extraction

Do not route to Architecture just because the source is a GitHub repo or a paper.
Architecture is the org-as-code layer. Its outputs are operating code, not passive documentation.

When routing a source to Architecture, the next required step is a source analysis per `shared/contracts/source-analysis-contract.md`, followed by adaptation decisions per `shared/contracts/adaptation-decision-contract.md`. Architecture should not skip straight to extraction or adoption.

## Route To Directive Forge

Choose `Directive Forge` when the main value is:
- a callable workflow capability
- a runtime operational surface
- a host-facing capability that should become usable in practice
- a follow-up that needs promotion contract, proof, and runtime integration
- a behavior-preserving transformation (same capability, better implementation — speed, cost, reliability, maintainability)

Do not route to Forge just because the source looks tool-like.

## Keep In Discovery

Choose a Discovery holding state when:
- `monitor`: interesting but timing is wrong
- `defer`: useful but blocked, premature, or not worth current effort
- `reject`: low fit, low value, or high baggage
- `reference`: useful as background knowledge but not an active implementation candidate

Holding-state rule:
- every `monitor` or `defer` decision must include:
  - trigger conditions for promotion/re-entry
  - review cadence
  - explicit no-op rule when triggers are not met

## Mission-Conditioned Routing

Before routing, check:
- Does this candidate address a known capability gap? (see `discovery/capability-gaps.json`)
- What does usefulness mean under the active mission? (see `knowledge/active-mission.md`)
- Is the value runtime capability, or reusable internal operating logic?

Usefulness is not fixed. It depends on the current objective.

## Canonical Rule

Forge and Architecture are separated by adoption target, not by source type.
