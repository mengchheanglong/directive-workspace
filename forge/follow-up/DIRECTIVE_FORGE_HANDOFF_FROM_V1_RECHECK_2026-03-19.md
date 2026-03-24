# Directive Forge Handoff From v1 Architecture Re-check (2026-03-19)

## purpose
Move runtime/callable `planned-next` work out of Directive Architecture (v1) and into Directive Forge (v0), while preserving extracted framework patterns in v1.

Source re-check:
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-adopted-candidates-architecture-recheck.md`

## lane-boundary decision
- Keep extracted mechanisms in v1 Architecture.
- Move runtime execution items to v0 Forge backlog and execute only through Forge/runtime gates.

## moved items

| Candidate | Keep in v1 Architecture | Move to v0 Forge backlog |
|---|---|---|
| `autoresearch` | Bounded experiment template pattern (iteration structure, metric delta capture, operator rules) | Execute one real bounded run against host runtime using template; capture callable-oriented evidence and rollback notes |
| `agentics` | Operational playbook template pattern (digest format, maintenance cadence) | Run one live Daily Status Digest + one maintenance sweep under runtime conditions; verify output quality and operational stability |
| `mini-swe-agent` | Fallback-lane-separation policy and deterministic rehearsal gate | Implement wrapper/preflight in runtime lane and run one non-deterministic fallback rehearsal with full runtime checks |

## execution guardrails (v0 Forge)
1. No runtime step is considered complete without evidence artifact + rollback note.
2. Promotion to `runtime-callable` requires required gates passing and proof linkage.
3. Runtime failures do not invalidate the v1 pattern unless they prove the pattern itself unsound.

## required gate baseline for each moved item
- `npm run check:directive-workspace-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

## status
- Handoff state: `recorded`
- Runtime execution state: `pending`
- Owner lane: `Directive Forge (v0)`
