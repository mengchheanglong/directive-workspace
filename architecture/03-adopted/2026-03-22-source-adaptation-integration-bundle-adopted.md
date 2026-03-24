# Adopted: Source Adaptation Integration Bundle

- Adopted date: 2026-03-22
- Owning track: Architecture
- Status: `product_materialized`
- Depends on: `2026-03-22-source-adaptation-chain-operating-code-adopted.md`

## Problem

The previous bundle created four standalone Architecture operating-code assets:
- `source-analysis-contract.md`
- `adaptation-decision-contract.md`
- `source-adaptation-record.md` (template)
- `source-adaptation-decision.schema.json`

These assets defined the right structure for the Analyze/Adapt/Improve steps, but they were not wired into the rest of Directive Workspace's operating system. No existing handoff, template, routing guide, or workflow document referenced them. Without integration, they risked becoming good standalone documents that the system never actually uses.

## What was integrated

### 1. Discovery → Architecture handoff (`shared/contracts/discovery-to-architecture.md`)

**Before:** 8 required fields, no reference to what Architecture should do next with a source.
**After:** Added source-analysis preparation fields (initial value hypothesis, initial baggage signals, usefulness level hint, capability gap reference) and a rule that Architecture's next step for source work is the `source-analysis-contract`, not direct extraction.

### 2. Architecture → Forge handoff (`shared/contracts/architecture-to-forge.md`)

**Before:** Referred to "extracted mechanism" — raw extracted value with no adaptation/improvement evidence.
**After:** Added required adaptation/improvement evidence fields (source-analysis ref, adaptation-decision ref, adaptation summary, improvement summary, value-handed-to-Forge description). Added rule that Forge receives adapted/improved value, not raw extracts. Added meta-usefulness flag.

### 3. Experiment record template (`shared/templates/experiment-record.md`)

**Before:** No fields for source-adaptation chain references.
**After:** Added optional "Source adaptation fields" section for Architecture source-driven experiments: source-analysis ref, adaptation-decision ref, adaptation quality, improvement quality, meta-usefulness flag and category.

### 4. Routing record template (`shared/templates/routing-record.md`)

**Before:** Generic "Handoff contract used" and "Required next artifact" fields with no guidance.
**After:** Added inline hints showing which handoff contracts apply and that Architecture source work requires `source-analysis-contract` → `adaptation-decision-contract`.

### 5. Discovery fast-path record template (`shared/templates/discovery-fast-path-record.md`)

**Before:** Mission alignment and gap fields existed, but no source-analysis preparation for Architecture routing.
**After:** Added "Source-analysis preparation" section with initial value hypothesis, initial baggage signals, usefulness level hint, and next required Architecture artifact pointer.

### 6. Routing matrix (`shared/ROUTING_MATRIX.md`)

**Before:** Described what Architecture is for, but not what the next step should be when a source is routed there.
**After:** Added explicit instruction that source routing to Architecture requires the source-analysis and adaptation-decision chain.

### 7. Workflow (`knowledge/workflow.md`)

**Before:** Architecture default was "one experiment slice + one adopted/deferred outcome." No mention of source-adaptation chain.
**After:** Added "Architecture source-driven work" section describing the 4-step source-adaptation chain (analysis → adaptation decision → experiment → Forge handoff if applicable). Explicitly states when to skip the chain (purely internal work with no external source).

### 8. Intake checklist (`architecture/01-triage/INTAKE_CHECKLIST.md`)

**Before:** Surface-level triage ending with Adopt/Defer/Reject, no pointer to deeper analysis.
**After:** Added section 7 explaining that if the decision is Adopt and the route is Architecture, the next required step is the source-analysis-contract, with a summary of what the deeper evaluation covers.

### 9. Evaluator contract (`shared/contracts/evaluator-contract.md`)

**Before:** Evaluators defined only for Forge transformation work and performance-sensitive changes.
**After:** Added "Architecture adaptation evaluation" section defining informational evaluator metrics for source-adaptation quality: adaptation coverage, improvement coverage, baggage exclusion rate, delta evidence completeness, meta-usefulness hit rate. These are not gates — they track whether the adaptation chain is producing real value or silently defaulting to `extract → adopt`.

## Why this matters

The source-adaptation contracts defined the right questions. This integration bundle makes the system actually ask those questions at the right moments:

- When Discovery routes a source to Architecture, the handoff now tells Architecture to start with source analysis
- When Architecture processes a source, the workflow now describes the 4-step chain
- When Architecture records an experiment, the template now has fields for adaptation/improvement evidence
- When Architecture hands off to Forge, the contract now requires adapted/improved value, not raw extracts
- When the system evaluates Architecture quality, the evaluator contract now defines adaptation-specific metrics

## Rollback

All changes are additive edits to existing files. Rollback = revert the added sections. No fields were removed or renamed.

## Meta-usefulness

This bundle is itself meta-useful in the `handoff_quality` category: it makes the connections between contracts, templates, and workflows explicit so the source-adaptation chain actually gets used by the system, not just defined by it.
