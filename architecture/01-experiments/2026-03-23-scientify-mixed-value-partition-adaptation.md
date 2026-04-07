# Adaptation Decision - Scientify Mixed-Value Partition

Date: 2026-03-23
Track: Architecture
Type: mixed-value source adaptation

## Source reference

- Source id: `scientify-mixed-value-partition`
- Analysis record ref: `architecture/01-experiments/2026-03-23-scientify-mixed-value-partition-source-analysis.md`
- Decision date: `2026-03-23`

## Extraction decisions

### Mechanism: mixed-value-source-partition

- Extraction decision: `extract`
- Extraction rationale: Architecture needs an explicit way to partition mixed-value sources into reused packet value, fresh re-analysis value, retained Architecture value, and Runtime candidates.
- Raw form summary: Scientify combines staged evidence-backed research workflow value with plugin runtime, scheduled jobs, delivery channels, and execution stack behavior.
- Target artifact type:
  - `contract`
  - `template`
  - `schema`
- Target path:
  - `shared/contracts/mixed-value-source-partition.md`
  - `shared/templates/mixed-value-source-partition.md`
  - `shared/schemas/mixed-value-source-partition.schema.json`

## Adaptation decisions

### Mechanism: mixed-value-source-partition

- Adaptation required: `yes`
- Adaptation description: convert the mixed Scientify source into a Directive-owned split surface that reuses the existing stage/evidence packet where valid and forces explicit source re-analysis for the remaining runtime/plugin surfaces.
- Adaptation actions:
  - structural reshape
  - extension
  - constraint addition
  - recomposition with existing assets
- Adaptation validates against:
  - `shared/contracts/source-analysis-contract.md`
  - `shared/contracts/architecture-to-runtime.md`
  - `shared/contracts/architecture-adoption-criteria.md`
  - `architecture/01-experiments/2026-03-23-paper2code-gpt-researcher-mechanism-packet.md`
  - `architecture/01-experiments/2026-03-23-paper2code-gpt-researcher-cross-source-synthesis-packet.md`
- Original vs adapted delta: instead of leaving the mixed source split as an informal judgment, the adapted form makes packet reuse scope, fresh re-analysis scope, Architecture-retained mechanisms, Runtime candidates, and excluded baggage explicit.

## Improvement decisions

### Mechanism: mixed-value-source-partition

- Improvement applied: `yes`
- Improvement description: make partial packet coverage a first-class Architecture concept instead of a hidden exception.
- Improvement type: `quality`
- Improvement rationale: the system gets better when ambiguous sources can reuse retained packet value without pretending that packet reuse removes the need for fresh source judgment.
- Improvement evidence plan: verify the contract is integrated into workflow, source-analysis, adoption, and Architecture-to-Runtime logic.
- Original vs improved delta: the improved form gives Directive Workspace a reusable partition mechanism for ambiguous sources instead of a one-off Scientify judgment.

## Integration target

- Integration surface:
  - `shared/contracts`
  - `shared/templates`
  - `shared/schemas`
  - `knowledge`
  - `architecture/03-adopted`
- Runtime handoff required: `yes`
- Runtime handoff ref: `architecture/02-adopted/2026-03-23-scientify-literature-monitoring-runtime-handoff.md`

## Meta-usefulness check

- Improves source consumption: `yes`
- Meta-usefulness description: this slice improves Directive Workspace's ability to process ambiguous mixed-value sources by standardizing how packet reuse, fresh re-analysis, Architecture retention, and later Runtime candidates are separated.
- Self-improvement category: `routing_quality`

## Decision summary

- Overall adaptation quality: `strong`
- Overall improvement quality: `strong`
- Confidence: `high`
- Next action: `proceed_to_proof`

