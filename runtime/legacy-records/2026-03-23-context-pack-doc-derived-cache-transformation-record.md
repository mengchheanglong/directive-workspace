# Transformation Record: Context Pack Doc Derived Cache Transformation

- Candidate id: `dw-transform-context-pack-doc-derived-cache`
- Candidate name: `Context Pack Doc Derived Cache Transformation`
- Record date: `2026-03-23`
- Transformation type: `speed`
- Discovery intake path: `discovery/01-intake/2026-03-23-context-pack-doc-derived-cache-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/context-pack-service.ts`
- Current implementation: repeated context-pack reads rebuilt the same doc-derived surfaces (docs map, search index, link map, graph data, and doc-analysis result) on every call even when the document set was unchanged.
- Measured baseline:
  - metric: `context pack doc derived prep wall-clock ms`
  - value: `0.30`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-doc-derived-cache.ts 5`, clearing the derived-doc cache before every run

## After State

- Proposed change: add a short-lived derived-doc-context cache keyed by user/project and doc signature, then reuse the derived surfaces across repeated context-pack work until the doc set changes.
- Preservation claim: docs-by-id, search index, unresolved-map counts, and graph-analysis node counts remain identical; only repeated derivation work is removed when the document set is unchanged.
- Expected improvement:
  - metric: `context pack doc derived prep wall-clock ms`
  - target value: `0.01`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-doc-derived-cache.ts 5`, timing the warmed derived-doc path after one cache-populating call

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-context-pack-doc-derived-cache.ts 5 && npx tsx ./scripts/benchmark-context-pack-phases.ts 5 && npm run directive:sync:reports && npm run check:directive-workspace-report-sync`
- Comparison mode: `before-after`
- Baseline artifact path: `runtime/legacy-records/2026-03-23-context-pack-doc-derived-cache-transformation-proof.json`
- Result artifact path: `runtime/legacy-records/2026-03-23-context-pack-doc-derived-cache-transformation-proof.json`

## Proof

- Correctness preserved: `yes - cached derived-doc context matched the uncached docsById/docSearchIndex/unresolvedMap/docAnalysis counts on the real control-plane project`
- Metric improvement measured: `yes - 0.30ms -> 0.00ms average (-0.30ms, -99.1%) across 5 real control-plane runs`
- Secondary signal: `benchmark-context-pack-phases.ts` kept graph-prep work in the sub-millisecond range while the broader warmed context-pack path stayed unchanged in behavior`
- Rollback path: `remove the derived-doc-context cache and helper exports from mission-control/src/server/services/context-pack-service.ts, remove mission-control/scripts/benchmark-context-pack-doc-derived-cache.ts if undesired, and remove the new Discovery / Runtime transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Runtime`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - reduce repeated document-graph prep work in context-pack assembly`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
