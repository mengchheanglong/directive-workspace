# Adaptation Decision â€” Cross-Source Synthesis Packet

Date: 2026-03-23
Track: Architecture
Type: cross-source adaptation

## Source reference

- Source id: `cross-source-synthesis-packet`
- Analysis record ref: `architecture/01-experiments/2026-03-23-cross-source-synthesis-packet-source-analysis.md`
- Decision date: `2026-03-23`

## Extraction decisions

### Mechanism: cross-source-synthesis-packet

- Extraction decision: `extract`
- Extraction rationale: Directive Workspace needs a reusable packet for the value that appears between sources, not just inside one source.
- Raw form summary: one source argues that interleaving enables cross-source collision; the other shows structured extraction plus synthesis as the real value of research systems.
- Target artifact type: `contract`
- Target path: `shared/contracts/cross-source-synthesis-packet.md`

### Mechanism: cross-source-synthesis-packet-template

- Extraction decision: `extract`
- Extraction rationale: future multi-source slices need a standard packet shape for preserving agreements, tensions, and synthesized judgment.
- Raw form summary: synthesis outcomes are structured outputs that future work should be able to call on directly.
- Target artifact type: `template`
- Target path: `shared/templates/cross-source-synthesis-packet.md`

### Mechanism: cross-source-synthesis-packet-schema

- Extraction decision: `extract`
- Extraction rationale: the synthesis packet should be machine-checkable for future evaluators or host consumers.
- Raw form summary: structured cross-source outputs should be retrievable, comparable, and reusable.
- Target artifact type: `schema`
- Target path: `shared/schemas/cross-source-synthesis-packet.schema.json`

## Adaptation decisions

### Mechanism: cross-source-synthesis-packet

- Adaptation required: `yes`
- Adaptation description: convert broad cross-source research synthesis into a Directive-specific packet for preserving reusable synthesis across multi-source Architecture slices.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - constraint addition
  - recomposition with existing assets
- Adaptation validates against:
  - `shared/contracts/source-analysis-contract.md`
  - `shared/contracts/adaptation-decision-contract.md`
  - `shared/contracts/phase-isolated-processing.md`
  - `shared/contracts/architecture-mechanism-packet.md`
  - `shared/contracts/transformation-artifact-gate.md`
- Original vs adapted delta: the original sources describe interleaving and academic synthesis broadly; the adapted form defines a bounded Directive packet with sources compared, synthesis question, shared pattern, agreements, tensions, Directive synthesis, excluded baggage, and product artifact refs.

### Mechanism: cross-source-synthesis-packet-template

- Adaptation required: `yes`
- Adaptation description: reshape the synthesis output into a reusable Directive template for multi-source slices.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - constrain
- Adaptation validates against:
  - `shared/contracts/cross-source-synthesis-packet.md`
- Original vs adapted delta: instead of broad synthesis prose, the adapted template requires explicit preservation of agreements, tensions, and Directive synthesis.

### Mechanism: cross-source-synthesis-packet-schema

- Adaptation required: `yes`
- Adaptation description: convert the packet into a bounded schema so future evaluators can validate that a cross-source slice actually preserved reusable synthesis.
- Adaptation actions:
  - structural reshape
  - constrain
  - evaluability
- Adaptation validates against:
  - `shared/contracts/cross-source-synthesis-packet.md`
  - `shared/templates/cross-source-synthesis-packet.md`
- Original vs adapted delta: the source materials imply structured synthesis but do not define a machine-readable packet shape.

## Improvement decisions

### Mechanism: cross-source-synthesis-packet

- Improvement applied: `yes`
- Improvement description: require explicit Directive synthesis and excluded baggage so the packet preserves transformed judgment rather than a neutral comparison.
- Improvement type: `composability`
- Improvement rationale: future Architecture work needs the adapted synthesis itself, not just a reminder that multiple sources were compared.
- Improvement evidence plan: verify integration into workflow and source-adaptation contracts as the reusable artifact for multi-source slices.
- Original vs improved delta: the improved form goes beyond the sources by turning cross-source synthesis into a bounded operating artifact for Directive Workspace.

### Mechanism: cross-source-synthesis-packet-template

- Improvement applied: `yes`
- Improvement description: make the packet immediately usable in future cross-source slices.
- Improvement type: `quality`
- Improvement rationale: packet quality should depend on explicit preservation of tensions and synthesis.
- Improvement evidence plan: verify the template is linked from the workflow and schema inventory.
- Original vs improved delta: the improved form becomes a canonical Directive template rather than only a pattern description.

### Mechanism: cross-source-synthesis-packet-schema

- Improvement applied: `yes`
- Improvement description: make packet completeness checkable.
- Improvement type: `evaluability`
- Improvement rationale: machine-readable packets are easier to audit and compare than prose-only synthesis notes.
- Improvement evidence plan: verify the schema is added to the canonical schema inventory.
- Original vs improved delta: the improved form adds a reusable validation layer absent from the original sources.

## Integration target

- Integration surface:
  - `shared/contracts`
  - `shared/templates`
  - `shared/schemas`
  - `knowledge`
- Integration dependencies:
  - `knowledge/workflow.md`
  - `shared/contracts/source-analysis-contract.md`
  - `shared/contracts/adaptation-decision-contract.md`
  - `shared/contracts/architecture-mechanism-packet.md`
  - `shared/contracts/phase-isolated-processing.md`
  - `shared/contracts/transformation-artifact-gate.md`
  - `shared/schemas/README.md`
- Runtime handoff required: `no`
- Runtime handoff ref:

## Meta-usefulness check

- Improves source consumption: `yes`
- Meta-usefulness description: future multi-source Architecture work can preserve reusable synthesis directly instead of diffusing it across long notes or redoing the comparison.
- Self-improvement category: `adaptation_quality`

## Decision summary

- Overall adaptation quality: `strong`
- Overall improvement quality: `strong`
- Confidence: `high`
- Next action: `proceed_to_proof`

