# 2026-04-02 - Runtime Host Integration Truth Update

## Slice

- CLAUDE roadmap slice: `era_b_b4_host_integration_truth_update`
- Owning lane: `Runtime`
- Result: Engine truth and shared Runtime state now stop claiming host integration is unbuilt after the bounded standalone Scientify host-consumption proof

## What changed

- Updated [engine/workspace-truth.ts](/C:/Users/User/projects/directive-workspace/engine/workspace-truth.ts) to record one bounded standalone-host consumption path as proven and to remove host integration from the still-unbuilt product list.
- Updated [dw-state.ts](/C:/Users/User/projects/directive-workspace/shared/lib/dw-state.ts), [shared.ts](/C:/Users/User/projects/directive-workspace/shared/lib/dw-state/shared.ts), and [runtime.ts](/C:/Users/User/projects/directive-workspace/shared/lib/dw-state/runtime.ts) so the shared read surface links the Scientify host-consumption report and advertises the correct post-host-consumption next step.
- Updated the two Scientify-specific proof surfaces that legitimately moved with this truth change:
  - [check-standalone-scientify-host-adapter.ts](/C:/Users/User/projects/directive-workspace/scripts/check-standalone-scientify-host-adapter.ts)
  - [check-directive-scientify-runtime-promotion.ts](/C:/Users/User/projects/directive-workspace/scripts/check-directive-scientify-runtime-promotion.ts)

## Resulting truth

- Product truth now reflects one bounded Directive-owned host consumption path as real.
- The Scientify promoted callable now reports only `registry acceptance` and `promotion automation` as intentionally unbuilt downstream seams.
- The next high-ROI completion work moves from integration realism toward evidence feedback and self-improvement.

## Proof path

- `npm run check:standalone-scientify-host-consumption`
- `npm run report:directive-workspace-state -- runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md`
- `npm run check:directive-workspace-composition`

## Rollback

Revert:

- [engine/workspace-truth.ts](/C:/Users/User/projects/directive-workspace/engine/workspace-truth.ts)
- [dw-state.ts](/C:/Users/User/projects/directive-workspace/shared/lib/dw-state.ts)
- [shared.ts](/C:/Users/User/projects/directive-workspace/shared/lib/dw-state/shared.ts)
- [runtime.ts](/C:/Users/User/projects/directive-workspace/shared/lib/dw-state/runtime.ts)
- the Scientify-specific checker expectation updates above

## Stop-line

Stop once Engine truth and shared Runtime focus agree that one bounded host path is proven. Do not imply registry acceptance, host parity, or automation from this slice.
