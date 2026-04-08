# Directive Workspace Ownership

## Product vs Host

- `Directive Workspace`
  - the product
  - standalone and host-agnostic by design
  - owns doctrine, contracts, decision model, Engine boundaries, shared operating assets, capability evolution logic, and the canonical engine runtime model

- `Host environments`
  - embed or expose Directive Workspace through APIs, UI, storage, or operator surfaces
  - may host Runtime behavior but do not own Runtime as a product concept
  - integrate Directive Workspace but do not define it
  - should consume Directive Workspace through host adapters rather than reconstructing the product core locally

- `External orchestration environments`
  - may provide persistent, looping, memory-backed coordination across agents and sessions
  - own their environment-native recovery surfaces and operator protocols

## Engine Lane Ownership

- `Directive Discovery`
  - owns mission-aware intake, routing, capability-gap detection, and holding states
  - interprets mission context and defines usefulness for the active objective

- `Directive Runtime`
  - owns bounded runtime operationalization and behavior-preserving transformation
  - owns follow-up -> execution record -> promotion record -> registry lifecycle

- `Directive Architecture`
  - owns reusable internal operating logic: contracts, schemas, templates, policies, rules, and doctrine
  - extracts essential mechanisms and converts them into product-owned assets
  - hands off runtime-worthy work to Runtime

## Explicit Non-Ownership

- `Directive Workspace`
  - does not own external rescue or recovery protocols
  - may reference environment-native recovery docs when needed, but should not redefine role ownership or protocol there

- `agent-lab`
  - temporary source catalog being retired by extraction into Directive Workspace
  - not part of the product structure

- `Host environments`
  - keep host runtime code, database, APIs, checks, and UI integration
  - does not own Directive doctrine, lane lifecycle definitions, product-level contracts, or the canonical DW engine

## Host Integration Rule

- Directive Workspace canonical asset first
- Directive Workspace engine first
- host adapter second
- any current or future host or orchestration environment should consume or expose Directive Workspace, not redefine it

Canonical boundary reference:
- `shared/contracts/host-integration-boundary.md`

## Canonical Routing Rule

Runtime and Architecture are separated by adoption target, not by source type.
