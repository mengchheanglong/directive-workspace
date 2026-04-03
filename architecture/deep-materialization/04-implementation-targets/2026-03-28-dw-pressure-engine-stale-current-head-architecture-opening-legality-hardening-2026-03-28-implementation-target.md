# Implementation Target: Stale Current-Head Architecture Opening Legality Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Architecture Opening Legality Hardening

## planned slice
- Extend the existing stale-current-head downgrade rule to `architecture_handoff` and `architecture_bounded_start`.
- Add focused composition assertions for those two artifact families.

## proof expectations
- Focused reports show currentHead redirects for the stale opening surfaces.
- Global checks stay clean.
