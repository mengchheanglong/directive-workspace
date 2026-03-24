# Architecture to Forge Handoff: scientify literature monitoring

Date: 2026-03-23
Handoff type: formal forward handoff

## Required Fields (per shared/contracts/architecture-to-forge.md)

- Candidate id: `scientify-literature-monitoring`
- Originating Architecture record: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-23-scientify-mixed-value-partition-adopted.md`
- Mixed-value partition ref: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-23-scientify-mixed-value-partition-adopted.md`
- Extracted mechanism kept in Architecture: mixed-value partition logic, promotion-quality gate logic, and evidence-backed stage/evidence packet logic
- Runtime value to operationalize in Forge: one bounded recurring literature-monitoring workflow that queries a small candidate pool, ranks and filters it against a bounded topic signal, and emits an inspectable digest artifact through a delivery-adapter boundary
- Proposed host: `OpenClaw` as first reference host
- Proposed runtime surface: Forge-owned bounded workflow or source-pack candidate for recurring literature monitoring with topic input, bounded source query, deterministic ranking/filter step, digest rendering step, and delivery adapter boundary
- Runtime guardrails:
  - keep the slice bounded to literature monitoring only
  - do not import the whole Scientify plugin/runtime stack
  - keep retrieval sources bounded and configurable
  - keep delivery adapters separated from ranking/filter logic
  - require degraded-state handling when evidence quality is weak or source retrieval is empty
  - keep the first Forge slice host-neutral enough that later hosts can adopt it
- Required proof:
  - one bounded Forge proof that the workflow can fetch a small candidate pool, rank/filter deterministically enough for inspection, and emit a digest artifact
  - one bounded degraded-state proof showing explicit visibility when evidence quality is insufficient
  - one Architecture-to-Forge parity proof showing the runtime slice still respects the retained promotion-quality gate logic and bounded candidate selection
- Required gates:
  - Forge-side bounded proof/evaluator gate for digest quality
  - Forge-side bounded proof/evaluator gate for degraded-state handling
  - relevant Directive Forge/runtime checks for the chosen runtime surface
  - no broad host-wide widening unless the slice actually touches broad host behavior
- Rollback note: if the Forge slice fails, keep the Architecture partition and promotion-quality patterns, remove only the runtime follow-up surface and its host bindings, and do not revert the Architecture mixed-value partition work

## Adaptation And Improvement Evidence

- Source-analysis record ref: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-23-scientify-mixed-value-partition-source-analysis.md`
- Adaptation-decision record ref: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-23-scientify-mixed-value-partition-adaptation.md`
- Adaptation summary: Directive separated the raw Scientify source into Architecture-owned split logic and one bounded runtime candidate, instead of carrying the whole plugin/runtime surface into Forge.
- Improvement summary: Forge now receives a narrower reusable literature-monitoring workflow candidate backed by explicit partition logic and promotion-quality guardrails, rather than an ad hoc "maybe plugin later" runtime idea.
- Value handed to Forge: adapted and improved bounded literature-monitoring workflow design, constrained by Directive-owned quality, partition, and evidence-visibility logic

## Meta-Usefulness Flag

- Meta-useful: `yes`
- Reason: the runtime candidate is direct-useful, but the handoff itself improves Directive Workspace's mixed-value Architecture-to-Forge handoff quality by showing how to preserve Architecture-owned value while still opening a precise runtime follow-up.

## Execution Status

- Forge follow-up: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\follow-up\2026-03-23-scientify-literature-monitoring-runtime-followup.md`
- Runtime slice executed: pending
- Proof artifact: pending
- Promotion record: pending
- Registry entry: pending
- Quality gate result: pending

## Handoff Rule Verification

- Architecture keeps the extracted framework pattern: YES - mixed-value partition logic, promotion-quality gate logic, and retained packet logic remain Architecture-owned
- Forge owns the callable follow-up path: YES - the bounded recurring literature-monitoring candidate is now opened as a Forge follow-up rather than a further Architecture-only slice

## Why This Record Exists

This is the first real forward mixed-value handoff opened from the new Architecture partition system. It formalizes the scientify literature-monitoring candidate under the Architecture-to-Forge contract so Forge can accept one bounded runtime follow-up without importing the whole Scientify runtime or losing the Architecture-owned partition logic that made the handoff safe.
