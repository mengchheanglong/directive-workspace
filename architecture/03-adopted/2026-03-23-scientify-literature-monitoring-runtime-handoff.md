# Architecture To Runtime Handoff - Scientify Literature Monitoring

Date: 2026-03-23
Track: Architecture -> Runtime
Type: mixed-value source handoff

## Candidate

- Candidate id: `scientify-literature-monitoring`
- Candidate name: `scientify literature monitoring workflow`

## Originating Architecture record

- Originating Architecture record:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-23-scientify-mixed-value-partition-adopted.md`
- Mixed-value partition ref:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-23-scientify-mixed-value-partition-adopted.md`

## Extracted mechanism kept in Architecture

- Architecture keeps:
  - the mixed-value partition mechanism
  - the promotion-quality gate pattern already retained from Scientify
  - the evidence-backed stage/evidence packet logic reused from prior packet slices

These remain Architecture-owned because they improve how Directive Workspace judges, partitions, and governs future source work even if no runtime follows.

## Runtime value to operationalize in Runtime

- A bounded recurring research-monitoring workflow that:
  - runs on a schedule or trigger
  - queries paper sources (`arXiv`, `OpenAlex`)
  - filters/ranks against a bounded topic or mission signal
  - emits a concise digest to a chosen delivery surface

The runtime value is not the entire Scientify plugin.
It is the narrower reusable monitoring workflow surface.

## Proposed host

- Proposed host: `OpenClaw` as the first reference host

Reason:
- the source runtime is already plugin/scheduler oriented
- OpenClaw already owns persistent orchestration and scheduled execution concepts
- Runtime should still keep the workflow design host-neutral enough that later hosts can adopt it

## Proposed runtime surface

- Proposed runtime surface:
  - Runtime-owned bounded workflow or source-pack for recurring literature monitoring
  - initial reference behavior:
    - topic input
    - bounded source query
    - ranking/filter step
    - digest rendering step
    - delivery adapter boundary

## Runtime guardrails

- Do not import the entire Scientify runtime/plugin stack.
- Keep retrieval sources bounded and configurable.
- Keep delivery adapters separated from ranking/filter logic.
- Require explicit degraded-state handling when source retrieval is empty or weak.
- Preserve quality-gate output on delivered digests when evidence quality is below threshold.
- Keep the host-facing workflow reversible and bounded; no broad autonomous research pipeline in the first Runtime slice.

## Required proof

- one bounded Runtime proof that the monitoring workflow can:
  - fetch a small candidate pool
  - rank/filter deterministically enough for inspection
  - emit a digest artifact
  - degrade safely when evidence quality is insufficient

- one Architecture-to-Runtime parity proof that the runtime surface still respects:
  - the retained promotion-quality gate logic
  - bounded candidate selection
  - explicit delivery failure/degraded-state visibility

## Required gates

- Runtime-side bounded proof/evaluator gate for digest quality and degraded-state handling
- relevant Directive Runtime/runtime checks for the chosen runtime surface
- no host-wide widening unless the runtime candidate actually touches broad host behavior

## Rollback note

- If the Runtime slice fails, keep the Architecture partition and promotion-quality patterns
- remove only the runtime follow-up surface and its host bindings
- do not revert the Architecture mixed-value partition work

## Adaptation and improvement evidence

- Source-analysis record ref:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-23-scientify-mixed-value-partition-source-analysis.md`
- Adaptation-decision record ref:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-23-scientify-mixed-value-partition-adaptation.md`
- Adaptation summary:
  - the raw Scientify source mixed staged workflow logic, evidence-quality logic, and plugin runtime behavior together
  - Directive adapted that into a partitioned model, keeping Architecture-owned split logic while isolating one bounded runtime candidate
- Improvement summary:
  - the handoff is now based on an explicit mixed-value partition rather than ad hoc “maybe Runtime later” language
  - Runtime receives a narrower reusable workflow candidate, not the whole plugin
- Value handed to Runtime:
  - a bounded recurring literature-monitoring workflow design, informed by the adapted Scientify split and constrained by Directive-owned quality/partition logic

## Meta-usefulness flag

- Meta-useful: `yes`
- Reason:
  - the runtime candidate is direct-useful, but the handoff itself also improves Directive Workspace's handoff quality by showing how mixed-value sources can yield a precise Runtime follow-up without losing Architecture-owned value
