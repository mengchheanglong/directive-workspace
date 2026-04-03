# Discovery Front-Door Coverage Dead-Surface Cleanup

- Date: 2026-04-03
- Migration slice: `dead_surface_reference_audit`
- Outcome: completed

## Why this slice was safe

- `shared/contracts/discovery-intake-queue.md` still referenced a missing `mission-control/scripts/check-discovery-front-door-coverage.ts` path.
- Repo-local search found no live `scripts/check-discovery-front-door-coverage.ts` surface in Directive Workspace.
- The live repo-native coverage surface already exists at `shared/lib/discovery-front-door-coverage.ts`.

## What changed

- Replaced the dead Discovery front-door coverage checker references in current operator-facing docs with the canonical repo-native analysis surface.
- Marked the operator-simplicity migration registry complete after the last pending slice was truthfully closed.

## Stop summary

- No pending operator-simplicity migration slice remains after this cleanup.
