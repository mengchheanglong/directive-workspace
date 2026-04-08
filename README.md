# Directive Workspace

Directive Workspace is the product.

Its purpose is to consume external sources, judge mission-relevant usefulness, adapt that usefulness into Directive-owned form, prove it safely, decide on it, and integrate it with reporting discipline.

Canonical workflow:

**Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**

## Doctrine

Directive Workspace doctrine is governed by:

- [`CLAUDE.md`](./CLAUDE.md)
- [`OWNERSHIP.md`](./OWNERSHIP.md)
- [`control/runbook/current-priority.md`](./control/runbook/current-priority.md)
- [`knowledge/README.md`](./knowledge/README.md)

If local documentation drifts from those sources, the governing sources win.

## Product Model

Directive Workspace uses this hierarchy:

- **Directive Workspace** - the whole product
- **Engine** - the shared adaptation core inside Directive Workspace
- **Discovery / Runtime / Architecture** - the three main operating lanes of the Engine

The lanes are separated by adoption target:

- **Discovery** - source intake, filtering, routing, and capability-gap visibility
- **Runtime** - reusable runtime usefulness conversion and behavior-preserving transformation
- **Architecture** - Engine self-improvement, operating logic, and long-term adaptation quality

Do not treat the lanes as peer products beside the Engine.

## Package Surface

Directive Workspace exposes a package-ready standalone surface at the product root:

- package name: `@directive-workspace/product`
- root manifest: [`package.json`](./package.json)
- root barrel: [`index.ts`](./index.ts)
- standalone surface inventory: [`STANDALONE_SURFACE.json`](./STANDALONE_SURFACE.json)

Stable export lanes include:

- `@directive-workspace/product/engine`
- `@directive-workspace/product/discovery`
- `@directive-workspace/product/runtime`
- `@directive-workspace/product/architecture`
- `@directive-workspace/product/engine/state`
- `@directive-workspace/product/standalone-host`
- `@directive-workspace/product/frontend`
- `@directive-workspace/product/integration-kit`

## Hosts

Directive Workspace currently ships repo-native reference hosts:

- [`hosts/standalone-host/`](./hosts/standalone-host/) - filesystem-based reference host
- [`hosts/web-host/`](./hosts/web-host/) - product-owned frontend/API host over canonical product artifacts
- [`hosts/integration-kit/`](./hosts/integration-kit/) - starter surfaces for new hosts

Hosts consume the Engine and lane surfaces. They do not redefine product doctrine or lane lifecycle behavior.

## Validation

Canonical product validation:

```bash
npm run check
```

Useful focused commands:

- `npm run check:directive-workspace-composition`
- `npm run check:frontend-host`
- `npm run report:directive-workspace-state`
- `npm run report:runtime-follow-up-navigation`
- `npm run report:operator-decision-inbox`

## Research Engine

Directive Workspace includes a bounded Discovery capability at [`discovery/research-engine/`](./discovery/research-engine/).

It produces Discovery-facing handoff packets for the canonical front door. It does not own downstream Runtime or Architecture decisions.

Import a bounded Discovery bundle with:

```bash
npm run import:research-engine-discovery-bundle -- --bundle ../research-engine/artifacts/dw_import_bundle.json
```

## Repository Structure

- [`engine/`](./engine/) - shared core machinery and cross-lane state
- [`discovery/`](./discovery/) - Discovery lane operating code and records
- [`runtime/`](./runtime/) - Runtime lane operating code, capabilities, proofs, and registry
- [`architecture/`](./architecture/) - Architecture lane operating code and records
- [`shared/`](./shared/) - contracts, schemas, templates, and shared support
- [`control/`](./control/) - run-control surfaces, policy, logs, and machine-readable state
- [`knowledge/`](./knowledge/) - supporting reference and planning context
- [`hosts/`](./hosts/) - repo-native reference hosts and integration-kit surfaces
- [`sources/`](./sources/) - raw source material and source-side notes
- [`state/`](./state/) - case and event persistence

## Start Here

- [`CLAUDE.md`](./CLAUDE.md)
- [`control/runbook/current-priority.md`](./control/runbook/current-priority.md)
- [`knowledge/engine-direction.md`](./knowledge/engine-direction.md)
- [`knowledge/active-mission.md`](./knowledge/active-mission.md)
- [`OWNERSHIP.md`](./OWNERSHIP.md)

## Boundaries

Directive Workspace is:

- a goal-driven source adaptation product
- Engine-centered
- proof-driven
- decision-aware
- integration-and-report disciplined

Directive Workspace is not:

- a repo catalog
- a passive notes archive
- a host feature inside another product
- a Runtime-only tool adoption layer
- an Architecture-only notes system
