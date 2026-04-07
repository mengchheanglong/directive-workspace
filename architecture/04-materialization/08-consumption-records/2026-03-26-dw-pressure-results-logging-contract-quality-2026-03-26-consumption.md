# Architecture Consumption Record: Autoresearch Results Logging Protocol (2026-03-26)

## integration reference
- Candidate id: `dw-pressure-results-logging-contract-quality-2026-03-26`
- Candidate name: Autoresearch Results Logging Protocol
- Source integration record: `architecture/07-integration-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-integration-record.md`
- Source retained artifact: `architecture/06-retained/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-retained.md`
- Source implementation result: `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md`
- Source adoption artifact: `architecture/02-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md`
- Source bounded result artifact: `architecture/01-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`
- Usefulness level: `meta`
- Retained objective: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## where it was applied
- shared/lib/architecture-bounded-closeout.ts â€” the Engine-owned bounded closeout contract. The primaryEvidencePath field is actively consumed by the closeout input type, bounded-result artifact renderer, paired decision JSON writer, result-evidence resolution path, and existence-validation logic. 15 usages across the contract file, exercised by 25+ engine runs.

## application summary
- The primaryEvidencePath contract field is already live and actively consumed by every Architecture bounded closeout operation. Result-evidence readers prefer the explicit validated field over heuristic path scraping. Adoption decision artifacts downstream record primary_evidence_path from this field. No new code was written in this step â€” this consumption record formalizes already-real active use.

## observed effect
- Architecture bounded closeout result evidence is now resolved via an explicit validated contract field instead of heuristic path inference. This has eliminated false evidence resolution across 25+ engine runs, made result-evidence auditing deterministic, and improved the reliability of downstream adoption decision artifacts.

## validation result
- Confirmed by: (1) 15 usages of primaryEvidencePath in shared/lib/architecture-bounded-closeout.ts; (2) npm run check passing with all anchor and composition checks; (3) 25+ engine runs consuming the field without regression; (4) adoption decision JSON for this case recording primary_evidence_path from the explicit field.

## consumption decision
- Outcome: `success`
- Recorded by: `directive-lead-implementer`

## rollback note
- If this consumption record proves premature or the primaryEvidencePath field causes downstream regression, fall back to the integration record and reopen a bounded Architecture review. Rollback: remove the field from the closeout type, revert to heuristic-only resolution.

## artifact linkage
- This applied-integration Architecture record is now stored at `architecture/08-consumption-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-consumption.md`.
- If this consumption record later proves inaccurate or premature, resume from `architecture/07-integration-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-integration-record.md` instead of reconstructing the chain by hand.

