# Adopted: Architecture Deep Audit + Corpus Normalization Bundle

- Adopted date: 2026-03-22
- Owning track: Architecture
- Status: `product_materialized`
- Origin: internally-generated
- Usefulness level: `meta`
- Forge threshold check: Yes, this is valuable without any runtime surface — it governs Architecture's own records.

## Problem

The previous three Architecture bundles created a strong contract layer:
- source-analysis-contract (Analyze step)
- adaptation-decision-contract (Extract → Adapt → Improve)
- architecture-adoption-criteria (Decide step)
- architecture-self-improvement-contract (self-improvement tracking)

But the actual Architecture corpus — 24 adopted records, 31 reference patterns, 52 experiments, 8 deferred/rejected records — was entirely pre-doctrine. No record used the new contracts. No record classified its own usefulness level. No record provided self-improvement evidence (except the maturity bundle itself). The Architecture operating system had good laws but had never conducted a census.

## What was done

### Phase 1: Deep audit

Read a meaningful sample of the Architecture corpus across all stages:
- 8 experiment records (from 2026-03-19 through 2026-03-22)
- 8 adopted records (Waves 1, 2, 3)
- 7 reference patterns
- 3 deferred/rejected records
- All existing contracts, templates, schemas, and knowledge docs

### Phase 2: Corpus classification

Every adopted Architecture record was classified by:
- origin (source-driven vs internally-generated)
- usefulness level (direct / structural / meta)
- contract coverage (which new contracts it does/doesn't satisfy)
- normalization status

Key findings (corrected baseline, revision 2):
- 14 structural, 3 direct (correctly Forge-routed), 7 meta (4 with self-improvement evidence)
- Zero pre-doctrine records reference the new contracts
- 3 meta-useful adoptions still lack self-improvement evidence (`discovery-gap-priority-worklist`, `source-adaptation-chain`, `source-adaptation-integration`)
- 8 reference patterns promoted to shared contracts; 22 remain reference-only; 6 governance/infrastructure patterns were omitted from initial baseline
- 8 deferred/rejected records classified with per-candidate lifecycle status
- Pre-doctrine records are well-structured but unclassified

### Phase 3: Artifact lifecycle contract

Created `shared/contracts/architecture-artifact-lifecycle.md` - the missing "type system" for Architecture records. Defines:
- **4 artifact states**: experiment, adopted, reference-pattern, deferred
- **Required fields per state**: what each state must contain to be valid
- **Transition rules**: experiment→adopted, experiment→deferred, experiment→reference-pattern, reference-pattern→adopted (promotion), reference-pattern→retired, adopted→Forge handoff
- **Reference-pattern admission criteria**: what qualifies for reference vs. experiment vs. deferred
- **Classification shortcuts**: quick decision tree for categorizing records
- **Pre-doctrine handling**: existing records are classified, not rewritten, and Forge handoff is tracked as an adopted-record transition rather than a separate state

### Phase 4: Corpus normalization record

Created `architecture/02-experiments/2026-03-22-architecture-corpus-normalization.md` — the classified inventory of the Architecture corpus. Revision 2 corrects the initial baseline. Contains:
- Classification table for all 24 adopted records with usefulness level, status class, contract coverage, and normalization status
- Reference pattern lifecycle assessment for all 31 patterns (8 promoted, 22 reference-only, 1 retired)
- Classification of all 8 deferred/rejected records
- 7 specific audit findings with impact assessment and action plans
- Correction log documenting all discrepancies from the initial baseline
- Verdict on corpus health (structurally sound but pre-doctrine)

### Phase 5: Integration

- **Experiment record template**: added lifecycle classification fields (origin, usefulness level, Forge threshold check) and explicit next-decision options
- **Workflow**: added Architecture artifact lifecycle section referencing the lifecycle contract and corpus normalization baseline
- **Architecture completion rubric**: added Corpus Normalization Baseline section and Artifact Lifecycle Governance sections, corrected to revision 2 counts

### Phase 6: Corpus Upgrade Program (revision 2)

Verified the initial normalization baseline was incomplete and overclaimed. Executed a 5-phase upgrade:

1. **Verified claims**: found adopted count was 24 not 21, reference patterns were 31 not 25, structural count was 14 not 12, meta count was 7 not 5, 8 deferred/rejected records were unclassified
2. **Fixed baseline**: rewrote normalization record with corrected counts, complete inventory, and correction log
3. **Real retroactive normalization**: added normalization annotations to 4 historical records (gpt-researcher, impeccable, hermes, adopted-candidates-architecture-recheck), including retroactive self-improvement evidence for 2 meta-useful records
4. **Strengthened operating system**: added normalization annotation policy, historical-record review checklist, and reference-pattern retirement checklist to the artifact lifecycle contract; retired 1 reference pattern (`stage-evidence-citation-handoff-contract`)
5. **Produced result**: updated all cross-references (completion rubric, adopted record, changelog)

## Materialized artifacts

| Artifact | Type | Path |
|---|---|---|
| Architecture Artifact Lifecycle | contract | `shared/contracts/architecture-artifact-lifecycle.md` |
| Architecture Corpus Normalization | experiment/audit record | `architecture/02-experiments/2026-03-22-architecture-corpus-normalization.md` |
| This adopted record | adopted record | `architecture/03-adopted/2026-03-22-architecture-corpus-normalization-adopted.md` |

## What changed in existing assets

| Asset | Change |
|---|---|
| `shared/templates/experiment-record.md` | Added lifecycle classification fields and explicit next-decision options |
| `knowledge/workflow.md` | Added Architecture artifact lifecycle section |
| `knowledge/architecture-completion-rubric.md` | Added Corpus Normalization Baseline and Artifact Lifecycle Governance sections; corrected counts in revision 2 |
| `shared/contracts/architecture-artifact-lifecycle.md` | Added normalization annotation policy, historical-record review checklist, reference-pattern retirement checklist |
| `architecture/03-adopted/2026-03-19-gpt-researcher-*` | Added normalization annotation (structural, strong adaptation) |
| `architecture/03-adopted/2026-03-21-impeccable-*` | Added normalization annotation (meta, evaluation_quality, retroactive self-improvement evidence) |
| `architecture/03-adopted/2026-03-21-hermes-*` | Added normalization annotation (structural, strong adaptation) |
| `architecture/03-adopted/2026-03-19-adopted-candidates-architecture-recheck` | Added normalization annotation (meta, routing_quality, retroactive self-improvement evidence) |
| `architecture/05-reference-patterns/2026-03-20-stage-evidence-citation-handoff-contract` | Retired — value fully absorbed by shared schemas |

## Self-improvement evidence

- Category: `evaluation_quality`
- Claim: Future Architecture work will be more consistently classified and governed because the lifecycle contract defines required fields per state, transition rules, and the corpus normalization provides a classified baseline.
- Mechanism: The lifecycle contract acts as a type system for Architecture records. The corpus normalization record makes the existing corpus self-aware. Together they prevent the classification drift that accumulated during the pre-doctrine phase.
- Baseline observation: Before this bundle, no Architecture record classified its own usefulness level, and no lifecycle rules governed transitions between experiment/adopted/reference-pattern/deferred states.
- Expected effect: New Architecture records will self-classify at creation time. Cycle evaluations will have a baseline to compare against. Reference-pattern promotion/retirement will follow explicit criteria instead of ad hoc decisions.
- Verification method: `next_cycle_comparison`

## Rollback

- Delete `shared/contracts/architecture-artifact-lifecycle.md`
- Delete `architecture/02-experiments/2026-03-22-architecture-corpus-normalization.md`
- Delete this adopted record
- Revert added sections in experiment-record template, workflow, and completion rubric
- Remove normalization annotations from gpt-researcher, impeccable, hermes, adopted-candidates-architecture-recheck adopted records
- Revert retirement header on stage-evidence-citation-handoff-contract reference pattern
- Revert normalization annotation policy, review checklist, and retirement checklist additions in lifecycle contract
