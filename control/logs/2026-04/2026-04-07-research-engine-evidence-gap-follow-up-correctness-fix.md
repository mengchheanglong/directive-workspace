## 2026-04-07 - Research Engine evidence-gap follow-up correctness fix

- affected layer: Discovery Research Engine follow-up acquisition and orchestration
- owning lane: Discovery
- mission usefulness: allow one bounded follow-up pass to enrich an already-seen candidate and preserve second-pass provider telemetry in the final record
- proof path:
  - `python -m unittest tests.test_run -q` in `discovery/research-engine` with `PYTHONPATH=src`
  - `npm run check:research-engine-discovery-import`
  - `npm run check:directive-workspace-composition`
- rollback path:
  - revert `discovery/research-engine/src/research_engine/acquisition.py`
  - revert `discovery/research-engine/src/research_engine/orchestrator.py`
  - revert `discovery/research-engine/tests/test_run.py`

### What changed

- follow-up acquisition no longer blocks same-candidate enrichment by seeding candidate exclusion from first-pass hits
- follow-up acquisition now reports its own provider-health block
- orchestrator now preserves follow-up provider telemetry in the final `ResearchRecord`
- targeted regressions prove:
  - same-candidate follow-up evidence can be added
  - follow-up provider health survives into the final record

### Stop-line

- bounded correctness repair only
- no scoring redesign
- no discovery authority change
- no recursive follow-up expansion
