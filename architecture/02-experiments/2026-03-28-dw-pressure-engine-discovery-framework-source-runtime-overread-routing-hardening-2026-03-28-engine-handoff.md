# Engine Discovery Framework-Source Runtime Overread Routing Hardening Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-discovery-framework-source-runtime-overread-routing-hardening-2026-03-28`
- Source reference: `engine/routing.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-inspect-ai-2026-03-28-402b52cf.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-28T00-00-00-000Z-dw-source-inspect-ai-2026-03-28-402b52cf.md`
- Discovery routing proof case 1: `discovery/routing-log/2026-03-28-dw-source-inspect-ai-2026-03-28-routing-record.md`
- Discovery routing proof case 2: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Primary truth surface: `engine/routing.ts`
- Engine stage checker: `scripts/check-directive-engine-stage-chaining.ts`
- Front-door materializer: `shared/lib/discovery-front-door.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the shared Engine currently overreads a narrow class of framework/tooling repos as Runtime even when the source text explicitly says the retained value is pattern extraction without adopting the source itself as runtime capability.

## Objective

Open one bounded DEEP Architecture slice that corrects Runtime overread for framework-like repos whose retained value is explicitly Engine-facing pattern extraction rather than source adoption.

## Bounded scope

- Keep this at one shared Engine routing-quality slice.
- Limit the change to framework/tooling repos with explicit non-adoption pattern-extraction language.
- Favor Architecture for that one source class when Engine-improvement signal is also present.
- Add focused Engine-stage verification using Inspect AI and ts-edge as proof cases.
- Do not redesign all routing heuristics, usefulness logic, Runtime reopening rules, or Discovery front-door policy.

## Inputs

- `engine/routing.ts` currently boosts Runtime for `github-repo` sources and runtime/tooling keywords.
- Inspect AI and ts-edge both entered with explicit text saying the retained value was a pattern to extract, not a runtime capability or dependency to adopt.
- The shared Engine nevertheless selected Runtime first in both cases, and operator review had to reroute them to Architecture.

## Validation gate(s)

- `framework_pattern_extraction_prefers_architecture`
- `runtime_control_case_preserved`
- `routing_slice_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the narrow routing signal in `engine/routing.ts`, revert the focused Engine-stage proof-case coverage, and delete this DEEP case chain.

## Next decision

- `adopt`
