# Post-Consumption Evaluation: Autoresearch Results Logging Protocol (2026-03-26)

## consumption reference
- Candidate id: `dw-pressure-results-logging-contract-quality-2026-03-26`
- Candidate name: Autoresearch Results Logging Protocol
- Source consumption record: `architecture/08-consumption-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-consumption.md`
- Source integration record: `architecture/07-integration-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-integration-record.md`
- Source retained artifact: `architecture/06-retained/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-retained.md`
- Source implementation result: `architecture/05-implementation-results/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-adopted.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-bounded-result.md`
- Usefulness level: `meta`
- Retained objective: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.

## keep or reopen decision
- Decision: `keep`
- Evaluation approval: `directive-lead-implementer`

## rationale
- The primaryEvidencePath contract field has been stable and actively consumed across 25+ engine runs with zero regressions. Result-evidence readers prefer the explicit validated field over heuristic path scraping. Adoption decision artifacts downstream consume primary_evidence_path from this field. The bounded scope (one field, one contract file) remained tight throughout the full Architecture chain. No open question or instability justifies reopening.

## observed stability
- Stable. The field has been exercised by every Architecture bounded closeout operation across 25+ engine runs. npm run check passes with all anchor and composition checks. No false evidence resolution or downstream breakage has been observed since materialization.

## retained usefulness assessment
- Meta-useful and confirmed. The primaryEvidencePath discipline improves how the Engine evaluates and proves its own Architecture results — making result-evidence auditing deterministic and adoption decision artifacts more reliable. This is level-3 meta-usefulness: it improves the system ability to discover, judge, adapt, prove, and integrate future sources.

## next bounded action if reopen
- No reopen action required. The Architecture chain for this case is complete. Karpathy Autoresearch (at architecture.handoff.pending_review) is the next candidate for active Architecture work.

## rollback note
- If this keep evaluation later proves wrong, return to the consumption record and reassess. Rollback: remove primaryEvidencePath from the closeout type in shared/lib/architecture-bounded-closeout.ts and revert to heuristic-only resolution.

## artifact linkage
- This post-consumption evaluation is now stored at `architecture/09-post-consumption-evaluations/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-evaluation.md`.
- If this judgment later proves wrong, resume from `architecture/08-consumption-records/2026-03-26-dw-pressure-results-logging-contract-quality-2026-03-26-consumption.md` instead of reconstructing the applied chain by hand.
