# Deferred Decision: gpt-researcher (2026-03-19)

## Candidate
- Name: `gpt-researcher`
- Source type: `github-repo`
- Source path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher`
- Pinned commit: `7c321744ce336949949b1e95b4652e2d455a33f9`

## Decision
- **Defer**

## Reason
- Runtime validation on current host (`Python 3.14.3`) is not operationally stable:
  - One isolated install path failed due Windows long-path dependency extraction.
  - Short-path workaround installed, but constructor smoke crashed with `Windows fatal exception: access violation` in the numpy import chain.

## Evidence
- Experiment report: `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-19-gpt-researcher-experiment.md`

## Smallest Next Fix
1. Create a clean `Python 3.11` or `3.12` venv.
2. Re-run `pip install -e` and constructor smoke.
3. If stable, promote back to active candidate and run one bounded real query experiment.
