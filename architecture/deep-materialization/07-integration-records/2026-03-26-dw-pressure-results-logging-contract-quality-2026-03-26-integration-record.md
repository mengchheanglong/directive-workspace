# Architecture Integration Record: Autoresearch Results Logging Protocol (2026-03-26)

## retained objective
- Candidate id: `dw-pressure-results-logging-contract-quality-2026-03-26`
- Candidate name: Autoresearch Results Logging Protocol
- Source retained artifact: `architecture/06-retained/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-retained.md`
- Source implementation result: `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`
- Usefulness level: `meta`
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## integration target/surface
- shared/lib/architecture-bounded-closeout.ts — the Engine-owned bounded closeout contract. The primaryEvidencePath field is integrated into the closeout input type, the bounded-result artifact renderer, the paired decision JSON writer, and the result-evidence resolution path. Every Architecture bounded closeout operation across all lanes consumes this field.

## readiness summary
- Already integrated and in active use. The primaryEvidencePath field has been consumed by 25+ engine runs powering Architecture bounded closeout operations. The field is parsed from bounded-result artifacts, existence-validated against the directive root, and preferred by result-evidence readers over heuristic path scraping. npm run check confirms all composition and anchor checks pass with the field in place.

## expected effect
- Architecture bounded closeout result evidence is resolved via an explicit validated contract field instead of heuristic path inference. This reduces false evidence resolution, makes result-evidence auditing deterministic, and improves the reliability of downstream adoption decision artifacts that record primary_evidence_path.

## validation boundary
- Validated by: (1) structural inspection of shared/lib/architecture-bounded-closeout.ts showing 15 usages of primaryEvidencePath; (2) npm run check passing with all anchor and composition checks; (3) the source bounded-result adoption decision JSON recording primary_evidence_path: shared/lib/architecture-bounded-closeout.ts.

## evidence links
- Retained artifact: `architecture/06-retained/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-retained.md`
- Implementation result: `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md`
- Implementation target: `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md`
- Adoption artifact: `architecture/03-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md`
- Upstream bounded result: `architecture/02-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`

## integration decision
- Decision approval: `directive-lead-implementer`
- Decision: Confirm integration. The retained value is not a plan — it is already live, consumed by the Engine, and powering every Architecture bounded closeout. This integration record formalizes that existing downstream use.

## rollback boundary
- If the primaryEvidencePath integration causes regression, remove the field from the closeout type in shared/lib/architecture-bounded-closeout.ts, revert result-evidence readers to heuristic-only resolution, and return to the retained artifact for re-evaluation.

## artifact linkage
- This integration-ready Architecture record is now retained at `architecture/07-integration-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-integration-record.md`.
- If integration readiness later proves premature, resume from `architecture/06-retained/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-retained.md` instead of reconstructing the chain by hand.
