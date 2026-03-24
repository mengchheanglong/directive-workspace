# Adopted: GPT Researcher Adoption Decision Store Lib

- Adopted date: `2026-03-23`
- Owning track: `Architecture`
- Status: `product_materialized`
- Origin: `source-driven`
- Usefulness level: `meta`
- Source id: `dw-src-gpt-researcher-adoption-decision-store-lib`

## Problem

Directive Workspace had already built:
- a live Architecture closeout lane
- a retained adoption-decision writer
- a wave-evaluation loader

But the retained decision persistence itself still lived in Mission Control scripts.

That meant the system still had a weak seam:
- product-owned review/adoption logic
- but host-script-owned JSON persistence

The result was avoidable drift risk in the exact place Architecture now depends on machine-readable retained decisions.

## Source

- Primary source:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher\backend\server\report_store.py`
- Prior Directive context:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\architecture-closeout.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\architecture-cycle-decision-loader.ts`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\architecture-adoption-decision-writer.ts`

## What was extracted

1. atomic temp-file JSON write discipline
2. reusable get/list/upsert/delete store surface
3. store-owned path handling instead of caller-owned path handling
4. safe retained-artifact loading before later aggregation/evaluation

## What was excluded as baggage

- GPT Researcher report-id mapping
- Python async lock semantics
- backend research report API behavior
- report-store concerns unrelated to Directive record-adjacent artifact retention

## Materialized artifacts

1. Canonical shared lib:
   - `shared/lib/architecture-adoption-decision-store.ts`
2. Mission Control host mirror:
   - `mission-control/src/lib/directive-workspace/architecture-adoption-decision-store.ts`
3. Source analysis:
   - `architecture/02-experiments/2026-03-23-gpt-researcher-adoption-decision-store-source-analysis.md`
4. Adaptation decision:
   - `architecture/02-experiments/2026-03-23-gpt-researcher-adoption-decision-store-adaptation.md`

## Why adopted

This closes a real Architecture system gap.

The retained decision corpus is now supported by one canonical product-owned store instead of duplicated host-script file handling.

That improves Architecture at its actual job:
- emitting retained machine-readable decisions
- reloading them safely later
- evaluating waves from the retained system state instead of fragile path-copy logic

## Adoption criteria summary

- source analysis complete: yes
- adaptation decision complete: yes
- adaptation quality acceptable: yes (`strong`)
- delta evidence present: yes
- no unresolved baggage: yes

Artifact type selection:
- shared lib for executable product-owned persistence behavior

Forge threshold check:
- no Forge handoff
- the mechanism is valuable even if no runtime surface is promoted

## Self-improvement evidence

- Category: `evaluation_quality`
- Claim: Future Architecture closeout, backfill, and wave-evaluation work will become less drift-prone because retained decision persistence now runs through one canonical store instead of duplicated script-local JSON handling.
- Mechanism: `shared/lib/architecture-adoption-decision-store.ts` plus the Mission Control mirror now own atomic write, schema-guarded read, and record-adjacent retained decision listing for Architecture.
- Baseline observation: the Architecture closeout lane existed, but retained decision persistence was still implemented separately in host scripts.
- Expected effect: later Architecture slices can emit and reload retained decision artifacts through one shared path, making cycle evaluation more trustworthy and easier to extend.
- Verification method: `structural_inspection`

## Rollback

- remove `shared/lib/architecture-adoption-decision-store.ts`
- remove `mission-control/src/lib/directive-workspace/architecture-adoption-decision-store.ts`
- revert the closeout/writer/backfill/loader wiring changes
- revert boundary inventory, workflow, and shared-lib README updates
- remove the source analysis and adaptation records
