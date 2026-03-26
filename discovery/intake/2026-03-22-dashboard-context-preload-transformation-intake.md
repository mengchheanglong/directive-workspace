# Discovery Fast Path: Dashboard Context Preload Transformation

- Candidate id: `dw-transform-dashboard-context-preload`
- Candidate name: `Dashboard Context Preload Transformation`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-context-writer.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - remove repeated context-surface loads from dashboard context-file generation`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- removes repeated reads and recomputation across summary, overview, full, readiness, and repo-snapshot context generation
- speeds up a real operator-facing context artifact path without changing the written outputs
- strengthens the behavior-preserving transformation lane with a measured multi-surface preload/reuse slice

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host path`

## Bounded Claim

Allow `writeDashboardContextFiles` to load shared context surfaces once and reuse them across:
- summary context-pack generation
- overview context-pack generation
- full context-pack generation
- workspace readiness generation
- repo snapshot generation

without changing:
- generated context file content
- `ContextPack` behavior
- `WorkspaceReadiness` behavior
- repo snapshot behavior

## Proof Boundary Notes

- keep the change inside `context-pack-service.ts`, `workspace-context-writer.ts`, and a dedicated benchmark script
- preserve the legacy distinction between quest scope used by `buildContextPack` and quest scope used by standalone readiness scoring
- benchmark the full dashboard context bundle path against the preloaded-reuse path on the real control-plane project

## Result Link

- Runtime record: `runtime/records/2026-03-22-dashboard-context-preload-transformation-record.md`
