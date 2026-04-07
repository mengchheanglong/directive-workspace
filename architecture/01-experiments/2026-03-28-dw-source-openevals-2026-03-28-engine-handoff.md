# OpenEvals Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-openevals-2026-03-28`
- Source reference: `https://github.com/langchain-ai/openevals`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-openevals-2026-03-28-fb6c8e49.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-openevals-2026-03-28-fb6c8e49.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-28-dw-source-openevals-2026-03-28-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Open one NOTE-mode Architecture review to decide whether OpenEvals' evaluator-library patterns justify a later bounded Architecture adaptation for Directive Workspace evaluator quality and proof structure, without adopting OpenEvals itself as runtime capability.

## Bounded scope

- Keep this at one Architecture review slice.
- Preserve human review before any deeper Architecture chain or runtime adoption.
- Do not implement or operationalize OpenEvals from this stub alone.

## Inputs

- Evaluation quality and proof-backed adoption. Assess whether OpenEvals' evaluator primitives, LLM-as-judge patterns, prebuilt prompts, code and trajectory evaluation helpers, and lighter-weight evaluation contracts should improve Directive Workspace evaluator quality and proof structure without adopting OpenEvals itself as runtime capability.
- Official sources describe OpenEvals as an open-source evaluator package for LLM applications, with LLM-as-judge evaluators, prebuilt prompts, code/type-checking and agent-trajectory evaluators, Python and TypeScript support, and LangSmith integration. Retained value hypothesis: evaluator/proof-library patterns rather than direct runtime reuse.

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

Keep the source routed with this handoff only and do not open downstream implementation unless a narrower evaluator or proof mechanism becomes explicit.

## Next decision

- `needs-more-evidence`
