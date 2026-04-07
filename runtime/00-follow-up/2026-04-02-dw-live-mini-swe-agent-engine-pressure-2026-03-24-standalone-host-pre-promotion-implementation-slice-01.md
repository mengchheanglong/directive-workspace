# live mini-swe-agent Standalone Host Pre-Promotion Implementation Slice 01

Date: 2026-04-02
Candidate id: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
Candidate name: `mini-swe-agent Runtime Capability Pressure`
Track: Directive Workspace Runtime
Status: `explicit_non_promoting_slice`

## Objective

Define one bounded standalone-host implementation slice that is truthful before any host-facing promotion review opens.

This slice exists to make the first host/implementation boundary explicit without opening:
- host-facing promotion
- runtime execution
- host integration
- callable rollout
- automation

## Proposed host

- Proposed host: `Directive Workspace standalone host (hosts/standalone-host/)`

Why this is the truthful first host:
- the retained Runtime value is a local/shareable callable boundary for a minimal shell-first coding-agent capability, not a frontend-first review surface
- Directive Workspace already has a product-owned standalone reference host for bounded Runtime-side local workflow support without Mission Control
- the standalone host is explicitly intended to prove local/shareable host consumption of Runtime artifacts before broader host parity is claimed

## Source boundary

- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- Source Runtime follow-up record: `runtime/00-follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/03-routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Callable boundary:
  - `runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts`
- Standalone host boundary references:
  - `hosts/standalone-host/README.md`
  - `hosts/standalone-host/EXPANSION_DIRECTION.md`

## Runtime-owned output to expose

Runtime and Engine remain the only owners of:
- lifecycle truth
- blocker judgment
- callable legality
- legality of downstream Runtime progression
- host-facing promotion, runtime execution, host integration, callable rollout, and automation decisions

The bounded Runtime-owned output exposed to the standalone host in this slice is one non-executing live mini-swe descriptor:
- candidate identity
- Runtime objective
- currentStage
- nextLegalStep
- proposedHost
- executionState
- promotionReadinessBlockers
- linked Runtime artifact paths
- callable boundary input/output shape and safety rules

## Standalone-host owned implementation slice

The standalone host owns one bounded product slice only:
- one local/shareable host-side descriptor surface for the live mini-swe callable boundary
- that surface may be rendered through the existing standalone-host CLI/read-model layer as a read-only capability descriptor

This slice is limited to:
- exposing the existence and boundary of the retained callable capability
- exposing the proof-backed callable contract already retained by Runtime
- making the non-executing state visible to a local/shareable host consumer

This slice does not include:
- invoking any coding agent runtime
- wiring host commands directly to the callable boundary
- background scheduling
- automation

## Why this is the smallest useful host-facing slice

The case already has a bounded Runtime capability boundary, but no truthful repo-native host/descriptor surface. The smallest useful next move is therefore not live execution. It is one host-owned descriptor surface that proves the standalone host can consume the bounded callable candidate as a local/shareable product surface without claiming callable activation.

## Proof / verification expectations for this slice

This slice is only ready to open when all of the following remain true:
- focused Runtime truth resolves cleanly from the promotion-readiness artifact
- `proposedHost` is explicit as `Directive Workspace standalone host (hosts/standalone-host/)`
- execution state remains non-executing and non-promoted
- no standalone-host command or API is claimed to invoke the callable boundary yet
- the host-facing surface is limited to descriptor/read visibility over the approved Runtime candidate

## What this slice does not open

This slice does not create:
- a promotion record
- runtime execution
- host integration rollout
- callable rollout
- automation

## Rollback / no-op

- Remove this implementation-slice artifact and the reference to it from the promotion-readiness artifact.
- Revert the proposed host in the promotion-readiness artifact to `pending_host_selection`.
- Keep the case at `runtime.promotion_readiness.opened`.
- Do not open host-facing promotion, runtime execution, host integration, callable rollout, or automation.
