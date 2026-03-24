# CodeGraphContext Reanalysis Bundle 01

Date: 2026-03-20
Track: Directive Architecture
Type: bounded reanalysis slice
Candidate id: `al-parked-codegraphcontext`
Decision state: `experiment`

## Baseline

Existing reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-codegraphcontext-analysis-patterns.md`

Baseline stance:
- keep as reference pattern
- avoid full runtime graph stack adoption

## New Value vs Existing Extraction

New in this reanalysis:
- move from passive reference to explicit bounded experiment request
- define a focused extraction target: indexing/query separation contract for Directive analysis surfaces
- require measurable acceptance criteria instead of open-ended pattern notes

No change:
- still no direct runtime/MCP package import
- still no heavy storage dependency adoption

## Bounded Experiment Definition

Objective:
- specify an Architecture contract for code-understanding workflows that separates:
  - local indexing stage
  - query/reasoning stage

Acceptance criteria:
- one contract artifact exists under Architecture reference/patterns
- contract includes failure and fallback behavior when index is missing/stale
- contract is validated as documentation-only (no runtime coupling)

Risk:
- medium (risk of over-designing beyond current workflow needs)

Rollback:
- keep existing reference-only pattern and close as no-op

Validation gates:
- `npm run check:directive-v0`
- `npm run check:ops-stack`
