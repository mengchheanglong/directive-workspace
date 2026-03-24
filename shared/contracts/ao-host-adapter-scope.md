# AO Host Adapter Scope

- Contract id: `ao_host_adapter_scope/v1`
- Candidate id: `agent-orchestrator`
- Track: `Directive Forge`
- Current source-pack classification: `follow_up_only`
- Current activation mode: `manual_follow_up`

## Purpose

Keep `agent-orchestrator` aligned with its actual Forge state.

The AO pack is currently verified only as:
- a Forge-owned CLI precondition build
- a bounded temp-copy smoke for `ao status --json`

It is not yet promoted as a live Mission Control backend.

## Required Host Rule

While `agent-orchestrator` remains `follow_up_only`, Mission Control must:
- block new agent creation or update to `backend = agent-orchestrator`
- block interactive AO runtime endpoints
- block AO dispatch/session controls in the host UI
- keep AO promotion and registry artifacts absent

## Allowed Surface

Allowed now:
- bounded smoke scripts
- Forge records and follow-up notes
- host-side verification checks

Not allowed now:
- live dashboard/backend runtime surface
- implicit dispatch through AO
- session restore/send/kill as a supported operator path
- import-pack promotion

## Exit Condition

This contract can be relaxed only when:
- one narrower AO host adapter surface is explicitly chosen
- that surface has a Forge promotion record
- registry state exists
- required host checks pass under a new promotion profile
