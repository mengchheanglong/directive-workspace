# mini-swe-agent Slice 3 Execution Evidence (2026-03-19)

## guard confirmation
- Slice objective/scope/rollback verified from:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-19-mini-swe-agent-slice-3.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\PHASE_2_ARCHITECTURE_EXPLORATION.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\execution-plan.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\delivery-plan.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\project-plan.md`
- API-contract cutover guard status: no violation (doc-only integration in mission-control; no API/schema edits).

## what changed
- Added extracted fallback pattern doc:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\follow-up\DIRECTIVE_MINI_SWE_AGENT_SLICE_3_FALLBACK_PATTERN.md`
- Created runtime smoke sandbox outside mission-control tree for bounded validation:
  - `C:\v\mswea3` (short-path venv)
  - `C:\v\slice3-mini-a\run_slice3_mswea.py`
  - `C:\v\slice3-mini-a\slice3-mini.traj.json`

## commands run (ordered)
1. `python -m venv C:\v\mswea3`
2. `C:\v\mswea3\Scripts\python.exe -m pip install --upgrade pip`
3. `C:\v\mswea3\Scripts\python.exe -m pip install pytest`
4. `C:\v\mswea3\Scripts\python.exe -m pip install C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent`
5. `git -C C:\v\slice3-mini-a init`
6. `git -C C:\v\slice3-mini-a checkout -b codex/slice3-mini-swe-sandbox`
7. `C:\v\mswea3\Scripts\python.exe -m pytest -q` (fail-first baseline)
8. `C:\v\mswea3\Scripts\python.exe .\run_slice3_mswea.py` (deterministic bounded run)
9. `C:\v\mswea3\Scripts\python.exe -m pytest -q` (post-run verification)
10. `npm run check:directive-v0`
11. `npm run check:directive-integration-proof`
12. `npm run check:directive-workspace-health`
13. `npm run check:ops-stack`

## key outputs
- Install blocker removed with short path:
  - previous error: `Windows Long Path support` hint.
  - retry result: `Successfully installed ... mini-swe-agent-2.2.7`.
- Candidate revision validated: `a9b635ab0f79b52e9354e676f5a90a534d4c6afa`.
- Fail-first test:
  - `FAILED test_math_ops.py::test_add - assert -1 == 5`.
- mini-swe-agent runtime smoke:
  - `step 2`: one-file fix command on `math_ops.py`.
  - `step 3`: `1 passed in 0.01s`.
  - `calls=4`, `cost=0.0`.
- Overhead comparison (same bounded task):
  - mini-swe-agent deterministic run: `mini_seconds=1.847`.
  - direct Codex/manual command path: `codex_seconds=0.735`.

## pass/fail checks
- Runtime install retry (short path): PASS
- Bounded deterministic smoke run: PASS
- File-scope constraint for fix step (`math_ops.py` only): PASS
- `check:directive-v0`: PASS
- `check:directive-integration-proof`: PASS
- `check:directive-workspace-health`: PASS
- `check:ops-stack`: PASS

## observed risks
- Host runtime fragility for direct CLI path on this environment:
  - `UnicodeEncodeError` (cp1252 emoji rendering) and `NoConsoleScreenBufferError` from prompt_toolkit.
- Requires wrapper/harness discipline (explicit interpreter path + deterministic mode) for reproducible bounded runs.
- Full dependency surface is heavy for a fallback lane.

## rollback status
- Rollback not required (all required gates green).
- Reversible rollback path remains:
1. Remove `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\follow-up\DIRECTIVE_MINI_SWE_AGENT_SLICE_3_FALLBACK_PATTERN.md`.
2. Delete sandbox artifacts under `C:\v\mswea3` and `C:\v\slice3-mini-a`.
3. Remove this execution evidence note.
