# ESLint Custom Rule System Bounded Architecture Start

- Candidate id: dw-source-eslint-custom-rules-2026-03-30
- Candidate name: ESLint Custom Rule System
- Experiment date: 2026-03-30
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by codex-mcp-preflight-pass from routed handoff `architecture/02-experiments/2026-03-30-dw-source-eslint-custom-rules-2026-03-30-engine-handoff.md`

- Objective: Materialize the adapted mechanism as engine-owned product logic only after the staged proof boundary for "improve engine self-improvement quality" remains explicit through adaptation_complete.
- Bounded scope:
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.
- Inputs:
- Engine-building mission pressure: extract one Architecture-owned checker-definition schema pattern with explicit metadata, option-shape validation, severity posture, suppression boundaries, and self-test expectations so Directive Workspace can improve proof/evaluator quality without reopening runtime execution, planner-driven execution, host-admin seams, or structural-mapping expansion.
- selected_via:mcp-outside-pass | stronger_than:dropbox-data-checking-note,gpt-researcher-mcp-server-monitor,repo-ask-note,spectral-rulesets-lower-score,opa-policy-testing-broader-policy-engine | supporting_sources:https://eslint.org/docs/latest/use/suppressions,https://eslint.org/docs/latest/use/configure/rules,https://eslint.org/docs/latest/integrate/nodejs-api#ruletester | retained_value:checker-definition-schema-pattern
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `adaptation_complete`
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Keep the result at experiment status and do not integrate it into the engine until the staged proof boundary is clearer.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-30-dw-source-eslint-custom-rules-2026-03-30-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-eslint-custom-rules-2026-03-30-82144c93.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-30T00-00-00-000Z-dw-source-eslint-custom-rules-2026-03-30-82144c93.md`
- Discovery routing record: `discovery/routing-log/2026-03-30-dw-source-eslint-custom-rules-2026-03-30-routing-record.md`
- Next decision: `needs-more-evidence`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/02-experiments/2026-03-30-dw-source-eslint-custom-rules-2026-03-30-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-30-dw-source-eslint-custom-rules-2026-03-30-engine-handoff.md`
