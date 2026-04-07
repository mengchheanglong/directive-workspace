# 2026-04-07 Research Engine Academic Web Follow-Through (Bounded)

- affected layer: Discovery Research Engine live web academic evidence assembly seam
- owning lane: Discovery
- mission usefulness: improve authoritative evidence assembly quality for academic/research sources by adding bounded same-host follow-through for academic-paper pages before shaping and scoring
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

- extended non-repo web follow-through to include `academic-paper` sources with explicit bounds:
  - max followed pages = 1
  - max ranked follow-through candidates = 4
- preserved existing safety boundaries:
  - same-host links only
  - no recursive crawling
  - no cross-host fan-out
  - PDF follow-through links are skipped to avoid binary-noise fetches in this bounded slice
- added source-type-specific telemetry for follow-through evidence facts:
  - academic path emits `Academic authoritative follow-through` fact wording
  - notes explicitly record bounded abstract/html/supplementary follow-through intent

## Proof notes

- added regression test ensuring academic follow-through enriches shaped evidence and remains host-bounded
- added boundary/negative test ensuring PDF-only academic links do not trigger low-value follow-through fetches
- updated active README behavior contract for bounded academic follow-through
- ran unit tests and required workspace checks

## Stop-line

This slice stops at bounded academic same-host follow-through within Discovery acquisition shaping. It does not alter Discovery routing authority, route/import decisions, recursive crawler behavior, or any already-hardened follow-up/diversification seams.
