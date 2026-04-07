Affected layer: Discovery Research Engine live acquisition seam.
Owning lane: Discovery.
Mission usefulness: add bounded optional Tavily, Exa, and Firecrawl adapters so live-source discovery/fetch can use stronger external providers without widening Discovery authority.
Proof path: `python -m unittest tests.test_run -q`, `npm run check:research-engine-discovery-import`, `npm run check:directive-workspace-composition`.
Rollback path: revert the provider-adapter edits in `discovery/research-engine/src/research_engine/acquisition.py`, `discovery/research-engine/src/research_engine/planning.py`, `discovery/research-engine/tests/test_run.py`, and `discovery/research-engine/README.md`.
Stop-line: optional provider integration only; no routing-authority, packet-contract, or crawler-behavior redesign.

What changed:
- added bounded optional discovery adapters for Tavily, Exa, and Firecrawl in the live acquisition provider
- added Firecrawl-backed bounded web scrape support for live web-page fetch/extraction
- exposed Tavily / Exa / Firecrawl API-key detection in live acquisition notes
- extended provider-preference aliases/defaults so optional providers can participate when enabled
- added regression coverage for provider auth, provider-preference routing, discovery-hit mapping, and Firecrawl-backed web fetch preference

Authority note:
- Discovery remains the front door
- external providers add evidence acquisition breadth only
- no route/adoption authority moved into Research Engine or the provider backends
