# Experiment: gpt-researcher (2026-03-19)

## Candidate
- Name: `gpt-researcher`
- Source path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher`
- Pinned source revision: `7c321744ce336949949b1e95b4652e2d455a33f9` (`v3.4.3-3-g7c321744`)
- Related triage note: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\01-triage\2026-03-18-gpt-researcher.md`

## Install Method
Two bounded install paths were tested:

1) **Skill install (Codex)**
- from: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher\.claude\SKILL.md` + `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher\.claude\references`
- to: `C:\Users\User\.codex\skills\gpt-researcher`

2) **Runtime package smoke (isolated venv)**
- Attempt A: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\.venv-gptr-smoke`
- Attempt B (short-path workaround): `C:\gpv2`
- Install command: `pip install -e C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher`

## Commands Run
```powershell
git -C "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher" rev-parse HEAD
git -C "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher" describe --tags --always --dirty

# Skill copy install
Copy-Item "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher\.claude\SKILL.md" "C:\Users\User\.codex\skills\gpt-researcher\SKILL.md"
Copy-Item "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher\.claude\references" "C:\Users\User\.codex\skills\gpt-researcher\references" -Recurse

# Attempt A (failed due Windows long path during dependency install)
python -m venv "C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\.venv-gptr-smoke"
C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\.venv-gptr-smoke\Scripts\python.exe -m pip install -e "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher"

# Attempt B (short path install succeeded)
python -m venv "C:\gpv2"
C:\gpv2\Scripts\python.exe -m pip install -e "C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher"

# Constructor smoke
@'
from gpt_researcher import GPTResearcher
r = GPTResearcher(query="smoke test query", report_type="research_report", report_source="web")
print(type(r).__name__)
'@ | & "C:\gpv2\Scripts\python.exe" -X faulthandler -
```

## Runtime / Dependency Requirements
From project docs and observed install behavior:
- Python: docs target `3.11+` (current host is `Python 3.14.3`)
- API keys for full research flow: `OPENAI_API_KEY` and often a retriever key (for example `TAVILY_API_KEY`)
- Large dependency graph (LangChain/LangGraph/LiteLLM/NLTK/Numpy and others)

## Results
- Skill copy install: PASS
- Skill reference validation: PASS
  - Parsed skill name: `gpt-researcher`
  - Reference files discovered: `12`
  - Missing references: `0`
- Runtime package install Attempt A (`.venv-gptr-smoke`): FAIL
  - Error excerpt: `OSError: [Errno 2] No such file or directory ... litellm ...` with hint about Windows long path support.
- Runtime package install Attempt B (`C:\gpv2`): PASS
- Constructor smoke (`from gpt_researcher import GPTResearcher`): FAIL
  - Error excerpt: `Windows fatal exception: access violation` during `numpy` import chain under Python `3.14.3`.

## Rollback Steps
```powershell
Remove-Item -Recurse -Force "C:\Users\User\.codex\skills\gpt-researcher"
Remove-Item -Recurse -Force "C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\.venv-gptr-smoke"
Remove-Item -Recurse -Force "C:\gpv2"
```

## Integration Recommendation
Decision: **DEFER**

Why:
- Runtime path is unstable in current host environment (`Python 3.14.3`)
- Reproduced hard crash (`access violation`) in constructor-path import chain
- Initial install path also hit Windows long-path friction

Concrete re-entry condition:
1. Re-run on pinned `Python 3.11` or `3.12` environment.
2. Confirm `import GPTResearcher` and single constructor smoke pass.
3. Then evaluate one real bounded research run with API keys configured.
