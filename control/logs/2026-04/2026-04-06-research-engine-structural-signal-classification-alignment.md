# 2026-04-06 Research Engine Structural Signal Classification Alignment

- affected layer: Discovery Research Engine scoring/export and Discovery import seam
- owning lane: Discovery-owned source intelligence with Engine/Architecture-directed structural judgment
- mission usefulness: separate "not novel" from "still structurally useful" so Discovery can preserve Architecture-relevant extraction value without over-promoting baseline-overlap sources
- proof path:
  - `npm run check:research-engine-discovery-import`
  - `python -m unittest tests.test_run -q` (from `discovery/research-engine` with `PYTHONPATH=src`)
  - `npm run check:directive-workspace-composition`
- rollback path:
  - revert the structural-signal additions in `discovery/research-engine/src/research_engine`
  - revert the schema updates in `discovery/research-engine/schemas/`
  - revert the adapter consumption changes in `hosts/adapters/research-engine-discovery-import.ts`
  - remove this log entry

## What changed

- added an explicit structural-signal surface to Research Engine packets:
  - `structural_signal_band`
  - `structural_signal_summary`
- added top-level `structural_signals` to `source_intelligence_packet.json` and the machine-friendly packet
- classify strong structural candidates into:
  - `strong_structural`
  - `comparison_structural`
  - `extractive_structural`
- keep `extractive_structural` for baseline-overlap candidates that still expose reusable workflow or mechanism boundaries worth extracting
- teach the Discovery import adapter to preserve that structural signal in its routing inference instead of relying only on prose heuristics

## Result

- structurally useful baseline-overlap candidates are no longer flattened into weak/noisy only
- `open-deep-research` now preserves its bounded workflow/provider-seam value explicitly while still remaining review-gated when routing confidence is conflicted

## Stop-line

This slice stops at signal classification, packet export, and Discovery import inference. It does not change the autonomous approval threshold or force conflicted Architecture routes past review.
