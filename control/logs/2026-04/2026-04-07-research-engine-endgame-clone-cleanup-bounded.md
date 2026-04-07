# 2026-04-07 Research Engine Endgame Clone Cleanup (Bounded)

- affected layer: Discovery Research Engine local workspace hygiene + inspection shell micro-polish
- owning lane: Discovery
- mission usefulness: remove local-only run baggage and keep operator-facing inspection clarity high while preserving Discovery authority and hardened acquisition/import seams
- proof path:
  - local-only safety checks: `git check-ignore -v` for `.research/` and `artifacts*` paths under `discovery/research-engine/`
  - `python -m unittest tests.test_run -q` (from `discovery/research-engine` with `PYTHONPATH=src`)
  - `npm run check:research-engine-discovery-import`
  - smoke check: `python -m research_engine --output-dir %TEMP%/research-engine-clone-cleanup-smoke --acquisition-mode catalog` then artifact existence check and cleanup
- rollback path:
  - restore deleted local ignored folders only if needed (`discovery/research-engine/.research`, `discovery/research-engine/artifacts*`)
  - revert `discovery/research-engine/src/research_engine/export.py`
  - revert `discovery/research-engine/tests/test_run.py`
  - revert `discovery/research-engine/README.md`
  - remove this log entry

## Bounded slice

- removed verified local-only ignored baggage:
  - root `.venv`
  - `discovery/research-engine/.research`
  - `discovery/research-engine/artifacts`
  - `discovery/research-engine/artifacts-api`
  - `discovery/research-engine/artifacts-live`
  - `discovery/research-engine/artifacts-live-test`
  - `discovery/research-engine/artifacts-local`
  - `discovery/research-engine/artifacts-local-research`
  - `discovery/research-engine/artifacts-local-research-calibrated`
- deletion safety was confirmed before removal using ignore rules in `discovery/research-engine/.gitignore` and by verifying no active checker depended on those in-repo directories
- applied one minor operator/report polish only:
  - inspection Run Snapshot now includes `Acquisition notes` count for faster operator triage context
- docs cleanup:
  - clarified `.research/` as optional local-only ignored workspace area, usually absent in clean clones

## Guard rails respected

- no acquisition/follow-through/follow-up/diversification/routing/import authority logic changed
- no packet schema/contract changes
- no Discovery authority widening

## Stop-line

This slice stops at local-only surface cleanup plus one small operator-facing inspection readability improvement. No hardened core seam was reopened.
