# Arscontexta Phase-Isolated Processing Adaptation Decision

- Source id: `dw-src-arscontexta-phase-isolation`
- Analysis record ref: `architecture/02-experiments/2026-03-23-arscontexta-phase-isolated-processing-source-analysis.md`
- Decision date: `2026-03-23`

## Extraction decisions

### Mechanism: phase-isolated-processing

- Extraction decision: `extract`
- Extraction rationale: Directive Workspace needs an explicit operating rule for separating judgment-heavy phases so Architecture can execute the new source-adaptation chain without context bleed.
- Raw form summary: arscontexta’s four-phase processing guidance isolates processing phases, prefers fresh context per phase, and passes state through files rather than through chat continuity.
- Target artifact type: `contract`
- Target path: `shared/contracts/phase-isolated-processing.md`

### Mechanism: phase-handoff-packet

- Extraction decision: `extract`
- Extraction rationale: Once phases are isolated, Directive Workspace needs a standard packet for transferring state between them.
- Raw form summary: arscontexta passes phase state through files, queue entries, and composable packets rather than relying on session continuity.
- Target artifact type: `template`
- Target path: `shared/templates/phase-handoff-packet.md`

### Mechanism: phase-handoff-packet-schema

- Extraction decision: `extract`
- Extraction rationale: The packet should be machine-checkable so future host or agent surfaces can validate phase boundaries.
- Raw form summary: arscontexta emphasizes schema-backed quality and structural expectations for outputs.
- Target artifact type: `schema`
- Target path: `shared/schemas/phase-handoff-packet.schema.json`

## Adaptation decisions

### Mechanism: phase-isolated-processing

- Adaptation required: `yes`
- Adaptation description: reshape the general vault-processing philosophy into a Directive Workspace execution contract for heavy source-driven work in Architecture, Discovery, and Runtime.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - simplification
  - constraint addition
- Adaptation validates against:
  - `shared/contracts/source-analysis-contract.md`
  - `shared/contracts/adaptation-decision-contract.md`
  - `shared/contracts/architecture-adoption-criteria.md`
- Original vs adapted delta: arscontexta’s broad “capture/process/connect/verify” vault philosophy becomes a Directive-specific rule for when to isolate phases, how to order them, and what packet fields must exist between them.

### Mechanism: phase-handoff-packet

- Adaptation required: `yes`
- Adaptation description: turn arscontexta’s implicit file-based state transfer into a reusable Directive template for bounded phase handoff.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - recomposition with existing assets
- Adaptation validates against:
  - `shared/templates/source-adaptation-record.md`
  - `shared/contracts/discovery-to-architecture.md`
  - `shared/contracts/architecture-to-runtime.md`
- Original vs adapted delta: instead of generic queue/file passing, the adapted form defines explicit packet identity, mission linkage, inputs, outputs, decisions, open questions, gates, and fresh-context requirements.

### Mechanism: phase-handoff-packet-schema

- Adaptation required: `yes`
- Adaptation description: convert schema-backed note discipline into a small machine-readable packet schema for Directive phase boundaries.
- Adaptation actions:
  - structural reshape
  - simplification
  - constraint addition
- Adaptation validates against:
  - `shared/contracts/phase-isolated-processing.md`
  - `shared/templates/phase-handoff-packet.md`
- Original vs adapted delta: the original source discusses schema-backed quality in general terms; the adapted Directive form turns that into a concrete JSON schema for phase packets.

## Improvement decisions

### Mechanism: phase-isolated-processing

- Improvement applied: `yes`
- Improvement type: `quality`
- Improvement description: make the execution discipline explicit for Directive Workspace’s weak point: source-driven adaptation quality.
- Improvement rationale: the source does not target Directive’s source-adaptation chain directly; the improved form does.
- Improvement evidence plan: proof is structural inspection of the new contract plus workflow integration.
- Original vs improved delta: the improved Directive form explicitly maps phase isolation to `analyze -> adapt -> prove -> integrate` and defines when a slice must not rely on conversational continuity.

### Mechanism: phase-handoff-packet

- Improvement applied: `yes`
- Improvement type: `evaluability`
- Improvement description: add explicit fields for fresh-context reasoning, required gates, and rollback note so handoff quality becomes reviewable.
- Improvement rationale: the original source argues for file-based state transfer but does not define a bounded packet contract.
- Improvement evidence plan: structural inspection of the template and schema.
- Original vs improved delta: the improved form is a named, reusable packet contract rather than a general workflow recommendation.

### Mechanism: phase-handoff-packet-schema

- Improvement applied: `yes`
- Improvement type: `composability`
- Improvement description: make the packet usable by future validators, host adapters, or agents without relying on prose interpretation alone.
- Improvement rationale: this turns a workflow idea into composable operating code.
- Improvement evidence plan: structural inspection of the schema plus alignment with the template and contract.
- Original vs improved delta: the improved form enables machine validation where the original only implied structural quality expectations.

## Integration target

- Integration surface: `shared/contracts`, `shared/templates`, `shared/schemas`
- Integration dependencies:
  - `knowledge/workflow.md`
  - `shared/contracts/source-analysis-contract.md`
  - `shared/contracts/adaptation-decision-contract.md`
- Runtime handoff required: `no`
- Runtime handoff ref:

## Meta-usefulness check

- Improves source consumption: `yes`
- Meta usefulness description: This makes Directive Workspace better at executing source-driven work without context bleed and with explicit state transfer between judgment-heavy phases.
- Self-improvement category: `adaptation_quality`

## Decision summary

- Overall adaptation quality: `strong`
- Overall improvement quality: `strong`
- Confidence: `high`
- Next action: `proceed_to_proof`
