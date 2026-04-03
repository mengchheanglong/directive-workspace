# Control Log: Capability Gap Batch Resolution

- Date: 2026-04-01
- Scope: All 6 open capability gaps resolved in one session
- Mode: STANDARD batch (tightly coupled gap closures)

## Gaps Resolved

### 1. gap-engine-adaptation-logic (score 113, high)
- **Resolution:** Already built. Engine owns `buildExtractionPlan`, `buildAdaptationPlan`, `buildImprovementPlan` in `engine/directive-engine.ts` with real lane-specific logic and structured chaining.
- **Action:** Updated gap registry to reflect existing state. No code change needed.

### 2. gap-run-evidence-aggregation (score 104, medium)
- **Resolution:** Created `shared/lib/run-evidence-aggregation.ts` and `scripts/report-run-evidence-aggregation.ts`.
- **Surface:** `npm run report:run-evidence-aggregation`
- **Produces:** Lane distribution, usefulness distribution, source type diversity, confidence distribution, decision outcome patterns, integration mode patterns, temporal trend buckets (7 periods), case lifecycle durations, and mission priority score stats across all 39 engine runs.

### 3. gap-runtime-promotion-seam (score 98, medium)
- **First pass:** Created `scripts/check-runtime-promotion-specification.ts` — validated promotion-readiness artifacts are contract-complete but only confirmed blockers exist. Premature closure: checker specified blockers, not a forward pathway.
- **Correction:** Created `scripts/generate-promotion-specifications.ts` which produces 6 structured JSON promotion specification artifacts at `runtime/06-promotion-specifications/`. Each spec fills promotion contract fields (integrationMode, targetRuntimeSurface, owner, sourceIntentArtifact, requiredGates, rollbackPlan, proofArtifactPath, proposedHost) and explicitly lists openDecisions.
- **Surface:** `npm run generate:promotion-specifications`
- **Proof:** Scientify case spec has concrete host (standalone-host), integration mode (reimplement), target runtime surface, and implementation slices — a genuine host-consumable artifact.

### 4. gap-case-catalog-coverage (score 95, medium)
- **First pass:** Created `scripts/report-case-catalog.ts` — measured coverage but didn't close it. Only 6/62 entries had case files; planner covered only 8. Premature closure: report measures, not resolves.
- **Correction:** Created `scripts/backfill-case-models.ts` which generated 55 new case records and event logs. 33 with canonical resolution (state_materialized events), 22 minimal (legacy pre-routing). Added two planner rules: null-stage legacy entries → stop, `architecture.bounded_result.adopt` → recommend_task(confirm_retention).
- **Result:** 62/62 case files, 62/62 plannable (37 stop, 14 parked, 6 recommend_task, 5 waiting_review, 0 blocked).
- **Surface:** `npm run report:case-catalog` provides the unified catalog surface.

### 5. gap-engine-lane-boundary-enforcement (score 86, medium, was blocked)
- **Resolution:** Created `scripts/check-lane-boundary-imports.ts`.
- **Surface:** `npm run check:lane-boundary-imports` (added to main `npm run check` pipeline)
- **Produces:** Directional import validation: engine must not import from hosts, shared must not import from hosts. Scans 12 engine files and 81 shared files. Zero violations.
- **Unblocked by:** Replacing the rejected dependency-cruiser/ESLint approaches with a lightweight targeted checker.

### 6. gap-engine-host-adapter-contract (score 83, medium, was blocked)
- **Resolution:** Created `scripts/check-host-adapter-boundary.ts`.
- **Surface:** `npm run check:host-adapter-boundary` (added to main `npm run check` pipeline)
- **Produces:** Host adapter boundary validation with explicit 35-prefix allowlist. Scans 26 host TS files across 4 host directories. Zero violations. New host imports require explicit allowlist addition.
- **Unblocked by:** Replacing the rejected dependency-cruiser facade approach with a targeted allowlist checker.

## Corrections Applied

Two gaps were initially marked resolved prematurely and reopened:
- **gap-case-catalog-coverage:** First pass created a report that measured coverage without closing it. Corrected by backfilling 55 case models and adding 2 planner rules to achieve 62/62 plannable.
- **gap-runtime-promotion-seam:** First pass created a checker that validated blockers without producing forward artifacts. Corrected by generating actual host-consumable promotion specification JSON files.

## Verification

- `npm run check` passes (all 10 pipeline checks including 2 new ones)
- Gap worklist regenerated: 0 open items (all resolved)
- `capability-gaps.json` updated with resolution notes and dates for all 6 gaps

## Files Created
- `shared/lib/run-evidence-aggregation.ts`
- `scripts/report-run-evidence-aggregation.ts`
- `scripts/check-runtime-promotion-specification.ts`
- `scripts/generate-promotion-specifications.ts`
- `scripts/report-case-catalog.ts`
- `scripts/backfill-case-models.ts`
- `scripts/check-lane-boundary-imports.ts`
- `scripts/check-host-adapter-boundary.ts`
- `runtime/06-promotion-specifications/*.json` (6 promotion specification artifacts)
- `state/cases/*.json` (55 backfilled case models)
- `state/case-events/*.jsonl` (55 backfilled event logs)

## Files Modified
- `discovery/capability-gaps.json` (6 gaps resolved, updatedAt)
- `discovery/gap-worklist.json` (regenerated, 0 open items)
- `package.json` (6 new scripts, 2 added to check pipeline)
- `shared/lib/case-planner.ts` (2 new planner rules: null-stage stop, adopt retention)
