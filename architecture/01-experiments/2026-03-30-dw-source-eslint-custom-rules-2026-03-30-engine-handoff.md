# ESLint Custom Rule System Engine-Routed Architecture Experiment

Date: 2026-03-30
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-eslint-custom-rules-2026-03-30`
- Source reference: `https://eslint.org/docs/latest/extend/custom-rules`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-eslint-custom-rules-2026-03-30-82144c93.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-eslint-custom-rules-2026-03-30-82144c93.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-30-dw-source-eslint-custom-rules-2026-03-30-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Materialize the adapted mechanism as engine-owned product logic only after the staged proof boundary for "improve engine self-improvement quality" remains explicit through adaptation_complete.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## Inputs

  - Engine-building mission pressure: extract one Architecture-owned checker-definition schema pattern with explicit metadata, option-shape validation, severity posture, suppression boundaries, and self-test expectations so Directive Workspace can improve proof/evaluator quality without reopening runtime execution, planner-driven execution, host-admin seams, or structural-mapping expansion.
  - selected_via:mcp-outside-pass | stronger_than:dropbox-data-checking-note,gpt-researcher-mcp-server-monitor,repo-ask-note,spectral-rulesets-lower-score,opa-policy-testing-broader-policy-engine | supporting_sources:https://eslint.org/docs/latest/use/suppressions,https://eslint.org/docs/latest/use/configure/rules,https://eslint.org/docs/latest/integrate/nodejs-api#ruletester | retained_value:checker-definition-schema-pattern

## Validation gate(s)

  - `adaptation_complete`
  - `improvement_complete`
  - `engine_boundary_preserved`
  - `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Keep the result at experiment status and do not integrate it into the engine until the staged proof boundary is clearer.

## Next decision

- `needs-more-evidence`
