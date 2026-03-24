# Cross-Source Contract Delta Slice 07

Date: 2026-03-20
Candidate id: `dw-cross-source-wave-01`
Track: Directive Architecture + Mission Control runtime observability
Status: executed

## Objective

Expose strict lifecycle artifact coverage in the Directive Workspace overview surface so the UI can show strict-required vs strict-bound vs strict-missing coverage as a first-class runtime signal.

## Scope

In:
- add lifecycle artifact coverage aggregation to backend workspace overview payload
- expose strict coverage metrics in standalone track panel (Forge card)
- resolve typecheck blockers in shared lifecycle artifact normalization and directive service evaluation flow
- verify gates remain green

Out:
- DB schema changes
- lifecycle artifact generation logic changes
- cross-track decision/routing changes

## Dependencies

- `C:\Users\User\.openclaw\workspace\mission-control\backend\src\modules\directive-workspace\directive-workspace.service.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\src\app\dashboard\directive-workspace\WorkspaceTracksOverviewPanel.tsx`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\src\server\services\directive-workspace-service.ts`

## Execution Steps

1. Add strict lifecycle artifact shape/coverage helpers in workspace overview service path.
2. Append `forge.lifecycleArtifacts` coverage block in `workspace/overview` response.
3. Render strict-required/strict-bound/strict-missing + coverage percentages in Forge card.
4. Fix discovered typecheck issues in lifecycle artifact normalization and evaluation sourceRef binding.
5. Re-run directive and ops gates.

## Commands run (ordered)

1. `npm run check:directive-v0` (mission-control)
2. `npm run check:directive-integration-proof` (mission-control)
3. `npm run check:directive-workspace-health` (mission-control)
4. `npm run typecheck` (mission-control)
5. `npm run check:directive-lifecycle-artifacts` (mission-control)
6. `npm run check:ops-stack` (mission-control)

## Raw outputs (key excerpts)

- `check:directive-v0`: `ok: true`
- `check:directive-integration-proof`: `ok: true`, `missingProof: 0`
- `check:directive-workspace-health`: `ok: true`, `reasons: []`
- `typecheck`: PASS
- `check:directive-lifecycle-artifacts`:
  - `strictRequiredCapabilities: 6`
  - `strictBoundCapabilities: 6`
  - `strictMissingCapabilities: 0`
  - `failedCapabilities: 0`
- `check:ops-stack`: `ok: true` with all listed sub-checks green

## Validation Gates

- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:directive-lifecycle-artifacts`
- `npm run check:ops-stack`

## Rollback / No-op

- remove `forge.lifecycleArtifacts` block from workspace overview response
- remove strict coverage cards from `WorkspaceTracksOverviewPanel`
- keep lifecycle artifact gate/backfill behavior unchanged
