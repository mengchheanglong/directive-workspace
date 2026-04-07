# Adopted: Architecture Maturity Bundle

- Adopted date: 2026-03-22
- Owning track: Architecture
- Status: `product_materialized`
- Depends on: `2026-03-22-source-adaptation-chain-operating-code-adopted.md`, `2026-03-22-source-adaptation-integration-bundle-adopted.md`

## Problem

The previous two bundles created the source-adaptation chain (Analyze → Adapt → Improve) and wired it into the system. But after the adaptation-decision contract produces output, Architecture had no operating code for three critical downstream decisions:

1. **When to adopt, what artifact type to use, and when to hand off to Runtime** — no structured decision criteria existed. The completion rubric tracked whether things were materialized but not the decision logic for getting there.

2. **What different treatment each usefulness level gets** — the three-level classification (direct/structural/meta) appeared as an enum field but had no operating logic defining what each level means for adoption path, artifact type, Runtime handoff, or self-improvement tracking.

3. **Whether Architecture is actually improving** — meta-usefulness was a flag with no accountability. The system could claim "this improves our ability to consume future sources" with no evidence structure, no verification method, and no cycle-over-cycle comparison.

## What was created

### 1. Architecture Adoption Criteria (`shared/contracts/architecture-adoption-criteria.md`)

Profile: `architecture_adoption_criteria/v1`

The missing "Decide" step operating code. Defines:
- **Adoption readiness check**: 5 boolean conditions that must all be true before adoption (source analysis complete, adaptation decision complete, adaptation quality acceptable, delta evidence present, no unresolved baggage)
- **Artifact type selection matrix**: structured decision logic for choosing contract vs. schema vs. template vs. policy vs. reference-pattern vs. shared-lib vs. doctrine-update
- **Architecture-to-Runtime threshold**: "Would this mechanism still be valuable if we never built a runtime surface for it?" Yes → Architecture. No → Runtime.
- **Usefulness level treatment**: different adoption paths for direct (→ Runtime handoff), structural (→ Architecture core), and meta (→ self-improvement priority) usefulness
- **Stay-experimental criteria**: when to keep a mechanism in experiments instead of adopting

### 2. Architecture Self-Improvement Contract (`shared/contracts/architecture-self-improvement-contract.md`)

Profile: `architecture_self_improvement/v1`

The missing self-improvement accountability. Defines:
- **Seven self-improvement categories** with compounding logic: analysis, extraction, adaptation, improvement, routing, evaluation, handoff quality
- **Self-improvement evidence structure**: required for every meta-useful adoption — falsifiable claim, mechanism, baseline observation, expected effect, verification method
- **Cycle evaluation structure**: sources processed, mechanisms extracted/adapted/improved, adaptation/improvement coverage, meta-usefulness rate, per-category assessment, cycle verdict
- **Anti-patterns**: labeling everything meta-useful, non-falsifiable claims, skipping cycle evaluation

### 3. Architecture Adoption Decision Schema (`shared/schemas/architecture-adoption-decision.schema.json`)

Machine-readable schema for adoption decisions. Key enforcement:
- `readiness_check` with all 5 boolean fields required
- `self_improvement` block required when `usefulness_level` is `meta`, with falsifiable `claim` and `verification_method`
- `decision.verdict` with explicit options: `adopt`, `stay_experimental`, `hand_off_to_runtime`, `defer`, `reject`
- `decision.runtime_threshold_check` field for the Runtime threshold question

### 4. Architecture Cycle Evaluation Template (`shared/templates/architecture-cycle-evaluation.md`)

Reusable template for cycle-over-cycle self-improvement assessment. Structures:
- source processing metrics (adaptation coverage, improvement coverage, meta-usefulness rate)
- per-category state assessment with change-since-last-cycle tracking
- meta-usefulness claim verification table
- cycle verdict with investment recommendation

## What was integrated

### Workflow (`knowledge/workflow.md`)
Added Architecture adoption decisions section explaining when and how to use the adoption criteria contract. Added Architecture cycle evaluation section pointing to the cycle evaluation template.

### Adaptation Decision Contract (`shared/contracts/adaptation-decision-contract.md`)
Updated relationship section to reference `architecture-adoption-criteria` and `architecture-self-improvement-contract` as downstream consumers.

### Source Analysis Contract (`shared/contracts/source-analysis-contract.md`)
Updated relationship section to reference downstream adoption criteria and self-improvement tracking.

### Architecture Completion Rubric (`knowledge/architecture-completion-rubric.md`)
Added Adoption Quality Rule: `product_materialized` with `weak` adaptation quality or missing delta evidence is a concern, not a success. Added Self-Improvement Tracking Rule: cycle evaluation is required at the start of each new Architecture wave.

## Why this matters

Before this bundle, Architecture could:
- analyze sources (source-analysis-contract)
- make adaptation decisions (adaptation-decision-contract)
- track completion (completion rubric)

But it could not:
- decide *what artifact type* a mechanism should become → now it can (artifact type selection matrix)
- decide *when to hand off to Runtime* with structured logic → now it can (Runtime threshold check)
- differentiate treatment by usefulness level → now it does (direct/structural/meta paths)
- evaluate whether it's actually improving → now it can (cycle evaluation structure)
- hold meta-usefulness claims accountable → now it does (self-improvement evidence with verification)

The full Architecture operating chain is now:

```
Source → Analyze (source-analysis-contract)
       → Extract/Adapt/Improve (adaptation-decision-contract)
       → Decide (architecture-adoption-criteria)
       → Materialize (artifact type selection)
       → Track self-improvement (architecture-self-improvement-contract)
       → Evaluate cycles (architecture-cycle-evaluation template)
       → Hand off to Runtime when appropriate (architecture-to-runtime + threshold logic)
```

## Meta-usefulness

This bundle is meta-useful in two categories:

**evaluation_quality**: The cycle evaluation structure makes Architecture self-improvement measurable instead of assumed. Future cycles can compare adaptation coverage, improvement coverage, and meta-usefulness rates.

**adaptation_quality**: The artifact type selection matrix makes materialization decisions structured instead of ad hoc. Future adaptations will produce the right artifact type because the decision logic is explicit.

### Self-improvement evidence

- Category: `evaluation_quality`
- Claim: Future Architecture cycles will have quantitative self-improvement tracking instead of only qualitative "seems better" judgment.
- Mechanism: The cycle evaluation template and self-improvement contract create a comparison structure that did not exist before.
- Baseline observation: Before this bundle, no cycle-over-cycle comparison was possible. Meta-usefulness was a label with no verification structure.
- Expected effect: The next Architecture cycle evaluation should be able to fill in metrics for adaptation coverage, improvement coverage, and verify previous meta-usefulness claims.
- Verification method: `next_cycle_comparison`

## Rollback

All artifacts are new files. Integration changes are additive sections in existing files. Rollback = delete the 4 new files + revert the added sections. No existing fields were removed or renamed.
