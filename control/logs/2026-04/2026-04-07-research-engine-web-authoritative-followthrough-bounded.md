# 2026-04-07 Research Engine Web Authoritative Follow-Through (Bounded)

- affected layer: Discovery Research Engine live web document extraction seam
- owning lane: Discovery
- mission usefulness: improve non-repo authoritative evidence quality by adding bounded same-host follow-through for web api-doc/product-doc pages so extraction can capture stronger official signals before normalization/scoring
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

- added bounded same-host web follow-through for non-repo `api-doc`/`product-doc` extraction:
  - max followed pages = 2
  - max ranked follow-through candidates = 6
- prevented authority widening:
  - follow-through is same-host only
  - no recursive crawling
  - no cross-host fan-out
- enriched web extraction facts with explicit follow-through evidence and telemetry notes:
  - follow-through signal fact
  - follow-through count in extraction notes
  - maintenance-note count when page timestamp exists

## Proof notes

- added regression coverage for same-host follow-through enriching API integration evidence
- added boundary/negative coverage for host-boundary enforcement and page-cap behavior
- updated active README behavior contract for the new bounded follow-through path
- ran unit tests and required workspace checks

## Stop-line

This slice stops at bounded same-host follow-through for non-repo web doc extraction. It does not alter routing authority, Discovery front-door ownership, or add recursive/cross-host crawler behavior.
