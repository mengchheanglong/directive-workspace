# Directive Workspace

Directive Workspace is the goal-driven product as a whole. Its job is to consume sources, extract usefulness, improve that usefulness, and upgrade the user's system in Directive-owned form.

Core purpose: **convert breakthroughs into usefulness**, where usefulness is defined by the active mission.

Canonical operating loop:
**Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**

## Governing Doctrine

Directive Workspace doctrine is governed first by:

- [CLAUDE.md](./CLAUDE.md)
- [OWNERSHIP.md](./OWNERSHIP.md)
- [knowledge/doctrine.md](./knowledge/doctrine.md)

The files under `knowledge/` operationalize that doctrine for this product surface.
If adjacent OpenClaw workspace doctrine helpers are used during incubation, treat them as external environment aids rather than as ownership of the Directive Workspace product root.
If a local Directive Workspace document drifts from the governing sources above, the governing sources win and the local document should be corrected.

## Engine Model

Directive Workspace uses this hierarchy:

- **Directive Workspace** - the whole goal-driven product
- **Engine** - the shared core adaptation machinery inside Directive Workspace
- **Discovery / Runtime / Architecture** - the three main operating lanes of the Engine

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
- **Runtime** - reusable runtime conversion and behavior-preserving transformation
- **Architecture** - engine self-improvement, adaptation quality improvement, and reusable operating logic

Architecture is the lane closest to the current mission because the current mission is to improve the Engine itself.

## Ownership

- Directive Workspace is the **product**. It owns doctrine, contracts, decision model, Engine structure, and shared operating assets.
- Directive Workspace is also a **standalone product**. It is designed to be integrated into different hosts, not reduced to one host's local feature set.
- Mission Control is a **host**. It hosts broad runtime behavior but does not define Directive Workspace.
- OpenClaw is the **orchestration layer**. Persistent, looping, memory-backed coordination.

Canonical host/product boundary:
- [host-integration-boundary.md](./shared/contracts/host-integration-boundary.md)

## Package-Ready Standalone Surface

Directive Workspace exposes a package-ready standalone surface at the product root:

- package name: `@directive-workspace/product`
- root manifest: [package.json](./package.json)
- root barrel: [index.ts](./index.ts)
- standalone surface inventory: [STANDALONE_SURFACE.json](./STANDALONE_SURFACE.json)

Stable root export lanes:

- `@directive-workspace/product/engine`
- `@directive-workspace/product/integration-kit`
- `@directive-workspace/product/integration-kit/starter`
- `@directive-workspace/product/integration-kit/cli`
- `@directive-workspace/product/standalone-host`
- `@directive-workspace/product/standalone-host/bootstrap`
- `@directive-workspace/product/standalone-host/cli`
- `@directive-workspace/product/standalone-host/config`
- `@directive-workspace/product/standalone-host/runtime`
- `@directive-workspace/product/standalone-host/persistence`
- `@directive-workspace/product/standalone-host/server`
- `@directive-workspace/product/frontend`
- `@directive-workspace/product/frontend/cli`
- `@directive-workspace/product/frontend/server`
- `@directive-workspace/product/shared/discovery`
- `@directive-workspace/product/shared/architecture`
- `@directive-workspace/product/shared/workspace-state`
- `@directive-workspace/product/runtime/core/v0`

Initial Engine surface:

- engine barrel: [engine/index.ts](./engine/index.ts)
- core orchestrator: `DirectiveEngine`
- stable lane contract: `DirectiveEngineLaneSet`
- default DW lane set: [directive-workspace-lanes.ts](./engine/directive-workspace-lanes.ts)
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
- `discovery/`, `runtime/`, `architecture/` = lane operating surfaces, records, proofs, and adopted assets
- `hosts/` = adapters and reference hosts that consume the Engine

Hosts should keep the Engine API stable and tailor lane behavior through Engine-owned lane definitions, not by rebuilding the kernel.

## Current Direction

Directive Workspace should converge toward:

- one reusable executable Engine that hosts can embed cleanly
- one canonical runtime model for source intake, analysis, routing, extraction, adaptation, improvement, proof, decision, integration, and reporting
- host adapters that call that Engine cleanly
- Discovery / Runtime / Architecture behavior that remains inside the Engine model instead of drifting into host-local reconstruction

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

- [hosts/standalone-host/README.md](./hosts/standalone-host/README.md)

That reference host exposes a bounded HTTP API, config-driven boot, runtime status/access logging, optional SQLite persistence, optional bearer auth, a Discovery front door that can persist full Engine run records and materialize Discovery intake/triage/routing outputs from the active mission and capability-gap corpus, and a bounded local Runtime workflow. This is a shareable local host surface for GitHub/package usage. It is not yet the broader host/runtime replacement for Mission Control.

Directive Workspace also ships a minimal product-owned standalone frontend at:

`hosts/web-host/`

This standalone frontend is a direct product surface over the same Engine-native artifacts. The canonical frontend app lives in `frontend/` (Vite + Lit), and `hosts/web-host/` is the thin product-owned API/static host that serves it. It keeps Discovery as the front door, materializes inspectable Discovery intake/triage/routing artifacts from one real source submission, shows persisted Engine runs and queue state, derives the current live case artifact from the canonical resolver instead of treating the first downstream stub as the practical pointer, keeps downstream Architecture or Runtime advancement explicit through approval boundaries instead of automatic progression, and now exposes the Runtime follow-up review/open boundary, the Runtime record proof-open boundary, the Runtime proof runtime-capability-boundary-open boundary, and the runtime-capability-boundary promotion-readiness-open boundary as bounded non-executing Runtime steps.
For Architecture bounded starts, the same frontend now surfaces derived closeout assistance from the bounded-start artifact plus linked Engine-run truth so the operator can review mission fit, extracted value, stage-preservation expectations, and suggested closeout summary language without losing explicit closeout control.

## Validation

Canonical product validation:

```bash
npm run check
```

That command now runs two bounded validations:

- `check:frontend-host` validates the standalone frontend/host surface and its existing browser-level checks
- `check:directive-workspace-composition` resolves and validates the current whole-product state across Discovery, Engine, Architecture, and Runtime using real product artifacts

The whole-product composition checker is intentionally narrow:

- it uses real March 24 and March 25 product artifacts
- it reuses the existing Architecture composition checker
- it calls existing shared helpers only
- it does not mutate the tracked source-of-truth artifacts
- it fails clearly if a shared product contract drifts, a lane link breaks, or a current next legal step is overstated

Run the whole-product composition checker directly when you need the current Directive Workspace truth anchor:

```bash
npm run check:directive-workspace-composition
```

Run the read-only current-state report directly when you need a machine-readable snapshot of the current product truth:

```bash
npm run report:directive-workspace-state
```

You can also pass one real artifact path to focus the report on a specific case or lane:

```bash
npm run report:directive-workspace-state -- runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md
```

Focused report output now distinguishes:

- `artifactStage` / `artifactNextLegalStep` = what the inspected artifact itself represents
- `currentStage` / `nextLegalStep` = the latest known case state reachable from that artifact's linked chain
- `currentHead.artifactPath` / `currentHead.artifactStage` = the current live artifact to continue from, derived from the canonical linked chain rather than queue-owned workflow state

## Structure

- `engine/` - shared core machinery and default Directive Workspace lane definitions
- `sources/` - raw source snapshots, parked upstream material, and source notes that feed the Engine
- `discovery/` - Discovery lane operating surfaces and records
- `runtime/` - Runtime lane operating surfaces, proofs, records, and registry
- `architecture/` - Architecture lane experiments, adoptions, and deferred decisions
- `shared/` - product-owned contracts, schemas, templates, and shared vocabulary
- `knowledge/` - canonical doctrine, workflow, mission definition, and operating policy
- `hosts/` - host adapters, reference hosts, and integration state

## Start Here

- [engine-direction.md](./knowledge/engine-direction.md)
- [doctrine.md](./knowledge/doctrine.md)
- [workflow.md](./knowledge/workflow.md)
- [active-mission.md](./knowledge/active-mission.md)
- [OWNERSHIP.md](./OWNERSHIP.md)
- [execution-plan.md](./knowledge/execution-plan.md)
- [architecture-completion-rubric.md](./knowledge/architecture-completion-rubric.md)
- [technology-policy.md](./knowledge/technology-policy.md)
