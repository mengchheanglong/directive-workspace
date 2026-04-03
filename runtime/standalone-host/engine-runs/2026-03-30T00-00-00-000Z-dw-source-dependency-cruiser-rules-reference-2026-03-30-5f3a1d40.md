# Directive Engine Run

- Run ID: `5f3a1d40-9b71-4c7a-a6db-2f9f18ea5bf2`
- Received At: `2026-03-30T00:00:00.000Z`
- Candidate ID: `dw-source-dependency-cruiser-rules-reference-2026-03-30`
- Candidate Name: dependency-cruiser Rules Reference
- Source Type: `product-doc`
- Source Ref: `https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md`
- Selected Lane: `architecture`
- Usefulness Level: `structural`
- Decision State: `accept_for_architecture`
- Integration Mode: `adapt`
- Proof Kind: `architecture_validation`
- Run Record Path: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.json`

## Mission Fit

Assess whether dependency-cruiser's narrow forbidden-rule surface can truthfully protect the canonical dw-state facade and private implementation split without opening repo-wide linting or dependency-policy work.

## Usefulness Rationale

Structural usefulness: the source offers a bounded mechanism for preserving Engine-owned facade/private boundaries around the canonical dw-state read surface.

## Report Summary

Sync the accept_for_architecture decision and bounded dw-state facade-boundary evaluation into Directive Workspace reporting surfaces.

## Routing Rationale

- Matched open gap `gap-directive-engine-materialization` (rank 1) as the closest current mission pressure.
- Recommended architecture because the source offers one bounded Engine-structure boundary rule rather than reusable runtime capability.
- Current repo truth already points at a canonical facade/private split around `shared/lib/dw-state.ts`, which makes this a structural Architecture question.
- Split-case is recommended because the proposed boundary must be validated against the actual repo import graph before any rule proposal is retained.

## Next Action

Record one bounded Architecture result that either materializes the single dw-state facade-boundary proposal or stops because the requested boundary is false in current repo truth.
