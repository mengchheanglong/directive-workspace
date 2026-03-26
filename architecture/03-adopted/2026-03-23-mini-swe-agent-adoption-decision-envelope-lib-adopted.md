# Adopted: mini-SWE-agent Adoption Decision Envelope Lib

- Adopted date: `2026-03-23`
- Owning track: `Architecture`
- Status: `product_materialized`
- Origin: `source-driven`
- Usefulness level: `meta`
- Source id: `dw-src-mini-swe-agent-adoption-decision-envelope-lib`

## Problem

Directive Workspace had already made Architecture adoption decisions machine-readable.

But the retained artifacts still had one structural weakness:
- no explicit format identifier
- no canonical merge primitive for optional nested sections

That meant later Architecture generations would have to assume every retained decision JSON had the same implicit shape.

For a self-improving system, that is weak.

## Source

- Primary source:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent\src\minisweagent\utils\serialize.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent\src\minisweagent\agents\default.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent\docs\usage\output_files.md`
- Prior Directive context:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\architecture-adoption-artifacts.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\architecture-adoption-decision-store.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\architecture-adoption-decision.schema.json`

## What was extracted

1. stable artifact-format identity
2. recursive nested merge for artifact sections
3. explicit skipping of unset optional values during artifact construction

## What was excluded as baggage

- mini-SWE-agent trajectory payloads
- run config serialization
- agent/model/environment metadata
- full trajectory persistence logic

## Materialized artifacts

1. Canonical shared lib:
   - `shared/lib/architecture-adoption-decision-envelope.ts`
2. Mission Control host mirror:
   - `mission-control/src/lib/directive-workspace/architecture-adoption-decision-envelope.ts`
3. Source analysis:
   - `architecture/02-experiments/2026-03-23-mini-swe-agent-adoption-decision-envelope-source-analysis.md`
4. Adaptation decision:
   - `architecture/02-experiments/2026-03-23-mini-swe-agent-adoption-decision-envelope-adaptation.md`

## Why adopted

This makes the retained Architecture decision lane more durable.

The system can now distinguish the current adoption-decision artifact format explicitly and can compose nested optional sections through one reusable helper instead of hand-filtered object construction.

That is a real Architecture-system improvement, not just another schema note.

## Adoption criteria summary

- source analysis complete: yes
- adaptation decision complete: yes
- adaptation quality acceptable: yes (`strong`)
- delta evidence present: yes
- no unresolved baggage: yes

Artifact type selection:
- shared lib for executable retained-artifact construction behavior

Runtime threshold check:
- no Runtime handoff
- the mechanism is valuable even if no runtime surface is promoted

## Self-improvement evidence

- Category: `evaluation_quality`
- Claim: Future Architecture generations will handle retained decision artifacts more safely because every artifact now carries an explicit format identifier and is assembled through one canonical envelope helper.
- Mechanism: `shared/lib/architecture-adoption-decision-envelope.ts` now defines the canonical `decision_format` and the merge behavior used by `shared/lib/architecture-adoption-artifacts.ts`.
- Baseline observation: retained Architecture decision artifacts were machine-readable but had no explicit format identity and no reusable merge discipline for nested optional blocks.
- Expected effect: later schema or closeout-lane upgrades can distinguish old versus current retained artifacts cleanly instead of assuming one implicit shape forever.
- Verification method: `structural_inspection`

## Rollback

- remove `shared/lib/architecture-adoption-decision-envelope.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-adoption-decision-envelope.ts`
- revert adoption-artifact builder, schema, workflow, and README changes
- backfill the retained decision corpus back to the previous format if needed
- remove the source analysis and adaptation records
