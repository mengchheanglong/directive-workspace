# 2026-04-07 Research Engine Structured Extraction And Review Guidance Alignment

- affected layer: Discovery Research Engine scoring/export and Discovery import seam
- owning lane: Discovery-owned source intelligence with Engine/Architecture-directed structural judgment
- mission usefulness: turn structurally useful research sources into explicit extraction recommendations, lane-target hints, phase-aware scores, and review guidance instead of generic score prose only
- proof path:
  - `python -m unittest tests.test_run -q` (from `discovery/research-engine` with `PYTHONPATH=src`)
  - `npm run check:research-engine-discovery-import`
  - `npm run check:directive-workspace-composition`
- rollback path:
  - revert the packet/export changes in `discovery/research-engine/src/research_engine`
  - revert the schema updates in `discovery/research-engine/schemas/`
  - revert the importer changes in `hosts/adapters/research-engine-discovery-import.ts`
  - remove this log entry

## What changed

- added explicit structured recommendation surfaces:
  - `lane_target_signals`
  - `structural_recommendations`
  - `review_guidance`
- extended `dw_discovery_packet.json` candidates with:
  - `recommended_lane_target`
  - `lane_target_rationale`
  - `workflow_phase_scores`
  - `structural_extraction_recommendations`
  - `structural_avoid_recommendations`
  - `review_guidance_summary`
  - `review_guidance_action`
  - `review_guidance_stop_line`
- improved baseline-vs-structural handling so structurally useful baseline-overlap candidates can surface as bounded review candidates instead of being flattened into weak/noisy only
- taught the Discovery import adapter to preserve the new structured hints in its import notes and target inference without giving Research Engine route authority

## Result

- Research Engine now says what to extract, what to avoid, which lane the value most likely belongs to, and what review boundary to keep
- sources like `Open Deep Research` remain review-gated, but the reason is now explicit and actionable
- structurally strong imports like `PaperQA2` and `LangGraph` now preclassify as Architecture-oriented in the bounded checker seam because their value is framed as Engine/discovery improvement rather than direct runtime adoption

## Stop-line

This slice stops at structured packet quality and Discovery import inference. It does not widen into a live-provider redesign or make Research Engine the final routing authority.
