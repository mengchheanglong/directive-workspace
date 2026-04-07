# 2026-04-07 Research Engine Live Web Acquisition Breadth

- affected layer: Discovery Research Engine live acquisition seam
- owning lane: Discovery
- mission usefulness: increase live-provider source breadth and early evidence quality before normalization/scoring by capturing additional web result surfaces and reducing premature web-hit dedupe collisions
- proof path:
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run -q (from discovery/research-engine with PYTHONPATH=src)
  - npm run check:research-engine-discovery-import
  - npm run check:directive-workspace-composition
- rollback path:
  - revert discovery/research-engine/src/research_engine/acquisition.py
  - revert discovery/research-engine/tests/test_run.py
  - revert discovery/research-engine/README.md
  - remove this log entry

## Bounded slice

- broadened web-live candidate harvesting from DuckDuckGo payload fields already returned by the provider:
  - AbstractURL + AbstractText
  - Results[]
  - RelatedTopics[]
- added canonical URL dedupe and deeper path-based web candidate IDs so distinct docs under the same host are less likely to collapse into one candidate
- when web discovery returns GitHub/GitLab repo URLs, acquisition now emits repo hits and follows through with repo-aware fetch extraction instead of generic web-doc extraction

## Proof notes

- new tests validate breadth and follow-through behavior:
  - test_live_web_hits_include_abstract_results_and_related_topics
  - test_web_candidate_ids_distinguish_deeper_paths
  - test_documents_from_hits_routes_web_repo_hits_to_repo_fetch
- full Research Engine suite passed: 44 tests
- repository checks passed:
  - check:research-engine-discovery-import
  - check:directive-workspace-composition

## Stop-line

This slice stops at live acquisition breadth and evidence capture quality improvements in the existing web-live provider path. It does not redesign planning, scoring policy, routing authority, or provider stack composition.
