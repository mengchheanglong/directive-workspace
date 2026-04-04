# Directive Workspace Execution Plan (Historical Reference)

Last updated: 2026-03-24
Owner: User (scope), Codex (implementation), OpenClaw (orchestration), Claude (planning/review)

Status: historical/reference document

This plan is preserved for execution-history context. Active doctrine now lives in `../CLAUDE.md`, with active run priority in `../control/runbook/current-priority.md`. Use `./README.md` before treating any `knowledge/` document as current authority.

Primary doctrine reference: `../CLAUDE.md`
Directive Workspace product doctrine guardrails:
- `../OWNERSHIP.md`
- `./doctrine.md`

Product-local references:
- `knowledge/doctrine.md`
- `knowledge/workflow.md`
- `knowledge/active-mission.md`

## 1) North Star

Directive Workspace is an objective-driven system that continuously identifies mission-relevant capability gaps, extracts useful mechanisms from existing and emerging breakthroughs, proves them safely, and upgrades the architecture/runtime/agent stack in service of the active mission.

Core purpose: **convert breakthroughs into usefulness**, where usefulness is defined by the active mission.

Near-term missing center:
- one reusable executable Directive Workspace engine that hosts can embed cleanly; the first slice exists, but too much DW behavior still lives outside it
- a clean hierarchy where Directive Workspace owns one Engine and Discovery / Runtime / Architecture operate as Engine lanes shaped by host objective

## 2) Core Doctrine

The operating loop is: **Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**.

That loop is decomposed into three Engine lanes separated by adoption target, not by source type:

- `Directive Discovery` - mission-aware intake queue, routing, and capability-gap detection
- `Directive Runtime` - bounded runtime operationalization and behavior-preserving transformation
- `Directive Architecture` - reusable internal operating logic (org-as-code)

Usefulness is mission-conditioned. If the mission changes, the meaning of usefulness changes too.

## 3) Current Mission

Current objective:
- build and operate a revenue-generating personal AI workspace that continuously strengthens its own capabilities through mission-driven ingestion, proof-backed adoption, and persistent orchestration

Current mission reference:
- `knowledge/active-mission.md`

## 4) Canonical Roles

- `Directive Workspace`
  - objective-driven capability evolution system
  - continuously converts breakthroughs into mission-relevant usefulness
  - should converge toward one canonical engine surface rather than many host-composed helper paths

- `Directive Discovery`
  - mission-aware intake queue, routing, and capability-gap detection
  - interprets mission context, defines usefulness for the active objective
  - routes by adoption target, preserves deferred/rejected work, and maintains revisit loops
  - does not run deep integration by default

- `Directive Runtime`
  - bounded runtime operationalization and behavior-preserving transformation
  - turns accepted patterns into bounded, measurable, callable autonomous loops
  - owns promotion contract, runtime proof, evaluator clarity, and runtime follow-up lifecycle

- `Directive Architecture`
  - reusable operating-code layer (org-as-code)
  - extracts essential mechanisms and converts them into product-owned contracts, schemas, templates, policies, and rules
  - hands off runtime-worthy work to Runtime
  - is the lane closest to the current mission because the current mission is to improve the Engine itself

- `Mission Control`
  - active runtime host and unified command surface
  - hosts Runtime runtime behavior but does not own Runtime as a product concept
  - owns runtime gates and production reliability

- `OpenClaw`
  - persistent orchestration and autonomy layer
  - session management, agent coordination, memory-backed looping execution

## 5) Capability Source Policy

Valid inputs include:
- GitHub repositories
- research papers
- product docs
- theory/framework writeups
- technical essays
- workflow patterns
- external systems
- internal operational signals

Policy:
- source type does not decide Runtime vs Architecture
- adoption target decides Runtime vs Architecture
- external sources are capability references and reverse-engineering targets
- do not absorb external runtime stacks blindly
- prefer adaptation or re-implementation with explicit proof

## 6) Operational Loop (Canonical)

Default fast loop:
1. Capture in Discovery.
2. Route by adoption target.
3. Prove only when needed.
4. Decide explicitly.
5. Integrate and report.

Escalation rule:
- use the full split workflow only when the candidate is complex, disputed, reusable as doctrine or contract, or crosses tracks

## 7) Delivery Stages (Historical Reference + Current Mode)

### Phase 0: Stability Baseline
Objective: keep host reliability and verification stable.

Checks:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run check:ops-stack`
- `npm run check:orchestrator-readiness`

Exit:
- all required checks green, or failures converted to tracked blockers

### Phase 1: Runtime Baseline
Objective: prove end-to-end callable-adoption path and runtime safety.

Scope:
- directive lifecycle API baseline
- promotion contract path to runtime
- runtime-proof discipline

Exit:
- at least one real capability reaches callable path with proof

### Phase 2: Architecture Exploration (Completed Cycle)
Objective: improve Directive Architecture through bounded, evidence-backed extraction from external sources.

Completion notes:
- Discovery is now the standalone front-door surface
- Architecture records and experiments now live under `architecture/`
- the current adopted Architecture cycle is closed

### Phase 3: Discovery Buildout
Objective: formalize Discovery as a first-class system with clear intake, triage, and routing interfaces.

Scope:
- discovery intake records
- routing decisions with explicit adoption target
- handoff contracts to Runtime and Architecture

Exit:
- Discovery is the operational front door in tooling and docs, not only in doctrine

### Current Operating Mode
Objective: deepen the core Directive Workspace engine so hosts consume one canonical product kernel rather than reconstructing DW behavior from helper flows and Markdown-first assets.

Current emphasis:
- engine-first product materialization
- Engine/lane separation
- Discovery-first intake as engine behavior, not just doctrine/reporting
- mission-conditioned usefulness and capability-gap tracking
- bounded Runtime runtime operationalization and transformation where it strengthens the engine
- keeping Mission Control and OpenClaw as hosts/orchestration layers instead of accidental product centers

## 8) Decision States and Adoption Targets

Decision states:
- `reject`
- `defer`
- `monitor`
- `experiment`
- `accept_for_architecture`
- `route_to_runtime_follow_up`
- `knowledge_only`

Adoption targets:
- `Directive Architecture`
- `Directive Runtime follow-up`
- `Directive Discovery backlog`
- `Knowledge/reference only`

Rule:
- no candidate moves to implementation without explicit decision state plus explicit adoption target

## 9) Promotion Contract (Runtime Path)

Before runtime or callable integration:
- `integration_mode` (`reimplement` | `adapt` | `wrap`)
- `target_runtime_surface`
- `owner`
- `required_gates`
- `rollback_plan`
- `proof_artifact_path`

No callable status without contract plus passing gates plus proof.

## 10) Governance and Required Gates

Always before merge or release:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run check:ops-stack`
- `npm run check:orchestrator-readiness`

Directive workflow changes:
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:directive-workflow-doctrine`

Validation bundle rule:
- doc or workflow-only changes use the smallest safe bundle first
- shared contract or schema changes use relevant directive checks plus workspace health
- host-wide gates such as `check:ops-stack` are reserved for host-wide or release-relevant changes

Fail-fast:
- two consecutive red nightly runs -> stop feature work, fix ops first
- high-severity hotspot -> investigate within 24h
- build, type, or lint failure -> no merge

## 11) Success Metrics

Primary:
- `decision_lead_time_hours`
- percentage of candidates that end in explicit evidence-backed decisions
- percentage of accepted items that produce reusable value

Secondary:
- `adopt_to_callable_lead_time_hours` (Runtime path only)
- experiment-to-decision cycle time
- reduction in repeated debates through explicit decision logging

## 12) Immediate Priorities

Current state (2026-03-23):
- Architecture completion is 100% for the current adopted set
- Runtime Waves 01-04 are complete
- Discovery is in primary mode with a validation checker
- the system needs an engine-first correction so host and Markdown surfaces stop outrunning the product kernel

Priority list:
1. Expand the canonical Directive Workspace engine surface so it owns more of source intake, routing, adaptation, proof, and integration state.
2. Keep Discovery / Architecture / Runtime as explicit Engine lanes that can be tailored to host objective without changing the engine API.
3. Treat Markdown/contracts/schemas/templates as spec and reporting surfaces emitted by or aligned to engine behavior, not as the primary product completion target.
4. Keep Mission Control as the first broad host, but require host-side DW behavior to collapse toward Engine consumption rather than host-local reconstruction.
5. Keep the standalone host bounded and useful, but pause breadth-first expansion unless it directly proves the engine adapter boundary.
6. Keep raw source material in `sources/` so Architecture and Runtime remain extraction/adaptation lanes, not repo-storage lanes.
7. Keep every new candidate tied to mission-conditioned usefulness and known capability gaps where applicable.
8. Maintain behavior-preserving transformation as a first-class lane: favor verifiable improvements in speed, cost, reliability, maintainability, and runtime fit alongside new capability adoption.
9. Strengthen dimensional evaluators: prefer numeric before/after measurement where applicable, not just binary pass/fail gates.
10. Keep Runtime source-packs curated: no generated dependency trees, no host caches, and only bounded reproducible build output when explicitly justified.
11. Keep ops reliability green while increasing candidate throughput.

Completed waves (historical reference):
- Architecture: current adopted-set cycle is 100% complete
- Runtime Waves 01-04: all complete
- Runtime System Bundles 02-06: all complete
- Discovery: primary-mode transition complete on 2026-03-22

## 13) Post-Phase-2 Side Experiment Reservation: Structural Blueprint / Analogy Layer

Locked vNext migration order remains:
1. Phase 1A - parallel event mirror foundation
2. Phase 1B - snapshot materializer and backfill parity
3. Phase 2 - planner in recommendation mode
4. Phase 3 - partial generated projections and event-first write path
5. Phase 4 - durable runner and repo-awareness packets
6. Phase 5 - retire artifact-first control

Verdict:
- keep structural blueprint / analogy work only as a narrow later side experiment
- do not treat it as Phase 1A or Phase 1B work
- do not let it change roadmap order or block substrate migration

Placement and owner:
- placement: after Phase 2, outside the critical path
- owner: Engine shared reasoning with planner-adjacent evaluation
- precondition: planner foundations must already be proven on current doctrine before this is considered

Experiment shape:
- start as an evaluation-only experiment on a tiny golden set
- suggested golden set: Inspect AI, OpenEvals, PromptWizard, ts-edge, and one Runtime-oriented negative control
- evaluate whether structural blueprint data improves:
  - route explanation
  - next-step recommendation quality
  - reduction in repeated reinterpretation
  - reduction in false transfer
- keep the experiment outside the critical path until it demonstrates measurable value
- discard it quickly if it does not measurably improve recommendation quality or transfer discipline

Structural mapping rule:
- this is not generic analogy note-taking
- no structural blueprint counts unless it maps relations, not attributes
- the goal is transfer discipline, not decorative abstraction

Suggested schema direction (note only, not implementation scope):
- `structural_blueprint`
- `source_structure`
- `target_structure`
- `relational_correspondence`
- `transferable_schema`
- `transfer_conditions`
- `non_transfer_conditions`
- `mapping_completeness`
- `systematicity_strength`
- `false_analogy_risk`
- `blueprint_confidence`

Anti-drift rules:
- do not block Phase 1A on this idea
- do not place it inside the case-store or append-only event foundation
- do not invent a new lane for it
- do not make blueprint extraction mandatory in Discovery early
- do not let a smart-sounding reasoning layer delay the substrate migration

## 13) Stop / Continue / Start

### Stop
- treating host breadth or standalone APIs as proof that the core DW engine exists
- treating Markdown emission as the main product completion signal
- letting Mission Control composition define Directive Workspace behavior by default
- treating source type as routing logic
- treating external repos as drop-in runtime truth
- running Architecture work without explicit decision and adoption target
- letting phase-era wording override the current mission-driven operating mode

### Continue
- bounded experiments
- explicit decisions
- evidence-backed promotion
- anti-random-rewrite discipline
- runtime gate discipline
- preserving doctrine/spec quality while moving the product center into executable code

### Start
- defining a canonical engine runtime model and API surface
- defining storage and host-adapter boundaries around that engine
- building one end-to-end machine-executable DW flow that hosts can call directly
- model every candidate with Discovery-first intake and routing semantics
- document mission usefulness and capability-gap linkage explicitly in every intake or follow-up artifact
- treat behavior-preserving transformation as a normal Runtime lane, not a special case
- make remaining legacy bridges explicit decisions instead of quiet leftovers

---

This file is the canonical execution plan.
If operating behavior changes, update this file and `doctrine.md` together.
