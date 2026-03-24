# AO CLI Runtime Guard

Quality gate profile: `ao_cli_runtime_guard/v1`  
Promotion profile family: `bounded_ao_cli`  
Proof shape: `ao_cli_status_snapshot/v1`  
Primary host checker: `npm run check:directive-agent-orchestrator-cli-smoke`

## Purpose

Define the bounded Forge proof for `agent-orchestrator` without widening the host into dashboard, mobile, or full plugin-platform runtime truth.

## Pass Conditions

- the latest AO CLI smoke report is `ok: true`
- the smoke uses a temp copy of the Forge-owned source pack rather than mutating the canonical source-pack root
- the smoke proves `ao status --json` can run successfully against a generated local runtime config
- the status output parses as a JSON array
- built packages include:
  - `@composio/ao-core`
  - `@composio/ao-plugin-agent-claude-code`
  - `@composio/ao-plugin-agent-codex`
  - `@composio/ao-plugin-agent-aider`
  - `@composio/ao-plugin-agent-opencode`
  - `@composio/ao-plugin-scm-github`
  - `@composio/ao-cli`
- the source pack remains:
  - `classification = follow_up_only`
  - `activationMode = manual_follow_up`

## Required Host Artifacts

- latest smoke report:
  - `C:\Users\User\.openclaw\workspace\mission-control\reports\ao-cli-smoke\agent-orchestrator-latest.json`
- archived smoke report:
  - one timestamped JSON artifact in the same directory

## Required Host Commands

- `npm run forge:agent-orchestrator:smoke`
- `npm run check:directive-agent-orchestrator-cli-smoke`
- `npm run check:directive-agent-orchestrator-preconditions`
- `npm run check:ops-stack`

## Not Allowed

- changing the AO pack to `live_runtime`
- creating AO promotion or registry artifacts from this slice alone
- no promotion or registry artifacts may exist for this slice
- treating the dashboard, mobile app, or full upstream plugin ecosystem as accepted runtime truth
- leaving temp build outputs in the canonical Forge source-pack root as the proof artifact
