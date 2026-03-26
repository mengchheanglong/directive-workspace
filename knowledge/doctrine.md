# Workspace Operating Model (Canonical)

Last updated: 2026-03-24

## Doctrine Precedence

This file is the canonical Directive Workspace operating model, but it is not the topmost doctrine source for the repo.

Repo-governing doctrine lives in:
- `C:\Users\User\.openclaw\workspace\CLAUDE.md`
- `C:\Users\User\.openclaw\workspace\.claude\skills\directive-workspace-doctrine\SKILL.md`
- `C:\Users\User\.openclaw\workspace\.claude\skills\directive-workspace-audit\SKILL.md`

This document should remain aligned with those governing sources and operationalize them for the Directive Workspace product surface.
If a conflict appears, correct this document rather than treating it as a competing doctrine.

## Doctrine

Directive Workspace exists to **convert breakthroughs into usefulness**, where usefulness is defined by the active mission.

Usefulness is not fixed. It depends on the current objective. If the mission is revenue, usefulness means anything that improves revenue, conversion, execution speed, automation, decision quality, cost efficiency, or strategic leverage. If the mission changes, the meaning of usefulness changes too.

The system extracts usefulness across many lanes: coding, research, planning, workflow design, memory systems, verification systems, business execution, operations monitoring, interface design, routing and prioritization, automation structure, specialized model/agent usage, capability-gap detection, and behavior-preserving transformation.

The operating loop is: **Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**.

The correct hierarchy is:
- **Directive Workspace**
  - the whole product
- **Engine**
  - the shared core adaptation machinery inside Directive Workspace
- **Discovery / Runtime / Architecture**
  - the three main operating lanes of the Engine

Do not treat the lanes as separate peer products.
Do not collapse Engine into Architecture.

The loop is decomposed into three Engine lanes separated by adoption target, not by source type:
- **Discovery**: mission-aware intake queue, routing, and capability-gap detection
- **Runtime**: bounded runtime operationalization and behavior-preserving transformation
- **Architecture**: reusable internal operating logic (org-as-code) and engine self-improvement

## Engine-First Correction

Directive Workspace should not stop at doctrine, contracts, templates, and records.

The core product must converge toward:
- one reusable executable engine
- one canonical runtime/state model for source intake, routing, adaptation, proof, and integration
- host adapters that consume that engine

This means:
- Markdown artifacts remain valid operating assets, but they are not by themselves the core system
- Architecture outputs are valuable as specs and reusable mechanisms, but they do not replace the engine kernel
- Mission Control and the standalone host should be treated as adapters and proving surfaces, not the product center

## Core System Model

- `Directive Workspace`
  - objective-driven capability evolution system
  - continuously identifies mission-relevant capability gaps, extracts useful mechanisms from breakthroughs, proves them safely, and upgrades the architecture/runtime/agent stack in service of the active mission
  - must ultimately materialize as one reusable engine that hosts can embed cleanly

- `Directive Engine`
  - shared goal-aware adaptation machinery
  - owns mission/goal interpretation, source normalization, default usefulness evaluation, explicit usefulness rationale, routing logic, shared usefulness signals, extraction/adaptation/improvement flow, proof/evaluator logic, decision logic, lifecycle states, integration logic, report coordination, cross-lane handoff rules, and coordination across records/contracts/registries

- `Directive Discovery`
  - mission-aware intake queue, routing surface, and capability-gap detector
  - intakes sources, interprets mission context, defines usefulness for the active objective, detects capability gaps, routes by adoption target, preserves deferred/rejected work, and maintains revisit loops
  - does not perform deep integration by default

- `Directive Runtime`
  - bounded runtime operationalization and behavior-preserving transformation lane
  - turns accepted patterns into bounded, measurable, callable, runtime-capable autonomous loops
  - owns follow-up records, execution records, promotion contracts, registry state, and host integration
  - supports two lanes: new runtime capability adoption and behavior-preserving transformation (same capability, better implementation)

- `Directive Architecture`
  - reusable operating-code layer (program-MD / org-as-code)
  - extracts essential mechanisms from outside systems, strips implementation baggage, converts value into product-owned contracts, schemas, templates, policies, and reusable rules
  - improves doctrine over time and produces agent-readable internal assets
  - hands off runtime-worthy work to Runtime instead of leaking runtime work into Architecture
  - should strengthen the engine itself, not become a substitute for executable engine behavior
  - is the lane closest to the current mission because the current mission is to improve the Engine itself

- `Mission Control`
  - active runtime host and unified command surface
  - currently hosts Runtime runtime behavior but does not own Runtime as a product concept
  - owns runtime reliability gates and production behavior
  - is a current host integration, not the canonical definition of Directive Workspace
  - should consume the engine through host adapters rather than define the engine by composition

- `OpenClaw`
  - persistent orchestration and autonomy layer
  - session management, agent coordination, ops monitoring, memory-backed looping execution
  - connected to Directive Workspace, but not the canonical definition of it

## Operational Loop (Canonical)

Default workflow reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\workflow.md`

Canonical loop:
1. Capture the source in Discovery.
2. Analyze the source against mission and capability gaps.
3. Route by adoption target.
4. Extract mission-relevant value.
5. Adapt the extracted value into Directive-owned form.
6. Improve it where appropriate.
7. Prove the adapted/improved result.
8. Decide the adoption state and target explicitly.
9. Integrate in Directive-owned form and sync reports.

Bridge clarification:
- This is the same original mission loop, decomposed for control.
- It is not three disconnected ideas.
- The fast path is default.
- The full split workflow is used only when complexity, risk, or reuse demands it.

## Source Policy

All lanes can use all source types:
- `github-repo`
- `paper`
- `product-doc`
- `theory`
- `technical essay`
- `workflow writeup`
- `external system`

Source type does not decide lane.  
Adoption target decides lane.

External source handling:
- treat external sources as capability inputs and reverse-engineering targets
- do not treat external repos/frameworks as runtime truth by default
- extract mechanisms, patterns, interfaces, workflows, and contracts
- adapt or re-implement useful value cleanly
- direct import is rare and requires explicit justification

## Lane Boundaries

### Discovery boundary
- Owns mission-aware intake, routing, capability-gap detection, and holding states (monitor, defer, reject, reference).
- Applies Engine-owned mission context, routing assessment, and usefulness judgment at the front door.
- Maintains revisit loops for monitor/defer items.
- Does not own deep integration by default.

### Runtime boundary
- Owns bounded runtime operationalization and behavior-preserving transformation.
- Owns follow-up -> execution record -> promotion record -> registry lifecycle.
- Owns promotion contract, runtime proof, and evaluator clarity.
- Behavior-preserving transformation (same capability, better implementation) is a first-class lane, not a side case.
- Canonical completion reference: promotion contract + passing gates + proof artifact.

### Architecture boundary
- Owns reusable internal operating logic: contracts, schemas, templates, policies, rules, and doctrine.
- Extracts essential mechanisms from outside systems and converts them into product-owned assets.
- Hands off runtime-worthy work to Runtime instead of leaking runtime into Architecture.
- Architecture completion is measured by product-owned Directive Workspace materialization, not by Mission Control host implementation alone.
- Canonical completion reference: `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\architecture-completion-rubric.md`

### Mission Control boundary
- Active runtime host and unified command surface.
- Owns runtime behavior and runtime reliability gates.
- No runtime integration without explicit promotion contract + proof + evaluator clarity + rollback thinking.
- Must remain an adapter host over product-owned Directive Workspace assets rather than a competing product definition.

Canonical boundary reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\host-integration-boundary.md`

## Technology Rule

- Directive Workspace uses TypeScript as the default implementation language.
- Introduce Rust only for measured narrow hot paths after the TypeScript design is already stable.
- Canonical reference: `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\technology-policy.md`

## Status Semantics

- `framework_status`: `intake | analyzed | experimenting | evaluated | decided`
- `runtime_status`: `none | planned | implementing | callable | parked | removed`

Meaning:
- `framework_status=decided` can exist without callable runtime.
- `runtime_status=callable` requires runtime gates + proof artifact.
- Architecture adoption can be complete without creating a callable skill.

Operator-facing labels:
- `framework-adopted` for framework/architecture acceptance
- `runtime-callable` for runtime-ready callable outcomes
- raw `integrated` is legacy/internal wording only

## System Surfaces

### `agent-lab`
- source catalog for candidate repositories and capability references
- not production runtime
- temporary upstream extraction source while Directive Workspace absorbs any surviving value
- slated for retirement after useful components are re-homed under Discovery, Runtime, or Architecture

### `directive-workspace/architecture`
- product-owned Architecture surface for experiments, adopted patterns, and deferred decisions
- legacy redirect path remains at `C:\Users\User\.openclaw\workspace\architecture-lab`

### `directive-workspace/runtime`
- product-owned Runtime surface for follow-up records, execution records, promotion contracts, registry state, and host-agnostic core logic
- Mission Control remains the current runtime host

### `directive-workspace/discovery`
- product-owned Discovery front door for intake, triage, routing, and holding states

### `knowledge`
- canonical doctrine, boundary rules, and operating policy

## Roles

- Codex: primary implementation lane.
- OpenClaw: orchestration and ops-monitoring lane (coding allowed when selected/fallback).
- Claude: planning/review lane for architecture and risk/tradeoff quality.

## Non-Negotiable Principles

1. No blind repo adoption — external capabilities are inputs, not truth.
2. No runtime integration without promotion contract — runtime behavior must have proof, evaluator clarity, boundary definition, and rollback thinking.
3. Human approval for final adoption decisions — automation proposes, tests, proves; humans decide.
4. Keep experiments narrow and reversible — bounded slices over broad uncontrolled change.
5. Preserve rejected and deferred work — failure history is system memory.
6. Keep integrations replaceable — no hard-lock to one tool or vendor-specific abstraction.
7. Verification is core, not overhead — proof, evaluation, regression checks, and rollback plans are central capabilities.
8. Usefulness beats novelty — a breakthrough matters only if it improves mission execution.

## Practical Routing Rule

- If primary value is callable/runtime capability or behavior-preserving transformation, route to Runtime.
- If primary value is reusable internal operating logic (contracts, schemas, policies, workflow rules, doctrine), route to Architecture.
- If useful but not yet actionable, keep in Discovery as defer/monitor/reference.

## Implementation Biases

Prefer work that strengthens:
- the executable Directive Workspace engine kernel first
- Discovery as the enforced front door with mission-aware routing
- mission-conditioned usefulness logic and capability-gap detection
- Architecture as operating code (org-as-code), not passive documentation
- Runtime as bounded runtime operationalization
- Runtime as behavior-preserving transformation engine
- verifier lanes, evaluator contracts, and proof discipline
- Mission Control as unified runtime host
- OpenClaw as persistent orchestration layer

Avoid:
- treating Markdown/report emission as the main product completion signal
- expanding host breadth as a substitute for materializing the core engine
- shrinking the project into coding-only capability ingestion
- treating doctrine as passive documentation instead of operating code
- turning Discovery into passive note storage
- ignoring highly verifiable transformation opportunities
- over-valuing novelty over mission-relevant usefulness
