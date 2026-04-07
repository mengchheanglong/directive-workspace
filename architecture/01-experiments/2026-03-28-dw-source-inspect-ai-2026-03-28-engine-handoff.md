# Inspect AI Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-inspect-ai-2026-03-28`
- Source reference: `https://github.com/UKGovernmentBEIS/inspect_ai`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-inspect-ai-2026-03-28-402b52cf.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-inspect-ai-2026-03-28-402b52cf.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-28-dw-source-inspect-ai-2026-03-28-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the retained value is not adopting Inspect AI as a callable host capability but improving how Directive Workspace defines tasks, scorers, tool approval, agent evaluation, and sandbox review boundaries.

## Objective

Open one NOTE-mode Architecture review to decide whether Inspect AI's evaluator-framework patterns justify a later bounded Architecture adaptation for Directive Workspace proof and evaluator quality, without adopting Inspect AI itself as runtime capability.

## Bounded scope

- Keep this at one Architecture review slice.
- Preserve human review before any deeper Architecture chain or runtime adoption.
- Do not implement or operationalize Inspect AI from this stub alone.

## Inputs

  - Evaluation quality and proof-backed adoption. Assess whether Inspect AI's task, scorer, tool, agent, tool-approval, and sandboxing patterns should improve Directive Workspace evaluator quality, proof design, and Architecture-side decision discipline without adopting Inspect AI itself as runtime capability.
  - Official docs position Inspect AI as an open-source LLM evaluation framework with tasks, scorers, tools, agents, MCP/tool support, sandboxing, and 100+ pre-built evals. Retained value hypothesis: evaluator/proof framework patterns rather than direct runtime reuse.

## Validation gate(s)

  - `adaptation_complete`
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
