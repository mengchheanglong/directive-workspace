# Adopted / Planned-Next: mini-swe-agent Slice 3 (2026-03-19)

## candidate
- `mini-swe-agent`
- Source: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent`
- Evaluated revision: `a9b635ab0f79b52e9354e676f5a90a534d4c6afa`

## decision
- **Adopted (planned-next)** with policy constraint:
  - adopt extracted fallback execution pattern/interface only
  - do not absorb full repo/runtime into mission-control production path

## evidence
- Execution artifact:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-19-mini-swe-agent-slice-3-execution.md`
- Integration artifact:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\forge\follow-up\DIRECTIVE_MINI_SWE_AGENT_SLICE_3_FALLBACK_PATTERN.md`
- Runtime smoke trajectory:
  - `C:\v\slice3-mini-a\slice3-mini.traj.json`

## gate evidence
- `npm run check:directive-v0` -> PASS
- `npm run check:directive-integration-proof` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:ops-stack` -> PASS

## rationale
- Bounded fallback smoke completed successfully after short-path setup and host-safe harness.
- Run produced reproducible command transcript and pass-after verification.
- Operator overhead is higher than direct Codex path; therefore keep as fallback lane, not primary lane.

## planned next
1. Add a mission-control wrapper script that enforces deterministic rehearsal before any live fallback run.
2. Add explicit host preflight checks (encoding/console availability, interpreter path) before enabling runtime path.
3. Promote from planned-next to fully adopted only after one live non-deterministic fallback run succeeds with the same gates green.

## rollback
- Delete the fallback pattern doc and this adoption note.
- Remove sandbox artifacts under `C:\v\mswea3` and `C:\v\slice3-mini-a`.
