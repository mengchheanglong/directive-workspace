---
id: f9183c87-018c-49ae-b206-9ce18958d714
title: Directive Workspace Project Plan
userId: 795edcca-fd18-4be3-8ba0-b86045af08ef
createdAt: '2026-03-17T20:06:43.2045961+07:00'
updatedAt: '2026-03-17T20:34:14.7463222+07:00'
tags:
  - project-plan
  - directive-workspace
  - agents
  - orchestration
  - capability-integration
---
# Directive Workspace Project Plan

> **Status: superseded (2026-03-22)**
> This file is a v0-era planning artifact. The core loop, capability intake, analysis, experiment, evaluation, decision, and integration registry described below are all implemented and operational.
>
> For current priorities, see: `active-mission.md`
> For current operating model, see: `doctrine.md`
> For current workflow, see: `workflow.md`
>
> This file is preserved as decision history per doctrine principle #5.

Canonical naming:
- `Project Directive Workspace` = overall product
- `Directive Runtime` = callable-adoption system
- `Directive Architecture` = framework-improvement system
- `Directive Discovery` = discovery-front-door system (standalone module planned/in progress)

## Status
Directive Workspace is being developed as a user-directed AI workspace for continuously improving a personal work system through the controlled intake, evaluation, and integration of new capabilities.

Related delivery plan:
- `C:\Users\User\projects\directive-workspace\knowledge\delivery-plan.md`

## Working Thesis
Directive Workspace should be built as a user-directed workspace that can absorb useful external innovation such as research papers, GitHub repositories, AI products, models, workflows, and tool patterns, evaluate whether they improve real work, and integrate them into a controlled and evolving operating system.

Doctrine clarification:
- Directive Workspace starts from one core loop: ingest external capability, evaluate it, and improve the personal AI system with it.
- The current structure is a decomposition of that same loop:
  - Directive Discovery = intake + first-pass triage + routing
  - Directive Runtime = callable/runtime operationalization
  - Directive Architecture = internal framework/workflow improvement
- Runtime and Architecture are separated by adoption target, not by source type.

## Core Idea
The goal is not to build a vague self-improving AI.

The goal is to build a workspace that helps the user continuously upgrade how they work.

When a new capability appears, the workspace should help answer:
- what it is
- what it is useful for
- where it fits in the current system
- whether it is worth testing
- whether it should be adopted, deferred, monitored, or rejected
- how it should be integrated if accepted

## Product Intent
Directive Workspace should become a directive-driven operating layer for knowledge work, software work, and experimental workflow development.

The user should be able to feed the workspace:
- a research paper
- a GitHub repository
- a product link
- a model release
- an implementation pattern
- a workflow idea
- a prompt or orchestration method

The workspace should then:
- analyze the capability
- relate it to current goals and workflows
- propose a way to test it
- record the result
- integrate it if it proves useful

## External Capability Source Model
Directive Workspace must continuously ingest capability inputs from:
- GitHub repositories
- research papers
- AI products
- model release notes
- workflow and architecture patterns

GitHub is the practical first lane for execution speed, but it is not the only capability source.

## Reverse-Engineering Rule
External repositories are primarily reference and reverse-engineering targets:
- extract the useful mechanism/pattern/interface/architecture
- adapt or re-implement cleanly inside the workspace
- avoid importing unnecessary complexity, dependencies, or maintenance baggage

The system goal is value integration, not repository cloning as product strategy.

## Runtime Ownership Boundary
- Directive Workspace owns capability intake, analysis, experiment, evaluation, and decision records.
- Mission Control owns callable runtime capabilities and production execution surfaces for mission-control projects.
- `agent-lab` is a temporary source capability catalog being retired by extraction into Directive Workspace.
- Promotion path: evaluated capability -> decision (`adopt`) -> explicit integration task -> callable capability in Mission Control.
- The boundary rule is strict: no direct external-repo runtime exposure without adaptation/re-implementation.

## Framework Clarification
- Directive Runtime is the callable-adoption system Mission Control currently hosts.
- Directive Architecture focuses on improving that framework (better intake quality, better experiment quality, better decision evidence, better promotion safety).
- Directive Discovery is the front-door routing system for finding/receiving useful sources and routing them to Runtime or Architecture.
- Mission Control remains the runtime host and destination for callable capabilities.
- Reverse-engineering outputs should become native Directive Workspace or Mission Control assets, not passive external dependencies.

Build-order clarification:
- Discovery may be built as a formal module after Runtime/Architecture implementation surfaces exist.
- Operational-loop clarification:
  - even before Discovery module is complete, intake/triage/routing should behave as Discovery-first.

## Day-to-Day Operating Flow
1. Discovery intake captures candidate in Directive Workspace.
2. Discovery triage routes by adoption target:
   - Runtime path for callable/runtime value
   - Architecture path for internal framework value
   - or keep in Discovery as defer/monitor/reject/reference
3. Downstream track evaluates with bounded proof and explicit decision logging.
4. If routed to Runtime and approved, create Mission Control integration task with promotion contract.
5. Implement runtime capability in Mission Control.
6. Prove runtime behavior with ops and integration checks.
7. Record artifacts and update registry state.

## Long-Range Direction
If the initial versions prove useful, Directive Workspace should expand into a controlled personal intelligence system that can:
- continuously evaluate new external capabilities
- maintain a registry of tools, patterns, and workflows
- compare old and new approaches through experiments
- preserve memory about what worked and what failed
- evolve the user’s working environment without losing clarity or control
- turn fast-moving AI progress into practical operational advantage

At maturity, Directive Workspace should function as a personal upgrade engine for the user’s stack.

## Product Frame
Directive Workspace should be treated as a controlled capability-integration system with five layers:
- User direction
- Capability intake
- Analysis and evaluation
- Experiment and decision
- Integration and memory

The workspace should improve by learning what to adopt, not by uncontrolled self-rewrite.

## Goals
- Let the user continuously feed new capabilities into the workspace.
- Help the user decide whether a new paper, repo, product, or workflow is worth adopting.
- Preserve memory of prior evaluations, experiments, and decisions.
- Keep an auditable record of why something was adopted, rejected, or deferred.
- Turn useful external innovation into repeatable workflow improvements.
- Keep the system modular so tools and orchestrators can change over time.

## Non-Goals for V0
- Building a fully autonomous AGI system
- Training or fine-tuning a new foundation model
- Fully automatic system-wide changes without approval
- Monitoring the entire internet by default
- Large-scale multi-agent autonomy from day one
- Complex research replication as the first milestone
- Heavy UI work before the capability loop is real

## V0 Definition
Prototype v0 is a user-directed capability integration workspace that can:
- accept a new paper, repo, product, or workflow input
- analyze what it is and where it might fit
- propose a limited experiment
- record the result of that experiment
- support an adoption decision
- record how accepted capabilities should be integrated into the workspace

V0 is intentionally scoped to:
- one primary user
- one or two supported input types at first
- one initial workflow family
- one experiment path
- one decision model
- one integration registry

## Core Capabilities

### 1. Capability Intake
The workspace should accept new external inputs such as:
- research papers
- GitHub repositories
- AI products or services
- model releases
- workflow ideas
- prompts or orchestration patterns

Each item should be captured as a capability candidate rather than treated as immediate truth or immediate adoption.

### 2. Capability Analysis
The workspace should help determine:
- what the capability does
- what category it belongs to
- what problem it may solve
- what workflows it may affect
- what dependencies or risks it introduces
- how it compares to current tools or methods

### 3. Experiment Planning
The workspace should propose a limited test for each promising capability, such as:
- a sandbox trial
- a side-by-side comparison
- a benchmark task
- a pilot integration into one workflow
- a lightweight proof of concept

The experiment should be narrow enough to run without destabilizing the wider system.

### 4. Evaluation and Decision
After an experiment, the workspace should record:
- usefulness
- friction
- quality impact
- speed impact
- cost impact
- setup complexity
- ongoing maintenance burden
- final recommendation

The decision should be one of:
- adopt
- reject
- defer
- monitor

### 5. Integration Memory
If a capability is accepted, the workspace should preserve:
- what was integrated
- where it was integrated
- why it was accepted
- what evidence supported the decision
- what workflows it affects
- what dependencies it introduced
- how to roll it back or replace it later

### 6. Workspace Registry
Directive Workspace should maintain a living internal record of:
- active tools
- evaluated capabilities
- experiments
- adoption decisions
- deferred ideas
- failed trials
- current workflow components

This registry becomes the memory of how the workspace evolved over time.

## Core Loop
1. Discovery receives a new capability input.
2. Discovery performs first-pass triage and routing.
3. The routed downstream track runs deeper analysis and bounded experiments.
4. The workspace records explicit decision state and adoption target.
5. Accepted Architecture value is integrated into internal framework improvements.
6. Accepted Runtime value is promoted to runtime integration path.
7. Runtime integrations are validated with gates and proof before callable status.
8. Registry and operating knowledge are updated for future decisions.

## Supported Capability Types
Initial capability types may include:
- research papers
- GitHub repositories
- AI tooling products
- model releases
- prompts
- orchestration patterns
- workflow templates

V0 should not attempt to support all of these equally from day one.

## Success Measures
Start with a small measurable set:
- number of evaluated capabilities that result in a clear decision
- time from intake to decision
- percentage of experiments that produce usable evidence
- number of accepted capabilities that lead to a real workflow improvement
- reduction in repeated manual re-evaluation of the same ideas
- quality of the workspace registry as a practical memory system

One primary metric should be chosen for v0 so progress is measurable.

## Guardrails
- Do not let the workspace silently adopt major system changes without approval.
- Keep experiments narrow and reversible.
- Prefer controlled trials over hype-based adoption.
- Do not absorb external repositories blindly; require extracted-value justification.
- Record failed experiments instead of discarding them.
- Keep the system modular so tools can be replaced later.
- Do not treat every new paper or repo as equally relevant.
- Preserve user control over final adoption decisions.

## Technical Direction
Recommended initial direction:
- OpenClaw as the orchestration or control layer
- Codex and Claude as specialist execution and reasoning tools
- a capability registry for intake, evaluation, and integration memory
- a lightweight experiment engine for controlled trials
- a persistent store for decisions, history, and integration state

The architecture should remain modular so parts of OpenClaw can be replaced later if a thinner custom controller becomes more effective.

## Delivery Phases

### Phase 1
Prove the capability loop:
- capability intake
- capability analysis
- experiment proposal
- evaluation record
- decision record

### Phase 2
Add integration memory:
- active tool registry
- experiment history
- accepted and rejected capability tracking
- clearer mapping between capability and workflow impact

### Phase 3
Expand carefully:
- more input types
- richer experiment templates
- better decision support
- broader workflow integration support

## Immediate Product Focus
Build the first proof that the workspace can turn one new external capability into one evidence-based adoption decision.

If this loop does not create real value, do not expand scope.

## Decision
Directive Workspace should be developed as a controlled capability-integration workspace that helps the user continuously evaluate, test, and incorporate useful external innovation into an evolving personal work system.
