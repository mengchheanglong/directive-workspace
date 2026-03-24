# Knowledge Duplication Inventory

Date: 2026-03-22
Updated: 2026-03-22
Purpose: Track root-level knowledge files that have canonical copies in `directive-workspace/knowledge/`.

## Duplicated Files (resolved)

| Root path | Canonical path | Resolution | Date |
|-----------|----------------|------------|------|
| `knowledge/workspace-operating-model.md` | `directive-workspace/knowledge/doctrine.md` | Replaced with redirect | 2026-03-22 |
| `knowledge/architecture-map.md` | `directive-workspace/knowledge/architecture-map.md` | Replaced with redirect (frontmatter preserved) | 2026-03-22 |
| `knowledge/workspace-charter.md` | `directive-workspace/knowledge/charter.md` | Replaced with redirect (frontmatter preserved) | 2026-03-22 |
| `knowledge/delivery-workflow.md` | `directive-workspace/knowledge/delivery-workflow.md` | Replaced with redirect (frontmatter preserved) | 2026-03-22 |

## Root-level contracts (outside both DW and MC)

| Root path | Purpose | Ownership |
|-----------|---------|-----------|
| `contracts/context-compaction.contract.schema.json` | Context compaction schema | OpenClaw-owned (agent behavior) |
| `contracts/external-tool-run.contract.schema.json` | External tool execution schema | OpenClaw-owned (agent behavior) |
| `contracts/skill-command-index.contract.schema.json` | Skill command index schema | OpenClaw-owned (agent behavior) |

## Legacy Folder Cleanup

| Path | Resolution | Date |
|------|------------|------|
| `architecture-lab/` | Archived to `archive/architecture-lab-retired-20260322/` | 2026-03-22 |
| `agent-lab/` | Workspace-level direct callers removed; OpenClaw-root bridge migrated to `scripts/external-tools/` so no live runtime path depends on `workspace/agent-lab/orchestration` | 2026-03-22 |

## Superseded Planning Files (within `directive-workspace/knowledge/`)

| File | Status | Superseded by | Date |
|------|--------|---------------|------|
| `delivery-plan.md` | Superseded (v0-era) | `active-mission.md`, `doctrine.md`, `workflow.md` | 2026-03-22 |
| `project-plan.md` | Superseded (v0-era) | `active-mission.md`, `doctrine.md`, `workflow.md` | 2026-03-22 |

These files are preserved as decision history per doctrine principle #5 but marked with superseded banners. They describe milestones and tasks that are all complete.

## Resolution Status

- Root `knowledge/` files: all 4 resolved via redirect
- Root `contracts/`: left as OpenClaw-owned (correct ownership, no duplication)
- `architecture-lab/`: archived
- `agent-lab/`: no longer required by active workspace callers or the root OpenClaw external-tool bridge
- Internal knowledge overlap: 2 v0-era planning files marked superseded
