# Directive Workspace

Directive Workspace is the goal-driven product as a whole. Its job is to consume sources, extract usefulness, improve that usefulness, and upgrade the user's system in Directive-owned form.

Core purpose: **convert breakthroughs into usefulness**, where usefulness is defined by the active mission.

Canonical operating loop:
**Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**

## Governing Doctrine

Directive Workspace doctrine is governed first by:

- [CLAUDE.md](./CLAUDE.md)
- [OWNERSHIP.md](./OWNERSHIP.md)
- [control/runbook/current-priority.md](./control/runbook/current-priority.md)
- [knowledge/README.md](./knowledge/README.md)

The files under `knowledge/` are supporting reference and historical context, not peer authority with `CLAUDE.md`.
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
- `@directive-workspace/product/discovery`
- `@directive-workspace/product/architecture`
- `@directive-workspace/product/runtime`
- `@directive-workspace/product/engine/state`
- `@directive-workspace/product/runtime/core/runtime-core-contract`
- `@directive-workspace/product/runtime/core/v0` (legacy compatibility alias)

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

- `engine/` = stable kernel plus cross-lane state/truth
- `discovery/`, `runtime/`, `architecture/` = lane-owned operating code under `lib/` plus records, proofs, and adopted assets
- `hosts/` = adapters and reference hosts that consume the Engine and lane surfaces

Hosts should keep the Engine API stable and consume the canonical lane surfaces, not rebuild the kernel or recreate lane lifecycle behavior host-locally.

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

This standalone frontend is a direct product surface over the same Engine-native artifacts. The canonical frontend app lives in `frontend/` (Vite + Lit), and `hosts/web-host/` is the thin product-owned API/static host that serves it. It keeps Discovery as the front door, materializes inspectable Discovery intake/triage/routing artifacts from one real source submission, shows persisted Engine runs and queue state, derives the current live case artifact from the canonical resolver instead of treating the first downstream stub as the practical pointer, keeps downstream Architecture or Runtime advancement explicit through approval boundaries instead of automatic progression, exposes the Runtime follow-up review/open boundary, the Runtime record proof-open boundary, the Runtime proof runtime-capability-boundary-open boundary, and the runtime-capability-boundary promotion-readiness-open boundary as bounded Runtime steps, reads the operator decision inbox dynamically from `GET /api/operator-decision-inbox` for Discovery routing review, Architecture materialization due items, and Runtime host/registry decisions, and includes a compact `/workflow-map` page over live snapshot + inbox data instead of static phase text.
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

## Current Baseline

Directive Workspace is now operating on a simplified v1 baseline:

- CLAUDE-aligned core completion is achieved
- the active operator path is shorter and defaults to truthful early stop-lines
- Runtime follow-up navigation has one canonical report surface instead of raw folder-recency browsing
- Architecture DEEP-only materialization is physically collapsed under `architecture/04-materialization/` while logical artifact paths remain stable
- check infrastructure is faster and less repetitive through shared helpers for frontend build, frontend host startup, temporary Directive roots, and DW web-host checker families

This means the current repo emphasis is:

- preserve product truth and proof discipline
- keep Discovery as the front door
- keep Runtime reusable and bounded
- keep Architecture self-improvement real but only deepen when the next stage adds concrete new product value
- treat remaining cleanup or optimization as incremental improvement, not missing baseline product setup

## Research Engine Discovery Skill

Directive Workspace now treats `research-engine` as a bounded Discovery capability. It ingests a Discovery-only `research-engine` bundle through the canonical Discovery front door without granting it route or adoption authority.

Use:

```bash
npm run import:research-engine-discovery-bundle -- --bundle ../research-engine/artifacts/dw_import_bundle.json
```

Defaults:

- imports only the `research-engine` packet's `strong_signals`
- adapts them into `queue_only` Discovery submissions
- preserves `Discovery` as the route/adoption decision-maker
- keeps imported entries in `note` operating mode
- records imported entries with `submission_origin = research-engine` in canonical queue/state truth
- consumes only the Discovery-facing packet pair (`source_intelligence_packet.json` and `dw_discovery_packet.json`) plus the manifest refs that point at them

Optional bounded selection:

```bash
npm run import:research-engine-discovery-bundle -- --bundle ../research-engine/artifacts/dw_import_bundle.json --candidate-id paperqa2 --candidate-id langgraph
```

## Structure

- `engine/` - shared core machinery plus `engine/state/` for canonical cross-lane state resolution
- `sources/` - raw source snapshots, parked upstream material, and source notes that feed the Engine
- `discovery/` - Discovery lane operating surfaces and records
- `runtime/` - Runtime lane: `runtime/lib/` (operating code), `runtime/core/` + `runtime/capabilities/` (callable capabilities), plus records, proofs, and registry
- `architecture/` - Architecture lane: `architecture/lib/` (operating code), plus experiments, adoptions, deferred decisions, and DEEP-only materialization
- `shared/` - product-owned contracts, schemas, templates, and shared vocabulary
- `knowledge/` - supporting reference material, mission framing, and historical planning context
- `control/` - active run-control surfaces, policies, logs, and machine-readable control state
- `state/` - case/event persistence
- `hosts/` - host adapters, reference hosts, and integration state
- `scratch/` - local non-authoritative scratch only

## Code vs Artifact Surfaces

Each lane folder owns both its operating code and its artifact records:

- `architecture/lib/` = Architecture lane operating code; `architecture/01-experiments/` etc. = artifact records
- `runtime/lib/` = Runtime lane operating code; `runtime/core/` + `runtime/capabilities/` = callable capabilities; `runtime/02-records/` etc. = artifact records
- `discovery/lib/` = Discovery lane operating code; `discovery/intake-queue.json`, `03-routing-log/` etc. = artifact records
- `engine/` = shared kernel (source processing, routing, usefulness) + `engine/state/` (cross-lane state resolver)
- `shared/lib/` = cross-cutting support: case management, lifecycle coordination, evidence aggregation, host-neutral adapters

This means lane operating work now lands primarily in each lane's own `lib/` folder while recording proof in the lane corpus. `shared/lib/` is reserved for residual cross-cutting support rather than as the default home of lane code.

## Start Here

- [operator-start.md](./operator-start.md)
- [engine-direction.md](./knowledge/engine-direction.md)
- [CLAUDE.md](./CLAUDE.md)
- [current-priority.md](./control/runbook/current-priority.md)
- [knowledge/README.md](./knowledge/README.md)
- [active-mission.md](./knowledge/active-mission.md)
- [OWNERSHIP.md](./OWNERSHIP.md)
- [architecture-completion-rubric.md](./knowledge/architecture-completion-rubric.md)
- [technology-policy.md](./knowledge/technology-policy.md)

Useful operator reports:

- `npm run report:directive-workspace-state`
- `npm run report:runtime-follow-up-navigation`
- `npm run report:runtime-loop-control`
- `npm run report:read-only-lifecycle-coordination`
- `npm run report:operator-decision-inbox`
- `npm run report:operator-decision-inbox-markdown`

