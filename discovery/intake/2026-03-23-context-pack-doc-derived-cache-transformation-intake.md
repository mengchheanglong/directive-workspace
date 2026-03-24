# Discovery Fast Path: Context Pack Doc Derived Cache Transformation

- Candidate id: `dw-transform-context-pack-doc-derived-cache`
- Candidate name: `Context Pack Doc Derived Cache Transformation`
- Date: `2026-03-23`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/context-pack-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce repeated doc-derived graph prep in context-pack assembly`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Forge transformation candidate.

Useful value:
- removes repeated doc-derived prep work from context-pack assembly when the doc set has not changed
- preserves docs-by-id, search index, link map, graph data, and graph analysis outputs exactly
- strengthens the behavior-preserving transformation lane on a core host context surface

## Routing Decision

- Primary adoption target: `Directive Forge`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Add a short-lived derived-doc-context cache for:
- `docsById`
- `docSearchIndex`
- `docLinksById`
- `graphData`
- `docAnalysis`

without changing:
- document ids or ordering
- graph connectivity interpretation
- focus resolution behavior
- context-pack shape

## Proof Boundary Notes

- keep the change inside `context-pack-service.ts` plus a dedicated benchmark
- preserve parity on derived graph counts for the control-plane project
- treat the broad context-pack phase benchmark only as a secondary signal

## Result Link

- Forge record: `forge/records/2026-03-23-context-pack-doc-derived-cache-transformation-record.md`
