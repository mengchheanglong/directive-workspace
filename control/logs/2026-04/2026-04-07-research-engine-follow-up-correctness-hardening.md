# 2026-04-07 Research Engine Follow-Up Correctness Hardening

- affected layer: Discovery Research Engine live evidence-gap follow-up acquisition seam
- owning lane: Discovery
- mission usefulness: improve one-pass follow-up correctness and inspectability by preventing silent later-query suppression, allowing stronger duplicate replacement, and preserving bounded cap telemetry
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

- hardened follow-up acquisition with explicit constants and bounded caps:
  - max follow-up queries = 3
  - max follow-up hits/documents = 6
- removed cross-query candidate-ID suppression in follow-up query calls so later queries can still contribute useful evidence
- added same-source duplicate replacement logic so later stronger evidence can replace earlier weaker variants
- added explicit notes for dedupe replacements, existing-source skips, and cap trimming

## Proof notes

- added regression tests for:
  - non-silent later-query hit retention in follow-up pass
  - same-source stronger replacement with global cap pressure
- retained and rechecked bounded follow-up cap tests
- follow-up contract cleanup removed unused `existing_hits` plumbing after the dedupe model moved fully to source-document/source-url tracking
- cap-pressure proof now explicitly asserts the trim note instead of relying only on result lengths
- ran full Research Engine test suite and required workspace checks

## Stop-line

This slice stops at follow-up-pass correctness hardening and telemetry polish. It does not alter final route authority, Discovery front-door ownership, or add recursive acquisition behavior.
