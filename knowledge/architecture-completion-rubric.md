# Directive Architecture Completion Rubric

Last updated: 2026-03-21
Status: canonical

## Purpose

This rubric prevents boundary drift when evaluating Directive Architecture progress.

Directive Architecture is complete only when extracted value is materialized as a product-owned Directive Workspace artifact.

Mission Control consumption, enforcement, or host-side implementation can strengthen confidence, but it does not define Architecture completion by itself.

## Canonical Completion Rule

Architecture work counts as complete only when the extracted mechanism exists in Directive Workspace as one or more of:
- a shared contract
- a shared schema
- a shared template
- an architecture reference pattern or policy
- a canonical doctrine or policy document when doctrine is the intended output

Default product-owned surfaces:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns`
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge`

## What Does Not Count By Itself

The following do not count as Architecture completion on their own:
- an intake note
- an experiment note
- an adopted note
- a Mission Control checker, generator, parser, or adapter without a product-owned Directive Workspace artifact
- a Forge follow-up record
- a runtime proof run

Mission Control host work is downstream consumption of Architecture output, not the definition of the Architecture output.

## Status Classes

Use exactly one status class for each adopted Architecture candidate.

### `product_materialized`

Use when:
- the extracted mechanism is materially represented in Directive Workspace product-owned artifacts
- the Architecture output can be pointed to without relying on Mission Control code for its identity

Counts as:
- complete for Architecture current-cycle accounting

### `product_partial`

Use when:
- the extracted mechanism has some product-owned artifacts
- but the artifact family is still incomplete, weakly normalized, or still overly dependent on host-side implementation to be coherent

Counts as:
- partial completion for Architecture current-cycle accounting

### `doc_only_or_planned`

Use when:
- the mechanism is understood
- adoption is decided
- but the result still mainly exists as notes, experiments, or planned-next wording

Counts as:
- not complete for Architecture current-cycle accounting

### `routed_out_of_architecture`

Use when:
- the extracted pattern is valid
- but the remaining real work belongs to Forge or another non-Architecture lane
- and the handoff is explicit

Counts as:
- excluded from Architecture remaining-work denominator once the handoff is locked

### `reference_only`

Use when:
- the candidate remains useful context
- but no further materialization is expected in the current Architecture cycle

Counts as:
- excluded from Architecture completion denominator

## Scoring Rule

Use this only for current-cycle Architecture completion estimation.

Weights:
- `product_materialized` = 1.0
- `product_partial` = 0.75
- `doc_only_or_planned` = 0.0
- `routed_out_of_architecture` = excluded
- `reference_only` = excluded

Formula:

`Architecture completion % = (materialized + 0.75 * partial) / (materialized + partial + doc_only_or_planned) * 100`

Rule:
- never count Mission Control-only work as if it closes Architecture by itself
- never leave routed Forge work inside the Architecture denominator after handoff is explicit

## Current Baseline (2026-03-21)

This is the current adopted-set baseline under the strict product-owned rule.

| Candidate | Status class | Why |
|---|---|---|
| `gh-aw` | `product_materialized` | Product-owned lane-split contract and policy exist in Directive Workspace. |
| `scientify` | `product_materialized` | Product-owned promotion-quality contract and policy exist in Directive Workspace. |
| `gpt-researcher` | `product_materialized` | Product-owned evidence, citation, and evaluation schemas exist in Directive Workspace, and lifecycle artifact assembly now also has a canonical `shared/lib` implementation. |
| `Paper2Code` | `product_materialized` | Product-owned stage-handoff schemas, templates, contracts, and canonical shared helper logic now exist in Directive Workspace. |
| `openmoss` | `product_materialized` | Product-owned lifecycle transition contract, score-feedback contract, template fields, and closure policy note exist in Directive Workspace. |
| `metaclaw` | `product_materialized` | Product-owned escalation/boundary contract, integration template fields, and closure policy note exist in Directive Workspace. |
| `autoresearch` | `routed_out_of_architecture` | Remaining real work is Forge runtime follow-up, not Architecture product materialization. |
| `agentics` | `routed_out_of_architecture` | Remaining real work is Forge playbook and runtime follow-up, not Architecture product materialization. |
| `mini-swe-agent` | `routed_out_of_architecture` | Remaining real work is Forge fallback-lane operationalization, not Architecture product materialization. |

Current estimate:
- in-scope Architecture denominator: 6 candidates
- materialized: 6
- partial: 0
- doc-only or planned: 0
- current completion estimate: 100%

Operational shorthand:
- treat current Architecture completion as `100%` for the current adopted-set cycle
- future work, if opened, should be a new Architecture slice rather than unresolved debt from the current adopted set

Boundary note:
- canonical `shared/lib/` migration closes the old “Mission Control-only helper” gap for structured fallback, lifecycle artifact assembly, and integration artifact generation
- Mission Control now consumes those helpers as host-local mirrors instead of defining them as the product owner

## Exit Criteria For Current Architecture Cycle

Current-cycle Architecture is done when all of the following are true:
- every in-scope adopted Architecture candidate is either `product_materialized`, `reference_only`, or explicitly removed from Architecture scope
- no adopted Architecture candidate remains `doc_only_or_planned`
- all routed-to-Forge candidates have explicit handoff records and are no longer treated as Architecture debt
- the current core product artifact families are materially present:
  - stage handoff
  - evidence and citation
  - promotion quality
  - lifecycle transition policy
  - escalation and scheduler boundary policy

## Corpus Normalization Baseline

The Architecture corpus normalization record (`architecture/02-experiments/2026-03-22-architecture-corpus-normalization.md`) provides the first classified inventory of all adopted Architecture work.

Key findings (corrected baseline, revision 2):
- 24 adopted records classified by usefulness level (14 structural, 3 direct/Forge-routed, 7 meta, 4 with self-improvement evidence)
- 31 reference patterns assessed (8 promoted to shared contracts, 23 reference-only)
- 8 deferred/rejected records classified with per-candidate lifecycle status
- 3 meta-useful adoptions still lack self-improvement evidence (discovery-gap-priority-worklist, source-adaptation-chain, source-adaptation-integration)
- All pre-doctrine records exempt from retroactive rewrite but classified for future reference

This baseline should be used as input for the first Architecture cycle evaluation.

## Artifact Lifecycle Governance

All Architecture records are governed by `shared/contracts/architecture-artifact-lifecycle.md`, which defines:
- required fields per state (experiment, adopted, reference-pattern, deferred)
- transition rules between states
- adopted-to-Forge handoff rules
- reference-pattern admission and retirement criteria
- pre-doctrine record handling

New adopted records must include usefulness-level classification and Forge threshold check.

## Immediate Remaining Architecture Work

Do not open a broad new candidate wave before these are resolved:
- none for the current adopted-set closure baseline

## Adoption Quality Rule

Architecture completion is not just materialization. It is materialization with evidence of adaptation and improvement quality.

When evaluating whether an adopted candidate is well-adopted (not just present):
- check that the adoption used `shared/contracts/architecture-adoption-criteria.md` for artifact type selection
- check that adaptation quality is `strong` or `adequate` with substantive delta evidence
- check that meta-useful adoptions include a self-improvement evidence block per `shared/contracts/architecture-self-improvement-contract.md`
- check that direct-useful adoptions have a Forge handoff plan (even if deferred)
- check that source-driven Architecture work passes `shared/contracts/transformation-artifact-gate.md` with at least one transformed Directive-owned artifact
- do not treat note movement, folder movement, queue updates, or prose expansion without transformed operating value as completed processing

A `product_materialized` status with `weak` adaptation quality or missing delta evidence is a completion accounting concern, not a success.

## Self-Improvement Tracking Rule

At the start of each new Architecture cycle, perform a cycle evaluation using `shared/templates/architecture-cycle-evaluation.md`.

This evaluation:
- measures adaptation coverage, improvement coverage, and meta-usefulness rate
- verifies whether previous meta-useful claims were confirmed
- identifies the weakest self-improvement category for next-cycle investment

Architecture completion without cycle evaluation is activity without self-improvement accountability.

## Anti-Drift Rule

When summarizing Architecture progress:
- say "product-owned Directive Workspace materialization" first
- mention Mission Control only as host consumption, host enforcement, or host proof
- do not describe host-side scripts as if they mean Directive Architecture itself is finished
