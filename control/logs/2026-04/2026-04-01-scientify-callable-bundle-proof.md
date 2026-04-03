# Scientify Callable Bundle Proof

Date: 2026-04-01
Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
Lane: `Runtime`
Track: `internal repo-native self-build`
Status: `completed`

## Bounded move

Prove the Scientify literature-access bundle as a real Runtime-owned callable code surface, not only a linked callable stub.

## Why this slice

- `road-to-completion.md` says the current phase is not complete until at least one Runtime case becomes a real callable capability.
- The previous slice made the Scientify callable boundary explicit but still left the bundle mostly as linked metadata plus direct module files.
- Scientify remains the most advanced real Runtime case and still stops before host-facing promotion, host integration, and runtime execution.

## What changed

- Added one Runtime-owned bundle loader under `runtime/capabilities/literature-access/bundle.ts`.
- Re-exported that bundle loader from `runtime/capabilities/literature-access/index.ts`.
- Added one focused checker that:
  - proves the callable stub and bundle loader stay aligned
  - proves the standalone-host descriptor exposes the same callable stub path
  - invokes all 4 approved tools with mocked fetch responses so the bundle is proved as callable code without live external execution
- Wired the checker into `npm run check`.
- Finalized the proof surface by:
  - fixing the checker's request-header assertion so it runs under `node --experimental-strip-types`
  - fixing `.ts` extension imports in `hosts/standalone-host/runtime-lane.ts` so the checker can load the canonical standalone-host descriptor surface directly

## Proof path

- `npm run check:directive-scientify-runtime-callable` proves:
  - bundle metadata and callable stub agree
  - all 4 bundle tools are loadable through one Runtime-owned surface
  - all 4 tools can be invoked under bounded mocked conditions
  - canonical Runtime truth and standalone-host descriptor both expose the same callable stub path
- `npm run check` still passes after adding the new proof surface.

## Rollback path

- Remove `runtime/capabilities/literature-access/bundle.ts`.
- Remove the bundle exports from `runtime/capabilities/literature-access/index.ts`.
- Remove the checker and its `package.json` script wiring.
- Keep the explicit callable stub and existing promotion-readiness stop unchanged.

## Stop-line

Stop at verified Runtime-owned callable proof.
Do not open host-facing promotion, host integration, runtime execution, or promotion automation in this slice.
