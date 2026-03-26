# Discovery Fast Path: Context Pack Async Latency Transformation

- Candidate id: `dw-transform-context-pack-async-latency`
- Candidate name: `Context Pack Async Surface Concurrency`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/context-pack-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce context-pack latency by overlapping independent async surfaces`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- reduces context-pack wall-clock latency without changing the `ContextPack` contract
- strengthens the behavior-preserving transformation lane with a real runtime-latency slice, not only maintainability slices
- prepares for larger latency gains when both codegraph and automation integrations are fully active

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Run the bounded codegraph summary and n8n automation snapshot collection concurrently inside `buildContextPack` without changing:
- `ContextPack` output shape
- codegraph summary gating behavior
- automation snapshot behavior
- ordering of subsequent sync context assembly

## Proof Boundary Notes

- keep the change inside `context-pack-service.ts`
- do not change repository interfaces or `ContextPack` types
- benchmark the real service calls using the control-plane project

## Result Link

- Runtime record: `runtime/records/2026-03-22-context-pack-async-latency-transformation-record.md`
