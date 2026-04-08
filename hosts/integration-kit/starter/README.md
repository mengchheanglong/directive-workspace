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
- `discovery-front-door-adapter.template.ts`
- `discovery-front-door-adapter.smoke.template.ts`
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
4. prefer the front-door starter first when your host can point at a real Directive Workspace root and wants Engine-backed route/review truth
5. use the manual submission adapter only when your host truly needs to author `queue_only`, `fast_path`, or `split_case` records itself
6. implement the storage bridge for:
   - reading the queue json
   - writing json
   - writing markdown/text artifacts
   - resolving safe paths inside your Directive Workspace root
   - listing unresolved gap ids
7. expose it through your host API or worker entrypoint
8. use the memory bridge and smoke template to validate your adapter shape before wiring real storage
   - use the filesystem bridge when your starter proof needs real artifact existence, not only in-memory writes
9. add a host-side Discovery overview reader using the queue document instead of copying host-local service logic
10. adapt upstream runtime or watchdog events through the signal starter instead of inventing a host-only intake bypass
11. prove the host against the product-owned acceptance harness before calling the integration complete
12. emit the canonical acceptance report json through the acceptance writer starter instead of inventing a host-local artifact shape
13. use the acceptance quickstart runner when you want one small starter entrypoint that both runs acceptance and writes the canonical artifact

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
2. start with `discovery-front-door-adapter.template.ts` when your host can submit directly into a real Directive Workspace root
3. run `discovery-front-door-adapter.smoke.template.ts` to prove the preferred Engine-backed route/review path first
4. if direct front-door imports are not practical, or your host must author manual record shapes, copy `discovery-submission-adapter.template.ts` into your host repo
5. copy `discovery-host-storage-bridge.memory.template.ts` and get the manual adapter working in memory first
6. add `discovery-host-storage-bridge.filesystem.template.ts` when you need a starter bridge that proves real file creation semantics
7. run the smoke template logic with your imported or copied files
8. swap the starter bridge for your real storage/runtime bridge
9. add `discovery-overview-reader.template.ts` if your host needs a recent-cases or queue summary surface
10. run the overview smoke template before wiring UI/API response code
11. add `discovery-signal-adapter.template.ts` if your host emits runtime or watchdog signals into Discovery
12. run the signal smoke template before wiring real event hooks
13. run `host-integration-acceptance.template.ts` or adapt it to your host bridge before declaring the integration accepted
14. use `write-host-integration-acceptance-report.template.ts` to emit the canonical json artifact once the acceptance run passes
15. use `run-host-integration-acceptance-quickstart.template.ts` when you want a single quickstart function that resolves a stable output path and writes the acceptance artifact for you
16. use the package-ready CLI example if you want to exercise acceptance or submission flows before copying starter files into your host repo

The front-door starter exists to keep new hosts aligned with current product truth: Discovery stays first and the Engine owns route/review judgment.
The memory bridge and smoke template exist to keep third-party hosts from starting with legacy host-specific assumptions.
The filesystem bridge exists to prove starter flows that need real artifact existence without importing a host-local runtime storage layer.
The overview reader exists to keep hosts from copying host-local backend aggregation logic when all they need is a queue-backed Discovery summary.
The signal starter exists to keep hosts from bypassing Discovery when surfacing upstream runtime or watchdog events.
The acceptance starter exists to keep `integration complete` tied to a canonical product-owned standard.
The acceptance writer exists to keep successful host integrations emitting one canonical artifact shape.
The acceptance quickstart exists to keep the first end-to-end host acceptance run simple and repeatable.
The CLI example exists to keep first-time host integrations runnable even before starter files are copied into a separate repo.
The examples folder plus signal CLI commands exist to keep upstream signal examples runnable through the canonical adapter surface instead of being treated as inert json only.
