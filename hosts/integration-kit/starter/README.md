# Starter Adapter Template

This starter is for hosts that want a real code shape, not just payload examples.

Use it when:
- your host runs Node/TypeScript
- you want to persist Discovery queue + markdown artifacts yourself
- you want to stay aligned with canonical Directive Workspace shared libs
- you want either:
  - direct package-style imports from the integration-kit export surface, or
  - copied starter files when direct imports are not practical

Current starter:
- `discovery-submission-adapter.template.ts`
- `discovery-host-storage-bridge.memory.template.ts`
- `discovery-host-storage-bridge.filesystem.template.ts`
- `discovery-submission-adapter.smoke.template.ts`
- `discovery-overview-reader.template.ts`
- `discovery-overview-reader.smoke.template.ts`
- `discovery-signal-adapter.template.ts`
- `discovery-signal-adapter.smoke.template.ts`
- `host-integration-acceptance.template.ts`
- `write-host-integration-acceptance-report.template.ts`
- `run-host-integration-acceptance-quickstart.template.ts`
- `index.ts`

## How to use it

1. copy the template into your host repo
2. or import from the package-ready integration-kit surface if your host can consume Directive Workspace directly
3. replace the relative imports with your chosen integration path
   - vendored copy
   - workspace-relative import
   - package-ready integration-kit import
4. implement the storage bridge for:
   - reading the queue json
   - writing json
   - writing markdown/text artifacts
   - resolving safe paths inside your Directive Workspace root
   - listing unresolved gap ids
5. expose it through your host API or worker entrypoint
6. use the memory bridge and smoke template to validate your adapter shape before wiring real storage
   - use the filesystem bridge when your starter proof needs real artifact existence, not only in-memory writes
7. add a host-side Discovery overview reader using the queue document instead of copying Mission Control service logic
8. adapt upstream runtime or watchdog events through the signal starter instead of inventing a host-only intake bypass
9. prove the host against the product-owned acceptance harness before calling the integration complete
10. emit the canonical acceptance report json through the acceptance writer starter instead of inventing a host-local artifact shape
11. use the acceptance quickstart runner when you want one small starter entrypoint that both runs acceptance and writes the canonical artifact

## Why it is a template

Hosts differ in:
- storage layer
- queue persistence
- API framework
- runtime path policy
- validation stack

The canonical product logic should stay the same.
Only the host bridge should vary.

## Suggested bootstrap order

1. prefer importing from `hosts/integration-kit` or `hosts/integration-kit/starter`
2. if direct imports are not practical, copy `discovery-submission-adapter.template.ts` into your host repo
3. copy `discovery-host-storage-bridge.memory.template.ts` and get the adapter working in memory first
4. add `discovery-host-storage-bridge.filesystem.template.ts` when you need a starter bridge that proves real file creation semantics
5. run the smoke template logic with your imported or copied files
6. swap the starter bridge for your real storage/runtime bridge
7. add `discovery-overview-reader.template.ts` if your host needs a recent-cases or queue summary surface
8. run the overview smoke template before wiring UI/API response code
9. add `discovery-signal-adapter.template.ts` if your host emits runtime or watchdog signals into Discovery
10. run the signal smoke template before wiring real event hooks
11. run `host-integration-acceptance.template.ts` or adapt it to your host bridge before declaring the integration accepted
12. use `write-host-integration-acceptance-report.template.ts` to emit the canonical json artifact once the acceptance run passes
13. use `run-host-integration-acceptance-quickstart.template.ts` when you want a single quickstart function that resolves a stable output path and writes the acceptance artifact for you
14. use the package-ready CLI example if you want to exercise acceptance or submission flows before copying starter files into your host repo

The memory bridge and smoke template exist to keep third-party hosts from starting with Mission Control assumptions.
The filesystem bridge exists to prove starter flows that need real artifact existence without importing Mission Control runtime storage.
The overview reader exists to keep hosts from copying Mission Control backend aggregation logic when all they need is a queue-backed Discovery summary.
The signal starter exists to keep hosts from bypassing Discovery when surfacing upstream runtime or watchdog events.
The acceptance starter exists to keep `integration complete` tied to a canonical product-owned standard.
The acceptance writer exists to keep successful host integrations emitting one canonical artifact shape.
The acceptance quickstart exists to keep the first end-to-end host acceptance run simple and repeatable.
The CLI example exists to keep first-time host integrations runnable even before starter files are copied into a separate repo.
