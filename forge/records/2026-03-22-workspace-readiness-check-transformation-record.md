# Transformation Record: Workspace Readiness Check Consolidation

- Candidate id: `dw-transform-workspace-readiness-check-consolidation`
- Candidate name: `Workspace Readiness Check Consolidation`
- Record date: `2026-03-22`
- Transformation type: `maintainability`
- Discovery intake path: `discovery/intake/2026-03-22-workspace-readiness-check-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: `buildWorkspaceReadiness` handled recent-report detection, context-file verification, document-signal collection, readiness-check construction, and score summarization inline inside one host evaluator function.
- Measured baseline:
  - metric: `buildWorkspaceReadiness` line count
  - value: `171`
  - measurement method: brace-matched span of `buildWorkspaceReadiness` in tracked Mission Control baseline (`HEAD:src/server/services/workspace-intel-service.ts`)

## After State

- Proposed change: extract recent-report, required-context-file, doc-signal, readiness-check, and summary logic into explicit helpers (`findRecentReport`, `hasRequiredContextFiles`, `collectWorkspaceReadinessDocSignals`, `collectWorkspaceReadinessSignals`, `buildWorkspaceReadinessChecks`, `summarizeWorkspaceReadiness`) and keep `buildWorkspaceReadiness` focused on orchestration.
- Preservation claim: `WorkspaceReadiness` return shape, readiness thresholds, readiness-check labels/details/hrefs, and the underlying doc/quest/report/context-file rules remain unchanged.
- Expected improvement:
  - metric: `buildWorkspaceReadiness` line count
  - target value: `26`
  - measurement method: brace-matched span of `buildWorkspaceReadiness` in the working tree after helper extraction

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:discovery-intake-queue && npm run check:directive-transformation-proof && npm run check:directive-workflow-doctrine && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `forge/records/2026-03-22-workspace-readiness-check-transformation-proof.json`
- Result artifact path: `forge/records/2026-03-22-workspace-readiness-check-transformation-proof.json`

## Proof

- Correctness preserved: `yes - helper extraction only; no external type, return-shape, readiness-rule, or UI-message change; host typecheck passes`
- Metric improvement measured: `yes - 171 -> 26 lines (-145, -84.8%)`
- Rollback path: `revert mission-control/src/server/services/workspace-intel-service.ts and remove the new Discovery / Forge transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Forge`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - clearer project-readiness evaluation for IDE collaboration`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
