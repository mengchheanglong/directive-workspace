# Scientify Callable Stub Slice

Date: 2026-04-01
Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
Lane: `Runtime`
Track: `internal repo-native self-build`
Status: `completed`

## Bounded move

Materialize the first explicit non-executing callable stub for the Scientify literature-access bundle and wire it into canonical Runtime truth.

## Why this slice

- `road-to-completion.md` names the first Runtime-owned callable capability as a key remaining completion track.
- Scientify was already the most advanced Runtime case:
  - approved Runtime record/proof/capability-boundary chain exists
  - standalone-host descriptor slice is materially complete
  - promotion-readiness reported only `host_facing_promotion_unopened`
- The callable boundary was still implicit in the tool modules and host descriptor rather than explicit as one Runtime-owned stub artifact.

## What changed

- Added a non-executing callable stub:
  - `runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts`
- Linked that stub from:
  - the Scientify Runtime capability boundary
  - the Scientify promotion-readiness artifact
  - the standalone-host Scientify descriptor
- Strengthened the promotion-specification checker so the approved Scientify bundle now fails closed if its callable stub link is absent.

## Proof path

- Focused canonical state on the Scientify promotion-readiness artifact now exposes `linkedArtifacts.runtimeCallableStubPath`.
- Focused canonical state on the new callable stub resolves as `runtime.callable_stub.not_implemented`.
- `npm run check:runtime-promotion-specification` now treats the Scientify callable-stub link as required proof for this bounded completion seam.
- `npm run check` still passes after the slice.

## Rollback path

- Remove the Scientify callable stub file.
- Remove the linked callable-stub references from the Runtime capability-boundary and promotion-readiness artifacts.
- Remove the callable-stub field from the standalone-host descriptor shape.
- Revert the promotion-specification checker rule that requires the Scientify callable stub.

## Stop-line

Stop at the explicit callable-stub boundary.
Do not open host-facing promotion, runtime execution, host integration, or callable activation in this slice.
