# 2026-04-07 Research Engine Mission-Aware Query Diversification (Bounded)

- affected layer: Discovery Research Engine planning seam
- owning lane: Discovery
- mission usefulness: improve mission-conditioned source intake by adding bounded objective-aware query diversification so live acquisition receives stronger non-generic query pressure without changing Discovery route authority
- proof path:
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run -q (from discovery/research-engine with PYTHONPATH=src)
  - npm run check:research-engine-discovery-import
  - npm run check:directive-workspace-composition
- rollback path:
  - revert discovery/research-engine/src/research_engine/planning.py
  - revert discovery/research-engine/tests/test_run.py
  - revert discovery/research-engine/README.md
  - remove this log entry

## Bounded slice

- added mission-aware query diversification in planning:
  - up to 2 diversified query variants per plan
  - each variant appends bounded objective-derived novel terms to an existing track query
  - diversified queries reuse the existing track and query_type boundaries
- preserved hard bounds and reversibility:
  - diversification is skipped when max query budget is already saturated
  - required-track and required-query-type logic remains unchanged
  - existing query budget enforcement remains the final cap
- added explicit planning telemetry notes:
  - diversification additions are recorded with track id and selected terms
  - skip reasons are recorded when diversification is not applied

## Proof notes

- added regression test that verifies diversified mission queries are added when budget allows
- added boundary test that verifies saturated query budget prevents diversification expansion
- updated active README behavior contract for bounded planning diversification
- ran unit tests and required workspace checks

## Stop-line

This slice stops at bounded query-planning diversification. It does not change acquisition provider authority, Discovery front-door ownership, or any routing/import decision authority.