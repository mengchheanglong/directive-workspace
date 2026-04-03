# dependency-cruiser Rules Reference Bounded Architecture Result

- Candidate id: dw-source-dependency-cruiser-rules-reference-2026-03-30
- Candidate name: dependency-cruiser Rules Reference
- Experiment date: 2026-03-30
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by codex-architecture-boundary-pass from bounded start `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-bounded-start.md`

- Objective: Determine whether dependency-cruiser can truthfully express one bounded `dw-state` facade boundary proposal without broadening into repo-wide enforcement or misdescribing the current private-file import graph.
- Bounded scope:
- Keep this at one Architecture experiment slice.
- Preserve human review before any later enforcement or broader dependency-policy work.
- Do not open repo-wide dependency-cruiser adoption from this stub alone.
- Inputs:
- dependency-cruiser rules reference confirms that custom dependency rules live under `forbidden`, that rule conditions use `from`/`to`, and that `path` plus `pathNot` are valid matchers in both sections.
- Current repo truth confirms `shared/lib/dw-state.ts` is the canonical read surface used by external consumers, but also confirms `shared/lib/dw-state/runtime.ts` imports `shared/lib/dw-state/shared.ts`.
- Expected output:
- One bounded Architecture experiment slice that either materializes the single dw-state facade-boundary proposal or records why the requested boundary is not truthful in current repo state.
- Validation gate(s):
- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before any broader dependency-boundary adoption.
- Failure criteria: Current repo truth shows the requested facade-only importer boundary is false, so a concrete proposal would misdescribe the product.
- Rollback: Keep the result at experiment status and do not integrate any boundary enforcement until the target rule matches current repo truth.
- Result summary: The source did yield one real Architecture pattern: dependency-cruiser can express a narrow private-boundary rule with a single `forbidden` rule using `from.pathNot` to exclude allowed importers and `to.path` to match private targets, authored in JavaScript config and validated against dependency-cruiser's schema. However, the exact proposal requested for this slice is not truthful in current repo state. `shared/lib/dw-state.ts` is the canonical external read facade, but `shared/lib/dw-state/runtime.ts` is also a legitimate current importer of `shared/lib/dw-state/shared.ts`. That means the requested rule "only `shared/lib/dw-state.ts` may import `shared/lib/dw-state/shared.ts` and `shared/lib/dw-state/runtime.ts`" would be false as written. The bounded retained value is the rule-shape pattern plus an explicit stop: do not materialize a concrete facade-only dependency-cruiser config artifact until the implementation is refactored or the allowed-importer set is restated truthfully. Out of scope: repo-wide dependency-cruiser adoption, `npm run check` integration, or protecting any boundary beyond this one `dw-state` seam.
- Evidence path:
- Bounded start: `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-dependency-cruiser-rules-reference-2026-03-30-5f3a1d40.md`
- Discovery routing record: `discovery/routing-log/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-routing-record.md`
- Closeout decision artifact: `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-bounded-result-adoption-decision.json`
- Next decision: `defer`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `structural`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `adequate`
- Improvement quality: `skipped`
- Meta-useful: `no`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-bounded-result.md`

## Extracted rule shape

```js
module.exports = {
  forbidden: [
    {
      name: "no-private-dw-state-imports-outside-allowed-importers",
      comment: "Keep private dw-state implementation files behind the allowed facade/importer set.",
      severity: "error",
      from: {
        pathNot: "^shared/lib/dw-state\\.ts$"
      },
      to: {
        path: "^shared/lib/dw-state/(shared|runtime)\\.ts$"
      }
    }
  ]
};
```

This is the bounded dependency-cruiser pattern extracted from the source. It is not adopted as a concrete proposal for the current repo because the allowed importer set above is false as written today.

## Closeout decision

- Verdict: `stay_experimental`
- Rationale: The source produced a valid narrow rule pattern, but the exact facade-only boundary requested for this slice contradicts current repo truth.
- Review result: `approved`
- Review score: `4`
