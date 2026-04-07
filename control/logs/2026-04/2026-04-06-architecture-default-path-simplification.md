# 2026-04-06 Architecture Default Path Simplification

## Slice

- Affected layer: Architecture lifecycle policy and operator-path simplification
- Owning lane: Architecture
- Mission usefulness: keep the normal Architecture path short, make deep continuation explicit, and prevent adopted Architecture work from being treated as automatically materialization-due

## Changes

- Added an explicit `Deep continuation required` field to adopted Architecture artifacts in [architecture/lib/architecture-result-adoption.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-result-adoption.ts).
- Changed the Architecture materialization due-check in [architecture/lib/architecture-materialization-due-check.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-materialization-due-check.ts) so only adopted records that explicitly require deep continuation are due for an implementation target.
- Tightened the lifecycle contract in [shared/contracts/architecture-artifact-lifecycle.md](/C:/Users/User/projects/directive-workspace/shared/contracts/architecture-artifact-lifecycle.md) so `experiment -> adopted` is again the normal finish for NOTE/STANDARD Architecture work and deep continuation is explicit rather than assumed.
- Marked [architecture/00-intake](/C:/Users/User/projects/directive-workspace/architecture/00-intake), [architecture/01-triage](/C:/Users/User/projects/directive-workspace/architecture/01-triage), and [architecture/01-bounded-starts](/C:/Users/User/projects/directive-workspace/architecture/01-bounded-starts) as inactive for new work in [architecture/README.md](/C:/Users/User/projects/directive-workspace/architecture/README.md).

## Proof Path

- `npm run check:architecture-materialization-due-check`
- `npm run check:read-only-lifecycle-coordination`
- `npm run check:runtime-loop-control`
- `npm run check:directive-workspace-composition`

## Rollback Path

- Revert:
  - [architecture/lib/architecture-result-adoption.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-result-adoption.ts)
  - [architecture/lib/architecture-materialization-due-check.ts](/C:/Users/User/projects/directive-workspace/architecture/lib/architecture-materialization-due-check.ts)
  - [shared/contracts/architecture-artifact-lifecycle.md](/C:/Users/User/projects/directive-workspace/shared/contracts/architecture-artifact-lifecycle.md)
  - [architecture/README.md](/C:/Users/User/projects/directive-workspace/architecture/README.md)
  - this log file

## Stop Line

- No historical corpus rewrite
- No folder deletion or mass artifact relocation
- No change to DEEP-mode availability; only the default path semantics were shortened
