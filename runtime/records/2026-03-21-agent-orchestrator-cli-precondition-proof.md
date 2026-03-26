# Agent-Orchestrator CLI Precondition Proof

Date: 2026-03-21
Candidate id: `agent-orchestrator`
Track: `Directive Runtime`
Slice type: bounded precondition build proof
Status: completed

## Source Follow-up

- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\follow-up\2026-03-20-agent-orchestrator-runtime-followup.md`

## Purpose

Prove whether the Runtime-owned `agent-orchestrator` pack can produce a runnable CLI entrypoint without reopening the broader dashboard, mobile, or plugin-platform surface.

## Scope

Allowed:
- install the Runtime-owned workspace locally
- build only the local packages required for the CLI proof
- run one bounded executable check: `ao --help`

Not allowed:
- mark the pack `live_runtime`
- create promotion or registry artifacts
- treat the full upstream monorepo as Directive runtime truth

## Commands Run

1. `pnpm install --ignore-scripts --frozen-lockfile`
2. `pnpm --filter @composio/ao-core build`
3. `pnpm --filter @composio/ao-plugin-agent-claude-code --filter @composio/ao-plugin-agent-codex --filter @composio/ao-plugin-agent-aider --filter @composio/ao-plugin-agent-opencode --filter @composio/ao-plugin-scm-github build`
4. `pnpm --filter @composio/ao-cli build`
5. `pnpm --filter @composio/ao-cli exec node dist/index.js --help`

## Key Outcomes

- The Runtime-owned AO pack can be installed locally without changing upstream ownership.
- `@composio/ao-core` and the minimal CLI-imported plugin set build successfully from the Runtime-owned copy.
- `packages/cli/dist/index.js` is producible under Runtime ownership.
- `ao --help` executes successfully from the Runtime-owned CLI build.

## CLI Proof Snapshot

- CLI entrypoint: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\source-packs\agent-orchestrator\packages\cli\dist\index.js`
- Proof command: `pnpm --filter @composio/ao-cli exec node dist/index.js --help`
- Result: PASS
- Visible commands include:
  - `start`
  - `stop`
  - `status`
  - `spawn`
  - `session`
  - `doctor`
  - `update`

## Decision

`agent-orchestrator` is no longer blocked by a missing CLI precondition.

It remains:
- `classification = follow_up_only`
- `activationMode = manual_follow_up`

The next valid step is a bounded AO CLI runtime slice. That slice must prove actual Directive host value and rollback discipline before any promotion or registry entry exists.

## Keep / Discard

Keep:
- Runtime-owned CLI buildability
- bounded CLI-only follow-up scope
- minimal workspace-package build discipline

Discard:
- any implication that dashboard, mobile, or full plugin ecosystem are now accepted runtime surfaces
- any implication that the pack is already `live_runtime`

## Cleanup Note

This proof does not require keeping generated build outputs or `node_modules` as product truth. The proof is the record; future runtime follow-up must reproduce the bounded build and execution path explicitly.
