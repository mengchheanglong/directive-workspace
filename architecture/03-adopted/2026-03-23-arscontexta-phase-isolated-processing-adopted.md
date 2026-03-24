# Adopted: Arscontexta Phase-Isolated Processing

- Adopted date: `2026-03-23`
- Owning track: `Architecture`
- Status: `product_materialized`
- Origin: `source-driven`
- Usefulness level: `meta`
- Source id: `dw-src-arscontexta-phase-isolation`

## Problem

The first Architecture cycle evaluation showed that Directive Workspace had become strong at governance and evaluation, but remained weak at explicit adaptation execution.

The specific failure mode was:
- the system had contracts for source analysis and adaptation
- but no explicit execution discipline for keeping high-judgment phases isolated
- and no standard packet for passing state through artifacts instead of chat continuity

That made Architecture better at describing adaptation than at executing it cleanly.

## Source

- Primary source: `C:\Users\User\.openclaw\workspace\agent-lab\tooling\arscontexta\methodology\adapt the four-phase processing pipeline to domain-specific throughput needs.md`
- Prior Directive reference pattern: `architecture/05-reference-patterns/2026-03-20-arscontexta-context-patterns.md`

## What was extracted

1. fresh-context-per-phase discipline for high-judgment work
2. file-over-context state transfer
3. judgment-first phase ordering
4. small-batch processing discipline

## What was excluded as baggage

- plugin runtime
- vault-generation machinery
- note-domain specific templates and vocabulary system
- generic knowledge-vault orchestration beyond Directive Workspace’s immediate operating need

## Materialized artifacts

1. Contract:
   - `shared/contracts/phase-isolated-processing.md`
2. Template:
   - `shared/templates/phase-handoff-packet.md`
3. Schema:
   - `shared/schemas/phase-handoff-packet.schema.json`
4. Source analysis:
   - `architecture/02-experiments/2026-03-23-arscontexta-phase-isolated-processing-source-analysis.md`
5. Adaptation decision:
   - `architecture/02-experiments/2026-03-23-arscontexta-phase-isolated-processing-adaptation.md`

## Why adopted

This source improves Directive Workspace at its own job.

It does not primarily add a new runtime capability.
It improves how the system executes bounded, source-driven work:
- clearer phase boundaries
- better adaptation execution
- less context bleed
- better handoff quality between analysis, adaptation, and proof

## Adoption criteria summary

- source analysis complete: yes
- adaptation decision complete: yes
- adaptation quality acceptable: yes (`strong`)
- delta evidence present: yes
- no unresolved baggage: yes

Artifact type selection:
- contract for execution discipline
- template for human-readable packet transfer
- schema for machine-readable packet validation

Forge threshold check:
- no Forge handoff
- the mechanism is valuable even if no runtime surface is built

## Self-improvement evidence

- Category: `adaptation_quality`
- Claim: Future Architecture source-driven slices will execute adaptation more cleanly because high-judgment phases can now be isolated and handed off through explicit packets instead of relying on long conversational continuity.
- Mechanism: `phase-isolated-processing.md` plus the packet template/schema create a reusable structure for phase boundaries and file-based state transfer.
- Baseline observation: The first Architecture cycle evaluation rated adaptation quality as `weak` and recorded `0%` explicit adaptation coverage across the pre-doctrine cycle.
- Expected effect: The next post-doctrine source-driven Architecture slice should be able to split analysis and adaptation into explicit phases with packet-based handoff and stronger adaptation evidence.
- Verification method: `next_cycle_comparison`

## Rollback

- remove `shared/contracts/phase-isolated-processing.md`
- remove `shared/templates/phase-handoff-packet.md`
- remove `shared/schemas/phase-handoff-packet.schema.json`
- remove the source analysis and adaptation records
- revert workflow and contract relationship updates introduced by this slice
