# Architecture Adoption Decision Corpus Adopted

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes`
- Decision: `adopted`
- Status: `product_materialized`

## Problem

Directive Workspace had executable review resolution, adoption resolution, machine-readable adoption artifacts, and cycle-decision summarization, but no stable on-disk corpus of those decisions beside the adopted records they described.

That weakened the system in a predictable way:
- cycle evaluation still needed synthetic artifact inputs to exercise the summary lane
- corpus review still depended on prose-first interpretation of adopted records
- the Decide step had no retained machine-readable footprint in the Architecture corpus itself

## Adopted result

Added an on-disk Architecture decision corpus in `architecture/02-adopted/` for six real adopted slices:
1. `2026-03-23-openmoss-review-feedback-lib-adoption-decision.json`
2. `2026-03-23-architecture-review-resolution-lib-adoption-decision.json`
3. `2026-03-23-architecture-adoption-resolution-lib-adoption-decision.json`
4. `2026-03-23-architecture-adoption-artifacts-lib-adoption-decision.json`
5. `2026-03-23-architecture-cycle-decision-summary-lib-adoption-decision.json`
6. `2026-03-23-scientify-literature-monitoring-runtime-handoff-adoption-decision.json`

Added an executable corpus checker:
- `mission-control/scripts/check-directive-architecture-adoption-decision-corpus.ts`

Bound the corpus into a real evaluation wave:
- `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-06.md`

## Why this improves the system

This makes Architecture better at its job because its Decide-step output is now retained as part of the Architecture corpus itself.

That means later system lanes can consume real decision artifacts instead of reconstructing verdict/usefulness/handoff state from prose alone.

## Rollback

If the retained adoption-decision corpus proves noisy or misleading:
- remove the six `*-adoption-decision.json` artifacts
- remove `mission-control/scripts/check-directive-architecture-adoption-decision-corpus.ts`
- remove this adopted record and the companion experiment record
- revert the workflow and changelog updates tied to this slice

