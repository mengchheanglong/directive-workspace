Affected layer: Discovery Research Engine CLI setup seam.
Owning lane: Discovery.
Mission usefulness: make the local provider-key setup path truthful so a filled `.env` file is actually consumed by Research Engine runs.
Proof path: `python -m unittest tests.test_run -q`, real `live-hybrid` run from `discovery/research-engine`, `npm run check:research-engine-discovery-import`.
Rollback path: revert `discovery/research-engine/src/research_engine/cli.py`, `discovery/research-engine/tests/test_run.py`, and the small README note.
Stop-line: bounded local setup alignment only; no acquisition semantics or authority changes.

What changed:
- added a small stdlib `.env` loader to the Research Engine CLI
- preserved existing environment values over `.env` values
- added regression coverage for `.env` loading behavior
- updated README so the documented local setup path matches runtime behavior
