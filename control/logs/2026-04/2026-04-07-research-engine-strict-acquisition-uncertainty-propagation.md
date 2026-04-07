# 2026-04-07 Research Engine Strict Acquisition Uncertainty Propagation (Bounded)

- affected layer: Discovery Research Engine source-intelligence packet and reporting export seam
- owning lane: Discovery
- mission usefulness: preserve truthful Discovery triage context by surfacing degraded/strict no-fallback acquisition pressure in packet-level open uncertainties without changing routing or adoption authority
- proof path:
  - c:/Users/User/projects/directive-workspace/.venv/Scripts/python.exe -m unittest tests.test_run -q (from discovery/research-engine with PYTHONPATH=src)
  - npm run check:research-engine-discovery-import
- rollback path:
  - revert discovery/research-engine/src/research_engine/export.py
  - revert discovery/research-engine/tests/test_run.py
  - remove this log entry

## Bounded slice

- added bounded acquisition-health uncertainty derivation in export flow:
  - summarizes non-healthy provider-health entries (`degraded` / `fallback`) into explicit uncertainty text
  - emits strict no-fallback uncertainty when signaled by acquisition notes or provider reason codes
- prepended acquisition-health uncertainties into source-intelligence `open_uncertainties` with dedupe and existing cap behavior preserved
- exposed acquisition-health uncertainty subset in machine-friendly packet for explicit downstream inspection
- no changes were made to acquisition behavior, retry/backoff logic, fallback mechanics, scoring, routing, decision authority, or integration authority

## Proof notes

- added regression coverage for strict local-first degraded context to ensure packet, markdown recommendations, and inspection surfaces all include acquisition-health uncertainty visibility
- validated the full Research Engine unittest suite and Discovery import checker after the bounded change

## Stop-line

This slice stops at truthfulness propagation for strict/degraded acquisition context in export/report artifacts. No hardened acquisition seam or provider execution behavior was reopened.
