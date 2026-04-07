# Agent-Orchestrator Runtime Follow-up

Date: 2026-03-20
Track: Directive Runtime
Type: runtime follow-up
Status: active

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\agent-orchestrator`

## Runtime Value To Evaluate

Potentially useful callable/runtime value:
- isolated multi-agent execution
- worktree-first branch separation
- explicit reaction handling for CI/review events
- runtime-agnostic adapter model

## What Runtime Should Keep

- the runtime boundary idea
- the notion of swappable execution slots
- supervisor-to-agent escalation rules

## What Runtime Should Not Keep Blindly

- the entire upstream platform
- the upstream dashboard as product truth
- broad runtime assumptions like tmux/docker as mandatory Directive requirements

## Gate Rule

Any future Runtime slice based on this source must prove:
- bounded operational value for the actual Directive host workflow
- rollback path
- no dependency on `agent-lab` path ownership
- the Runtime-owned source pack can reproducibly produce and run the AO CLI entrypoint from `packages/cli/dist/index.js`

## Current State

- the CLI precondition is now proven in:
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-precondition-proof.md`
- the bounded AO CLI status smoke is now proven in:
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-cli-runtime-slice-01-proof.md`
- the host-adapter decision is now closed in:
  - `runtime/legacy-records/2026-03-21-agent-orchestrator-host-adapter-decision.md`
- the pack remains `follow_up_only`
- the pack is still not allowed to become `live_runtime` without a narrower AO host adapter target, promotion record, registry entry, and passing host gates

## Next Valid Slice

If AO is reopened, open only one bounded promotion slice:
- choose one narrower host adapter target explicitly
- keep dashboard, mobile, and broad plugin-platform behavior out of scope
- promote only if the chosen target is narrower than the current blocked host AO surface

## Exit Condition

This source becomes removable when:
- any retained runtime behavior is re-homed into product-owned Runtime assets or explicitly dropped
- no active workflow needs `C:\Users\User\.openclaw\workspace\agent-lab\tooling\agent-orchestrator`
