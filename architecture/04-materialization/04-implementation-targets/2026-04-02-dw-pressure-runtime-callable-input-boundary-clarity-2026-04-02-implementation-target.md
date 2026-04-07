# Implementation Target: Engine Input-Boundary Review Logic From Callable Failure Evidence (2026-04-02)

## target
- Candidate id: `dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02`
- Candidate name: Engine Input-Boundary Review Logic From Callable Failure Evidence
- Source adoption artifact: `architecture/02-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `codex-era-d-self-improvement`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize the adapted mechanism as engine-owned product logic only after the staged proof boundary for "improve engine self-improvement quality" remains explicit through adaptation_complete.
- Materialization basis: Recorded one bounded Architecture self-improvement result from runtime callable failure evidence. The retained product value is the already-materialized shared lib and report/check surface around `shared/lib/operational-architecture-improvement-candidates.ts`, which converts bounded callable `validation_error` evidence into a canonical Engine evaluation-quality Architecture candidate and routed handoff path instead of leaving the signal as ad hoc Runtime follow-up pressure.

## source decision envelope
- Decision format: `directive-architecture-adoption-decision-1.0`
- Source completion status: `doc_only_or_planned`
- Source verification method: `structural_inspection`
- Source verification result: `not_recorded`
- Source runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

## source adoption resolution
- Source verdict: `adopt`
- Source readiness passed: yes
- Source Runtime handoff required: no
- Source Runtime handoff rationale: none recorded
- Source artifact path: `architecture/02-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next.md`
- Source primary evidence path: not recorded
- Source self-improvement category: `handoff_quality`
- Source self-improvement verification method: `structural_inspection`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Validate that the runtime callable failure signal is already materialized as a canonical Architecture improvement candidate surface and routed Architecture case without reopening Runtime or widening automation.

## mechanical success criteria
- `shared/lib/operational-architecture-improvement-candidates.ts` remains the canonical product-owned shared-lib surface for this evidence-backed Architecture candidate.
- `npm run report:operational-architecture-improvement-candidates` reports the candidate in Architecture-owned state rather than as unresolved Runtime pressure.
- The Discovery routing record and Architecture handoff for `dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02` remain linked and resolvable through the shared state resolver.

## explicit limitations
- Do not reopen Runtime follow-up, host integration, or automation from this Architecture materialization target.
- Do not broaden beyond the one evidence-backed callable input-boundary candidate already present in repo truth.

## scope (bounded)
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## inputs
- Architecture self-improvement from operational evidence: adapt the callable failure pattern into Engine evaluation logic, analysis policy, and proof guidance rather than a new runtime capability.
- signal_kind:runtime_callable_execution_failure_pattern | failure_status:validation_error | failure_count:1 | pattern extraction: retain the failure pattern rather than direct runtime reuse | architecture self-improvement: evaluation policy, proof guidance, operating logic | not the library as a dependency
- record_shape:queue_only
- Adopted artifact: `architecture/02-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next.md`
- Adoption decision artifact: `architecture/02-adopted/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-bounded-result.md`
- Handoff stub: `architecture/01-experiments/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-04-02T14-54-00-000Z-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-fb7ebe97.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-04-02T14-54-00-000Z-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-fb7ebe97.md`
- Discovery routing record: `discovery/03-routing-log/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-routing-record.md`

## constraints
- Preserve explicit human review before any downstream execution or host integration.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code from this target artifact alone.
- Rollback boundary: Keep the result at experiment status and do not integrate it into the engine until the staged proof boundary is clearer.

## validation approach
- `adaptation_complete`
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`
- `decision_envelope_continuity_check`
- Confirm the implementation target still matches the adopted artifact and paired decision artifact.
- Confirm the target remains one bounded slice and does not imply execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned shared library implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-04-02-dw-pressure-runtime-callable-input-boundary-clarity-2026-04-02-implementation-target.md`.

