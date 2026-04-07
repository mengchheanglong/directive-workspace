# 2026-04-07 Research Engine Live Web Selection Quality

- affected layer: Discovery Research Engine live web acquisition seam
- owning lane: Discovery
- mission usefulness: improve pre-fetch live web source selection quality across multiple source classes by ranking mission fit and authority, preserving cross-class diversity, and reducing duplicate/noisy hits before document assembly
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

- improved live web pre-fetch candidate selection by adding bounded ranking components:
  - mission-fit signal from query-term overlap
  - authority weighting by source class (repo/docs/api/academic/blog/forum/news)
  - comparative-value bonus for weaker source classes when they carry structural/comparative cues
  - low-value/noise penalties and near-duplicate reduction
- added a bounded two-pass selection policy:
  - pass 1 keeps high-quality source-type diversity
  - pass 2 fills remaining slots by ranked quality
- extended web source classification to include `academic-paper` so pre-fetch selection and later shaping can treat research sources explicitly

## Proof notes

- new tests validate quality improvements before fetch:
  - test_live_web_hits_prefetch_selection_prefers_authoritative_when_fit_is_similar
  - test_live_web_hits_prefetch_preserves_unique_forum_comparative_signal
  - test_live_web_hits_prefetch_reduces_duplicate_and_low_value_noise
- existing tests continue covering web breadth and repo follow-through behavior
- repository checks listed in proof path executed after implementation

## Stop-line

This slice stops at pre-fetch web-source selection quality in live acquisition. It does not change Discovery front-door authority, final routing authority, normalization/scoring policy, or provider-stack composition.
