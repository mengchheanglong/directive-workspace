# 2026-04-01 - Pre-Host Promotion Record Prerequisites

## Slice

- Completion slice: `formalize_pre_host_promotion_record_prerequisites`
- Candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Owning lane: `Architecture`
- Result: pre-host manual promotion-record prerequisites are now explicit and machine-checkable

## What changed

- `shared/lib/runtime-promotion-record-writer.ts`
  - now exposes a canonical evaluator for pre-host manual promotion-record prerequisites
- `scripts/check-pre-host-promotion-record-prerequisites.ts`
  - now proves the first bounded Scientify candidate satisfies that prerequisite set
- `shared/contracts/runtime-to-host.md`
  - now states the required pre-host prerequisite set and its non-authority boundary
- `runtime/README.md`
  - now distinguishes prerequisite formalization from an actual host-facing promotion record
- `runtime/promotion-records/README.md`
  - now states the same prerequisite boundary inside the promotion-record family

## Prerequisite set proved

Before a non-executing manual promotion record can be prepared, the repo now requires:

- one promotion-readiness artifact
- one generated promotion specification
- the Runtime-to-host compile contract
- linked Runtime record, proof, capability boundary, follow-up, and Discovery routing artifacts
- the linked callable stub for the first Runtime-owned callable bundle
- a selected host
- execution state still explicitly:
  - not promoted
  - not host-integrated
  - not executing
- no live promotion record already opened for the candidate

## Why this is truthful

This slice does not open host-facing promotion.

It only proves that the repo can tell, mechanically and without reinterpretation, whether the first manual promotion-record contract would be grounded in complete pre-host Runtime truth before any later promotion review is proposed.

## Completion-control effect

- Mark `formalize_pre_host_promotion_record_prerequisites` completed.
- Advance the selector frontier to:
  - `decide_registry_acceptance_boundary_after_manual_promotion`

## Proof path

- `npm run check:pre-host-promotion-record-prerequisites`
  - must prove the Scientify candidate satisfies the full pre-host prerequisite set
- `npm run report:directive-workspace-state`
  - must stay coherent

## Rollback

Revert:

- `shared/lib/runtime-promotion-record-writer.ts`
- `scripts/check-pre-host-promotion-record-prerequisites.ts`
- `shared/contracts/runtime-to-host.md`
- `runtime/README.md`
- `runtime/promotion-records/README.md`
- `package.json`
- `control/state/completion-status.json`
- `control/state/completion-slices.json`
- this log

## Stop-line

Stop this slice once the prerequisite set is explicit, machine-checkable, and the selector advances to the registry-boundary decision slice.
