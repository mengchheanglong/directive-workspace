# live mini-swe-agent Standalone Host Runtime-Implementation Slice 01

Date: 2026-04-02
Candidate id: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
Candidate name: `mini-swe-agent Runtime Capability Pressure`
Track: Directive Workspace Runtime
Status: `opened_bounded_non_executing_runtime_implementation_slice`

## Objective

Open the first bounded Runtime-implementation slice for the live mini-swe callable boundary without opening promotion, execution, host integration rollout, callable rollout, or automation.

## Slice boundary

This slice is limited to one host-owned implementation behavior in the Directive Workspace standalone host:
- expose a read-only standalone-host descriptor for the approved live mini-swe callable boundary
- render the current Runtime truth, linked artifacts, and callable boundary shape as a local/shareable host surface

This slice does not include:
- promotion record creation
- runtime execution
- host integration rollout
- callable rollout
- automation

## Standalone-host ownership

The standalone host owns:
- one descriptor reader backed by canonical Runtime truth
- one CLI surface that exposes that descriptor locally

Affected host-owned files:
- `hosts/standalone-host/runtime-lane.ts`
- `hosts/standalone-host/runtime.ts`
- `hosts/standalone-host/cli.ts`
- `hosts/standalone-host/README.md`

## Runtime / Engine ownership

Runtime and Engine continue to own:
- `currentStage`
- `nextLegalStep`
- blocker judgment
- callable legality
- promotion legality
- execution legality
- downstream Runtime progression

## Required pre-promotion inputs

- promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md`
- pre-promotion implementation slice:
  - `runtime/follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-pre-promotion-implementation-slice-01.md`
- capability boundary:
  - `runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md`
- proof artifact:
  - `runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md`
- runtime record:
  - `runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md`
- callable boundary:
  - `runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts`

## Why this is the smallest useful implementation move

The live mini-swe case already has a bounded callable objective and an explicit standalone-host target, but the standalone host did not yet expose any case-specific host surface. This slice makes one real host-owned boundary visible without implying that the callable boundary is runnable through the host yet.

## Proof expectation for this slice

This slice is open only if:
- the standalone host can read the live mini-swe descriptor from canonical Runtime truth
- the descriptor exposes the callable boundary and linked Runtime artifacts
- the descriptor remains read-only and non-executing
- promotion, execution, host integration, callable rollout, and automation remain closed

## Rollback / no-op

- remove this artifact and its reference from the promotion-readiness artifact
- remove the standalone-host descriptor reader and CLI surface
- keep the case at `runtime.promotion_readiness.opened`
- keep promotion, execution, host integration, callable rollout, and automation closed
