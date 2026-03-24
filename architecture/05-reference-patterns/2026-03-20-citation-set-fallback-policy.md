# Citation Set Fallback Policy

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control host checks

## Objective

Harden `CitationSetArtifact` behavior by enforcing URL validity, deterministic dedupe, and fallback synthesis from `visited_urls` when explicit citations are missing.

## Policy

1. Treat citation entries as valid only when URL-normalizable to `http/https`.
2. Deduplicate citations by normalized URL key.
3. Allow fallback synthesis from `visited_urls` only when explicit citations are absent/invalid.
4. Keep explicit wording: fallback synthesis from visited_urls is allowed only under the missing/invalid citation condition.
5. Mark fallback-only citation sets as `coverage_status=partial`.
6. Keep `coverage_status=missing` when no valid citation source exists.

## Validation Hooks

- `npm run check:directive-citation-contracts`
- `npm run check:directive-v0`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

## Rollback

- remove citation URL normalization + dedupe + synthesis behavior in host lifecycle artifact builder
- remove citation contract and this policy
- remove citation contract check and ops-stack wiring
