# Adopted: Celtrix Wave 03 (2026-03-21)

## decision
- **Adopt (completed current-slice closure)** for extracted Architecture/Discovery mechanisms only.
- Do **not** adopt the Celtrix scaffolder runtime or generated templates.

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\Celtrix`
- Source lane: retired `agent-lab` extraction path

## adopted extracted patterns
1. explicit stack-signal capture at intake time
2. boilerplate-vs-product boundary at routing time
3. reusable stack-shaped routing hints for Discovery and Architecture

## rationale
- the existing Discovery notes preserved the right checklist, but left it as reference-only
- the surviving value is reusable across intake and triage surfaces
- broader Celtrix adoption would import scaffolder/runtime baggage with no product need

## closure result
1. Added product-owned shared contract:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\intake-stack-signals.md`
2. Bound the contract into Discovery templates:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\intake-record.md`
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\triage-record.md`
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\discovery-fast-path-record.md`
3. Added Architecture closure policy note:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-celtrix-stack-signal-policy.md`
4. Added host-side completeness check:
   - `npm run check:directive-celtrix-contracts`

Status class:
- `product_materialized`

## rollback
- delete this note and corresponding closure slice
- remove the shared contract and template field additions
- no runtime rollback required
