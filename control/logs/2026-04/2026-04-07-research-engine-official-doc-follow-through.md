# 2026-04-07 Research Engine Official-Doc Follow-Through

- affected layer: Discovery Research Engine live acquisition seam
- owning lane: Discovery
- mission usefulness: strengthen primary-source evidence before normalization/scoring by boundedly following repo homepage/docs signals into authoritative docs/reference/quickstart pages
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

- added bounded official-doc follow-through in live repo fetch paths
- when repo discovery exposes homepage/docs signals, acquisition follows through into at most three authoritative pages
- authority preference is docs/reference/api/quickstart/getting-started pages
- no crawler behavior: single-step link extraction plus bounded page fetch only
- surfaced follow-through evidence explicitly through new `signal` facts and maintenance notes (`docs_followthrough_pages`, `docs_followthrough_urls`)

## Proof notes

- targeted tests added for bounded follow-through and repo evidence strengthening:
  - test_official_docs_followthrough_is_bounded_to_three_pages
  - test_live_github_document_follows_official_docs_for_stronger_evidence
  - test_live_gitlab_document_follows_official_docs_links_from_description
- existing live coverage retained for web breadth and repo follow-through from web hits
- validation commands listed in proof path run after implementation

## Stop-line

This slice stops at bounded official-doc follow-through for live repo discoveries in Research Engine acquisition. It does not change Discovery front-door authority, scoring policy, routing authority, or provider-stack composition.
