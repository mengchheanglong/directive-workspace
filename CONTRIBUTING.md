# Contributing To Directive Workspace

Directive Workspace is a product with strict boundaries.

Governing doctrine comes first from:
- `CLAUDE.md`
- `OWNERSHIP.md`
- `knowledge/doctrine.md`

If adjacent OpenClaw workspace doctrine helpers are used during incubation, treat them as external environment aids rather than as ownership of the product root.
Use the local Directive Workspace docs only insofar as they stay aligned with those governing sources.

Contributors should optimize for:
- clear ownership
- bounded change scope
- explicit decisions
- evidence-backed updates
- no blind external adoption
- mission-relevant usefulness

## Core Rules

1. Do not collapse product and host.
Directive Workspace is the product. Mission Control is a host.

2. Route by adoption target, not by source type.
The same repo, paper, or product doc may belong in Runtime or Architecture depending on the value being extracted.

3. Discovery is the front door.
New candidates should enter through Discovery intake/triage/routing before deeper downstream work.

4. Do not treat external work as runtime truth.
External repos, papers, products, and patterns are capability references and reverse-engineering targets.

5. Prefer adaptation over absorption.
Extract the useful mechanism, pattern, interface, workflow, or contract. Avoid importing unnecessary runtime baggage.

6. Keep runtime changes host-aware.
If work changes runtime behavior, it belongs in the host path and must respect host verification gates.

## Expected Change Types

Appropriate:
- doctrine updates
- track-boundary clarifications
- shared contract/schema/template updates
- Discovery intake/routing improvements
- Architecture experiment records and adopted-pattern records
- Runtime product-level records and core host-agnostic logic

Not appropriate without explicit approval:
- broad rewrites
- blind framework imports
- moving host runtime code out of Mission Control in one shot
- changing release boundary language to imply standalone runtime support that does not exist

## Required Verification

When changes affect Mission Control integration:
- run `npm run typecheck` from the current Mission Control root
- run `npm run build` from the current Mission Control root
- run `npm run check:ops-stack` from the current Mission Control root

When changes are docs-only inside Directive Workspace:
- keep doctrine, ownership, execution plan, and migration state aligned

## Canonical References

- [README.md](./README.md)
- [OWNERSHIP.md](./OWNERSHIP.md)
- [doctrine.md](./knowledge/doctrine.md)
- [execution-plan.md](./knowledge/execution-plan.md)
- [decision-states.md](./shared/decision-states.md)
- [adoption-targets.md](./shared/adoption-targets.md)
