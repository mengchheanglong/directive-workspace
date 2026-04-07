# Directive Workspace Ownership

## Product vs Host

- `Directive Workspace`
  - the product
  - standalone and host-agnostic by design
  - owns doctrine, contracts, decision model, Engine boundaries, shared operating assets, capability evolution logic, and the canonical engine runtime model

- `Mission Control`
  - the host
  - active runtime host and unified command surface
  - hosts Runtime runtime behavior but does not own Runtime as a product concept
  - integrates Directive Workspace but does not define it
  - should consume Directive Workspace through host adapters rather than reconstructing the product core locally

- `OpenClaw`
  - the orchestration layer
  - persistent, looping, memory-backed coordination across agents and sessions
  - owns OpenClaw-native recovery surfaces such as `openclaw/RESCUE_OPENCLAW.md` and `openclaw/RESCUE_PROTOCOL.md`

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
  - does not own Rescue OpenClaw
  - may reference OpenClaw-native recovery docs when needed, but should not redefine role ownership or protocol there

- `agent-lab`
  - temporary source catalog being retired by extraction into Directive Workspace
  - not part of the product structure

- `Mission Control`
  - keeps runtime code, database, APIs, checks, and UI integration
  - does not own Directive doctrine, lane lifecycle definitions, product-level contracts, or the canonical DW engine

## Host Integration Rule

- Directive Workspace canonical asset first
- Directive Workspace engine first
- host adapter second
- Mission Control, OpenClaw, or any future environment should consume or expose Directive Workspace, not redefine it

Canonical boundary reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\host-integration-boundary.md`

## Canonical Routing Rule

Runtime and Architecture are separated by adoption target, not by source type.
