# Architecture Wave 02 Shortlist

Date: 2026-03-21
Owner: Directive Architecture
Status: active
Cycle position: post-closure planning after current adopted-set completion

## Purpose

Open the next bounded Architecture wave without reopening already-closed current-cycle debt.

Wave 02 is limited to candidates that still have surviving Architecture value but remain mostly at reference-pattern level rather than product-owned shared contracts, schemas, templates, or reusable libraries.

## Selection Rule

A candidate qualifies for Wave 02 only if all of the following are true:
- Discovery routing is already explicit.
- The remaining work is still Architecture, not Forge runtime follow-up.
- The candidate adds a new internal mechanism family rather than duplicating the current closed set.
- The next slice can be bounded to one contract, template, schema family, or policy artifact set.

## Shortlist

### 1) `al-parked-codegraphcontext`
- Current state:
  - routed to Architecture
  - has reference-pattern outputs only
- Existing outputs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-codegraphcontext-analysis-patterns.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-codegraphcontext-index-query-contract.md`
- Why this is next:
  - introduces an internal index/query state boundary that is not yet normalized in shared product contracts
  - likely reusable across code-understanding, retrieval, and graph-backed analysis surfaces
- Proposed Architecture target:
  - product-owned shared contract for `index_state` disclosure and degraded query semantics
- Proposed first bounded slice:
  - convert the current reference contract into a shared contract with required state vocabulary and fallback rules

### 2) `al-parked-hermes-agent`
- Current state:
  - routed to Architecture with optional Forge follow-up
  - has reference-pattern outputs only
- Existing outputs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-hermes-agent-surviving-patterns.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-hermes-context-compaction-contract.md`
- Why this is next:
  - context-compaction fidelity remains a reusable internal handoff problem across Discovery, Architecture, and Forge
  - the current result is still mostly contract prose, not a shared reusable product artifact family
- Proposed Architecture target:
  - product-owned shared contract or schema-backed handoff fidelity profile for compaction/bypass behavior
- Proposed first bounded slice:
  - normalize retained-field rules and bypass semantics into a shared contract plus template/checklist linkage

### 3) `al-parked-impeccable`
- Current state:
  - routed to Architecture
  - has policy/reference outputs only
- Existing outputs:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-impeccable-frontend-guardrails.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-impeccable-review-policy.md`
- Why this is next:
  - review-policy language is useful, but still not normalized into a reusable review template or policy binding surface
  - low-risk candidate for turning architecture review guidance into a more enforceable internal artifact
- Proposed Architecture target:
  - shared Architecture review checklist/policy template with explicit state, gate, and rollback prompts
- Proposed first bounded slice:
  - convert the current policy into a reusable review template or checklist artifact rather than prose-only policy

## Not In Wave 02

### Cross-source theory candidates
- `dw-src-karpathy-autoresearch`
- `dw-src-rag-architecture`

Reason:
- their usable deltas have already been absorbed into the current Architecture cycle through the stage/evidence/citation contract family
- reopening them now would duplicate closed current-cycle value instead of adding a new mechanism family

### Holding-state Discovery items
- `dw-src-genetic-mutation`
- `dw-src-nanogpt-grokking`

Reason:
- still governed by Discovery monitor triggers
- not active Architecture execution targets

## Execution Order

1. `al-parked-codegraphcontext`
2. `al-parked-hermes-agent`
3. `al-parked-impeccable`

## Validation Rule

Default bundle for Wave 02 opening:
- `npm run check:directive-workflow-doctrine`
- `npm run directive:sync:reports`
- `npm run check:directive-workspace-report-sync`

Escalate to contract/host checks only when a candidate is converted from reference-pattern output into product-owned shared artifacts.

## Success Condition

Wave 02 is considered properly opened when:
- the shortlist is explicit
- order is explicit
- non-wave candidates are explicitly excluded
- the next Architecture slice can start from a single candidate without redoing routing
