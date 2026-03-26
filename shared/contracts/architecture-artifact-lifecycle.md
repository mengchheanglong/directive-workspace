# Architecture Artifact Lifecycle

Profile: `architecture_artifact_lifecycle/v2`

## Purpose

Define the taxonomy, required fields, transition rules, and lifecycle governance for Architecture artifacts.

Without this contract, Architecture records have no type system. Experiments, adopted records, reference patterns, and deferred decisions look structurally similar, differ in ad hoc ways, and transition between states without explicit criteria.

## Artifact states

Every Architecture artifact exists in exactly one of these states:

### `experiment`

Location: `architecture/02-experiments/`

An experiment is a bounded proof slice. It tests whether a mechanism has extractable value.

Required fields:
- candidate id or name
- experiment date
- owning track (must be Architecture)
- objective (one sentence)
- bounded scope (what is in, what is out)
- validation gates
- rollback path
- result summary
- next decision (explicit: adopt / defer / reject / needs-more-evidence)

An experiment may reference `source-analysis-contract` and `adaptation-decision-contract` when it involves source-driven work, but experiments are not required to satisfy adoption criteria.

### `adopted`

Location: `architecture/03-adopted/`

An adopted record declares that a mechanism has been accepted into the Architecture operating system and materialized as a product-owned artifact.

Required fields:
- adoption date
- candidate id or name
- status class (per `architecture-completion-rubric`)
- usefulness level: `direct` | `structural` | `meta`
- materialized artifacts (list of product-owned file paths)
- rationale (why adopted, what value it provides)
- rollback path

Required for source-driven adoptions:
- source reference (pinned commit or URL)
- extracted patterns (what was taken from the source)
- excluded baggage (what was deliberately left behind)
- adaptation evidence (how the extracted value was reshaped for Directive Workspace, per `adaptation-decision-contract`)

Required for meta-useful adoptions:
- self-improvement evidence block (per `architecture-self-improvement-contract`)

Recommended for all adoptions:
- adoption criteria reference (per `architecture-adoption-criteria`)
- Runtime handoff note (explicit: yes with ref, or no with threshold justification)

### `reference-pattern`

Location: `architecture/05-reference-patterns/`

A reference pattern is a preserved mechanism or policy that is useful as context but has not been promoted to a shared product-owned artifact.

Required fields:
- date
- candidate id or source
- track (Architecture)
- type: `pattern` | `policy` | `contract-draft` | `analysis-notes`
- retained value (what is worth preserving)
- excluded baggage (what was deliberately excluded)

Admission criteria:
- it has surviving value worth preserving as context
- it is not yet ready for promotion to shared contracts/schemas/templates
- or it has been deliberately kept as reference without enforcement intent

A reference pattern is not:
- a parking lot for unfinished work (use experiments or deferred)
- a source note or repo commentary (use `sources/`)
- a draft contract that should be in shared/contracts (promote it)

### `deferred`

Location: `architecture/04-deferred-or-rejected/`

A deferred record preserves a decision not to adopt, with re-entry criteria.

Required fields:
- decision date
- candidate id or name
- decision: `defer` | `reject`
- reason (specific, not vague)
- re-entry criteria (for defer: what would trigger re-evaluation)
- extracted value retained (what was worth noting even though adoption was declined)
- excluded as baggage (what was the primary rejection driver)

## Runtime handoff is a transition, not a state

`Runtime-handoff` is not a fifth Architecture artifact state.

It is a transition outcome recorded on top of an Architecture adoption when:
- the Architecture value has been captured
- the remaining work is runtime operationalization
- the Runtime threshold question is answered "no" - the mechanism would not be valuable without a runtime surface

Track Runtime handoff through:
- the adopted Architecture record
- `shared/contracts/architecture-to-runtime.md`
- any downstream Runtime record that accepts the handoff

## Transition rules

### experiment -> adopted

Requirements:
- experiment result is positive
- adoption criteria are met (per `architecture-adoption-criteria`)
- at least one product-owned artifact is materialized
- usefulness level is classified
- if meta-useful, self-improvement evidence block is included

### experiment -> deferred

Requirements:
- experiment completed but value is insufficient, premature, or blocked
- re-entry criteria are explicit
- extracted value retained is documented

### experiment -> reference-pattern

Requirements:
- experiment produced useful context but not enough for adoption
- the value is worth preserving for future reference
- the mechanism does not belong in shared contracts/schemas/templates yet

### reference-pattern -> adopted

Trigger:
- a subsequent Architecture slice determines the reference pattern has enough value and specificity to become a shared product-owned artifact
- the promotion goes through the normal adoption criteria

Evidence:
- the promoting slice must explain what changed since the reference pattern was created
- the promoted artifact must be materialized in shared contracts/schemas/templates/lib

### reference-pattern -> retired

Trigger:
- the reference pattern's value has been fully absorbed by a shared contract, schema, template, or lib surface
- or the reference pattern is no longer relevant to the active mission

Retirement checklist:
1. Identify the absorbing artifact (shared contract, schema, template, or lib module).
2. Verify that all substantive value from the reference pattern is represented in the absorbing artifact.
3. Add a retirement header to the reference pattern file: `Status: retired (<date>)` and `Absorbed by: <path to absorbing artifact>`.
4. Update the corpus normalization record to reflect the retirement.
5. Do not delete the file - preserve history per doctrine.

Retirement candidates are identified during corpus normalization or cycle evaluation. A reference pattern is a retirement candidate when:
- a shared contract exists that covers the same mechanism
- the reference pattern adds no value beyond what the shared contract provides
- no other Architecture work references the reference pattern as a dependency

### adopted -> Runtime handoff

Requirements:
- Architecture has captured its own value as a product-owned artifact
- the remaining work is runtime operationalization
- the Runtime threshold check confirms the mechanism needs a runtime surface
- an explicit `architecture-to-runtime` handoff record exists or is explicitly queued as the next step

## Classification shortcuts

For quick classification of an Architecture record:

1. Does it test a hypothesis? -> `experiment`
2. Does it declare a materialized product artifact? -> `adopted`
3. Does it preserve useful context without enforcement? -> `reference-pattern`
4. Does it explain why something was not adopted? -> `deferred`
5. Does it describe runtime work remaining after Architecture is done? -> still `adopted`, with a Runtime handoff note

## Pre-doctrine records

Records created before the source-adaptation chain contracts (before 2026-03-22) are governed by this lifecycle contract going forward but are not required to be retroactively rewritten.

Instead, pre-doctrine records should be:
- classified by usefulness level in the corpus normalization record
- assessed for contract coverage gaps
- enriched with normalization annotations when reviewed or referenced in new work
- promoted or retired if their state no longer matches their actual role

### Normalization annotation policy

When a pre-doctrine record is reviewed, referenced in new work, or selected for normalization, add a `## Normalization annotation (retroactive, <date>)` section at the end of the record. Do not modify the original content.

Required annotation fields:

**Lifecycle classification:**
- Origin: `source-driven` | `internally-generated`
- Usefulness level: `direct` | `structural` | `meta`
- Meta-usefulness category (if meta): per `architecture-self-improvement-contract`
- Status class: per `architecture-completion-rubric`
- Runtime threshold check: yes/no with reasoning

**Contract coverage assessment:**
- Source analysis: performed / not performed (pre-doctrine) / n/a (internal)
- Adaptation decision: performed / implicit / not performed / n/a
- Adoption criteria: applied / not applied / n/a
- Adaptation quality: `strong` | `adequate` | `weak` | `n/a` - with brief justification
- Improvement quality: `strong` | `adequate` | `weak` | `n/a` - with brief justification

**Self-improvement evidence (for meta-useful records only):**
- Per `architecture-self-improvement-contract` evidence block structure
- Label as "retroactive identification" to distinguish from forward-looking evidence

Rules:
- annotations are additive - they do not replace or modify the original record content
- annotations should be honest about gaps - "not performed (pre-doctrine)" is a valid classification
- do not fabricate adaptation or improvement evidence that does not exist in the record
- a pre-doctrine record with a normalization annotation is "normalized"; one without is "classified only"

### Historical-record review checklist

When reviewing a pre-doctrine adopted record, check these items:

1. Is the record in the correct state? An adopted record in `03-adopted/` should describe materialized product-owned artifacts. If it describes work-in-progress, it may belong in experiments. If it describes a decision not to adopt, it belongs in deferred.
2. Is the usefulness level correct? Check whether the mechanism improves the engine's own source-consumption ability (meta), improves the framework structure (structural), or provides runtime value (direct/Runtime).
3. Are the materialized artifacts still present? Verify that the file paths listed in the record still exist. If not, the record may need a staleness note.
4. Is the status class still accurate? A `product_materialized` record whose artifacts have been moved or deleted may need reclassification.
5. Does the record have a normalization annotation? If not, add one per the normalization annotation policy above.
6. For meta-useful records: is self-improvement evidence present? If missing, add a retroactive identification block.

## Rules

- Every Architecture artifact must be in exactly one state.
- State must be inferable from the artifact's location and content.
- Runtime handoff is a transition note on an adopted record, not a separate state.
- Transitions require explicit evidence, not implicit drift.
- Reference patterns are not a default parking state - use experiments for work-in-progress and deferred for rejected/blocked work.
- The corpus normalization record tracks the classification state of all adopted Architecture work.

## Relationship to other contracts

- Works with: `architecture-adoption-criteria` (adoption readiness and artifact type selection)
- Works with: `architecture-self-improvement-contract` (meta-usefulness evidence for adopted records)
- Works with: `architecture-completion-rubric` (status classes for completion tracking)
- Works with: `architecture-to-runtime` (Runtime handoff transition)
- Governs: all records in `architecture/02-experiments/`, `03-adopted/`, `04-deferred-or-rejected/`, `05-reference-patterns/`
