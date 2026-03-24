# Host Integration Kit

This kit exists for hosts other than Mission Control.

Directive Workspace is the standalone product.
Hosts integrate it by consuming canonical Directive Workspace assets rather than redefining them locally.

Use this kit when integrating Directive Workspace into:
- another workspace
- another dashboard or control plane
- a different runtime host
- automation infrastructure
- a custom operator surface

## Integration rule

Use this order:

1. read the product boundary:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\host-integration-boundary.md`
2. consume canonical product contracts/schemas/shared libs
3. add only a thin host adapter for runtime/API/UI behavior

When possible, consume the package-ready module surface at:
- published root package:
  - `@directive-workspace/product/integration-kit`
  - `@directive-workspace/product/integration-kit/starter`
  - `@directive-workspace/product/integration-kit/cli`
- in-repo root package surface:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\package.json`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\index.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\package.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\index.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\cli\host-integration-kit-cli.ts`

Do not start by inventing host-local payloads or host-local Engine lane definitions.

## Minimum host responsibilities

A host may own:
- runtime services
- runtime storage
- runtime APIs
- operator UI
- runtime checks

A host must not redefine:
- Discovery / Forge / Architecture
- source-adaptation lifecycle
- product decision vocabulary
- product routing vocabulary
- canonical schemas or contracts

## Canonical assets to consume first

### Discovery front door

- schema:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\discovery-submission-request.schema.json`
- shared libs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-submission-router.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-intake-queue-writer.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-fast-path-record-writer.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-case-record-writer.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-routing-record-writer.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-completion-record-writer.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-intake-queue-transition.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-intake-lifecycle-sync.ts`

### Discovery prioritization

- schema:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\discovery-gap-worklist.schema.json`
- shared libs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-gap-priority.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\discovery-gap-worklist-generator.ts`

### OpenClaw-compatible upstream signals

- schemas:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\openclaw-runtime-verification-signal.schema.json`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\openclaw-maintenance-watchdog-signal.schema.json`

### Forge canonical core

- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\core\v0.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\core\decision-policy.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\core\workflow-contract.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\core\proof-contract.ts`

### Runtime host boundary references

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\forge-to-host.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\host-integration-boundary.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\host-integration-acceptance.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\BOUNDARY_INVENTORY.json`

## Example payloads

These examples are host-neutral seed payloads, not Mission Control-specific forms.

- queue-only Discovery submission:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\discovery-submission-queue-only.json`
- fast-path Discovery submission:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\discovery-submission-fast-path.json`
- split-case Discovery submission:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\discovery-submission-split-case.json`
- runtime verification signal:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\openclaw-runtime-verification-signal.json`
- maintenance watchdog signal:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\openclaw-maintenance-watchdog-signal.json`
- host integration acceptance report:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\host-integration-acceptance-report.json`

## Starter code

- package manifest:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\package.json`
- package export barrel:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\index.ts`
- starter export barrel:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\starter\index.ts`
- starter readme:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\starter\README.md`
- starter adapter template:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\starter\discovery-submission-adapter.template.ts`

The starter template shows one concrete host-bridge shape that composes the canonical shared libs while leaving storage, API framework, and path policy to the integrating host.
The starter folder also includes a memory bridge template and a smoke template so a new host can validate its adapter shape before wiring real storage.
It also includes a Discovery overview reader starter so hosts can render recent Discovery movement from the canonical queue document without importing Mission Control backend service code.
It also includes a signal adapter starter so hosts can convert runtime verification or maintenance/watchdog events into canonical Discovery submissions instead of inventing host-local intake paths.
It also includes a host integration acceptance starter so hosts can prove they consume Directive Workspace correctly against one canonical standard.
It also includes an acceptance report writer starter so hosts can emit the canonical acceptance artifact shape directly from code.
It also includes an acceptance quickstart runner starter so hosts can write that artifact to a stable output path through one small entrypoint.
It also includes a package-ready CLI example so hosts can exercise acceptance or submission flows from the command line before copying starter code.
It also includes both memory and filesystem starter bridges so hosts can choose between lightweight in-memory validation and real artifact-existence proof.

Prefer importing from the package-ready export surface when your host can consume the workspace directly.
Use copied starter files only when your host cannot depend on the Directive Workspace source tree directly.

## CLI example

The integration kit also exposes a host-neutral CLI example at:

- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\cli\host-integration-kit-cli.ts`

Use it when you want to:
- run the host acceptance quickstart from the command line
- dry-run a Discovery submission through the canonical memory bridge
- print a canonical submission example payload

Example commands:

```powershell
npx tsx C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\cli\host-integration-kit-cli.ts acceptance-quickstart --host-name "Example Host" --module-surface package_import --output-root C:\temp
npx tsx C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\cli\host-integration-kit-cli.ts submission-memory-dry-run --input-json-path C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\discovery-submission-fast-path.json
npx tsx C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\cli\host-integration-kit-cli.ts print-submission-example --shape fast_path
```

## Host adapter patterns

Recommended adapter shapes:

1. **API adapter**
   - validate incoming payload against canonical schema
   - call canonical Directive Workspace shared lib
   - persist resulting queue/artifact output in the product-owned structure

2. **UI adapter**
   - collect operator input
   - map it into the canonical payload
   - submit it through the host API adapter
   - do not invent a separate host-only lifecycle

3. **Signal adapter**
   - convert host/runtime/watchdog events into canonical signal payloads
   - submit them into Discovery rather than bypassing the front door

## Minimal integration checklist

- consume canonical schema before building payloads
- keep host adapter thin
- do not redefine Engine lane vocabulary
- do not let host-local runtime behavior become product doctrine
- keep product-owned outputs under Directive Workspace
- add host-specific checks only after the canonical product surface exists

## Acceptance standard

Hosts should validate themselves against:

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\host-integration-acceptance.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\host-integration-acceptance-report.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\starter\host-integration-acceptance.template.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\starter\write-host-integration-acceptance-report.template.ts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\starter\run-host-integration-acceptance-quickstart.template.ts`

This keeps `integrated correctly` tied to one product-owned standard instead of host-local guesses.
Use the example acceptance report in `hosts/integration-kit/examples/` as the reference shape for a successful host integration run.
Use the acceptance quickstart runner when you want the fastest path from starter import to emitted acceptance artifact.

## Current reference host

Mission Control remains the reference host today because it already exercises:
- Discovery API submission
- Discovery operator UI
- runtime checks
- bounded runtime hosting

But it should be treated as the first host implementation, not the only valid one.
