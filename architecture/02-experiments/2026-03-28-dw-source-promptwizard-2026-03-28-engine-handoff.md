# PromptWizard Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-promptwizard-2026-03-28`
- Source reference: `https://github.com/microsoft/PromptWizard`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-promptwizard-2026-03-28-ede8614d.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-promptwizard-2026-03-28-ede8614d.md`
- Discovery routing record: `discovery/routing-log/2026-03-28-dw-source-promptwizard-2026-03-28-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.

## Objective

Open one NOTE-mode Architecture review to decide whether PromptWizard's prompt-optimization patterns justify a later bounded Architecture adaptation for Directive Workspace prompt discipline, evaluator-guided analysis, and adaptation quality, without adopting PromptWizard itself as runtime capability.

## Bounded scope

- Keep this at one Architecture review slice.
- Preserve human review before any deeper Architecture chain or runtime adoption.
- Do not implement or operationalize PromptWizard from this stub alone.

## Inputs

- Prompt and evaluator quality under proof-backed adoption. Assess whether PromptWizard's feedback-driven prompt refinement, synthetic example generation, and instruction-plus-example optimization patterns should improve Directive Workspace prompt discipline, evaluator-guided analysis, and Architecture-side adaptation quality without adopting PromptWizard itself as runtime capability.
- Official sources describe PromptWizard as a task-aware prompt optimization framework where the model generates, critiques, and refines prompts and examples through iterative feedback. Retained value hypothesis: prompt-optimization and evaluator-guided Architecture patterns rather than direct runtime reuse.

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

Keep the source routed with this handoff only and do not open downstream implementation unless a narrower prompt or evaluator mechanism becomes explicit.

## Next decision

- `needs-more-evidence`
