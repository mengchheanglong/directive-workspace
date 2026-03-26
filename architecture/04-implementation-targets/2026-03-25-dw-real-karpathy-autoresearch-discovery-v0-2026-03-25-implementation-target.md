# Implementation Target: Karpathy Autoresearch Discovery Front Door Pressure (2026-03-26)

## target
- Candidate id: `dw-real-karpathy-autoresearch-discovery-v0-2026-03-25`
- Candidate name: Karpathy Autoresearch Discovery Front Door Pressure
- Source adoption artifact: `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adopted.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `reference-pattern`
- Final adoption status: `adopted`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned reference-pattern implementation slice.
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Materialization basis: The Karpathy autoresearch constraint-metric-iteration loop pattern was analyzed against the Engine current Architecture experiment loop. Finding: the pattern is already structurally present in the Engine. Constraints are explicit (bounded scope, failure criteria, rollback path in bounded start artifacts). Metrics exist as structural pass/fail validation gates (adaptation_complete, engine_boundary_preserved, decision_review) and closeout readiness checks. Iteration exists via continuation bounded starts and keep/reopen evaluation cycles. However, two specific gaps were identified relative to the Karpathy pattern: (1) metrics are gate-based (pass/fail) rather than quantitative/continuous — the Engine cannot currently express "how much closer did this iteration bring us" in measurable terms; (2) iteration is human-initiated rather than autonomous — the Engine does not autonomously decide when to iterate vs stop. Both gaps are intentional for the current Engine-building phase: quantitative metrics require a stable evaluation surface that does not yet exist, and autonomous iteration is explicitly in the forbidden scope expansion list (no lifecycle orchestration, no automatic workflow advancement). The bounded experiment confirms the pattern is already adapted into Engine-owned form at the structural level. No new code or mechanism is required from this experiment. The value is confirmatory: the Engine already embodies the core pattern, and the identified gaps are intentionally deferred rather than missing.

## source decision envelope
- Decision format: `directive-architecture-adoption-decision-1.0`
- Source completion status: `product_partial`
- Source verification method: `structural_inspection`
- Source verification result: `not_recorded`
- Source runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

## source adoption resolution
- Source verdict: `adopt`
- Source readiness passed: yes
- Source Runtime handoff required: no
- Source Runtime handoff rationale: none recorded
- Source artifact path: `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adopted.md`
- Source primary evidence path: not recorded
- Source self-improvement category: `evaluation_quality`
- Source self-improvement verification method: `structural_inspection`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Confirm that the adopted constraint-metric-iteration reference pattern is already structurally present in Engine-owned Architecture chain code.
- Record the formal implementation target for the confirmatory finding without inventing new code or mechanism work.
- Keep the two identified gaps (quantitative metrics, autonomous iteration) explicitly out of scope as intentionally deferred.

## mechanical success criteria
- Structural inspection of shared/lib/architecture-bounded-closeout.ts confirms constraints, metrics, and iteration are present in the bounded start/result/closeout chain.
- No new code or mechanism is required — the implementation target records a confirmatory formal chain step only.
- The implementation result (next step) can be produced by recording the structural inspection evidence without fabricating new work.
- Validation gates adaptation_complete, engine_boundary_preserved, and decision_review remain satisfied from the bounded result.

## explicit limitations
- No new code, mechanism, or shared library change is produced from this target.
- Quantitative/continuous metrics remain intentionally deferred — the Engine does not yet have a stable evaluation surface for them.
- Autonomous iteration remains intentionally deferred — it is in the forbidden scope expansion list.
- Do not add runtime execution, host integration, or Runtime handoff from this target.
- Do not broaden into general theory notes or speculative abstraction.

## scope (bounded)
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## inputs
- Constraint plus metric plus autonomous iteration loop patterns that can improve Directive Workspace engine evaluation, proof, and self-improvement loop design.
- Real Discovery v0 verification from a tracked source note under sources/intake.
- Adopted artifact: `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adopted.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-result.md`
- Source bounded start artifact: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-25T01-46-08-519Z-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-120309c0.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-25T01-46-08-519Z-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-120309c0.md`
- Discovery routing record: `discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md`

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
- One explicit Architecture implementation target that defines one Directive-owned reference-pattern implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-implementation-target.md`.
