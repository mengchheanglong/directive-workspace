# Adaptation Decision - mini-SWE-agent Adoption Decision Envelope Lib

Date: 2026-03-23
Track: Architecture
Type: source-driven adaptation

## Source reference

- Source id: `dw-src-mini-swe-agent-adoption-decision-envelope-lib`
- Analysis record ref: `architecture/02-experiments/2026-03-23-mini-swe-agent-adoption-decision-envelope-source-analysis.md`
- Decision date: `2026-03-23`

## Extraction decisions

### Mechanism: architecture adoption decision envelope

- Extraction decision: `extract`
- Extraction rationale: Directive Workspace's retained decision corpus now matters enough that its artifacts need an explicit format identity and canonical merge behavior. mini-SWE-agent already solves that class of problem for trajectory outputs.
- Raw form summary: mini-SWE-agent serializes outputs with a stable `trajectory_format` and composes nested data through `recursive_merge`, skipping `UNSET` values instead of leaking placeholders.
- Target artifact type: `shared-lib`
- Target path: `shared/lib/architecture-adoption-decision-envelope.ts`

## Adaptation decisions

### Mechanism: architecture adoption decision envelope

- Adaptation required: `yes`
- Adaptation description: convert the recursive merge and versioned envelope pattern into a host-neutral TypeScript helper for Directive Architecture adoption-decision artifacts, and use it to emit explicit `decision_format` metadata plus cleaner optional nested sections.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - simplification
  - recomposition with existing adoption artifact builder
- Adaptation validates against:
  - `shared/lib/architecture-adoption-artifacts.ts`
  - `shared/schemas/architecture-adoption-decision.schema.json`
  - `shared/lib/architecture-adoption-decision-store.ts`
  - `shared/lib/README.md`
- Original vs adapted delta: the original code serializes full agent trajectories in Python. The adapted form keeps only the versioned artifact identity and recursive merge discipline, reoriented around Directive's retained Architecture adoption decisions.

## Improvement decisions

### Mechanism: architecture adoption decision envelope

- Improvement applied: `yes`
- Improvement description: make every retained Architecture adoption decision self-identifying by format version and build nested sections through one reusable merge helper instead of hand-filtered optional-object assembly.
- Improvement type: `quality`
- Improvement rationale: later Architecture generations need to distinguish artifact-shape upgrades cleanly, or the retained corpus becomes brittle as the system evolves.
- Improvement evidence plan: prove the shared-lib mirror stays in sync, re-emit the retained decision corpus through backfill with the new format field, and confirm live closeout plus wave evaluation still pass on the upgraded artifacts.
- Original vs improved delta: the improved form goes beyond mini-SWE-agent by binding versioned envelope mechanics directly into Directive Workspace's closeout, retained corpus, and cycle-evaluation system rather than leaving format identity as documentation only.

## Integration target

- Integration surface:
  - `shared/lib`
- Integration dependencies:
  - `shared/lib/architecture-adoption-artifacts.ts`
  - `shared/lib/architecture-adoption-decision-store.ts`
  - `shared/schemas/architecture-adoption-decision.schema.json`
  - `mission-control/src/lib/directive-workspace/architecture-adoption-decision-envelope.ts`
  - `mission-control/scripts/backfill-directive-architecture-adoption-decision-corpus.ts`
- Runtime handoff required: `no`
- Runtime handoff ref:

## Meta-usefulness check

- Improves source consumption: `yes`
- Meta-usefulness description: future retained Architecture artifacts can survive schema evolution more safely because the system now knows what format they are and builds them through one canonical envelope helper.
- Self-improvement category: `evaluation_quality`

## Decision summary

- Overall adaptation quality: `strong`
- Overall improvement quality: `strong`
- Confidence: `high`
- Next action: `proceed_to_proof`
