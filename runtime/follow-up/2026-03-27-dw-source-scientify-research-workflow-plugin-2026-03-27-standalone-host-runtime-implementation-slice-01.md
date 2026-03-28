# Scientify Standalone Host Runtime-Implementation Slice 01

Date: 2026-03-27
Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
Candidate name: `Scientify Literature-Access Tool Bundle`
Track: Directive Workspace Runtime
Status: `opened_bounded_non_executing_runtime_implementation_slice`

## Objective

Open the first bounded Runtime-implementation slice for Scientify without opening promotion, execution, host integration rollout, callable rollout, or automation.

## Slice boundary

This slice is limited to one host-owned implementation behavior in the Directive Workspace standalone host:
- expose a read-only standalone-host descriptor for the approved Scientify literature-access bundle
- render the current Runtime truth, linked artifacts, and the 4 approved tool/module references as a local/shareable host surface

This slice does not include:
- promotion record creation
- runtime execution
- host integration rollout
- callable rollout
- automation
- live API calls to arXiv, OpenAlex, or Unpaywall

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
- the literature-access tool bundle modules and contracts
- promotion legality
- execution legality
- downstream Runtime progression

## Required pre-promotion inputs

- promotion-readiness artifact:
  - `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
- pre-promotion implementation slice:
  - `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-pre-promotion-implementation-slice-01.md`
- capability boundary:
  - `runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md`
- proof artifact:
  - `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- runtime record:
  - `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`

## Why this is the smallest useful implementation move

Scientify already has real Directive-owned modules and an explicit standalone-host target, but the standalone host did not yet expose any Scientify-specific host surface. This slice makes one real host-owned boundary visible without implying that the 4 tools are callable through the host yet.

## Proof expectation for this slice

This slice is open only if:
- the standalone host can read the Scientify descriptor from canonical Runtime truth
- the descriptor exposes the 4 approved tools and linked Runtime artifacts
- the descriptor remains read-only and non-executing
- promotion, execution, host integration, callable rollout, and automation remain closed

## Rollback / no-op

- remove this artifact and its reference from the promotion-readiness artifact
- remove the standalone-host descriptor reader and CLI surface
- keep Scientify at `runtime.promotion_readiness.opened`
- keep promotion, execution, host integration, callable rollout, and automation closed
