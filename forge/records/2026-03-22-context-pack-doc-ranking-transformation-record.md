# Transformation Record: Context Pack Doc Ranking Indexing

- Candidate id: `dw-transform-context-pack-doc-ranking`
- Candidate name: `Context Pack Doc Ranking Indexing`
- Record date: `2026-03-22`
- Transformation type: `speed`
- Discovery intake path: `discovery/intake/2026-03-22-context-pack-doc-ranking-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/context-pack-service.ts`
- Current implementation: quest-focus doc ranking rebuilt lowercase title/tag/body search surfaces for every document scored, retokenized the quest query inside each score call, and fully sorted all scored docs before slicing the requested limit.
- Measured baseline:
  - metric: `context-pack doc ranking wall-clock ms`
  - value: `0.78`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-doc-ranking.ts 5`, with the legacy ranking algorithm evaluated across 12 real control-plane queries and 6 visible docs per run

## After State

- Proposed change: keep a preindexed search surface per document, score against one tokenized query per ranking pass, and maintain only the bounded top-N entries instead of sorting the full scored set.
- Preservation claim: quest-focus relevant-doc ordering, score semantics, ranking tie-breaks, and resulting graph-context behavior remain identical to the legacy ranking path.
- Expected improvement:
  - metric: `context-pack doc ranking wall-clock ms`
  - target value: `0.28`
  - measurement method: average across 5 real control-plane runs using `npx tsx ./scripts/benchmark-context-pack-doc-ranking.ts 5`, with the indexed top-N ranking path evaluated across the same 12 real control-plane queries and 6 visible docs per run

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:directive-transformation-proof && npx tsx ./scripts/benchmark-context-pack-doc-ranking.ts 5 && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-22-context-pack-doc-ranking-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-22-context-pack-doc-ranking-transformation-proof.json`

## Proof

- Correctness preserved: `yes - the benchmark compares legacy and indexed ranking outputs across the real query set and reports zero mismatches`
- Metric improvement measured: `yes - 0.78ms -> 0.28ms average (-0.50ms, -63.8%) across 5 real control-plane runs`
- Rollback path: `revert the quest-focus ranking helpers in mission-control/src/server/services/context-pack-service.ts, remove mission-control/scripts/benchmark-context-pack-doc-ranking.ts if undesired, and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - keep context-pack assembly faster under growing quest/doc load`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
