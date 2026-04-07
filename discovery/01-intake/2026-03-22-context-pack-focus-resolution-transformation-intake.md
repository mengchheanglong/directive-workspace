# Discovery Fast Path: Context Pack Focus Resolution Transformation

- Candidate id: `dw-transform-context-pack-focus-resolution`
- Candidate name: `Context Pack Focus Resolution Consolidation`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/context-pack-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - keep the context-pack assembly path clearer and easier to evolve without changing behavior`
- Capability gap id: `n/a`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- preserves the same context-pack behavior while reducing the size and branching complexity of a high-leverage host service
- makes it easier to evolve mission-conditioned focus behavior without re-editing one large host function
- supports the doctrine that Runtime should handle behavior-preserving transformations, not only new runtime adoption

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving maintainability transformation on a mission-relevant runtime-host surface`

## Bounded Claim

Extract quest/doc/graph focus-resolution logic, fallback document selection, and active-quest mapping out of `buildContextPack` without changing:
- `ContextPack` output shape
- focus selection behavior
- graph-context generation behavior
- prompt-generation inputs

## Proof Boundary Notes

- keep the change inside `context-pack-service.ts`
- do not change repository interfaces or `ContextPack` types
- validate with host-safe checks only

## Result Link

- Runtime record: `runtime/legacy-records/2026-03-22-context-pack-focus-resolution-transformation-record.md`
