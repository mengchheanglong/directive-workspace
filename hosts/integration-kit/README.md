# Host Integration Kit

This kit exists for hosts that want to clone or import Directive Workspace and wire it into their own runtime/API/UI surfaces.

Directive Workspace is the standalone product.
Hosts integrate it by consuming canonical Directive Workspace assets rather than redefining them locally.

Path references below are relative to the Directive Workspace product root unless explicitly labeled as an external example.

Use this kit when integrating Directive Workspace into:
- another workspace
- another dashboard or control plane
- a different runtime host
- automation infrastructure
- a custom operator surface

## Integration rule

Use this order:

1. read the product boundary:
   - `shared/contracts/host-integration-boundary.md`
2. consume canonical product contracts/schemas/shared libs
3. add only a thin host adapter for runtime/API/UI behavior

When possible, consume the package-ready module surface at:
- published root package:
  - `@directive-workspace/product/integration-kit`
  - `@directive-workspace/product/integration-kit/starter`
  - `@directive-workspace/product/integration-kit/cli`
- in-repo root package surface:
  - `package.json`
  - `index.ts`
- `hosts/integration-kit/package.json`
- `hosts/integration-kit/index.ts`
- `hosts/integration-kit/cli/host-integration-kit-cli.ts`

Do not start by inventing host-local payloads or host-local lane lifecycle definitions.

## Minimum host responsibilities

A host may own:
- runtime services
- runtime storage
- runtime APIs
- operator UI
- runtime checks

A host must not redefine:
- Discovery / Runtime / Architecture
- source-adaptation lifecycle
- product decision vocabulary
- product routing vocabulary
- canonical schemas or contracts

## Canonical assets to consume first

### Discovery front door

- schema:
  - `shared/schemas/discovery-submission-request.schema.json`
- shared libs:
  - `discovery/lib/discovery-front-door.ts`
  - `discovery/lib/discovery-submission-router.ts`
  - `discovery/lib/discovery-intake-queue-writer.ts`
  - `discovery/lib/discovery-fast-path-record-writer.ts`
  - `discovery/lib/discovery-case-record-writer.ts`
  - `discovery/lib/discovery-routing-record-writer.ts`
  - `discovery/lib/discovery-completion-record-writer.ts`
  - `discovery/lib/discovery-intake-queue-transition.ts`
  - `discovery/lib/discovery-intake-lifecycle-sync.ts`

### Discovery prioritization

- schema:
  - `shared/schemas/discovery-gap-worklist.schema.json`
- shared libs:
  - `discovery/lib/discovery-gap-priority.ts`
  - `discovery/lib/discovery-gap-worklist-generator.ts`

### Runtime canonical core

- `runtime/core/runtime-core-contract.ts`
- `runtime/core/decision-policy.ts`
- `runtime/core/workflow-contract.ts`
- `runtime/core/proof-contract.ts`

### Runtime host boundary references

- `shared/contracts/runtime-to-host.md`
- `shared/contracts/host-integration-boundary.md`
- `shared/contracts/host-integration-acceptance.md`
- `runtime/meta/BOUNDARY_INVENTORY.json`

## Example payloads

These examples are host-neutral seed payloads, not legacy host-specific forms.

- preferred Engine-backed Discovery front-door submission:
  - `hosts/integration-kit/examples/discovery-submission-front-door.json`
- queue-only Discovery submission:
  - `hosts/integration-kit/examples/discovery-submission-queue-only.json`
- fast-path Discovery submission:
  - `hosts/integration-kit/examples/discovery-submission-fast-path.json`
- split-case Discovery submission:
  - `hosts/integration-kit/examples/discovery-submission-split-case.json`
- host integration acceptance report:
  - `hosts/integration-kit/examples/host-integration-acceptance-report.json`

## Starter code

- package manifest:
  - `hosts/integration-kit/package.json`
- package export barrel:
  - `hosts/integration-kit/index.ts`
- starter export barrel:
  - `hosts/integration-kit/starter/index.ts`
- starter readme:
  - `hosts/integration-kit/starter/README.md`
- preferred Engine-backed front-door starter:
  - `hosts/integration-kit/starter/discovery-front-door-adapter.template.ts`
- starter adapter template:
  - `hosts/integration-kit/starter/discovery-submission-adapter.template.ts`

The preferred front-door starter shows the current product-truth integration path: submit a canonical Discovery request through Discovery first, let the Engine produce the route/review truth, and consume the resulting queue, routing, and Engine-run artifacts.
The older submission adapter template remains available when a host truly must author `queue_only`, `fast_path`, or `split_case` records directly.
The starter folder also includes a memory bridge template and a smoke template so a new host can validate its adapter shape before wiring real storage.
It also includes a Discovery overview reader starter so hosts can render recent Discovery movement from the canonical queue document without copying host-local backend aggregation code.
It also includes a host integration acceptance starter so hosts can prove they consume Directive Workspace correctly against one canonical standard.
It also includes an acceptance report writer starter so hosts can emit the canonical acceptance artifact shape directly from code.
It also includes an acceptance quickstart runner starter so hosts can write that artifact to a stable output path through one small entrypoint.
It also includes a package-ready CLI example so hosts can exercise acceptance or submission flows from the command line before copying starter code.
It also includes both memory and filesystem starter bridges so hosts can choose between lightweight in-memory validation and real artifact-existence proof.

Prefer importing from the package-ready export surface when your host can consume the workspace directly.
Use copied starter files only when your host cannot depend on the Directive Workspace source tree directly.

## CLI example

The integration kit also exposes a host-neutral CLI example at:

- `hosts/integration-kit/cli/host-integration-kit-cli.ts`

Use it when you want to:
- run the host acceptance quickstart from the command line
- dry-run a Discovery submission through the canonical memory bridge
- print a canonical submission example payload

Example commands:

```powershell
npx tsx <directive-workspace-root>\hosts\integration-kit\cli\host-integration-kit-cli.ts acceptance-quickstart --host-name "Example Host" --module-surface package_import --output-root C:\temp
npx tsx <directive-workspace-root>\hosts\integration-kit\cli\host-integration-kit-cli.ts print-submission-example --shape front_door
npx tsx <directive-workspace-root>\hosts\integration-kit\cli\host-integration-kit-cli.ts submission-memory-dry-run --input-json-path <directive-workspace-root>\hosts\integration-kit\examples\discovery-submission-fast-path.json
npx tsx <directive-workspace-root>\hosts\integration-kit\cli\host-integration-kit-cli.ts print-submission-example --shape fast_path
```

## Host adapter patterns

Recommended adapter shapes:

1. **API adapter**
   - validate incoming payload against canonical schema
   - prefer the Engine-backed Discovery front door when you can keep Discovery first and let the Engine decide route/review truth
   - only use direct record-shape writers when your host genuinely needs to author manual `fast_path` or `split_case` records
   - persist resulting queue/artifact output in the product-owned structure

2. **UI adapter**
   - collect operator input
   - map it into the canonical payload
   - submit it through the host API adapter
   - do not invent a separate host-only lifecycle

## Minimal integration checklist

- consume canonical schema before building payloads
- keep host adapter thin
- do not redefine Engine lane vocabulary
- do not let host-local runtime behavior become product doctrine
- keep product-owned outputs under Directive Workspace
- add host-specific checks only after the canonical product surface exists

## Acceptance standard

Hosts should validate themselves against:

- `shared/contracts/host-integration-acceptance.md`
- `shared/schemas/host-integration-acceptance-report.schema.json`
- `hosts/integration-kit/starter/host-integration-acceptance.template.ts`
- `hosts/integration-kit/starter/write-host-integration-acceptance-report.template.ts`
- `hosts/integration-kit/starter/run-host-integration-acceptance-quickstart.template.ts`

This keeps `integrated correctly` tied to one product-owned standard instead of host-local guesses.
Use the example acceptance report in `hosts/integration-kit/examples/` as the reference shape for a successful host integration run.
Use the acceptance quickstart runner when you want the fastest path from starter import to emitted acceptance artifact.

## Current reference hosts

Use the repo-native hosts as the current reference surfaces:

- `hosts/standalone-host/`
- `hosts/web-host/`

External host-specific adapters should now live in the consuming project unless they are broadly useful enough to become product-owned integration-kit examples.
