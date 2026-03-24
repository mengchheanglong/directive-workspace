# Cross-Source Theory/Paper Patterns (Wave 01)

Date: 2026-03-20
Owner: Directive Architecture
Origin route:
- `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\routing-log\2026-03-20-cross-source-wave-01-routing.md`

## Purpose

Capture reusable architecture patterns extracted from non-repo sources without importing runtime stacks.

## Extracted Patterns

### 1) PaperCoder stage-contract model (`dw-src-papercoder-paper`)

- Extracted value:
  - explicit stage boundaries (`planning -> analysis -> generation`)
  - typed handoff expectation per stage
  - fail-fast behavior on missing stage outputs
- Directive mapping:
  - strengthen lifecycle artifact contracts between intake, analysis, experiment design, and integration proof stages
- Adoption form:
  - architectural pattern + interface contract

### 2) Karpathy autoresearch loop discipline (`dw-src-karpathy-autoresearch`)

- Extracted value:
  - constraint-first and metric-first loop design
  - bounded iteration with keep/discard decisions
  - explicit stop criteria to prevent runaway optimization
- Directive mapping:
  - standardize bounded-slice runbooks and proof artifacts in Forge and Architecture
- Adoption form:
  - workflow rule + evaluation method

### 3) RAG architecture patterns (`dw-src-rag-architecture`)

- Extracted value:
  - retrieval + evidence + citation coupling
  - observability for research pipelines
  - explicit source-quality handling for partial results
- Directive mapping:
  - reinforce evidence/citation artifact contracts for analysis/evaluation phases
- Adoption form:
  - design principle + interface contract

## Explicit Exclusions

- no direct runtime/framework import from source papers/theory
- no callable surface creation in this extraction step
- no bypass of Discovery routing decisions

## Next Action

If a concrete contract gap is identified, open a bounded Architecture slice in `02-experiments` with explicit rollback and gate validation.

Executed bounded slice:
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-20-cross-source-contract-delta-slice-01.md`
- output contract:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-stage-evidence-citation-handoff-contract.md`
