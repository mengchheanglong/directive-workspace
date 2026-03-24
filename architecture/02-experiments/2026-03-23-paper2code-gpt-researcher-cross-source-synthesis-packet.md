# Cross-Source Synthesis Packet

## Packet identity

- Packet id: `paper2code-gpt-researcher-stage-evidence-synthesis-2026-03-23`
- Packet date: `2026-03-23`
- Source slice ref: `architecture/02-experiments/2026-03-23-paper2code-gpt-researcher-packet-reuse-adaptation.md`

## Source set

- Sources compared:
  - `sources/intake/Paper2Code/README.md`
  - `sources/intake/gpt-researcher/README.md`
- Synthesis question: how should Directive Workspace preserve the combined value of stage progression and evidence/citation/proof discipline as reusable Architecture value without reopening both source families?
- Shared pattern: staged work should not advance without typed artifacts, and those artifacts should remain coupled to explicit evidence/citation/proof support

## Agreements and tensions

- Key agreements:
  - both source families rely on structured multi-stage progression rather than one-shot generation
  - both require explicit intermediate artifacts to preserve quality
  - both treat partial or imperfect upstream output as something to manage explicitly rather than ignore
- Key tensions or contradictions:
  - Paper2Code is stage-first and implementation-oriented, while GPT Researcher is evidence-first and research-oriented
  - Paper2Code’s default outcome is repository generation, while GPT Researcher’s default outcome is report synthesis
- Excluded baggage:
  - runtime code generation
  - web/local research execution stack
  - provider/configuration/runtime deployment details

## Directive synthesis

- Directive synthesis: the retained Architecture value is an evidence-backed stage synthesis in which stage artifacts, evidence artifacts, citation artifacts, and proof support are treated as one reusable operating bundle rather than separate historical extractions
- Product-owned artifacts created:
  - `shared/schemas/intake-normalized-artifact.schema.json`
  - `shared/schemas/analysis-plan-artifact.schema.json`
  - `shared/schemas/experiment-design-artifact.schema.json`
  - `shared/schemas/integration-contract-artifact.schema.json`
  - `shared/schemas/proof-checklist-artifact.schema.json`
  - `shared/schemas/analysis-evidence-artifact.schema.json`
  - `shared/schemas/citation-set-artifact.schema.json`
  - `shared/schemas/evaluation-support-artifact.schema.json`
  - `shared/contracts/integration-proof-template-generator.md`
- Reuse targets:
  - future multi-source Architecture slices dealing with staged artifact families
  - source-driven Architecture work that mixes stage-boundary logic with evidence-quality logic

## Classification

- Usefulness level: `meta`
- Meta-usefulness: `yes`
- Meta-usefulness category: `adaptation_quality`
