# Adopted: MetaClaw Generation Boundary

- Adopted date: `2026-03-23`
- Owning track: `Architecture`
- Status: `product_materialized`
- Origin: `source-driven`
- Usefulness level: `meta`
- Source id: `dw-src-metaclaw-generation-boundary`

## Problem

Directive Workspace had become better at source-driven Architecture work, packet reuse, mixed-value partitioning, and Architecture-to-Runtime handoff.

But it still lacked a clean rule for one important self-improvement question:

When the Architecture system materially changes itself, which older evidence should stop counting as confirmation of the new system?

Without an explicit boundary, the system could overclaim self-improvement by blending:
- historical baseline evidence
- pre-change proof
- and post-change confirmation

as if all three described the same generation of the Architecture system.

## Source

- Primary source:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\skill_manager.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\data_formatter.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\trainer.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\rollout.py`
- Prior Directive context:
  - `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-01.md`
  - `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-05.md`

## What was extracted

1. explicit generation boundary for self-improvement evidence
2. stale-evidence scope vs carry-forward scope
3. required reset actions after a material self-improving change
4. clean post-generation proof requirement

## What was excluded as baggage

- RL training loop details
- reward-model and optimizer behavior
- skill retrieval/evolution implementation
- rollout worker lifecycle

## Materialized artifacts

1. Contract:
   - `shared/contracts/self-improvement-generation-boundary.md`
2. Template:
   - `shared/templates/generation-boundary-note.md`
3. Schema:
   - `shared/schemas/generation-boundary-note.schema.json`
4. Source analysis:
   - `architecture/01-experiments/2026-03-23-metaclaw-generation-boundary-source-analysis.md`
5. Adaptation decision:
   - `architecture/01-experiments/2026-03-23-metaclaw-generation-boundary-adaptation.md`
6. Boundary note:
   - `architecture/01-experiments/2026-03-23-post-doctrine-architecture-generation-boundary.md`

## Why adopted

This source improves Directive Workspace at its own job.

The adopted value is not MetaClaw's RL stack.
The adopted value is the stricter evidence rule inside it:

- when the system changes itself, open a new generation
- do not count pre-generation evidence as clean confirmation of post-generation behavior
- keep historical context, but separate it from fresh proof

That directly improves Architecture self-improvement accounting and cycle-evaluation quality.

## Adoption criteria summary

- source analysis complete: yes
- adaptation decision complete: yes
- adaptation quality acceptable: yes (`strong`)
- delta evidence present: yes
- no unresolved baggage: yes

Artifact type selection:
- contract for the evidence-boundary rule
- template for recording concrete boundary openings
- schema for machine-checkable boundary notes

Runtime threshold check:
- no Runtime handoff
- the mechanism is valuable even if no runtime surface is built

## Self-improvement evidence

- Category: `evaluation_quality`
- Claim: Future Architecture cycle evaluations will make cleaner self-improvement claims because they can separate historical baseline evidence from post-change confirmation whenever the operating system materially changes itself.
- Mechanism: `self-improvement-generation-boundary.md` plus the boundary note template/schema create a reusable rule for boundary openings, stale-evidence exclusion, carry-forward allowances, and clean post-generation proof.
- Baseline observation: Prior cycle evaluations tracked category changes, but no explicit contract distinguished pre-change baseline context from valid post-change confirmation after a material self-improvement step.
- Expected effect: The next generation-sensitive Architecture review can show boundary openings explicitly and avoid blending old proof with new-system confirmation.
- Verification method: `next_cycle_comparison`

## Rollback

- remove `shared/contracts/self-improvement-generation-boundary.md`
- remove `shared/templates/generation-boundary-note.md`
- remove `shared/schemas/generation-boundary-note.schema.json`
- remove the source analysis and adaptation records
- remove `architecture/01-experiments/2026-03-23-post-doctrine-architecture-generation-boundary.md`
- revert workflow, self-improvement contract, cycle-evaluation template, and schema inventory updates introduced by this slice

