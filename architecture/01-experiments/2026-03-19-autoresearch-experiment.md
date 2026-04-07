# Experiment: autoresearch (2026-03-19)

## Candidate
- Name: `autoresearch`
- Source path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\autoresearch`
- Pinned source revision: `89aa3324beec399fc11a01c2fe1532b80f3eff42` (`v1.7.2`)
- Related triage note: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\01-triage\2026-03-18-autoresearch.md`

## Install Method
Manual local install from the pinned intake snapshot into Codex skills:
- from: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\autoresearch\skills\autoresearch`
- to: `C:\Users\User\.codex\skills\autoresearch`

This is a copy-only install (no repo mutation).

## Commands Run
```powershell
git -C "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\autoresearch" rev-parse HEAD
git -C "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\autoresearch" describe --tags --always --dirty
Copy-Item -Path "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\autoresearch\skills\autoresearch" -Destination "C:\Users\User\.codex\skills\autoresearch" -Recurse -Force
```

Smoke validation (bounded):
```powershell
$content = Get-Content -Raw "C:\Users\User\.codex\skills\autoresearch\SKILL.md"
[regex]::Matches($content,'references/[A-Za-z0-9\-]+\.md') | Sort-Object -Unique
$cmdCount = (Get-ChildItem "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\autoresearch\commands\autoresearch" -File -Filter *.md).Count
$cmdCount
```

## Runtime / Dependency Requirements
- Skill runtime: Codex skill loader (`SKILL.md` + `references/*.md`)
- External package install: none required for the skill itself
- Upstream subcommand support requires command docs under `commands/autoresearch/*.md` (present: 7 files)

## Results
- Install status: PASS
- Smoke status: PASS
- Evidence:
  - Parsed skill name/version: `autoresearch`, `1.7.2`
  - Reference files discovered: `10`
  - Missing references: `0`
  - Command docs present in source: `7`

## Rollback Steps
```powershell
Remove-Item -Recurse -Force "C:\Users\User\.codex\skills\autoresearch"
```

## Integration Recommendation
Decision: **ADOPT (active candidate)**

Why:
- Minimal install footprint (copy-only, reversible)
- Skill loads cleanly with complete reference graph
- Matches Day 2 goal for autonomous bounded iteration support

Next integration slice proposal:
1. Run one bounded Directive workflow trial using `autoresearch` (`Iterations: 3`) on a single mission-control reliability task.
2. Capture before/after metric and keep/discard logs in `02-experiments`.
