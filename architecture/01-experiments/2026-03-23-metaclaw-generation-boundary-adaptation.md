# Adaptation Decision - MetaClaw Generation Boundary

Date: 2026-03-23
Track: Architecture
Type: source-driven adaptation

## Source reference

- Source id: `dw-src-metaclaw-generation-boundary`
- Analysis record ref: `architecture/01-experiments/2026-03-23-metaclaw-generation-boundary-source-analysis.md`
- Decision date: `2026-03-23`

## Extraction decisions

### Mechanism: self-improvement-generation-boundary

- Extraction decision: `extract`
- Extraction rationale: Directive Workspace needs a product-owned rule for when self-improving adoptions invalidate older confirmation evidence.
- Raw form summary: MetaClaw increments a generation when skills change and discards stale pending and queued samples collected before that bump.
- Target artifact type: `contract`
- Target path: `shared/contracts/self-improvement-generation-boundary.md`

### Mechanism: generation-boundary-note

- Extraction decision: `extract`
- Extraction rationale: boundary events should be recorded explicitly instead of living only in cycle-evaluation prose.
- Raw form summary: the source carries generation state in code, but Directive Workspace needs a reusable human-readable note for boundary openings.
- Target artifact type: `template`
- Target path: `shared/templates/generation-boundary-note.md`

### Mechanism: generation-boundary-note-schema

- Extraction decision: `extract`
- Extraction rationale: future evaluators and host-neutral checks should be able to validate boundary records mechanically.
- Raw form summary: generation state exists in code, but not as a portable artifact shape.
- Target artifact type: `schema`
- Target path: `shared/schemas/generation-boundary-note.schema.json`

## Adaptation decisions

### Mechanism: self-improvement-generation-boundary

- Adaptation required: `yes`
- Adaptation description: convert RL sample-freshness generation tracking into an Architecture evidence-boundary contract focused on self-improvement claims, cycle evaluation, and clean post-change proof.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - simplification
  - constraint addition
- Adaptation validates against:
  - `shared/contracts/architecture-self-improvement-contract.md`
  - `shared/templates/architecture-cycle-evaluation.md`
  - `knowledge/workflow.md`
- Original vs adapted delta: the original source uses generation state to discard stale RL samples; the adapted form uses generation boundaries to separate historical context from valid confirmation after self-improving Architecture changes.

### Mechanism: generation-boundary-note

- Adaptation required: `yes`
- Adaptation description: reshape trainer-side generation logic into a reusable Directive note format for explicit boundary openings.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - constrain
- Adaptation validates against:
  - `shared/contracts/self-improvement-generation-boundary.md`
- Original vs adapted delta: instead of implicit state in Python objects and queues, the adapted form records boundary reason, stale-evidence scope, carry-forward allowances, reset actions, and next clean proof.

### Mechanism: generation-boundary-note-schema

- Adaptation required: `yes`
- Adaptation description: convert the note into a machine-checkable shape so future cycle evaluations can validate boundary records consistently.
- Adaptation actions:
  - structural reshape
  - constrain
  - extension
- Adaptation validates against:
  - `shared/contracts/self-improvement-generation-boundary.md`
  - `shared/templates/generation-boundary-note.md`
- Original vs adapted delta: the source has generation fields in code only; the adapted form creates a portable Directive artifact shape for boundary governance.

## Improvement decisions

### Mechanism: self-improvement-generation-boundary

- Improvement applied: `yes`
- Improvement description: preserve historical evidence as context while explicitly forbidding it from counting as clean confirmation after a material self-improvement change.
- Improvement type: `safety`
- Improvement rationale: Architecture should not overclaim self-improvement by blending old and new evidence across a changed operating baseline.
- Improvement evidence plan: verify integration into the self-improvement contract, cycle-evaluation template, and workflow, then confirm boundary use on a real Architecture baseline transition.
- Original vs improved delta: the improved form distinguishes historical carry-forward from valid confirmation, which MetaClaw's code implies operationally but does not generalize into Architecture governance.

### Mechanism: generation-boundary-note

- Improvement applied: `yes`
- Improvement description: make boundary events reviewable in normal Architecture records rather than hidden in evaluator assumptions.
- Improvement type: `quality`
- Improvement rationale: visible boundary notes make self-improvement discipline easier to audit and reuse.
- Improvement evidence plan: verify a real Architecture boundary note is emitted for the post-doctrine packet system transition.
- Original vs improved delta: the improved form adds a reusable human-facing governance artifact absent from the original source.

### Mechanism: generation-boundary-note-schema

- Improvement applied: `yes`
- Improvement description: make generation-boundary events machine-readable for future evaluators and tooling.
- Improvement type: `evaluability`
- Improvement rationale: the Architecture system should be able to measure clean post-boundary proof explicitly.
- Improvement evidence plan: verify the schema is added to the canonical schema inventory and referenced by the adopted slice.
- Original vs improved delta: the improved form adds a contract-backed validation layer beyond the source's runtime-only representation.

## Integration target

- Integration surface:
  - `shared/contracts`
  - `shared/templates`
  - `shared/schemas`
  - `knowledge`
- Integration dependencies:
  - `shared/contracts/architecture-self-improvement-contract.md`
  - `shared/templates/architecture-cycle-evaluation.md`
  - `knowledge/workflow.md`
  - `shared/schemas/README.md`
- Runtime handoff required: `no`
- Runtime handoff ref:

## Meta-usefulness check

- Improves source consumption: `yes`
- Meta-usefulness description: future Architecture cycles can separate baseline context from clean confirmation after the system improves itself, making self-improvement claims more trustworthy.
- Self-improvement category: `evaluation_quality`

## Decision summary

- Overall adaptation quality: `strong`
- Overall improvement quality: `strong`
- Confidence: `high`
- Next action: `proceed_to_proof`

