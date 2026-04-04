---
id: 8897e456-6cae-4627-a9b8-ec65095038dc
title: Directive Workspace Delivery Plan
userId: 795edcca-fd18-4be3-8ba0-b86045af08ef
createdAt: '2026-03-17T20:13:00.3320474+07:00'
updatedAt: '2026-03-17T20:34:14.7463222+07:00'
status: historical/reference document
tags:
  - directive-workspace
  - delivery-plan
  - roadmap
  - execution
  - capability-integration
---
# Directive Workspace Delivery Plan

> Historical/reference note:
> Active doctrine now lives in `../CLAUDE.md`, with active run priority in `../control/runbook/current-priority.md`.
> Use `./README.md` before treating any `knowledge/` document as current authority.

> **Status: superseded (2026-03-22)**
> This file is a v0-era planning artifact. The milestones, tasks, and immediate next actions described below are all complete. The system has moved beyond v0 into operational proof mode.
>
> For current priorities, see: `active-mission.md`
> For current operating model, see: `doctrine.md`
> For current workflow, see: `workflow.md`
> For current execution plan, see: `execution-plan.md`
>
> This file is preserved as decision history per doctrine principle #5.

Canonical naming:
- `Project Directive Workspace` = overall product
- `Directive Runtime` = callable-adoption system
- `Directive Architecture` = framework-improvement system
- `Directive Discovery` = discovery-front-door system (standalone module planned/in progress)

## Purpose
Directive Workspace is not only an internal orchestration/routing system. It is a user-directed capability-upgrade system.

Doctrine clarification:
- Directive Workspace starts from one core loop: ingest external capability, evaluate it, and improve the personal AI system with it.
- That loop is decomposed into three specialized tracks:
  - Directive Discovery (intake + first-pass triage + routing)
  - Directive Runtime (callable/runtime adoption)
  - Directive Architecture (internal framework improvement)
- Runtime and Architecture are separated by adoption target, not by source type.
- Build order and flow order are different:
  - Build order can be Runtime -> Architecture -> Discovery.
  - Operational flow still starts with Discovery.

Canonical runtime naming for this plan:
- read `Directive Runtime` wherever older text says `Directive Workspace v0`
- read `Directive Architecture` wherever older text refers to the framework-improvement lane

Turn Directive Workspace into a usable v0 that proves the workspace can ingest a new external capability, evaluate its value to the user’s workflow, and record a grounded decision about adoption.

## Runtime Boundary
- Directive Workspace evaluates and decides what should be integrated.
- Mission Control exposes and runs callable capabilities for mission-control projects.
- `agent-lab` is a temporary source-repository catalog and extraction source, not a permanent system owner.
- A Directive Workspace decision is not runtime integration by itself; promotion into Mission Control is an explicit, gated step.

## Framework vs Runtime Clarification
- Project Directive Workspace contains three systems:
  - Directive Runtime
  - Directive Architecture
  - Directive Discovery
- Directive Discovery is the front door in the operational loop.
- Directive Runtime and Directive Architecture are downstream handlers selected by adoption target.
- Directive Workspace is the framework and governance umbrella.
- Mission Control is the execution/runtime host lane.
- Phase 2 work improves Architecture quality (evaluation quality, promotion quality, lifecycle signal quality), not direct runtime implementation by default.
- Runtime delivery still happens in Mission Control through explicit Runtime promotion.

## Capability Promotion Path
1. Discovery intake receives external candidate (repo/paper/product/model/workflow).
2. Discovery triage performs first-pass evaluation and routes by adoption target.
3. Downstream track performs deep analysis and bounded experiment:
   - Runtime path for callable/runtime value
   - Architecture path for internal framework value
4. Record explicit decision with evidence (`accept_for_architecture` / `route_to_runtime_follow_up` / `defer` / `monitor` / `reject` / `knowledge_only`).
5. If routed to Runtime and approved for runtime, open Mission Control integration task with promotion contract fields.
6. Implement as native Mission Control capability (re-implement/adapt/wrap).
7. Verify gates and attach proof.
8. Mark runtime integration complete.

## Delivery Scope
This delivery plan assumes:
- one primary user
- one initial workflow family
- one or two initial capability input types
- Codex and Claude as the first primary execution and reasoning tools
- OpenClaw or a thin controller as the orchestrator
- human approval for all final adoption decisions

## Core Product Decision
Directive Workspace is now a standalone product root inside:
- `C:\Users\User\projects\directive-workspace`

Mission Control remains the first runtime host.

## V0 Outcome
By the end of v0, Directive Workspace should be able to:
- accept a capability input such as a paper, repo, or product
- create a structured record for that capability
- analyze what it is and where it might fit
- propose a limited experiment or evaluation path
- record the result of the evaluation
- support a final decision of adopt, reject, defer, or monitor
- store accepted capabilities in an integration registry
- preserve decision history for later review

## External Capability Integration Policy
- External GitHub repositories, research papers, AI products, model releases, and workflow patterns are first-class capability inputs.
- New capabilities are analyzed for problem-fit, workflow-fit, integration cost, and operational risk before any adoption decision.
- External repositories are treated primarily as capability references and reverse-engineering targets, not as code to absorb blindly.
- If useful, the system should extract and adapt the valuable mechanism, pattern, interface, workflow idea, or architectural approach into the workspace.
- The goal is to integrate useful value and avoid importing unnecessary complexity or maintenance baggage.
- Adoption must pass controlled evaluation, bounded experiments, evidence capture, and explicit decisions (adopt/reject/defer/monitor).
- This expands the existing orchestration/evaluation model; it does not replace it.

## Build Rules
- Do not build a general AGI platform.
- Do not build broad autonomous internet monitoring in v0.
- Do not silently integrate major changes.
- Do not treat external repos as drop-in truth or immediate adoption.
- Do not expose external-repo code directly as Mission Control callable runtime without adaptation/re-implementation review.
- Do not optimize UI polish before the loop works.
- Keep the first supported capability type narrow.
- Prefer practical workflow evidence over hype or trend-chasing.
- Cut scope before adding abstraction.
- Store failed evaluations and rejected ideas instead of hiding them.

## Workstreams

### 1. Capability Intake
Build the intake path that can:
- accept a new external capability
- classify the source type
- create a structured capability record
- attach notes, links, summaries, and user intent

### 2. Capability Analysis
Build the analysis path that can determine:
- what the capability is
- what category it belongs to
- what problems it may solve
- what workflows it may affect
- what its likely value and risks are
- what existing tools or methods it overlaps with

### 3. Experiment Planning
Build the planning path that can:
- decide whether the capability should be ignored, monitored, tested, or considered for adoption
- define a small experiment for promising candidates
- specify success criteria before the experiment begins
- keep the experiment narrow and reversible

### 4. Evaluation and Decision
Build the evaluation path that can:
- record experiment outcome
- capture usefulness, friction, and workflow impact
- compare the candidate against the current approach
- support a decision of adopt, reject, defer, or monitor

### 5. Integration Registry
Build the memory layer that stores:
- accepted capabilities
- rejected capabilities
- deferred capabilities
- monitored capabilities
- experiment history
- workflow impact notes
- dependency notes
- rollback or replacement notes

### 6. Operator Surface
Provide a minimal internal view that shows:
- incoming capability candidates
- analysis summary
- experiment status
- decision status
- integration registry entries
- recent accepted and rejected items

## Milestones

### Milestone 0: Scope Lock
Target:
- 2 to 3 days

Deliverables:
- one selected workflow family
- one selected capability input type for v0
- capability record schema
- experiment record schema
- evaluation record schema
- decision record schema
- integration record schema

Exit criteria:
- the first supported capability type is explicit
- the first supported workflow is written in one sentence
- there is exactly one primary metric for v0
- unsupported input types are clearly deferred

### Milestone 1: Capability Intake Foundation
Target:
- 4 to 5 days

Deliverables:
- capability intake form or ingestion path
- source type classification
- structured capability record creation
- capability storage
- basic intake history

Exit criteria:
- a user can submit one supported capability input
- the system stores the capability in a structured way
- the capability can be reopened and reviewed later

### Milestone 2: Capability Analysis
Target:
- 4 to 5 days

Deliverables:
- analysis summary generation
- category classification
- workflow relevance mapping
- overlap and dependency notes
- recommendation for ignore, monitor, or test

Exit criteria:
- every supported capability receives an analysis summary
- the analysis connects the capability to a concrete workflow context
- the system can produce an initial recommendation

### Milestone 3: Experiment and Evaluation
Target:
- 4 to 6 days

Deliverables:
- experiment proposal path
- experiment success criteria
- evaluation record
- workflow impact notes
- decision support output

Exit criteria:
- the system can define a limited experiment for a promising capability
- the experiment result can be recorded clearly
- usefulness can be judged against the chosen primary metric
- the system can recommend adopt, reject, defer, or monitor

### Milestone 4: Integration Registry and Demo
Target:
- 3 to 4 days

Deliverables:
- integration registry
- accepted and rejected capability views
- decision history
- basic summaries or dashboards
- end-to-end demo flow

Exit criteria:
- at least one evaluated capability completes the full loop
- at least one final decision is stored with supporting evidence
- accepted capabilities appear in the registry
- the demo is understandable without manual stitching

## Priority Backlog

### P0
- choose the first workflow family
- choose the first supported capability input type
- define capability, experiment, evaluation, decision, and integration schemas
- implement capability intake
- implement analysis summary generation
- implement workflow relevance mapping
- implement experiment proposal flow
- implement evaluation recording
- implement final decision flow
- implement integration registry

### P1
- simple operator UI
- richer capability categorization
- better overlap analysis against current tools
- stronger experiment templates
- comparison across multiple evaluated capabilities

### P2
- more input types
- automatic watchlists for monitored capabilities
- scheduled reevaluation of deferred candidates
- wider workflow integration support
- multi-project capability mapping

## Task Sequence

### Task 1: Lock the First Supported Workflow
- write the first workflow in one sentence
- define where capability improvements will be judged
- reject extra workflow ideas until v0 works

### Task 2: Lock the First Supported Capability Type
- choose one capability type for v0
- examples: GitHub repo, research paper, or AI product
- avoid supporting too many types at once

### Task 3: Define the Core Records
Define:
- `capability`
- `experiment`
- `evaluation`
- `decision`
- `integration`

Keep each schema small enough to inspect manually.

### Task 4: Define the Evaluation Contract
- choose one primary metric
- define what counts as usefulness
- define what evidence is needed for adoption
- define what causes defer, monitor, or reject decisions

### Task 5: Build Capability Intake
- accept a capability input
- capture source type and link or reference
- store notes and user intent
- create the capability record

### Task 6: Build Capability Analysis
- summarize what the capability is
- classify its category
- map it to a workflow or tool gap
- note likely risks, setup cost, and overlap

### Task 7: Build Recommendation Logic
- decide whether the capability should be ignored, monitored, tested, or considered for adoption
- keep recommendation logic explicit and inspectable
- store the reasons behind each recommendation

### Task 8: Build Experiment Proposal
- define a narrow experiment for promising capabilities
- state the expected benefit
- state the success criteria
- keep the scope small enough to run safely

### Task 9: Build Evaluation Recording
- store experiment results
- capture usefulness, friction, time cost, and quality impact
- preserve failed trials instead of discarding them

### Task 10: Build Final Decision Flow
- let the user finalize adopt, reject, defer, or monitor
- store the decision and supporting reasons
- block silent adoption of major changes

### Task 11: Build Integration Registry
- record accepted capabilities
- store where they fit in the workspace
- note dependencies and follow-up work
- make prior decisions easy to review later

### Task 12: Build the Repeatable Test Path
- create a small fixed process for evaluating multiple capability candidates
- use it to keep evaluations consistent
- use it for the v0 demo

### Task 13: Prepare the V0 Demo
- show one capability intake
- show one analysis summary
- show one experiment proposal
- show one evaluation result
- show one final decision
- show one integration record if accepted

## V0 Definition of Done
Directive Runtime (v0) is done when:
- one user can submit one supported capability type end to end
- the system stores the capability, analysis, experiment, evaluation, and decision records
- the system can support a grounded decision about adoption
- accepted capabilities appear in the integration registry
- rejected or deferred capabilities are also preserved
- the result is demonstrated on a small repeatable evaluation path

## Main Risks
- scope drift into a giant autonomous system
- trying to support too many capability types at once
- shallow analysis that turns into hype collection
- weak experiments that do not produce real evidence
- storing lots of notes without producing useful decisions
- overcommitting to one orchestrator or one model provider

## Risk Controls
- keep only one supported capability type in v0
- require one primary metric and one explicit decision per evaluation
- preserve rejected and failed items, not just accepted ones
- keep experiment scope narrow and reversible
- keep tool integrations replaceable
- review weekly whether the system is producing decisions or only accumulating information

## Immediate Next Actions
1. Complete Task 1 and write the first supported workflow in one sentence.
2. Complete Task 2 and choose the first supported capability type for v0.
3. Complete Task 3 and define the five core records: `capability`, `experiment`, `evaluation`, `decision`, and `integration`.
4. Complete Task 4 and choose the one primary metric for v0.
5. Start Task 5 and Task 6 to get the smallest intake and analysis path working.
