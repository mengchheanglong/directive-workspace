# 2026-04-07 Research Engine Review Queue Actionability (Bounded)

- affected layer: Discovery Research Engine source-intelligence packet export and report rendering seam
- owning lane: Discovery
- mission usefulness: increase Discovery triage usefulness by emitting explicit review-priority ordering and rationale from existing bounded evidence signals without changing route/adoption authority
- proof path:
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run -q (from discovery/research-engine with PYTHONPATH=src)
  - npm run check:research-engine-discovery-import
  - npm run check:directive-workspace-composition
- rollback path:
  - revert discovery/research-engine/src/research_engine/export.py
  - revert discovery/research-engine/src/research_engine/contracts.py
  - revert discovery/research-engine/schemas/source_intelligence_packet.schema.json
  - revert discovery/research-engine/tests/test_run.py
  - revert discovery/research-engine/README.md
  - remove this log entry

## Bounded slice

- added bounded `review_queue` emission to `source_intelligence_packet.json` and `machine_friendly_research_packet`:
  - score band (`high`/`medium`/`low`)
  - deterministic priority score (0-100)
  - explicit rationale text anchored to already-exported signals
  - status, action, stop-line, and uncertainty count for triage readability
- kept authority boundaries explicit:
  - queue semantics are triage priority only
  - no route/adoption decision authority was added
  - no import-selection behavior was changed in host adapters
- updated markdown rendering so recommendations include a dedicated review-queue section before open uncertainties
- tightened source-intelligence contract and schema to require the new queue payload

## Proof notes

- updated test coverage to assert review-queue presence, shape, sort order, and markdown section output
- kept the change bounded to reporting/contract surfaces; no acquisition, routing, or follow-through logic changed

## Stop-line

This slice stops at source-intelligence packet actionability improvement for Discovery triage. It does not alter acquisition behavior, Discovery routing authority, host import default candidate selection policy, or any hardened live web follow-through seams.
