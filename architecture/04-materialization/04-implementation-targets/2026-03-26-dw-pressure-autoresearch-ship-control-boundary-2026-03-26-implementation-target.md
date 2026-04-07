# Implementation Target: Autoresearch Ship Workflow (2026-04-06)

## target
- Candidate id: `dw-pressure-autoresearch-ship-control-boundary-2026-03-26`
- Candidate name: Autoresearch Ship Workflow
- Source adoption artifact: `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adopted.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopted`
- Target approval: `codex`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Materialization basis: Updated engine/directive-engine.ts so structural protocols with explicit checklist, dry-run, verification, rollback, approval, and logging boundaries now resolve as bounded control/evidence discipline instead of falling back to generic Architecture prose or inheriting loop framing from incidental prep-loop support. Proof method: reran DirectiveEngine.processSource on the same Autoresearch Ship Workflow source and confirmed that missionFitSummary, primaryAdoptionQuestion, extractionPlan, adaptationPlan, and improvementPlan now surface bounded control/evidence signals while avoiding loop-language claims, then ran npm.cmd run check. This keeps domain-specific shipping execution behavior out of scope while materializing one Engine-owned adaptation improvement.

## source decision envelope
- Decision format: `directive-architecture-adoption-decision-1.0`
- Source completion status: `product_materialized`
- Source verification method: `structural_inspection`
- Source verification result: `not_recorded`
- Source runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

## source adoption resolution
- Source verdict: `adopt`
- Source readiness passed: yes
- Source Runtime handoff required: no
- Source Runtime handoff rationale: none recorded
- Source artifact path: `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adopted.md`
- Source primary evidence path: not recorded
- Source self-improvement category: `evaluation_quality`
- Source self-improvement verification method: `structural_inspection`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Select one bounded tactical slice from the adopted value and record it explicitly before treating the target as complete.

## mechanical success criteria
- Satisfy validation gate `adaptation_complete` and record the corresponding evidence in the implementation result.
- Satisfy validation gate `engine_boundary_preserved` and record the corresponding evidence in the implementation result.
- Satisfy validation gate `decision_review` and record the corresponding evidence in the implementation result.
- Satisfy validation gate `decision_envelope_continuity_check` and record the corresponding evidence in the implementation result.
- Keep the completed slice aligned with the adopted artifact and paired decision artifact.
- Keep the completed slice bounded and explicit rather than implying automation or downstream execution.

## explicit limitations
- Stay within one bounded Architecture-owned implementation slice.
- Do not add runtime execution, host integration, or Runtime handoff from this target.
- If the slice proves too broad or unclear, stop and reopen the target instead of broadening the implementation.

## scope (bounded)
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## inputs
- Assess this shipping workflow for Engine-owned structural value, especially explicit checklist, dry-run, approval gate, verification, rollback, and logging boundaries that could improve Directive Workspace Architecture without becoming runtime shipping automation.
- Repo-backed local source; treat shipping execution behavior as out of scope and keep attention on bounded control, evidence, and decision structure.
- record_shape:default
- Adopted artifact: `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adopted.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result.md`
- Source bounded start artifact: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T00-30-00-000Z-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-836105c3.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T00-30-00-000Z-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-836105c3.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-routing-record.md`

## constraints
- Preserve explicit human review before any downstream execution or host integration.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code from this target artifact alone.
- Rollback boundary: Keep the result at experiment status and do not integrate it into the engine until the adaptation boundary is clearer.

## validation approach
- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`
- `decision_envelope_continuity_check`
- Confirm the implementation target still matches the adopted artifact and paired decision artifact.
- Confirm the target remains one bounded slice and does not imply execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned shared library implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-implementation-target.md`.

