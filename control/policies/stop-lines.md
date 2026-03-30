# Stop-Lines

## Locked vNext roadmap guardrail

Preserve the locked vNext migration order exactly:
1. Phase 1A - parallel event mirror foundation
2. Phase 1B - snapshot materializer and backfill parity
3. Phase 2 - planner in recommendation mode
4. Phase 3 - partial generated projections and event-first write path
5. Phase 4 - durable runner and repo-awareness packets
6. Phase 5 - retire artifact-first control

## Current Runtime Execution Stop-Line

Current sanctioned manual execution boundary:
- `scripts/runtime-manual-control.ts`
- backed by the shared manual-control layer in `shared/lib/runtime-manual-control.ts`

Allowed now:
- explicit single Runtime actions only through the already-proven Runtime execution substrate
- approved named Runtime sequences only through the already-proven named sequence options
- admin/test-only CLI invocation only
- explicit choice required
- explicit approval required
- non-authoritative execution only

Explicitly not allowed now:
- host-admin execution seam
- normal user-facing execution surface
- planner-driven execution
- arbitrary action lists
- arbitrary sequences
- sequence composition beyond the already-proven named options
- authority cutover away from `shared/lib/dw-state.ts`
- authority cutover away from `scripts/report-directive-workspace-state.ts`

Reopen criteria:
- do not reopen this area unless there is a concrete operator need that the CLI cannot adequately support
- minimum evidence for reopening must include:
- explicit documented operator need
- why the CLI is insufficient
- explicit admin/test-only access model
- isolated boundary or namespace
- preserved approval propagation
- no planner-driven execution
- no authority cutover

Anti-drift warning:
- do not add a host-admin route just for symmetry
- do not broaden Runtime exposure without a concrete need
- do not treat "would be cleaner" as sufficient justification
- do not continue this area by momentum alone
- keep the CLI as the sanctioned Runtime execution boundary until the reopen criteria are met

Reserved later side experiment:
- structural blueprint / analogy work is explicitly post-Phase-2 and non-blocking
- owner: Engine shared reasoning / planner-adjacent evaluation
- keep it outside the critical path until planner foundations are proven
- start only as an evaluation-first experiment on a tiny golden set
- discard it quickly if it does not measurably improve recommendation quality or transfer discipline

## Current Structural Mapping Experiment Boundary

Current structural-mapping status:
- sidecar-only experimental documentation
- structural usefulness cases only
- not a live system field
- not authoritative truth

Current allowed anchor scope:
- `dw-source-ts-edge-2026-03-27`
- `dw-source-scientify-research-workflow-plugin-2026-03-27`

Current not-allowed scope:
- live Discovery routing
- planner recommendation logic
- Runtime execution logic
- `shared/lib/dw-state.ts`
- `scripts/report-directive-workspace-state.ts`
- universal source coverage
- not required for NOTE-mode review sources

Use rule:
- only use structural mapping when it says something sharper than current bounded-result language
- no structural mapping counts unless it captures relations, not attributes

Anti-drift:
- do not turn this experiment into a required source-analysis field
- do not add it to all sources by momentum alone
- do not treat elegant pattern language as evidence of usefulness
- do not reopen this area beyond the current two anchor cases without a later explicit bounded decision

## Current Structural Mapping Stop-Line

Current parked status:
- parked
- sidecar-only
- non-authoritative
- limited to the existing `ts-edge` and `Scientify` structural-mapping sidecars

Allowed now:
- retain the existing schema note
- retain the two existing sidecars
- retain the tiny validation script
- retain the planning boundary note

Explicitly not allowed now:
- adding more sidecars
- live Discovery integration
- planner integration
- execution integration
- `shared/lib/dw-state.ts` integration
- `scripts/report-directive-workspace-state.ts` integration
- NOTE-mode review usage by symmetry
- broad schema rollout

Reopen criteria:
- only reopen this area if a future source clearly shows both:
- structural usefulness is primary
- current bounded-result language cannot cleanly separate transferable relation from source-specific baggage
- reopening requires a new bounded decision pass first
- automatic reuse is not allowed

Anti-drift warning:
- do not treat the presence of the sidecars as approval for expansion
- do not add more sidecars just because the format exists
- do not let elegant structural language count as proof of usefulness

Anti-drift:
- do not block Phase 1A or Phase 1B on it
- do not move it into the case-store or event-log foundation work
- do not invent a new lane for it
- do not make blueprint extraction mandatory in early Discovery
- do not let it delay the substrate migration

## Relocation stop-line

Explicitly not allowed now:
- drifting back to `.openclaw\workspace` as the canonical root
- adding permanent compatibility shims as a substitute for product-root clarity
- reopening relocation work by momentum alone
- reopening frozen Runtime exposure or structural-mapping lanes during relocation closeout

Reopen criteria:
- only reopen relocation work if a concrete post-move defect appears
- or if a specific external integration still fails against `C:\Users\User\projects\directive-workspace`

Anti-drift warning:
- future docs and scripts must not reintroduce the old root as the canonical product home
- examples that still mention the old root must be clearly labeled as historical or integration-specific, not as the product root
- continue product work from the new root only unless the reopen criteria are met
