# 2026-04-07 Research Engine Evidence-Gap Follow-Up Acquisition

- affected layer: Discovery Research Engine acquisition and orchestration seam
- owning lane: Discovery
- mission usefulness: convert first-pass evidence-gap detection into one bounded follow-up acquisition step so missing evidence classes can be partially filled before final scoring/export
- proof path:
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run -q (from discovery/research-engine with PYTHONPATH=src)
  - npm run check:research-engine-discovery-import
  - npm run check:directive-workspace-composition
- rollback path:
  - revert discovery/research-engine/src/research_engine/acquisition.py
  - revert discovery/research-engine/src/research_engine/normalize.py
  - revert discovery/research-engine/src/research_engine/orchestrator.py
  - revert discovery/research-engine/tests/test_run.py
  - revert discovery/research-engine/README.md
  - remove this log entry

## Bounded slice

- added actionable evidence-gap detection from first-pass normalized evidence:
  - missing-primary-source-evidence
  - missing-technical-facts
  - missing-maintenance-freshness
  - missing-comparative-evidence
- added one bounded follow-up acquisition capability to live-hybrid provider:
  - up to three follow-up queries total
  - one query per selected gap directive
  - up to six follow-up hits/documents total
- wired orchestrator to run exactly one follow-up pass after first-pass normalization and before final scoring/export
- kept behavior inspectable via acquisition notes and deterministic bounds; no recursive loop or crawler behavior

## Proof notes

- added targeted tests for:
  - gap detection correctness from normalized evidence
  - live provider bounded follow-up pass limits
  - orchestrator integration of one follow-up pass into final evidence bundle
- existing suites continue to cover live web selection, docs follow-through, extraction fidelity, and exports
- repository checks listed in proof path executed after implementation

## Stop-line

This slice stops at one bounded evidence-gap-driven follow-up acquisition pass between first-pass normalization and final scoring/export. It does not change Discovery front-door authority, final route authority, or create open-ended acquisition loops.
