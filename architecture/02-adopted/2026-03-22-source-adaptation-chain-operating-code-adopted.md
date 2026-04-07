# Adopted: Source Adaptation Chain Operating Code

- Adopted date: 2026-03-22
- Owning track: Architecture
- Status: `product_materialized`

## What was missing

The canonical source flow is:

**Source → Analyze → Route → Extract → Adapt → Improve → Prove → Integrate**

Before this bundle, Architecture had operating code for:
- routing (routing matrix, discovery-to-architecture handoff, discovery-to-runtime handoff)
- promotion and proof (evaluator-contract, proof-checklist, promotion-contract, promotion-quality-gate)
- completion tracking (architecture-completion-rubric)
- review quality (architecture-review-guardrails)

Architecture did **not** have operating code for:
- structured source analysis (the Analyze step)
- extraction-candidate framing with explicit baggage identification
- adaptation decisions (the Adapt step — reshaping extracted value to fit Directive Workspace better than the original)
- improvement decisions (the Improve step — enhancing beyond the original source)
- meta-usefulness evaluation (does this improvement make the engine itself better at consuming future sources?)

This meant the doctrine's core pattern — `extract → adapt → improve → integrate` — was stated in CLAUDE.md and the doctrine skill but had no enforceable operating code in shared assets. Architecture defaulted to the weaker pattern: `extract → adopt`.

## What was created

### 1. Source Analysis Contract (`shared/contracts/source-analysis-contract.md`)

Profile: `source_analysis/v1`

Operationalizes the Analyze step with required fields for:
- mission alignment and usefulness-level classification (direct / structural / meta)
- value map: specific extractable mechanisms with type classification
- baggage map: implementation, stack, scope, and complexity baggage explicitly identified
- adaptation opportunity: how each mechanism should be reshaped for Directive Workspace
- improvement opportunity: how each mechanism can be improved beyond the original source
- exclusion list: what should not be extracted, with reasons
- analysis verdict: structured decision with priority and cost estimate

### 2. Adaptation Decision Contract (`shared/contracts/adaptation-decision-contract.md`)

Profile: `adaptation_decision/v1`

Operationalizes the Extract → Adapt → Improve steps with required fields for:
- per-mechanism extraction decisions with target artifact type and path
- per-mechanism adaptation decisions with explicit delta (original vs adapted)
- per-mechanism improvement decisions with explicit delta (original vs improved)
- meta-usefulness check: does this improvement make Directive Workspace better at consuming future sources?
- integration target with Runtime handoff flag
- quality summary forcing explicit assessment of adaptation and improvement quality

### 3. Source Adaptation Record Template (`shared/templates/source-adaptation-record.md`)

Reusable template that enforces both contracts in a single working document. Forces every Architecture source processing through:
- value mapping
- baggage mapping
- per-mechanism extraction, adaptation, and improvement decisions
- meta-usefulness check
- integration targeting
- quality summary and verdict

### 4. Source Adaptation Decision Schema (`shared/schemas/source-adaptation-decision.schema.json`)

Machine-readable JSON Schema for the full adaptation decision chain. Makes the decision structure parseable by agents, validators, and reporting tools. Key enforcement:
- `adaptation_decision.original_vs_adapted_delta` is required (not optional)
- `improvement_decision.original_vs_improved_delta` is required (not optional)
- `meta_usefulness.improves_source_consumption` is required

## Why this matters

Architecture is defined as "the self-improvement layer of Directive Workspace." The doctrine says:

> Architecture should become better at improving the engine's ability to adapt sources.

But without operating code for the adapt/improve steps, Architecture was structurally unable to enforce its own core pattern. The intake checklist asked "which pain does this solve?" and "adopt/defer/reject" — but never "what is baggage?", "how should we adapt this?", "how can we improve beyond the source?", or "does this improvement make us better at improving?"

This bundle closes the gap between what the doctrine describes and what the operating code enforces.

## Architecture completion status

Status class: `product_materialized`

Product-owned artifacts:
- `shared/contracts/source-analysis-contract.md` — new
- `shared/contracts/adaptation-decision-contract.md` — new
- `shared/templates/source-adaptation-record.md` — new
- `shared/schemas/source-adaptation-decision.schema.json` — new

No Mission Control dependency. No Runtime dependency. Pure Architecture operating code.

## Meta-usefulness

This bundle is itself meta-useful:
- **analysis quality**: the source-analysis contract directly improves how Architecture evaluates sources
- **extraction quality**: the adaptation-decision contract forces explicit extraction framing instead of vague adoption
- **adaptation quality**: the adaptation chain operating code makes the adapt step mandatory and structured
- **improvement quality**: the improvement fields force asking "how can we do better than the source?"
- **self-improvement evaluation**: the meta-usefulness check field creates a feedback loop — every adaptation decision now explicitly asks whether it improves the engine

## Rollback

All artifacts are new files. Rollback = delete the four files. No existing assets were modified.

## Next actions

- Use the source-adaptation-record template for the next Architecture source processing
- Evaluate whether the intake checklist (`architecture/01-triage/INTAKE_CHECKLIST.md`) should reference the source-analysis contract for deeper analysis
- Consider whether existing adopted records should be retroactively assessed for adaptation and improvement quality
