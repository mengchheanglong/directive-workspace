# Adopted: CodeGraphContext Wave 02 (2026-03-21)

## decision
- **Adopt (completed current-slice closure)** for extracted Architecture mechanisms only.
- Do **not** adopt the full CodeGraphContext runtime stack into Directive Workspace or Mission Control.

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\CodeGraphContext`
- Source lane: retired `agent-lab` extraction path

## adopted extracted patterns
1. explicit separation between index stage and query stage
2. product-owned `index_state` vocabulary
3. degraded query disclosure when index data is missing, stale, or partial

## rationale
- the existing reference-pattern slice preserved real value, but left it at note level
- the surviving mechanism is reusable across code-understanding and structural-analysis surfaces
- full runtime adoption would import unnecessary storage/runtime baggage

## closure result
1. Added product-owned shared contract:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\index-query-state-boundary.md`
2. Added Architecture closure policy note:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-codegraphcontext-state-boundary-policy.md`
3. Added host-side completeness check:
   - `npm run check:directive-codegraphcontext-contracts`

Status class:
- `product_materialized`

## rollback
- delete this note and corresponding closure slice
- remove the shared contract and closure policy note
- no runtime rollback required
