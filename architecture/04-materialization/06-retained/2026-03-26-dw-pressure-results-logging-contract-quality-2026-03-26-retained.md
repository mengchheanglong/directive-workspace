# Retained Architecture Output: Autoresearch Results Logging Protocol (2026-03-26)

## retained objective
- Candidate id: `dw-pressure-results-logging-contract-quality-2026-03-26`
- Candidate name: Autoresearch Results Logging Protocol
- Source implementation result: `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md`
- Source adoption artifact: `architecture/02-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## final usefulness assessment
- Usefulness level: `meta`
- Assessment: The primaryEvidencePath explicit contract field is stable, in active use by 25+ engine runs, and improves how the Engine evaluates and proves its own Architecture results. The field is parsed, existence-validated, and preferred by result-evidence readers in shared/lib/architecture-bounded-closeout.ts. No instability or regression has been observed.

## retained review resolution
- Review score: `5`
- Review result: `approved`
- Lifecycle outcome: `promote_to_decision`
- Transition request: `evaluated -> decided` via `decision_owner`

### warning checks
- none

### failing checks
- none

### required changes
- none

## stability and reuse
- Stability level: `stable`
- Reuse scope: Retain as Engine-owned schema discipline. The primaryEvidencePath field is available to all Architecture bounded closeout operations and result-evidence readers across the entire Directive Workspace product.

## evidence links
- Actual implementation result summary: All four mechanical success criteria confirmed against live code and artifacts: (1) primaryEvidencePath field is present and functional in shared/lib/architecture-bounded-closeout.ts with 15 usages including type definition, parsing, validation, and rendering; (2) result-evidence readers prefer the explicit field over heuristic path inference (line 741 uses primaryEvidencePath ?? fallback pattern); (3) the source bounded-result adoption decision JSON records primary_evidence_path: shared/lib/architecture-bounded-closeout.ts; (4) npm run check passes with all composition and anchor checks ok. No new code was required; the implementation was already product-materialized before the target was created.
- Implementation result artifact: `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md`
- Implementation target artifact: `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md`
- Adoption artifact: `architecture/02-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md`
- Upstream bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`

## confirmation decision
- Confirmation approval: `directive-lead-implementer`
- Decision: Retain. The implementation result confirmed all four mechanical success criteria against live code. The value is product-materialized, stable, and actively consumed by the Engine. No further bounded Architecture work is needed before retention.

## rollback boundary
- If the primaryEvidencePath field later proves unhelpful, remove it from the closeout type in shared/lib/architecture-bounded-closeout.ts and revert readers to heuristic-only evidence resolution. The implementation result and implementation target remain valid for re-evaluation.

## artifact linkage
- This retained Architecture output is now recorded at `architecture/06-retained/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-retained.md`.
- If retention later proves premature, resume from `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md` or `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md` instead of reconstructing the chain by hand.

