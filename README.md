# Directive Workspace

Directive Workspace is the goal-driven product as a whole. Its job is to consume sources, extract usefulness, improve that usefulness, and upgrade the user's system in Directive-owned form.

Core purpose: **convert breakthroughs into usefulness**, where usefulness is defined by the active mission.

Canonical operating loop:
**Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**

## Governing Doctrine

Directive Workspace doctrine is governed first by:

- [CLAUDE.md](/C:/Users/User/.openclaw/workspace/CLAUDE.md)
- [directive-workspace-doctrine skill](/C:/Users/User/.openclaw/workspace/.claude/skills/directive-workspace-doctrine/SKILL.md)
- [directive-workspace-audit skill](/C:/Users/User/.openclaw/workspace/.claude/skills/directive-workspace-audit/SKILL.md)

The files under `directive-workspace/knowledge/` operationalize that doctrine for this product surface.
If a local Directive Workspace document drifts from those governing sources, the governing sources win and the local document should be corrected.

## Engine Model

Directive Workspace uses this hierarchy:

- **Directive Workspace** - the whole goal-driven product
- **Engine** - the shared core adaptation machinery inside Directive Workspace
- **Discovery / Forge / Architecture** - the three main operating lanes of the Engine

Do not treat the lanes as peer products beside the Engine.

The Engine owns the common logic behind all three lanes:

- mission / goal interpretation
- source normalization
- usefulness evaluation
- routing logic
- extraction / adaptation / improvement flow
- proof / evaluator logic
- lifecycle states
- integration logic
- cross-lane handoff rules
- record / contract / registry coordination

The Engine lanes are separated by adoption target, not by source type:

- **Discovery** - goal-aware intake, filtering, routing, and capability-gap detection
- **Forge** - reusable runtime conversion and behavior-preserving transformation
- **Architecture** - engine self-improvement, adaptation quality improvement, and reusable operating logic

Architecture is the lane closest to the current mission because the current mission is to improve the Engine itself.

## Ownership

- Directive Workspace is the **product**. It owns doctrine, contracts, decision model, Engine structure, and shared operating assets.
- Directive Workspace is also a **standalone product**. It is designed to be integrated into different hosts, not reduced to one host's local feature set.
- Mission Control is a **host**. It hosts broad runtime behavior but does not define Directive Workspace.
- OpenClaw is the **orchestration layer**. Persistent, looping, memory-backed coordination.

Canonical host/product boundary:
- [host-integration-boundary.md](/C:/Users/User/.openclaw/workspace/directive-workspace/shared/contracts/host-integration-boundary.md)

## Package-Ready Standalone Surface

Directive Workspace exposes a package-ready standalone surface at the product root:

- package name: `@directive-workspace/product`
- root manifest: [package.json](/C:/Users/User/.openclaw/workspace/directive-workspace/package.json)
- root barrel: [index.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/index.ts)
- standalone surface inventory: [STANDALONE_SURFACE.json](/C:/Users/User/.openclaw/workspace/directive-workspace/STANDALONE_SURFACE.json)

Stable root export lanes:

- `@directive-workspace/product/engine`
- `@directive-workspace/product/integration-kit`
- `@directive-workspace/product/integration-kit/starter`
- `@directive-workspace/product/integration-kit/cli`
- `@directive-workspace/product/standalone-host`
- `@directive-workspace/product/standalone-host/bootstrap`
- `@directive-workspace/product/standalone-host/cli`
- `@directive-workspace/product/standalone-host/config`
- `@directive-workspace/product/standalone-host/forge`
- `@directive-workspace/product/standalone-host/persistence`
- `@directive-workspace/product/standalone-host/server`
- `@directive-workspace/product/frontend`
- `@directive-workspace/product/frontend/cli`
- `@directive-workspace/product/frontend/server`
- `@directive-workspace/product/shared/discovery`
- `@directive-workspace/product/shared/architecture`
- `@directive-workspace/product/forge/core/v0`

Initial Engine surface:

- engine barrel: [engine/index.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/engine/index.ts)
- core orchestrator: `DirectiveEngine`
- stable lane contract: `DirectiveEngineLaneSet`
- default DW lane set: [directive-workspace-lanes.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/engine/directive-workspace-lanes.ts)
- canonical store boundary: `DirectiveEngineStore`
- default in-memory store: `createMemoryDirectiveEngineStore`

That Engine surface is host-agnostic and already supports one real source-processing slice:

- source normalization
- mission-context resolution
- Engine-lane-driven routing assessment
- Engine-owned default usefulness classification, shared usefulness signals, and explicit usefulness rationale in analysis/report outputs
- extraction / adaptation / improvement planning
- proof-plan emission
- preliminary decision recording
- report planning
- integration-proposal emission

The important boundary now is:

- `engine/` = stable kernel plus Engine-owned lane definitions
- `discovery/`, `forge/`, `architecture/` = lane operating surfaces, records, proofs, and adopted assets
- `hosts/` = adapters and reference hosts that consume the Engine

Hosts should keep the Engine API stable and tailor lane behavior through Engine-owned lane definitions, not by rebuilding the kernel.

## Current Direction

Directive Workspace should converge toward:

- one reusable executable Engine that hosts can embed cleanly
- one canonical runtime model for source intake, analysis, routing, extraction, adaptation, improvement, proof, decision, integration, and reporting
- host adapters that call that Engine cleanly
- Discovery / Forge / Architecture behavior that remains inside the Engine model instead of drifting into host-local reconstruction

Current host/reference surfaces such as:

- `hosts/integration-kit/`
- `hosts/standalone-host/`

should be treated as adapters and proving lanes, not as the final definition of the core system.

Markdown, contracts, schemas, templates, and records remain important, but they should act mainly as:

- doctrine
- spec surfaces
- proof/report outputs

They should not substitute for the missing Engine behavior.

Directive Workspace also includes a standalone filesystem reference host at:

- [hosts/standalone-host/README.md](/C:/Users/User/.openclaw/workspace/directive-workspace/hosts/standalone-host/README.md)

That reference host exposes a bounded HTTP API, config-driven boot, runtime status/access logging, optional SQLite persistence, optional bearer auth, a Discovery front door that can persist full Engine run records, and a bounded local Forge workflow. This is a shareable local host surface for GitHub/package usage. It is not yet the broader host/runtime replacement for Mission Control.

Directive Workspace also ships a minimal product-owned standalone frontend at:

`hosts/web-host/`

This standalone frontend is a direct product surface over the same Engine-native artifacts. The canonical frontend app lives in `frontend/` (Vite + Lit), and `hosts/web-host/` is the thin product-owned API/static host that serves it. It keeps Discovery as the front door, shows persisted Engine runs, queue state, routed handoff stubs, and Architecture bounded-start artifacts, and makes Directive Workspace operable on its own without forcing every product iteration through Mission Control.

## OpenClaw Note

When Directive Workspace documents need to reference OpenClaw-specific recovery behavior, they should defer to OpenClaw-owned docs instead of defining that role here.

OpenClaw-native rescue references:

- `C:\Users\User\.openclaw\workspace\openclaw\RESCUE_OPENCLAW.md`
- `C:\Users\User\.openclaw\workspace\openclaw\RESCUE_PROTOCOL.md`

## What Directive Workspace Is Not

- a repo catalog
- a notes archive
- a coding-only evaluator
- a static architecture lab
- a runtime integration checklist

## Structure

- `engine/` - shared core machinery and default Directive Workspace lane definitions
- `sources/` - raw source snapshots, parked upstream material, and source notes that feed the Engine
- `discovery/` - Discovery lane operating surfaces and records
- `forge/` - Forge lane operating surfaces, proofs, records, and registry
- `architecture/` - Architecture lane experiments, adoptions, and deferred decisions
- `shared/` - product-owned contracts, schemas, templates, and shared vocabulary
- `knowledge/` - canonical doctrine, workflow, mission definition, and operating policy
- `hosts/` - host adapters, reference hosts, and integration state

## Start Here

- [engine-direction.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/engine-direction.md)
- [doctrine.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/doctrine.md)
- [workflow.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/workflow.md)
- [active-mission.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/active-mission.md)
- [OWNERSHIP.md](/C:/Users/User/.openclaw/workspace/directive-workspace/OWNERSHIP.md)
- [execution-plan.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/execution-plan.md)
- [architecture-completion-rubric.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/architecture-completion-rubric.md)
- [technology-policy.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/technology-policy.md)
