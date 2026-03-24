# Accepted Implementation Bundle 35: Forge System-First Reprioritization

Date: 2026-03-21
Owner: Directive Discovery -> Directive Forge
Decision state: `route_to_forge_follow_up`
Adoption target: `Directive Forge follow-up`
Status: accepted

## Decision

Reprioritize Forge Wave 01 so system cleanup, activation hardening, and host-boundary hygiene happen before additional runtime candidate expansion.

## Why

- Promptfoo already proved one bounded Forge runtime lane.
- That proof exposed remaining Forge system debt:
  - source-pack activation must be strict
  - mirror/package boundaries are still deferred and should be inventoried before widening runtime use
  - Forge now has more than one promotion-profile family and should normalize that surface before opening broader callable paths

## Immediate consequence

- keep `promptfoo` as the completed Wave 01 anchor slice
- move Forge system bundles ahead of:
  - `al-tooling-puppeteer`
  - `al-tooling-skills-manager`
  - `al-tooling-agent-orchestrator`

## Bundle 01 outcome

Completed in this reprioritization slice:
- Mission Control runtime source-pack resolvers now require `SOURCE_PACK_READY.md`
- catalog/listing paths remain informational and no longer imply activation
- host validation now includes `npm run check:directive-source-pack-readiness`

## Next active Forge work

Forge System Bundle 02: mirror and package boundary inventory

## Validation hooks

- `npm run check:directive-source-pack-readiness`
- `npm run check:ops-stack`
- `npm run directive:sync:reports`
- `npm run check:directive-workspace-report-sync`
