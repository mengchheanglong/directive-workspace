# Runtime System Bundle 03: Source-Pack Catalog and Activation Cleanup

Date: 2026-03-21
Owner: Directive Runtime
Status: completed
Decision state: `route_to_runtime_follow_up`
Adoption target: `Directive Runtime follow-up`

## Purpose

Remove remaining ambiguity between:
- live runtime packs
- follow-up-only packs
- reference-only packs

## Problem

`SOURCE_PACK_READY.md` alone became too weak as an activation signal because all retained packs now carry the marker.

That made cutover-complete packs easy to misread as active runtime truth.

## Decision

Canonical source-pack state now lives in:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\source-packs\CATALOG.json`

Runtime activation rule is now:
- `SOURCE_PACK_READY.md` means cutover-complete
- actual live runtime requires:
  - `classification = live_runtime` in the catalog
  - `SOURCE_PACK_READY.md` present

## Live runtime packs

- `agency-agents`
- `desloppify`
- `promptfoo`

## Follow-up-only packs

- `agent-orchestrator`
- `arscontexta`
- `puppeteer`
- `skills-manager`
- `software-design-philosophy-skill`
- `superpowers`

## Reference-only packs

- `celtrix`
- `impeccable`
- `scripts`

## Host cleanup outcome

- Mission Control source-pack tooling catalog now reads from the canonical Runtime catalog
- runtime path resolvers no longer treat readiness alone as activation truth
- host validation now checks that catalog classification matches real pack directories and activation expectations

## Next active work

Runtime System Bundle 04: promotion-profile family normalization
