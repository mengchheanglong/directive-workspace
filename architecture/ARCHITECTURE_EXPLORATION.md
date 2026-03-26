# Architecture Exploration

Status: Active  
Start date: 2026-03-18  
Last updated: 2026-03-24

## Intent

Current execution mode for improving `Directive Architecture`.

It is not a runtime-delivery phase.  
It is an evidence-first architecture-improvement phase that extracts high-value mechanisms from external sources and adapts them into Directive Workspace safely.

## Doctrine Bridge

Directive Workspace converts breakthroughs into mission-relevant usefulness through three Engine lanes:
- Discovery: mission-aware intake queue, routing, and capability-gap detection
- Runtime: bounded runtime operationalization and behavior-preserving transformation
- Architecture: reusable internal operating logic (org-as-code)

This phase focuses on the Architecture lane while preserving Discovery-first routing semantics.

## Build Order vs Flow Order

Build order may be:
- Runtime first
- Architecture second
- Discovery later

Operational flow order remains:
- Discovery front door first, then route to Runtime or Architecture.

Phase 2 therefore behaves as:
- Architecture-focused execution
- with Discovery-style intake/triage/routing applied before deeper architecture adoption.

## Role

### What this exists to do

- Improve Directive Workspace internal framework quality.
- Evaluate external references for architecture value.
- Run bounded proof and record explicit decisions.
- Produce reusable internal mechanisms, patterns, contracts, and workflow improvements.

### What this is allowed to change

- intake/triage quality rules for architecture routing
- experiment methods and evidence standards
- architecture-level interfaces, policies, and contracts
- framework-level implementation slices inside Directive Workspace

### What this is not supposed to become

- a callable/runtime promotion lane by default
- a broad rewrite program without bounded proof
- a blind import pipeline
- a substitute for Discovery or Runtime ownership

### Why default adoption here is architecture

The purpose is to strengthen framework quality first.  
If a candidate is primarily runtime/callable value, route it to Runtime follow-up rather than forcing architecture adoption.

Architecture completion reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\architecture-completion-rubric.md`
- count Architecture progress by product-owned Directive Workspace materialization first, then host consumption second

## Canonical Definitions

- `Directive Workspace`: umbrella system.
- `Directive Discovery`: intake, first-pass triage, routing.
- `Directive Runtime`: callable/runtime adoption lane.
- `Directive Architecture`: internal framework-improvement lane.

Canonical routing rule:
- Runtime and Architecture are separated by adoption target, not by source type.

## Scope

### In scope

- source evaluation from:
  - `github-repo`
  - `paper`
  - `theory`
  - `product-doc`
  - `other`
- bounded experiments for architecture claims
- architecture adoption decisions with explicit evidence
- routing outputs that hand runtime-oriented value to Runtime

### Out of scope

- runtime exposure by default
- replacing stable host behavior without explicit override
- adopting whole external stacks as system truth
- broad feature expansion unrelated to architecture quality

## Candidate Types

Allowed sources are multi-source and equivalent from a routing perspective:
- repositories
- papers
- product docs
- theory/framework writeups
- technical essays
- workflow patterns

Source type is not the routing criterion.

## Operating Loop (Application)

Default fast path:
1. Receive a routed candidate.
2. Run one bounded experiment in `02-experiments`.
3. Record one explicit outcome:
   - accepted architecture value -> `03-adopted`
   - deferred/rejected value -> `04-deferred-or-rejected`

Escalate to the full split workflow only when:
- Discovery did not already resolve routing clearly
- the slice creates reusable cross-track doctrine or contracts
- the candidate is reopened, rerouted, or batched with others

## Decision Model

Allowed states:
- `reject`
- `defer`
- `monitor`
- `experiment`
- `accept_for_architecture`
- `route_to_runtime_follow_up`
- `knowledge_only`

Rule:
- Do not collapse all positive outcomes into generic "adopted".

## Experiment Types

Allowed experiment forms:
- `design_evaluation`
- `code_spike`
- `integration_slice`
- `workflow_simulation`
- `benchmark_comparison`
- `feasibility_check`

Rule:
- bounded duration
- one clear claim
- evidence required for decision

## Evaluation Criteria

Evaluate each candidate on:
- workflow impact
- direction fit (Architecture focus)
- integration cost
- operational risk
- reusability across surfaces
- observability fit
- safe validation fit with current gates
- adaptation quality (extractability vs entangled baggage)

## Adoption Target

No implementation without explicit target:
- `Directive Architecture`
- `Directive Runtime follow-up`
- `Directive Discovery backlog`
- `Knowledge/reference only`

## Valid Adoption Forms

Adoption may be:
- design principle
- workflow rule
- evaluation method
- architectural pattern
- interface contract
- schema/artifact model
- component adaptation
- policy/gate definition
- runtime follow-up candidate
- knowledge/reference capture

Default policy:
- extract value, do not absorb whole repositories.

## Promotion Rules

A candidate can move to `03-adopted` only if:
- bounded experiment evidence exists
- decision state is explicit
- adoption target is explicit
- extracted value and excluded baggage are explicit
- risk and rollback are documented
- required gates are green for relevant changes

Routing gate before final adoption:
- "Is this primarily Architecture improvement, or should it be routed to Runtime as runtime/callable follow-up?"

## Validation Bundles

### Bundle A: policy, workflow, or doctrine only
- `npm run check:directive-workflow-doctrine`
- `npm run directive:sync:reports`
- `npm run check:directive-workspace-report-sync`

### Bundle B: architecture contracts, templates, or schema work
- relevant directive contract/schema check
- `npm run check:directive-v0`
- `npm run check:directive-workspace-health`
- report sync

### Bundle C: host-facing Mission Control changes
- `npm run typecheck`
- relevant directive checks
- `npm run check:directive-integration-proof` when lifecycle/proof behavior changes
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack` only when the change affects host-wide or release safety

Rule:
- do not default to the heaviest validation bundle when a narrower bundle proves the slice safely

## Cutover Guard

- No API-contract-changing architecture adoption during runway without explicit freeze override and review.
- Stability takes priority over exploration speed.
- Decision quality takes priority over candidate volume.

## Decision Logging Standard

Every record must include:
- candidate id/name
- source type/reference
- decision state
- adoption target
- adoption form
- rationale
- extracted value
- excluded baggage
- evidence path
- risk and rollback notes
- follow-up slice/handoff

## Definition of Good Progress

Good progress is not cloning more repos.  
Good progress is:
- clearer routing decisions
- reproducible evidence
- safer architecture integration
- better framework quality
- less confusion between Architecture and Runtime work
- more product-owned Directive Workspace artifacts, not just more Mission Control host-side enforcement
