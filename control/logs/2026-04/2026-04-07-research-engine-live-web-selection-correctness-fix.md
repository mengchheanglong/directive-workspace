Affected layer: Discovery Research Engine pre-fetch live web selection.
Owning lane: Discovery.
Mission usefulness: ensure bounded live web selection actually keeps the strongest same-URL evidence and does not refill fetch slots with weak leftovers.
Proof path:
- `python -m unittest tests.test_run -q` with `PYTHONPATH=src` from `discovery/research-engine`
- `npm run check:research-engine-discovery-import`
- `npm run check:directive-workspace-composition`
Rollback path:
- revert the bounded selector edits in `discovery/research-engine/src/research_engine/acquisition.py`
- revert the regression tests in `discovery/research-engine/tests/test_run.py`

Bounded correction:
- removed premature same-URL exclusion during web candidate ranking so later better evidence for the same canonical URL can replace weaker earlier entries
- added the minimum quality gate to the final fill pass so weak/noisy leftovers are not fetched just to occupy unused slots
- added targeted tests for both correctness cases

Stop-line:
- this fixes selector correctness only
- it does not change the broader ranking model or Discovery authority
