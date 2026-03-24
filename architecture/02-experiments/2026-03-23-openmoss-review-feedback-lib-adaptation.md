# Adaptation Decision - OpenMOSS Review Feedback Lib

Date: 2026-03-23
Track: Architecture
Type: source-driven adaptation

## Source reference

- Source id: `dw-src-openmoss-review-feedback-lib`
- Analysis record ref: `architecture/02-experiments/2026-03-23-openmoss-review-feedback-lib-source-analysis.md`
- Decision date: `2026-03-23`

## Extraction decisions

### Mechanism: lifecycle-review-feedback shared lib

- Extraction decision: `extract`
- Extraction rationale: Directive Workspace already has the OpenMOSS review/transition logic as policy; the next useful step is an executable helper that product code can actually call.
- Raw form summary: OpenMOSS validates sub-task transitions, records review results, applies deterministic score deltas, and routes rejected work into rework or blocked recovery.
- Target artifact type: `shared-lib`
- Target path: `shared/lib/lifecycle-review-feedback.ts`

## Adaptation decisions

### Mechanism: lifecycle-review-feedback shared lib

- Adaptation required: `yes`
- Adaptation description: convert OpenMOSS's Python service-layer logic into a host-neutral TypeScript helper that resolves lifecycle gates, score deltas, review quality bands, and blocked recovery plans without database coupling.
- Adaptation actions:
  - terminology alignment
  - structural reshape
  - simplification
  - recomposition with existing assets
- Adaptation validates against:
  - `shared/contracts/lifecycle-transition-policy.md`
  - `shared/contracts/experiment-score-feedback.md`
  - `shared/lib/README.md`
- Original vs adapted delta: the original code mutates SQL-backed sub-task records directly; the adapted form is a pure product-owned helper that returns transition validity, review feedback outcomes, and recovery plans for Directive Workspace lifecycle states.

## Improvement decisions

### Mechanism: lifecycle-review-feedback shared lib

- Improvement applied: `yes`
- Improvement description: merge lifecycle transition, review-score feedback, and blocked recovery guidance into one reusable helper instead of leaving them separated across contracts and source-specific Python services.
- Improvement type: `composability`
- Improvement rationale: a single canonical helper is easier to reuse and audit than repeated ad hoc implementations in hosts or future slices.
- Improvement evidence plan: verify the helper compiles, is mirrored into Mission Control, is registered in the boundary inventory, and resolves deterministic review outcomes in a smoke proof.
- Original vs improved delta: the improved form goes beyond OpenMOSS by adapting the logic to Directive Workspace's cross-track lifecycle vocabulary and exposing it as a host-neutral reusable code surface.

## Integration target

- Integration surface:
  - `shared/lib`
- Integration dependencies:
  - `shared/contracts/lifecycle-transition-policy.md`
  - `shared/contracts/experiment-score-feedback.md`
  - `shared/lib/README.md`
  - `forge/BOUNDARY_INVENTORY.json`
  - `mission-control/src/lib/directive-workspace/lifecycle-review-feedback.ts`
- Forge handoff required: `no`
- Forge handoff ref:

## Meta-usefulness check

- Improves source consumption: `yes`
- Meta-usefulness description: the system can now operationalize adopted review and lifecycle rules as executable product code instead of reinterpreting them manually from Markdown or source snapshots.
- Self-improvement category: `evaluation_quality`

## Decision summary

- Overall adaptation quality: `strong`
- Overall improvement quality: `strong`
- Confidence: `high`
- Next action: `proceed_to_proof`
