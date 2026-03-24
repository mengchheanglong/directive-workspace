# Agent-Lab Archive Runbook

Last updated: 2026-03-20

## Purpose

Archive or remove `C:\Users\User\.openclaw\workspace\agent-lab` safely after cutover.

This runbook is the final step after extraction, not a replacement for extraction.

## Preconditions

All of the following must be true:
- runtime source-pack resolution is Forge-owned only
- `repo-sources.json` has no `agent-lab` entries
- `directive_capabilities.source_ref` has no `agent-lab/...` values
- `agent-lab` is frozen/read-only
- host checks are green

## Preflight Verification

Run from:
- `C:\Users\User\.openclaw\workspace\mission-control`

1. Runtime gates:
```powershell
npm run check:directive-v0
npm run check:backend-api-suite
npm run check:ops-stack
```

2. Repo-source registry check:
```powershell
rg -n "agent-lab" "C:\Users\User\.openclaw\workspace\repo-sources.json"
```
Expected: no matches.

3. Capability source-ref check:
```powershell
npm run directive:migrate:source-refs -- --dry-run
```
Expected: `"migrated": 0`.

4. Runtime path reference spot-check:
```powershell
rg -n "agent-lab/|agent-lab" "C:\Users\User\.openclaw\workspace\mission-control\src\server\paths" "C:\Users\User\.openclaw\workspace\mission-control\backend\src\infra\paths" "C:\Users\User\.openclaw\workspace\mission-control\scripts\\seed-repo-sources.ts"
```
Expected: no matches.

## Archive Modes

Mode A: archive and keep
- keep historical snapshot for audit/reference
- remove active dependency only

Mode B: archive then remove
- take snapshot
- remove `agent-lab` folder after one clean cycle

Default recommendation:
- use Mode A first
- move to Mode B after one additional clean ops cycle

## Archive Steps (Mode A)

1. Create timestamp:
```powershell
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
```

2. Create archive destination:
```powershell
$dst = "C:\Users\User\.openclaw\workspace\archive\agent-lab-retired-$stamp"
New-Item -ItemType Directory -Path $dst -Force | Out-Null
```

3. Copy frozen snapshot:
```powershell
robocopy "C:\Users\User\.openclaw\workspace\agent-lab" $dst /E /R:1 /W:1 /NFL /NDL /NJH /NJS /XD ".git" "node_modules"
```

4. Write archive note:
- update `AGENT_LAB_CUTOVER_AUDIT_2026-03-20.md` with archive location and date
- update `AGENT_LAB_RETIREMENT_PLAN.md` status board

## Removal Steps (Mode B)

Only after Mode A plus one clean cycle:

1. Re-run preflight verification.
2. Remove source folder:
```powershell
Remove-Item -Recurse -Force "C:\Users\User\.openclaw\workspace\agent-lab"
```
3. Re-run:
```powershell
cd "C:\Users\User\.openclaw\workspace\mission-control"
npm run check:ops-stack
```
4. Mark retirement complete in:
- `AGENT_LAB_RETIREMENT_PLAN.md`
- `AGENT_LAB_CUTOVER_AUDIT_2026-03-20.md`

## Rollback

If any check fails post-archive/removal:
- restore the archived snapshot back to `C:\Users\User\.openclaw\workspace\agent-lab`
- rerun `npm run check:ops-stack`
- reopen blocker in cutover audit with exact failing command/output

## Latest Execution Log

- mode: `Mode A (archive and keep)`
- date: `2026-03-20`
- archive path: `C:\Users\User\.openclaw\workspace\archive\agent-lab-retired-20260320-104211`
- result: snapshot created successfully
