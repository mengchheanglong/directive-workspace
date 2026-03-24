# Agent-Lab Cutover Audit

Date: 2026-03-20
Status: runtime cutover complete, archive mode active

## Summary

Directive Workspace now contains product-owned records for nearly all meaningful `agent-lab` value.

`agent-lab` no longer has live host/runtime path dependencies in Mission Control.
Remaining references are historical naming and migration-normalization helpers.

This audit separates:
- historical/documentary references
- product-owned extraction references
- live host/runtime blockers

## Safe Reference Class

These references are acceptable during retirement:
- extraction ledger entries
- source maps
- follow-up records
- historical ops reports

They mention `agent-lab` as source history, not as active runtime ownership.

## Live Host Blockers

Current blocker count: 0

Directive Workspace now has staged pack destinations under:
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\source-packs\`

All targeted source-pack directories are now active with `SOURCE_PACK_READY.md`.

Active Forge-owned packs (ready marker present):
- `agency-agents`
- `agent-orchestrator`
- `arscontexta`
- `promptfoo`
- `puppeteer`
- `scripts`
- `software-design-philosophy-skill`
- `superpowers`
- `skills-manager`
- `desloppify`
- `impeccable`
- `celtrix`

### Check and compatibility scripts

`C:\Users\User\.openclaw\workspace\mission-control\scripts\check-agents-import-packs-api-backend.ts` now prefers the Forge-owned `directive-workspace/forge/source-packs` root in its temp workspace and no longer requires an `agent-lab/tooling` fixture.
`C:\Users\User\.openclaw\workspace\mission-control\scripts\check-tool-admission.ts` now writes its generated classification mirrors into Directive Workspace-owned extraction docs instead of mutating `agent-lab`.

## Meaning

Mission Control now resolves runtime source packs from Directive Workspace-owned surfaces only.
`agent-lab` is no longer on the active runtime path.

## Archive Snapshot

Mode A executed on 2026-03-20.

Snapshot path:
- `C:\Users\User\.openclaw\workspace\archive\agent-lab-retired-20260320-104211`

Snapshot stats:
- files: `24698`
- directories: `5151`

## Discovery Reanalysis Program

Reanalysis queue for parked/unclassified candidates is now active under Discovery:
- intake: `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\intake\2026-03-20-agent-lab-parked-unclassified-reanalysis-intake.md`
- triage: `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\triage\2026-03-20-agent-lab-parked-unclassified-reanalysis-triage.md`
- routing: `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\routing-log\2026-03-20-agent-lab-parked-unclassified-reanalysis-routing.md`
- queue: `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\monitor\2026-03-20-agent-lab-parked-unclassified-reanalysis-queue.md`

Bundle 01 completed candidates:
- `al-parked-desloppify`
- `al-parked-codegraphcontext`
- `al-parked-autoresearch`

Bundle 02 completed candidates:
- `al-parked-hermes-agent`
- `al-parked-impeccable`
- `al-parked-celtrix`

Bundle 03 completed candidates:
- `al-parked-cli-anything`
- `al-unclassified-plane`

Queue status:
- `completed` (all 8 candidates processed)
- accepted implementation bundle queued:
- accepted implementation bundle executed:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\routing-log\2026-03-20-accepted-implementation-bundle-01.md`

Resolved in this audit cycle:
- `C:\Users\User\.openclaw\workspace\mission-control\src\server\services\tooling-catalog-service.ts`
  - now points the Agents dashboard catalog at Directive Workspace-owned records instead of `agent-lab/tooling`
- `C:\Users\User\.openclaw\workspace\mission-control\src\server\services\run-scoped-desloppify-service.ts`
  - now reports a Directive Workspace Forge source-pack path instead of an `agent-lab` tool path label
- `C:\Users\User\.openclaw\workspace\mission-control\src\server\services\run-scoped-agency-agents-service.ts`
  - now reports a Directive Workspace Forge source-pack path instead of an `agent-lab` tool path label
- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\modules\agents-import-packs\agents-import-packs.service.ts`
  - now uses the centralized backend Directive source-pack resolver instead of carrying its own `agent-lab` path rules
- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\modules\agents-runtime\agents-runtime.service.ts`
  - already relies on the centralized backend resolver for orchestrator-root selection
- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\modules\agents-extras\agents-extras.service.ts`
  - already relies on the centralized backend resolver for orchestrator-root selection
- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\modules\automation-run-tools\automation-run-tools.service.ts`
  - already relies on the centralized backend resolver for scoped tool source resolution
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\seed-repo-sources.ts`
  - now scans only Directive Workspace-owned roots (`directive-workspace/forge/source-packs/`) and no longer indexes `agent-lab` roots in `repo-sources.json`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\repo-sources-paths.ts`
  - no longer exports `agent-lab` roots for repo-source seeding/check workflows
- `C:\Users\User\.openclaw\workspace\mission-control\src\server\paths\directive-source-packs.ts`
  - now resolves source packs from Directive Workspace Forge-owned roots only
- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\infra\paths\directive-source-packs.ts`
  - now resolves source packs from Directive Workspace Forge-owned roots only
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-agents-import-packs-api-backend.ts`
  - now validates import-pack behavior against a Forge-owned source-pack fixture path instead of `agent-lab/tooling`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-tool-admission.ts`
  - now writes generated admission mirrors to `directive-workspace/discovery/agent-lab-extraction/` instead of `agent-lab`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\seed-directive-workspace-candidates.ts`
  - now creates and matches capabilities by Directive Workspace-owned source refs only
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\run-directive-candidate-lifecycle.ts`
  - now creates and matches lifecycle candidates by Directive Workspace-owned source refs only
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\tool-admission\directive-sync.ts`
  - now syncs against Directive Workspace-owned source refs only
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\tool-admission\source-ref.ts`
  - compatibility output is now Directive Workspace-owned only (`buildCompatibleAdmissionSourceRefs` returns directive-owned refs)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\migrate-directive-source-refs.ts`
  - one-time migration script added and executed to rewrite persisted `agent-lab/...` capability source refs to Directive Workspace-owned refs
- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\modules\projects\projects.service.ts`
  - removed hardcoded `agent-lab/` exclusion from available-project filtering
- `C:\Users\User\.openclaw\workspace\mission-control\src\server\context\project-context.ts`
  - removed hardcoded `agent-lab/` exclusion from available-project filtering

## Recommended Next Cutover

1. Keep historical reports and extraction records unchanged unless they actively break UX or checks.
2. Keep `agent-lab` read-only and route all new work through Directive Workspace surfaces.
3. Decide Mode B deletion timing after at least one additional clean operating cycle.
4. Re-run this audit only when changing extraction naming, deletion timing, or retiring migration helpers.

## Exit Rule

`agent-lab` is runtime-removable now; archive/removal timing is an operator decision.
