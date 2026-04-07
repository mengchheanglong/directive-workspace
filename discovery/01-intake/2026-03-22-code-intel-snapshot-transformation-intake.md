# Discovery Fast Path: Code Intel Snapshot Transformation

- Candidate id: `dw-transform-code-intel-snapshot-consolidation`
- Candidate name: `Code Intel Snapshot Consolidation`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - keep code-intelligence readiness evaluation clearer and easier to evolve without changing detection behavior`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- preserves the same code-intel detection behavior while reducing the size and duplication of a host evaluator
- makes it easier to evolve supported language-server probes without repeating the same status/detail/suggestion pattern inline
- strengthens the doctrine that Runtime should handle behavior-preserving transformations on mission-relevant host surfaces

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving maintainability transformation on a mission-relevant runtime-host surface`

## Bounded Claim

Extract repeated TypeScript, Python, Go, and Rust language-probe logic out of `collectCodeIntelSnapshot` without changing:
- `RepoCodeIntelSnapshot` shape
- per-language detection rules
- per-language runtime/config signals
- generated suggestions, statuses, or details
- override merge behavior

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts`
- do not change repository interfaces or `RepoCodeIntelSnapshot` types
- validate with host-safe checks only

## Result Link

- Runtime record: `runtime/legacy-records/2026-03-22-code-intel-snapshot-transformation-record.md`
