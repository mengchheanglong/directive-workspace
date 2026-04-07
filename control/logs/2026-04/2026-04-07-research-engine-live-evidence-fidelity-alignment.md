Affected layer: Discovery Research Engine acquisition-to-scoring seam.
Owning lane: Discovery.
Mission usefulness: make live-provider and local-first evidence quality track how faithfully a fact was extracted, so generic fallback snippets and summaries stop looking like first-class proof.
Proof path:
- `python -m unittest tests.test_run -q` with `PYTHONPATH=src` from `discovery/research-engine`
- `npm run check:research-engine-discovery-import`
- `npm run check:directive-workspace-composition`
Rollback path:
- revert fidelity fields in `discovery/research-engine/src/research_engine/models.py`
- revert acquisition fidelity tagging in `discovery/research-engine/src/research_engine/acquisition.py`
- revert normalization/scoring/export changes in `normalize.py`, `score.py`, and `export.py`
- revert the added tests in `discovery/research-engine/tests/test_run.py`

Bounded slice:
- added `extraction_fidelity` to `SourceFact` and `EvidenceItem`
- tagged live and local extracted facts as `direct`, `derived`, or `fallback`
- added `fallback-derived-evidence` and `fallback-evidence-majority` signals during normalization
- added `extraction_fidelity_penalty` to Research Engine scoring
- surfaced extraction-fidelity uncertainty through exported candidate uncertainty notes

Stop-line:
- this tightens evidence truth for the current Research Engine
- it does not redesign provider acquisition or add new live providers
