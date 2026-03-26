# Agent-Lab Retirement Plan

Last updated: 2026-03-20

## Objective

Retire `C:\Users\User\.openclaw\workspace\agent-lab` by extracting its useful value into Directive Workspace and removing the remaining shell safely.

This is not a folder move.

This is an extraction-and-cutover process:
- keep what has product value
- re-home that value under Discovery, Runtime, or Architecture
- drop the rest

## Current Status

- phase status: cutover complete, archive snapshot created
- runtime dependency status: clear
- source-pack status: Runtime-owned packs active
- registry status: `repo-sources.json` no longer indexed from `agent-lab`
- source-ref status: legacy `agent-lab/...` refs migrated to Directive-owned refs
- archive snapshot: `C:\Users\User\.openclaw\workspace\archive\agent-lab-retired-20260320-104211` (Mode A, 2026-03-20)
- parked/unclassified discovery reanalysis: complete (8/8 candidates processed in bundles 01-03)
- remaining work: decide final deletion timing (Mode B) and completion record

Canonical execution doc:
- [Agent-Lab Archive Runbook](C:/Users/User/.openclaw/workspace/directive-workspace/discovery/agent-lab-extraction/AGENT_LAB_ARCHIVE_RUNBOOK.md)

## End State

After completion:
- Directive Workspace is the only active system for capability intake, architecture improvement, and callable adoption
- Mission Control remains the runtime host
- `agent-lab` no longer owns any required skill, contract, script, or workflow
- `agent-lab` can be archived or deleted without breaking active workflows

## Phase Order

### Phase 1: Freeze (complete)

Rules:
- no new additions to `agent-lab`
- no new workflow should depend on `agent-lab` paths
- any new useful finding must be recorded in Directive Workspace first

Exit condition:
- `agent-lab` is treated as read-only source inventory

Current progress:
- top-level `agent-lab` docs now mark the workspace as frozen
- generated admission mirrors were moved under Directive Workspace ownership

### Phase 2: Extract orchestration value (complete)

Priority targets:
- `orchestration/CAPABILITY_REGISTRY.json`
- `orchestration/contracts/external-tool-run.contract.schema.json`
- `orchestration/adapters/*`
- `orchestration/scripts/*`

Output:
- Runtime contracts
- Discovery intake/routing rules
- Architecture pattern notes
- any surviving runbooks under product ownership

Excluded baggage:
- `node_modules`
- local logs
- generated test artifacts

### Phase 3: Extract active tooling value (complete)

Priority targets:
- `agency-agents`
- `agent-orchestrator`
- `arscontexta`
- `promptfoo`
- `puppeteer`
- `skills-manager`
- `software-design-philosophy-skill`
- `superpowers`

Output rule:
- each item must end in one explicit state:
  - extracted to Discovery
  - extracted to Runtime
  - extracted to Architecture
  - extracted to multiple tracks
  - reference-only
  - dropped

### Phase 4: Resolve parked and unclassified items (complete)

Targets:
- `autoresearch`
- `Celtrix`
- `CLI-Anything`
- `CodeGraphContext`
- `desloppify`
- `hermes-agent`
- `impeccable`
- `plane`

Decision rule:
- do not revive parked items by default
- only extract the surviving mechanism, rule, or contract

### Phase 5: Cutover check (complete)

Before removal:
- no Mission Control code references `C:\Users\User\.openclaw\workspace\agent-lab`
- no Directive Workspace docs require `agent-lab` as an active dependency
- all retained assets have a product-owned home
- the extraction ledger shows no `not-started` items that are still considered required

### Phase 6: Archive or remove (active)

Allowed actions:
- archive as historical reference
- delete entirely

Preferred rule:
- archive first if there is any uncertainty
- delete only after one clean operating cycle without fallback to `agent-lab`

Current progress:
- Mode A executed on 2026-03-20
- snapshot created at `C:\Users\User\.openclaw\workspace\archive\agent-lab-retired-20260320-104211`
- post-archive `ops-stack` verification passed

Execution rule:
- follow [Agent-Lab Archive Runbook](C:/Users/User/.openclaw/workspace/directive-workspace/discovery/agent-lab-extraction/AGENT_LAB_ARCHIVE_RUNBOOK.md)
- do not remove `agent-lab` ad hoc

## Final Checklist

- `agent-lab` remains read-only
- extraction ledger is current
- cutover audit shows no live runtime blockers
- `npm run check:directive-v0` is green
- `npm run check:backend-api-suite` is green
- `npm run check:ops-stack` is green
- archive path is recorded if Mode A is executed
- archive/removal decision is logged explicitly

## Success Condition

Success is not "the folder was deleted."

Success is:
- Directive Workspace owns the useful value
- no active workflow depends on `agent-lab`
- the removal of `agent-lab` changes nothing operationally
