# Discovery Fast Path: Context Pack Doc Ranking Transformation

- Candidate id: `dw-transform-context-pack-doc-ranking`
- Candidate name: `Context Pack Doc Ranking Indexing`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/context-pack-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce quest-focus doc ranking CPU cost inside context-pack assembly`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- reduces the CPU cost of quest-focus document ranking without changing the returned `ContextPack`
- strengthens the behavior-preserving transformation lane with a real data-path optimization on a mission-relevant host surface
- keeps the context-pack path cheaper as the document and quest set grows

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Replace legacy full-sort quest-goal document ranking with a preindexed top-N ranking path inside `context-pack-service.ts` without changing:
- `ContextPack` output shape
- ranking score semantics
- ranking tie-break order
- graph-context selection behavior for the chosen ranked focus document

## Proof Boundary Notes

- keep the change inside `context-pack-service.ts`
- do not change repository interfaces or `ContextPack` types
- benchmark both the legacy and indexed ranking paths against the real control-plane docs and quests

## Result Link

- Runtime record: `runtime/records/2026-03-22-context-pack-doc-ranking-transformation-record.md`
