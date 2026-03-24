# Adopted: Hermes Wave 02 (2026-03-21)

## decision
- **Adopt (completed current-slice closure)** for extracted Architecture mechanisms only.
- Do **not** adopt Hermes runtime, memory stack, or multi-surface platform.

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\hermes-agent`
- Source lane: retired `agent-lab` extraction path

## adopted extracted patterns
1. explicit compaction-fidelity boundary
2. non-lossy required retained field set for compacted handoffs
3. explicit bypass semantics when compaction confidence is low

## rationale
- the existing Architecture note preserved the idea, but left it at prose-only contract level
- the surviving value is reusable across Discovery and Architecture handoff records
- broader Hermes adoption would import unnecessary platform complexity

## closure result
1. Added product-owned shared contract:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\context-compaction-fidelity.md`
2. Bound the contract into shared handoff templates:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\decision-record.md`
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\routing-record.md`
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\discovery-fast-path-record.md`
3. Added Architecture closure policy note:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-hermes-compaction-fidelity-policy.md`
4. Added host-side completeness check:
   - `npm run check:directive-hermes-contracts`

Status class:
- `product_materialized`

## rollback
- delete this note and corresponding closure slice
- remove the shared contract and template field additions
- no runtime rollback required

## Normalization annotation (retroactive, 2026-03-22)

Added by corpus normalization program. This record predates the source-adaptation contracts and is exempt from retroactive rewrite per `architecture-artifact-lifecycle` contract.

### Lifecycle classification

- Origin: `source-driven` (hermes-agent)
- Usefulness level: `structural` — compaction-fidelity boundary improves Directive's handoff quality across Discovery and Architecture
- Status class: `product_materialized` — shared contract + template bindings + reference pattern + host check
- Forge threshold check: yes — compaction-fidelity rules are valuable without a runtime surface

### Contract coverage assessment

- Source analysis: not performed (pre-doctrine)
- Adaptation decision: implicit. The record correctly identifies adopted patterns (compaction boundary, retained field set, bypass semantics) vs excluded baggage (runtime, memory stack, platform)
- Adoption criteria: not applied
- Adaptation quality: `strong` — the adopted form (shared contract bound into templates) is cleanly Directive-native. The compaction-fidelity contract is a new Directive concept, not an upstream mirror
- Improvement quality: `adequate` — bypass semantics (when compaction confidence is low, skip compaction) is a Directive-specific improvement over the original Hermes approach
