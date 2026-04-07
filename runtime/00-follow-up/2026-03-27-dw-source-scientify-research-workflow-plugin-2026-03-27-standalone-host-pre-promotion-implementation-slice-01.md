# Scientify Standalone Host Pre-Promotion Implementation Slice 01

Date: 2026-03-27
Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
Candidate name: `Scientify Literature-Access Tool Bundle`
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
- Scientify's retained Runtime value is a local/shareable callable literature-access bundle, not a frontend-first review surface.
- Directive Workspace already has a product-owned standalone reference host for bounded Runtime-side local workflow support without Mission Control.
- The standalone host is explicitly intended to prove local/shareable host consumption of the Engine and Runtime artifacts before broader host parity is claimed.

## Source boundary

- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/00-follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Directive-owned capability bundle:
  - `runtime/capabilities/literature-access/index.ts`
  - `runtime/capabilities/literature-access/arxiv-search.ts`
  - `runtime/capabilities/literature-access/arxiv-download.ts`
  - `runtime/capabilities/literature-access/openalex-search.ts`
  - `runtime/capabilities/literature-access/unpaywall-download.ts`
- Standalone host boundary references:
  - `hosts/standalone-host/README.md`
  - `hosts/standalone-host/EXPANSION_DIRECTION.md`

## Runtime-owned output to expose

Runtime and Engine remain the only owners of:
- lifecycle truth
- blocker judgment
- legality of downstream Runtime progression
- the Directive-owned Scientify tool modules and their contracts
- host-facing promotion, runtime execution, host integration, callable rollout, and automation decisions

The bounded Runtime-owned output exposed to the standalone host in this slice is one non-executing Scientify bundle descriptor:
- candidate identity
- Runtime objective
- currentStage
- nextLegalStep
- proposedHost
- executionState
- promotionReadinessBlockers
- linked Runtime artifact paths
- the 4 approved tool names, exported function names, and module paths from `runtime/capabilities/literature-access/`

## Standalone-host owned implementation slice

The standalone host owns one bounded product slice only:
- one local/shareable host-side descriptor surface for the Scientify literature-access bundle
- that surface may be rendered through the existing standalone-host CLI/API/read-model layer as a read-only capability descriptor

This slice is limited to:
- exposing the existence and boundary of the 4-tool bundle
- exposing the proof-backed callable contracts already retained by Runtime
- making the non-executing state visible to a local/shareable host consumer

This slice does not include:
- invoking arXiv, OpenAlex, or Unpaywall
- downloading papers
- wiring host commands directly to the 4 callable tools
- background scheduling
- automation

## Why this is the smallest useful host-facing slice

Scientify already has real Directive-owned modules, but no truthful host boundary is selected yet. The smallest useful next move is therefore not live execution. It is one host-owned descriptor surface that proves the standalone host can consume the bounded Runtime bundle as a local/shareable product surface without claiming callable activation.

Anything broader would overstate current readiness.

## Proof / verification expectations for this slice

This slice is only ready to open when all of the following remain true:
- focused Runtime truth resolves cleanly from the Scientify promotion-readiness artifact
- `proposedHost` is explicit as `Directive Workspace standalone host (hosts/standalone-host/)`
- execution state remains non-executing and non-promoted
- no standalone-host command or API is claimed to invoke the 4 literature-access tools yet
- the host-facing surface is limited to descriptor/read visibility over the approved Runtime bundle

Current verification inputs for this bounded slice:
- `npm run check`
- `npm run report:directive-workspace-state`
- focused state report on the Scientify promotion-readiness artifact
- artifact inspection of the Runtime bundle and standalone-host boundary docs

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
- Keep Scientify at `runtime.promotion_readiness.opened`.
- Do not open host-facing promotion, runtime execution, host integration, callable rollout, or automation.
