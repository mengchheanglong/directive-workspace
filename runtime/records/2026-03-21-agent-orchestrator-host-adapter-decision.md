# Agent-Orchestrator Host Adapter Decision

- Candidate id: `agent-orchestrator`
- Candidate name: `agent-orchestrator`
- Runtime record date: 2026-03-21
- Linked follow-up record: `runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md`
- Decision type: `host-adapter decision`
- Decision result: `keep_follow_up_only`
- Contract path: `shared/contracts/ao-host-adapter-scope.md`

## Why

The bounded AO CLI smoke is real and useful, but the current Mission Control AO surface is still too broad:
- backend selection implied a live AO backend
- interactive runtime/session endpoints existed
- UI controls implied operator-facing AO support

That is wider than the proven AO value.

## What Was Kept

- Runtime-owned AO source pack
- CLI precondition proof
- bounded `ao status --json` smoke
- host-side smoke/check path

## What Was Explicitly Not Promoted

- dashboard/runtime AO backend
- interactive session send/restore/kill path
- AO promotion record
- AO registry entry

## Host Changes Required

- block new AO backend selection while the pack is `follow_up_only`
- block AO runtime/extras/dispatch host paths
- UI downgrade from active AO backend to follow-up-only messaging

## Current Status

- result: complete
- source-pack state: `follow_up_only`
- next valid step: either queue refresh or a future explicit AO promotion slice with a narrower host adapter target
