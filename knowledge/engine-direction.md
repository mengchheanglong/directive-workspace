# Directive Engine Direction

Last updated: 2026-03-24
Status: initial slice materialized; expansion pending

## Core Correction

Directive Workspace should be built primarily as:
- one reusable executable engine

It should not be mistaken for:
- a pile of Markdown artifacts
- a set of host-specific helper flows
- a Mission Control feature pack
- a standalone host surface without a canonical engine beneath it

## What The Engine Is

The target product center is a machine-executable core that can:
- intake sources against mission context
- classify usefulness
- route candidates to Discovery, Architecture, or Runtime
- perform adaptation/improvement work
- run proof/evaluation flows
- emit integration proposals and host-consumable outputs

The engine should own the canonical runtime model for:
- `SourceItem`
- `MissionContext`
- `SourceAnalysis`
- `Candidate`
- `RoutingDecision`
- `ExtractionPlan`
- `Adaptation`
- `ImprovementPlan`
- `ProofResult`
- `DecisionRecord`
- `IntegrationProposal`
- `ReportPlan`
- `EngineEvent`

Current engine slice already materialized:
- `engine/index.ts`
- `DirectiveEngine`
- `DirectiveEngineLaneSet`
- `DirectiveEngineStore`
- `createMemoryDirectiveEngineStore`
- `engine/directive-workspace-lanes.ts`

Current slice scope:
- source normalization
- mission-context resolution
- lane-driven routing assessment reuse
- extraction/adaptation/improvement planning
- usefulness classification
- proof-plan generation
- decision recording
- report planning
- integration-proposal generation

Current slice gap:
- more of Discovery, Architecture, and Runtime still lives outside the engine than inside it
- analysis/extraction/adaptation/improvement are still planning artifacts, not full engine-owned execution

## Engine vs Lanes

The separation should be:
- `engine/`
  - stable kernel
  - stable runtime primitives
  - stable store boundary
  - stable host-adapter entry point
  - Engine-owned lane contracts and the default Directive Workspace lane set

This means a host should be able to keep `DirectiveEngine` unchanged while tailoring lane behavior through the Engine-owned lane set.

Architecture already contributed one useful rule to this split:
- "valuable without runtime surface" is a good boundary test

That rule now belongs in lane design instead of being trapped only inside Architecture thinking.

## What Hosts Are

Mission Control, the standalone host, and future apps should be:
- host adapters
- execution surfaces
- storage/UI/API wrappers

They should consume Directive Workspace.
They should not reconstruct its core behavior independently.

## What Markdown Is

Markdown, contracts, schemas, templates, and records remain important.

They should primarily act as:
- doctrine
- specification
- proof/report outputs
- reviewable operator artifacts

They are not sufficient by themselves to satisfy the core product goal.

## Immediate Direction

Before expanding more host breadth, the next product goal is:
- deepen the Directive Workspace engine kernel cleanly

That means prioritizing:
1. expand the canonical engine API
2. keep Discovery / Architecture / Runtime as explicit Engine lanes instead of as peer product surfaces or host-local policy blobs
3. deepen the canonical runtime state model
4. strengthen the storage/adapter boundary
5. move more end-to-end DW behavior from helper flows into executable engine logic plus Engine lanes

This direction is meant to prevent drift.
Future host, Architecture, and Runtime work should be judged against whether it strengthens the engine itself.
