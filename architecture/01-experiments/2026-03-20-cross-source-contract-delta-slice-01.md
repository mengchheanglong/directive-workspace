# Cross-Source Contract Delta Slice 01

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture
Status: executed

## Objective

Convert cross-source paper/theory extraction into one concrete architecture contract that tightens lifecycle handoff quality across stage, evidence, and citation boundaries.

## Scope

In:
- stage handoff contract between intake -> analysis -> experiment -> integration/proof
- evidence/citation minimum fields and fallback behavior
- explicit fail-closed vs degrade-to-partial rule

Out:
- runtime/callable surface creation
- host API/schema changes
- external framework/runtime adoption

## Dependencies

- `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\routing-log\2026-03-20-cross-source-wave-01-routing.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-cross-source-theory-paper-patterns.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-paper2code-directive-architecture-adopted-planned-next.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-gpt-researcher-directive-architecture-adopted-planned-next.md`

## Execution Steps

1. Merge stage-contract patterns (PaperCoder) with evidence/citation contract patterns (gpt-researcher).
2. Define minimum artifact fields for each handoff stage.
3. Define fallback/degrade rules for partial evidence and missing citations.
4. Define deterministic validation hooks for Architecture and Runtime checks.
5. Record execution and gate evidence.

## Required Output Artifact

- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-stage-evidence-citation-handoff-contract.md`

## Commands run (ordered)

1. `Get-Content -Raw C:\Users\User\.openclaw\workspace\directive-workspace\discovery\routing-log\2026-03-20-cross-source-wave-01-routing.md`
2. `Get-Content -Raw C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-cross-source-theory-paper-patterns.md`
3. `Get-Content -Raw C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-paper2code-directive-architecture-adopted-planned-next.md`
4. `Get-Content -Raw C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-gpt-researcher-directive-architecture-adopted-planned-next.md`
5. `npm run check:directive-runtime-records` (mission-control)
6. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- routing source loaded: `cross-source-wave-01-routing`
- reference pattern source loaded: `cross-source-theory-paper-patterns`
- adopted contract baselines loaded: `paper2code` + `gpt-researcher`
- `check:directive-runtime-records` -> PASS
- `check:ops-stack` -> PASS

## Validation Gates

- `npm run check:directive-runtime-records`
- `npm run check:ops-stack`

## Rollback / No-op

- remove the output contract artifact and this slice record only.
- keep cross-source intake/triage/routing artifacts unchanged.
