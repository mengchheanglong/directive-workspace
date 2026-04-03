# live mini-swe-agent Standalone Host Runtime-Implementation Slice 01 Result

Date: 2026-04-02
Candidate id: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
Candidate name: `mini-swe-agent Runtime Capability Pressure`
Track: Directive Workspace Runtime
Opened implementation slice:
- `runtime/follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01.md`
Result decision: `materially_complete_and_worth_keeping`

## What this slice was supposed to make real

The opened slice was limited to one host-owned implementation behavior in the Directive Workspace standalone host:
- expose a read-only standalone-host descriptor for the approved live mini-swe callable boundary
- resolve the descriptor from canonical Runtime truth rather than a host-local status model
- keep the host surface non-promoting, non-executing, and bounded to the approved callable boundary

## Verified product/code behavior

The following bounded host-owned behavior now exists:
- `hosts/standalone-host/runtime-lane.ts` exposes `readStandaloneLiveMiniSweAgentDescriptor(...)` backed by `resolveDirectiveWorkspaceState(...)`
- `hosts/standalone-host/runtime.ts` exposes `readLiveMiniSweAgentDescriptor()` through the standalone host runtime surface
- `hosts/standalone-host/cli.ts` exposes the `runtime-live-mini-swe-agent` command and returns the descriptor as a read-only host surface
- `hosts/standalone-host/README.md` documents the non-executing live mini-swe descriptor command
- the shared Runtime truth now reports:
  - `executionState = bounded standalone-host descriptor implementation opened, not executing, not host-integrated, not promoted`
  - `promotionReadinessBlockers = [host_facing_promotion_unopened]`

## Success criteria satisfied

- The standalone host can read the live mini-swe descriptor from canonical Runtime truth: yes
- The descriptor exposes the callable boundary and linked Runtime artifacts: yes
- The descriptor remains read-only and non-executing: yes
- The coarse `runtime_implementation_unopened` blocker is no longer present in shared Runtime truth: yes
- Host-facing promotion remains unopened: yes
- Runtime execution remains unopened: yes

## Material result

This first bounded implementation slice is materially complete because the exact host-owned behavior named in the opened slice now exists in product code, resolves through canonical Runtime truth, and exposes the approved callable boundary without activating it.

## What remains out of scope

- host-facing promotion
- runtime execution
- host integration rollout
- callable rollout
- automation

## Rollback / no-op

- remove this result artifact and its head reference
- remove the standalone-host live mini-swe descriptor reader, CLI command, and README entry
- keep the case at `runtime.promotion_readiness.opened`
- keep host-facing promotion, execution, host integration, callable rollout, and automation closed
