# Contributing To Directive Workspace

Directive Workspace is a product with strict boundaries.

Governing doctrine comes first from:
- `C:\Users\User\.openclaw\workspace\CLAUDE.md`
- `C:\Users\User\.openclaw\workspace\.claude\skills\directive-workspace-doctrine\SKILL.md`
- `C:\Users\User\.openclaw\workspace\.claude\skills\directive-workspace-audit\SKILL.md`

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
- `npm --prefix C:\\Users\\User\\.openclaw\\workspace\\mission-control run typecheck`
- `npm --prefix C:\\Users\\User\\.openclaw\\workspace\\mission-control run build`
- `npm --prefix C:\\Users\\User\\.openclaw\\workspace\\mission-control run check:ops-stack`

When changes are docs-only inside Directive Workspace:
- keep doctrine, ownership, execution plan, and migration state aligned

## Canonical References

- [README.md](C:/Users/User/.openclaw/workspace/directive-workspace/README.md)
- [OWNERSHIP.md](C:/Users/User/.openclaw/workspace/directive-workspace/OWNERSHIP.md)
- [doctrine.md](C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/doctrine.md)
- [execution-plan.md](C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/execution-plan.md)
- [decision-states.md](C:/Users/User/.openclaw/workspace/directive-workspace/shared/decision-states.md)
- [adoption-targets.md](C:/Users/User/.openclaw/workspace/directive-workspace/shared/adoption-targets.md)
