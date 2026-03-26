# Architecture Wave 04 Shortlist

Date: 2026-03-21
Owner: Directive Architecture
Status: completed
Cycle position: post-Wave-03 planning

## Purpose

Open the next bounded Architecture wave after Wave 03 closure.

Wave 04 should only open candidates that still hold surviving internal-structure value and are not already absorbed by the current shared contract surface.

## Selection Rule

A candidate qualifies for Wave 04 only if all of the following are true:
- Discovery routing is explicit.
- The remaining work is Architecture, not Runtime runtime follow-up.
- The candidate adds a reusable internal control or boundary rule not already represented in `shared/contracts`, `shared/templates`, or `shared/lib`.
- The next slice can be bounded to one product-owned contract, template, schema, or policy family.

## Active Wave 04 Candidate

### 1) `al-src-agent-lab-orchestration-allowlist`
- Current state:
  - surviving value exists only as source-map/reference guidance
  - the Runtime external run envelope is already extracted, but the curation/export allowlist boundary is not yet normalized as a product-owned Directive Workspace contract
- Existing outputs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\reference\2026-03-20-agent-lab-orchestration-source-map.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\agent-lab-extraction\AGENT_LAB_EXTRACTION_LEDGER.md`
- Why this is next:
  - it still adds internal governance value for how Directive Workspace treats imported source packs, curated exports, and permitted extraction surfaces
  - it is control-plane Architecture work, not a callable/runtime feature
  - it closes a remaining gap from the agent-lab retirement/extraction path without reopening runtime cutover scope
- Proposed Architecture target:
  - a shared curation/export allowlist contract plus a policy note defining what may be promoted, mirrored, exported, or kept reference-only from external source packs
- Proposed first bounded slice:
  - convert the surviving allowlist boundary into a product-owned shared contract and one supporting Architecture policy note

## Explicit Non-Selection

### `al-unclassified-plane`
- Reason:
  - trigger conditions remain unmet
  - still correctly governed as a knowledge-only monitor item

### `dw-src-genetic-mutation`
- Reason:
  - loop-failure and scientific-scope triggers remain unmet
  - still deferred by rule

### `dw-src-nanogpt-grokking`
- Reason:
  - scientific-research automation trigger remains unmet
  - still knowledge-only by rule

### `al-src-skills-manager`
- Reason:
  - surviving value routes to Runtime and Discovery, not Architecture
  - skill-root precedence and lifecycle handling are runtime/source-pack concerns first

### `al-src-tooling-scripts`
- Reason:
  - surviving value remains Discovery/Runtime operational discipline
  - no remaining Architecture-specific contract gap is strong enough to open a bounded slice now

### Closed prior-wave candidates
- `al-parked-codegraphcontext`
- `al-parked-hermes-agent`
- `al-parked-impeccable`
- `al-parked-celtrix`

Reason:
- already materialized in Directive Workspace for their respective waves

## Execution Order

1. `al-src-agent-lab-orchestration-allowlist`

## Validation Rule

Default bundle for Wave 04 opening:
- `npm run check:directive-workflow-doctrine`
- `npm run directive:sync:reports`
- `npm run check:directive-workspace-report-sync`

Escalate to shared-contract or host checks only when the allowlist boundary is converted from source-map/reference level into product-owned shared artifacts.

## Success Condition

Wave 04 is properly opened when:
- the one active candidate is explicit
- monitor-held candidates remain explicitly excluded
- Runtime-routed source-map items are not miscounted as Architecture work
- the next Architecture slice can start from the allowlist boundary without redoing routing

Completion note:
- Wave 04 was closed on `2026-03-21` by `2026-03-21-orchestration-allowlist-contract-closure-slice-20.md`
