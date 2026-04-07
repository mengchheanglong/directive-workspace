# 2026-04-07 Research Engine HTTP Error Handle Cleanup (Bounded)

- affected layer: Discovery Research Engine live-provider retry path
- owning lane: Discovery
- mission usefulness: remove resource-handle leakage noise in bounded failure paths so strict review runs stay clean and interpretable without changing acquisition decisions
- proof path:
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run.ResearchEngineRunTest.test_read_json_closes_http_error_response_handle_on_failure -q (from discovery/research-engine with PYTHONPATH=src)
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run -q (from discovery/research-engine with PYTHONPATH=src)
  - npm run check:research-engine-discovery-import
- rollback path:
  - revert discovery/research-engine/src/research_engine/acquisition.py
  - revert discovery/research-engine/tests/test_run.py
  - remove this log entry

## Bounded slice

- live retry path now closes HTTPError response handles on each failed attempt and before final re-raise
- error-labeling and retry telemetry behavior are preserved
- added regression coverage to assert HTTPError response handles are closed after bounded retry failure
- no changes were made to routing, scoring, fallback policy, or Discovery authority boundaries

## Stop-line

This slice stops at resource-handle cleanup in retry failure handling. It does not alter live acquisition strategy, strict/fallback semantics, or downstream packet/routing behavior.
