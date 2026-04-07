# Transformation Record: Code Intel Snapshot Consolidation

- Candidate id: `dw-transform-code-intel-snapshot-consolidation`
- Candidate name: `Code Intel Snapshot Consolidation`
- Record date: `2026-03-22`
- Transformation type: `maintainability`
- Discovery intake path: `discovery/01-intake/2026-03-22-code-intel-snapshot-transformation-intake.md`

## Before State

- Component: `mission-control/src/server/services/workspace-intel-service.ts`
- Current implementation: `collectCodeIntelSnapshot` handled TypeScript, Python, Go, and Rust language-server probe construction inline, repeating the same status, suggestion, and detail pattern for each language family.
- Measured baseline:
  - metric: `collectCodeIntelSnapshot` line count
  - value: `193`
  - measurement method: brace-matched span of `collectCodeIntelSnapshot` in tracked Mission Control baseline (`HEAD:src/server/services/workspace-intel-service.ts`)

## After State

- Proposed change: extract repeated language-probe logic into explicit helpers (`buildAutoCodeIntelTool`, `buildTypeScriptCodeIntelProbe`, `readPythonDependencyText`, `buildPythonCodeIntelProbe`, `buildGoCodeIntelProbe`, `buildRustCodeIntelProbe`) and keep `collectCodeIntelSnapshot` focused on orchestration and override merge behavior.
- Preservation claim: `RepoCodeIntelSnapshot` return shape, per-language config/runtime signals, statuses, details, suggestions, and override merge behavior remain unchanged.
- Expected improvement:
  - metric: `collectCodeIntelSnapshot` line count
  - target value: `51`
  - measurement method: brace-matched span of `collectCodeIntelSnapshot` in the working tree after helper extraction

## Evaluator

- Evaluator type: `automated`
- Evaluator command (if automated): `npm run typecheck && npm run check:discovery-intake-queue && npm run check:directive-transformation-proof && npm run check:directive-workflow-doctrine && npm run check:ops-stack`
- Comparison mode: `before-after`
- Baseline artifact path: `runtime/legacy-records/2026-03-22-code-intel-snapshot-transformation-proof.json`
- Result artifact path: `runtime/legacy-records/2026-03-22-code-intel-snapshot-transformation-proof.json`

## Proof

- Correctness preserved: `yes - helper extraction only; no external type, return-shape, signal, suggestion, or override-merge change; host typecheck passes`
- Metric improvement measured: `yes - 193 -> 51 lines (-142, -73.6%)`
- Rollback path: `revert mission-control/src/server/services/workspace-intel-service.ts and remove the new Discovery / Runtime transformation artifacts`
- Rollback tested: `no`

## Decision

- Decision state: `decided`
- Adoption target: `Runtime`
- Promotion record (if promoted): `n/a`
- Mission alignment (which active-mission objective does this serve): `Mission Control as unified runtime host and agent command surface - clearer code-intelligence readiness evaluation for IDE collaboration`
- Addresses known capability gap (gap_id or n/a): `gap-transformation-lane`
